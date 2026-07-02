// Shared input sanitizers for user-supplied text that we STORE and/or ECHO back
// (audit feed, admin panel, outbound emails). No server-only deps, so any server
// route can import them. React already escapes on render — these are defense-in-depth
// plus data hygiene so stored values don't carry junk like "<script>…" or scam links.

// Reduce a display NAME to a plain name: letters (incl. accents), spaces, hyphens,
// apostrophes. Strips URLs, domains, digits and symbols so the value can never carry a
// link a mail/UI client would auto-linkify (see the contact auto-ack phishing abuse),
// and so stored names stay clean.
export function cleanName(raw?: string): string {
  return (raw || "")
    .replace(/[^\p{L}\s'’-]/gu, " ") // keep letters (accents), space, hyphen, apostrophe
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 80);
}

// Cheap spam heuristic for the public contact form. Returns a score; the route TAGS
// (does not drop) messages above a threshold so a false positive still reaches the team
// — just flagged. Deliberately conservative: real volunteer notes may cite a source link.
const SPAM_PHRASES = [
  "descargar en google", "download", "for android", "para celulares",
  "seo", "backlink", "ranking", "traffic", "guest post",
  "casino", "bet", "viagra", "cialis", "loan", "crypto", "bitcoin", "usdt", "forex",
  "click here", "haz clic", "limited offer", "act now", "make money", "gana dinero",
  "telegram.me", "wa.me/", "t.me/", "bit.ly", "tinyurl",
];
export function spamScore(message: string, name?: string): number {
  const text = `${name || ""} ${message || ""}`.toLowerCase();
  let score = 0;
  const urls = (text.match(/https?:\/\/|www\.|\.(?:tk|top|xyz|ru|cn|link|click)\b/g) || []).length;
  if (urls >= 1) score += 1;
  if (urls >= 2) score += 1; // multiple links → stronger signal
  for (const p of SPAM_PHRASES) if (text.includes(p)) score += 1;
  // Heavy non-Latin script (Cyrillic/Greek/CJK) in a Spanish-only audience.
  const nonLatin = (text.match(/[Ѐ-ӿͰ-Ͽ一-鿿぀-ヿ]/g) || []).length;
  if (nonLatin >= 6) score += 2;
  // Very short message that is basically just a link.
  if (message.trim().length < 25 && urls >= 1) score += 1;
  return score;
}

// Free-text field displayed AS TEXT (e.g. "why you want to volunteer" — may legitimately
// contain URLs as sources, so we keep those). Strips angle brackets so no "<script>"/markup
// noise is ever stored, and collapses ALL whitespace (tabs/newlines). `max` caps length.
export function cleanText(raw: unknown, max: number): string {
  return (typeof raw === "string" ? raw : "")
    .replace(/[<>]/g, " ") // drop angle brackets → no stored markup / <script>
    .replace(/\s+/g, " ") // collapse whitespace incl. tabs/newlines
    .trim()
    .slice(0, max);
}
