import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { clientIp, rateLimit, rateLimitHeaders } from "@/lib/rateLimit";

// Public "write to us" endpoint: an app user sends a message (+ optional images)
// which we email to the team inbox via nodemailer. No DB writes. Basic guards only
// (required message, max 4 images); images should already be compressed client-side.

// Each POST fires up to TWO emails (team + user ack), so it's a mail-bomb / SMTP-quota
// vector if unguarded. Keep the per-IP limit TIGHT — a real person writes once, not 5x/min.
const RATE_LIMIT = 5; // requests per window per IP
const RATE_WINDOW_MS = 60_000;

export async function POST(request: Request) {
  // Rate limit per client IP before doing any work (sending mail is the expensive part).
  const rl = rateLimit(`contact:${clientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retry_after: rl.retryAfter },
      { status: 429, headers: { ...rateLimitHeaders(rl), "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: { kind?: string; name?: string; email?: string; message?: string; images?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const message = (body.message || "").trim();
  if (message.length < 2) return NextResponse.json({ error: "missing_message" }, { status: 422 });

  const images = Array.isArray(body.images)
    ? body.images.filter((x): x is string => typeof x === "string").slice(0, 4)
    : [];
  const kind = body.kind === "volunteer" || body.kind === "donation" ? body.kind : undefined;

  const ok = await sendContactEmail({
    kind,
    name: body.name,
    replyTo: body.email,
    message: message.slice(0, 5000),
    images,
  });
  if (!ok) return NextResponse.json({ error: "email_unavailable" }, { status: 502 });

  // NOTE: we deliberately DO NOT send an auto-acknowledgment back to the sender's
  // address. Doing so let an attacker use our trusted domain (info@helpmapvzla.net)
  // to deliver arbitrary content to any address they typed in `email` (scam/phishing
  // vector — see the abuse report). Confirmation to the user is shown IN-APP only
  // (the `cDone` panel). The team notification above is the only mail this route sends.
  return NextResponse.json({ ok: true });
}
