import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { spamScore } from "@/lib/sanitize";
import { clientIp, rateLimit, rateLimitHeaders } from "@/lib/rateLimit";

// Public "write to us" endpoint: an app user sends a message (+ optional images)
// which we email to the team inbox via nodemailer. No DB writes. Basic guards only
// (required message, max 4 images); images should already be compressed client-side.

// Each POST sends an email to the team, so it's a mail-bomb / SMTP-quota vector if
// unguarded. Two windows: a tight per-minute burst guard AND an hourly cap so a
// determined sender can't dribble spam just under the minute limit all day.
const RATE_LIMIT = 5; // requests per minute per IP
const RATE_WINDOW_MS = 60_000;
const HOURLY_LIMIT = 8; // requests per hour per IP
const HOURLY_WINDOW_MS = 3_600_000;

// A real person types a message over several seconds. A form submitted faster than
// this after opening is almost certainly a script → dropped silently.
const MIN_DWELL_MS = 3_000;
// Spam score at/above this only TAGS the subject (still delivered) so a false positive
// never silently loses a real volunteer — the team can filter on the tag.
const SPAM_TAG_AT = 3;

export async function POST(request: Request) {
  // Rate limit per client IP before doing any work (sending mail is the expensive part).
  const ip = clientIp(request);
  const rl = rateLimit(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  const rlHr = rateLimit(`contact-hr:${ip}`, HOURLY_LIMIT, HOURLY_WINDOW_MS);
  if (!rl.ok || !rlHr.ok) {
    const worst = !rl.ok ? rl : rlHr;
    return NextResponse.json(
      { error: "rate_limited", retry_after: worst.retryAfter },
      { status: 429, headers: { ...rateLimitHeaders(worst), "Retry-After": String(worst.retryAfter) } },
    );
  }

  let body: {
    kind?: string;
    name?: string;
    email?: string;
    message?: string;
    images?: unknown;
    hp?: unknown;
    elapsed?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Honeypot: a hidden field no human fills. If it's populated, it's a bot — pretend
  // success (200) so the bot doesn't learn to adapt, but send nothing.
  if (typeof body.hp === "string" && body.hp.trim() !== "") {
    console.warn(`[contact] honeypot triggered (ip=${ip}) — dropped`);
    return NextResponse.json({ ok: true });
  }
  // Dwell time: reject instant (scripted) submissions. Same silent-success posture.
  if (typeof body.elapsed === "number" && body.elapsed >= 0 && body.elapsed < MIN_DWELL_MS) {
    console.warn(`[contact] too-fast submit (${body.elapsed}ms, ip=${ip}) — dropped`);
    return NextResponse.json({ ok: true });
  }

  const message = (body.message || "").trim();
  if (message.length < 2) return NextResponse.json({ error: "missing_message" }, { status: 422 });

  const images = Array.isArray(body.images)
    ? body.images.filter((x): x is string => typeof x === "string").slice(0, 4)
    : [];
  const kind = body.kind === "volunteer" || body.kind === "donation" ? body.kind : undefined;

  // Soft content heuristic → TAG (never drop) so a false positive still reaches the team.
  const suspicious = spamScore(message, body.name) >= SPAM_TAG_AT;
  if (suspicious) console.warn(`[contact] flagged possible spam (ip=${ip})`);

  const ok = await sendContactEmail({
    kind,
    name: body.name,
    replyTo: body.email,
    message: message.slice(0, 5000),
    images,
    suspicious,
  });
  if (!ok) return NextResponse.json({ error: "email_unavailable" }, { status: 502 });

  // NOTE: we deliberately DO NOT send an auto-acknowledgment back to the sender's
  // address. Doing so let an attacker use our trusted domain (info@helpmapvzla.net)
  // to deliver arbitrary content to any address they typed in `email` (scam/phishing
  // vector — see the abuse report). Confirmation to the user is shown IN-APP only
  // (the `cDone` panel). The team notification above is the only mail this route sends.
  return NextResponse.json({ ok: true });
}
