import type { MetadataRoute } from "next";
import { DOCS } from "@/components/helpmap/docs-content";

// Public sitemap. Lists ONLY public, non-sensitive informational pages so search
// engines and AI/answer engines (GPTBot, ClaudeBot, PerplexityBot, Google) can
// discover and cite the project.
//
// PRIVACY (CLAUDE.md §2): individual patient fichas (/p/[id]) are DELIBERATELY
// excluded. They are shareable one-by-one (OG cards), but a crawlable/indexable
// list of identified people during a disaster is a re-identification / targeting
// vector — the same reason the bulk API (§13) strips faces. Named victims must
// never become googleable in bulk. /p/ is also disallowed in robots.ts + carries
// a noindex directive.

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.helpmapvzla.net";

// A doc page is bilingual via ?lang=en (client route stays the same path).
const docAlternates = (path: string) => ({
  languages: {
    es: `${SITE}${path}`,
    en: `${SITE}${path}?lang=en`,
  },
});

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE,
      lastModified: now,
      changeFrequency: "hourly", // the map/records update continuously
      priority: 1,
    },
    {
      url: `${SITE}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: docAlternates("/docs"),
    },
    {
      url: `${SITE}/docs/roadmap`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
      alternates: docAlternates("/docs/roadmap"),
    },
  ];

  const docPages: MetadataRoute.Sitemap = DOCS.map((d) => ({
    url: `${SITE}/docs/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
    alternates: docAlternates(`/docs/${d.slug}`),
  }));

  return [...staticPages, ...docPages];
}
