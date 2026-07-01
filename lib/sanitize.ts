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
