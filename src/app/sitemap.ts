import config from "@/config";
import type { MetadataRoute } from "next";

const customUrls = [
  {
    path: "",
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/about",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/projects",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/blogs",
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapData = customUrls.map((item) => ({
    url: `${config.next_public_live_site_url}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency as
      | "yearly"
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "never"
      | undefined,
    priority: item.priority,
  }));

  return sitemapData;
}
