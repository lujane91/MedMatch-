import type { MetadataRoute } from "next";

/**
 * Public robots rules.
 * Do not list the private admin URL segment here — that would advertise it.
 * Platform Admin pages also set robots noindex/nofollow in their layout.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/platform-admin",
          "/platform-admin/",
          "/api/platform-admin",
          "/api/platform-admin/",
        ],
      },
    ],
  };
}
