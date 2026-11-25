import { defineType, defineField } from "sanity";

export const siteSeoSettings = defineType({
  name: "siteSeoSettings",
  title: "Site SEO & Global Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Default Site Title",
      type: "string",
      initialValue: "Tausif Alam – Backend & Full Stack Developer",
    }),
    defineField({
      name: "siteDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      initialValue: "Backend-focused engineer building scalable apps with Node.js and PostgreSQL. Explore Tausif Alam’s projects and portfolio.",
    }),
    defineField({
      name: "defaultKeywords",
      title: "Default Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "homeSeo",
      title: "Home Page SEO & OG",
      type: "seoMeta",
    }),
    defineField({
      name: "blogIndexSeo",
      title: "Blog Index SEO & OG",
      type: "seoMeta",
    }),
    defineField({
      name: "projectsIndexSeo",
      title: "Projects Index SEO & OG",
      type: "seoMeta",
    }),
  ],
});
