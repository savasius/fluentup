import type { MetadataRoute } from "next";

const BASE_URL = "https://fluentupenglish.com";

const ROUTES = [
  "",
  "/practice",
  "/vocabulary",
  "/lesson",
  "/tutor",
  "/profile",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
