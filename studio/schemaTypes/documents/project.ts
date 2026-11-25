import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Metadata & Links" },
    { name: "seo", title: "SEO & OG" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "meta",
      options: {
        source: "title",
        slugify: (input) =>
          input
            .trim()
            .replace(/[^A-Za-z0-9\- ]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-{2,}/g, "-")
            .replace(/^-+|-+$/g, "")
            .toLowerCase(),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description / TL;DR Summary",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tldrTakeaways",
      title: "TL;DR Key Takeaways (Optional)",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "pubDate",
      title: "Publish Date",
      type: "datetime",
      group: "meta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "github",
      title: "GitHub Repository URL",
      type: "url",
      group: "meta",
    }),
    defineField({
      name: "liveUrl",
      title: "Live Demo URL (Optional)",
      type: "url",
      group: "meta",
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      group: "meta",
      description: "e.g. 0.0.1 (rendered as v0.0.1)",
    }),
    defineField({
      name: "onHomePage",
      title: "Feature on Home Page",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "readingTimeOverride",
      title: "Reading Time Override (Minutes)",
      type: "number",
      group: "meta",
    }),
    defineField({
      name: "body",
      title: "Case Study Body",
      type: "blockContent",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO & Open Graph",
      type: "seoMeta",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Publish Date, Newest",
      name: "pubDateDesc",
      by: [{ field: "pubDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      version: "version",
      onHomePage: "onHomePage",
    },
    prepare({ title, version, onHomePage }) {
      const badges = [version ? `v${version}` : null, onHomePage ? "Home" : null].filter(Boolean).join(" • ");
      return {
        title,
        subtitle: badges || "Project Case Study",
      };
    },
  },
});
