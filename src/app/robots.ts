import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loftz.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/en/legal/", "/pt/legal/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
