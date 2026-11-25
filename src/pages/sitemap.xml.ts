import type { APIRoute } from "astro";
import { getAllSitemapEntries } from "@lib/cms/queries";
import { setEdgeCacheHeaders } from "@utils/cache";

export const prerender = false;

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async ({ site, url }) => {
  const origin = (site ? site.toString() : url.origin).replace(/\/$/, "");
  const { blogs, projects } = await getAllSitemapEntries();

  const staticRoutes = [
    { loc: `${origin}/`, priority: "1.0" },
    { loc: `${origin}/blog`, priority: "0.9" },
    { loc: `${origin}/projects`, priority: "0.9" },
  ];

  const dynamicRoutes = [
    ...blogs.map((b) => ({
      loc: `${origin}/blog/${encodeURIComponent(b.slug)}`,
      lastmod: new Date(b.updatedAt).toISOString(),
      priority: "0.8",
    })),
    ...projects.map((p) => ({
      loc: `${origin}/project/${encodeURIComponent(p.slug)}`,
      lastmod: new Date(p.updatedAt).toISOString(),
      priority: "0.8",
    })),
  ];

  const urlNodes = [
    ...staticRoutes.map(
      (r) => `  <url>\n    <loc>${xmlEscape(r.loc)}</loc>\n    <priority>${r.priority}</priority>\n  </url>`
    ),
    ...dynamicRoutes.map(
      (r) =>
        `  <url>\n    <loc>${xmlEscape(r.loc)}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`
    ),
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>\n`;

  const headers = new Headers({ "Content-Type": "application/xml; charset=utf-8" });
  setEdgeCacheHeaders(headers, { sMaxAgeSeconds: 3600, staleWhileRevalidateSeconds: 86400 });

  return new Response(xml, { status: 200, headers });
};
