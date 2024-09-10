import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateSitemap() {
  const baseUrl = "https://abirmahmud.top";

  const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0", lastmod: "2024-09-10" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((page) => {
        return `
        <url>
          <loc>${baseUrl}${page.loc}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `;
      })
      .join("")}
  </urlset>`;

  // Write the sitemap to the public directory
  writeFileSync(join(__dirname, "..", "sitemap.xml"), sitemap);
}

generateSitemap();
