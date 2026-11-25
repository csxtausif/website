import { defineType, defineField } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Metadata" },
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
      description: "Optional bullet points rendered inside the TL;DR Executive Summary box.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
      validation: (Rule) => Rule.required(),
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
      name: "readingTimeOverride",
      title: "Reading Time Override (Minutes)",
      type: "number",
      group: "meta",
      description: "Optional manual override. Automatically computed from word count if empty.",
    }),
    defineField({
      name: "body",
      title: "Article Body",
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
      author: "author.name",
      pubDate: "pubDate",
    },
    prepare({ title, author, pubDate }) {
      const dateStr = pubDate ? new Date(pubDate).toISOString().split("T")[0] : "No date";
      return {
        title,
        subtitle: `${dateStr} • ${author || "Unknown author"}`,
      };
    },
  },
});
