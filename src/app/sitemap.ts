import type { MetadataRoute } from "next";

/** Public sitemap — Platform Admin routes are intentionally excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://medmatch-pi.vercel.app";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sign-in`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/create-account`, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${base}/opportunities`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
