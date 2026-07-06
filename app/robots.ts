import type { MetadataRoute } from "next";

// robots.txt (Next file convention → served at /robots.txt).
//
// GOAL: maximise reach in both classic search AND AI/answer engines so the
// project surfaces for queries like "ayuda terremoto Venezuela / buscar
// familiares Caracas". We explicitly WELCOME the major AI crawlers (they are
// already covered by the "*" allow, but naming them makes the intent clear and
// avoids a future accidental block).
//
// PRIVACY (CLAUDE.md §2): individual patient fichas (/p/) and all API/auth
// surfaces are disallowed from indexing. Sharing a /p/ link still works — social
// preview bots (WhatsApp, Telegram, facebookexternalhit, Twitterbot) fetch OG
// tags directly and ignore robots.txt — so this blocks bulk indexing of named
// people without breaking one-to-one sharing.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.helpmapvzla.net";

// Paths that must never be indexed / crawled for content.
const DISALLOW = ["/p/", "/api/", "/login", "/signup"];

// AI / answer-engine crawlers we explicitly allow (same rules as everyone else).
const AI_BOTS = [
  "GPTBot", // OpenAI (ChatGPT)
  "OAI-SearchBot", // OpenAI search
  "ChatGPT-User", // ChatGPT browsing on user request
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / Google AI
  "Applebot-Extended", // Apple Intelligence
  "Bingbot", // Bing / Copilot
  "DuckAssistBot",
  "Amazonbot",
  "cohere-ai",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Everyone (classic search engines + anything unlisted).
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // Named AI/answer engines — same access, made explicit so they index the
      // public content and can cite HelpMap when asked about help in Venezuela.
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
