import type { ImageMetadata } from "astro";
import defaultOgImage from "@res/images/ogbanner.webp";
import ogImageProjects from "@res/images/ogbannerprojects.webp";
import ogImageBlog from "@res/images/ogbannerblog.webp";

export interface SEOProps {
  title: string;
  desc?: string;
  keywords?: string;
  image?: ImageMetadata;
  imageUrl?: string;
  type?: string;
}

/**
 * Global default SEO Configuration
 */
export const globalSEO: SEOProps = {
  title: "Tausif Alam – Backend & Full Stack Developer",
  desc: "Backend-focused engineer building scalable apps with Node.js and PostgreSQL. Explore Tausif Alam’s projects and portfolio.",
  keywords: "Tausif Alam, buildwithtausif, backend developer, Node.js developer, full stack developer, PostgreSQL, web developer portfolio, system design, software engineer India",
  type: "website",
  image: defaultOgImage,
  imageUrl: "/og/index.png",
};

/**
 * Page-specific SEO Configuration
 * Add your specific page paths (without trailing slash) here.
 */
export const pageSEOConfig: Record<string, Partial<SEOProps>> = {
  "/projects": {
    title: "Projects – Tausif Alam | Full Stack & Backend Work",
    desc: "Explore Tausif Alam’s projects, from backend systems to full stack apps built with Node.js, PostgreSQL, and modern web tech.",
    image: ogImageProjects,
    imageUrl: "/og/projects.png",
  },
  "/blog": {
    title: "Tausif's Blog – Code, Systems & Insights",
    desc: "Developer blog by Tausif Alam on coding, system design, decisions, and lessons from projects, tech, and life.",
    keywords: "Tausif Alam blog, developer blog, system design, Node.js blog, backend development, programming insights, buildwithtausif",
    image: ogImageBlog,
    imageUrl: "/og/blog.png",
  },
};

/**
 * Fallback mechanism to get the SEO for a given path.
 * This will merge the global defaults with dynamic OG image paths and specific page configuration.
 */
export function getSEOForPath(pathname: string): SEOProps {
  // Normalize the pathname by stripping trailing slash
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const matchedSEO = pageSEOConfig[normalizedPath] || {};

  // Compute dynamic OG image path based on the route
  let dynamicOgPath = "/og/index.png";
  if (normalizedPath === "/blog") {
    dynamicOgPath = "/og/blog.png";
  } else if (normalizedPath === "/projects") {
    dynamicOgPath = "/og/projects.png";
  } else if (normalizedPath.startsWith("/blog/")) {
    const slug = normalizedPath.replace("/blog/", "");
    dynamicOgPath = `/og/blog/${slug}.png`;
  } else if (normalizedPath.startsWith("/project/")) {
    const slug = normalizedPath.replace("/project/", "");
    dynamicOgPath = `/og/project/${slug}.png`;
  } else if (normalizedPath === "/404") {
    dynamicOgPath = "/og/404.png";
  }

  return {
    ...globalSEO,
    imageUrl: dynamicOgPath,
    ...matchedSEO,
  };
}
