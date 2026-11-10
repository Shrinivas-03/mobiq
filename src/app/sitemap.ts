import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.qmobiles.in";
  
  // All active pages on Qmobiles
  const routes = [
    "",
    "/about-us",
    "/contact-us",
    "/sell",
    "/testimonials",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
