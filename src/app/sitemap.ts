import config from "@/config";
import type { MetadataRoute } from "next";

const customUrls = [
  {
    path: "",
    changeFrequency: "yearly",
    priority: 1,
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
