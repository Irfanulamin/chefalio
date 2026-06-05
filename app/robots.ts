import type { MetadataRoute } from "next";

const siteUrl = "https://chefalio.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/chef", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
