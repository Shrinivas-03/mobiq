import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/api/admin/*"
      ],
    },
    sitemap: "https://www.themobiq.com/sitemap.xml",
  };
}
