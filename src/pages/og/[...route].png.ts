import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import createSlug from "@utils/createSlug";
import { renderOGImage } from "@utils/ogImage";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const projects = await getCollection("project");

  const staticHubs = [
    {
      params: { route: "index" },
      props: {
        title: "Tausif Alam – Backend & Full Stack Developer",
        description: "Backend-focused engineer building scalable apps with Node.js and PostgreSQL. Welcome to my digital oasis.",
        category: "PORTFOLIO",
        path: "",
        tags: ["software-engineer", "backend", "systems"],
        ctaText: "EXPLORE WORK ↗",
      },
    },
    {
      params: { route: "blog" },
      props: {
        title: "Tausif's Blog – Code, Systems & Insights",
        description: "Developer blog by Tausif Alam on coding, system design, decisions, and lessons from projects, tech, and life.",
        category: "ARTICLES",
        path: "blog",
        tags: ["systems", "tech", "insights"],
        ctaText: "BROWSE ARTICLES ↗",
      },
    },
    {
      params: { route: "projects" },
      props: {
        title: "Projects – Tausif Alam | Full Stack & Backend Work",
        description: "Explore Tausif Alam’s projects, from backend systems to full stack apps built with Node.js and PostgreSQL.",
        category: "PROJECTS",
        path: "projects",
        tags: ["projects", "engineering", "showcase"],
        ctaText: "VIEW PROJECTS ↗",
      },
    },
    {
      params: { route: "404" },
      props: {
        title: "404 – Page Not Found",
        description: "The requested coordinates could not be located in this sector.",
        category: "SYSTEM ERROR",
        path: "404",
        tags: ["lost-in-space"],
        ctaText: "RETURN HOME ↗",
      },
    },
  ];

  const blogPostRoutes = posts.map((post) => ({
    params: { route: `blog/${createSlug(post.id)}` },
    props: {
      title: post.data.title,
      description: post.data.description,
      category: "ARTICLE",
      path: "blog",
      tags: post.data.tags || [],
      ctaText: "READ ARTICLE ↗",
    },
  }));

  const projectRoutes = projects.map((project) => ({
    params: { route: `project/${createSlug(project.id)}` },
    props: {
      title: project.data.title,
      description: project.data.description,
      category: "CASE STUDY",
      path: "projects",
      tags: project.data.tags || [],
      ctaText: "VIEW CASE STUDY ↗",
    },
  }));

  return [...staticHubs, ...blogPostRoutes, ...projectRoutes];
}

export const GET: APIRoute = async ({ props }) => {
  const imageBuffer = await renderOGImage(props as any);

  return new Response(new Uint8Array(imageBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
