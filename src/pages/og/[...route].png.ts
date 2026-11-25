import type { APIRoute } from "astro";
import { getBlogOgData, getProjectOgData } from "@lib/cms/queries";
import type { OgRouteData } from "@lib/cms/types";
import { renderOGImage } from "@utils/ogImage";

export const prerender = false;

const STATIC_HUBS: Record<string, OgRouteData> = {
  index: {
    title: "Tausif Alam – Backend & Full Stack Developer",
    description:
      "Backend-focused engineer building scalable apps with Node.js and PostgreSQL. Welcome to my digital oasis.",
    category: "PORTFOLIO",
    path: "",
    tags: ["software-engineer", "backend", "systems"],
    ctaText: "EXPLORE WORK ↗",
  },
  blog: {
    title: "Tausif's Blog – Code, Systems & Insights",
    description:
      "Developer blog by Tausif Alam on coding, system design, decisions, and lessons from projects, tech, and life.",
    category: "ARTICLES",
    path: "blog",
    tags: ["systems", "tech", "insights"],
    ctaText: "BROWSE ARTICLES ↗",
  },
  projects: {
    title: "Projects – Tausif Alam | Full Stack & Backend Work",
    description:
      "Explore Tausif Alam’s projects, from backend systems to full stack apps built with Node.js and PostgreSQL.",
    category: "PROJECTS",
    path: "projects",
    tags: ["projects", "engineering", "showcase"],
    ctaText: "VIEW PROJECTS ↗",
  },
  "404": {
    title: "404 – Page Not Found",
    description: "The requested coordinates could not be located in this sector.",
    category: "SYSTEM ERROR",
    path: "404",
    tags: ["lost-in-space"],
    ctaText: "RETURN HOME ↗",
  },
};

export const GET: APIRoute = async ({ params, url }) => {
  const route = (params.route || "").replace(/^\/+|\/+$/g, "");
  let ogProps: OgRouteData | null = STATIC_HUBS[route] || null;

  if (!ogProps && route.startsWith("blog/")) {
    const slug = route.slice("blog/".length);
    ogProps = await getBlogOgData(slug);
  } else if (!ogProps && route.startsWith("project/")) {
    const slug = route.slice("project/".length);
    ogProps = await getProjectOgData(slug);
  }

  if (!ogProps) {
    return new Response("Not Found", { status: 404 });
  }

  const imageBuffer = await renderOGImage(ogProps);
  const hasVersionParam = url.searchParams.has("v");
  const cacheControl = hasVersionParam
    ? "public, max-age=31536000, immutable"
    : "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

  return new Response(new Uint8Array(imageBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": cacheControl,
      "CDN-Cache-Control": cacheControl,
    },
  });
};
