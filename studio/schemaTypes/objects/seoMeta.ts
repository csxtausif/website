import { defineType, defineField } from "sanity";

export const seoMeta = defineType({
  name: "seoMeta",
  title: "SEO & Open Graph",
  type: "object",
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title Override",
      type: "string",
      description: "Overrides the HTML <title> and og:title. Leave blank to use the default template.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description Override",
      type: "text",
      rows: 3,
      description: "Recommended 120–160 characters. Leave blank to fall back to the document description.",
      validation: (Rule) => Rule.max(200).warning("Keep meta descriptions concise (under 160 chars is ideal)."),
    }),
    defineField({
      name: "keywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Comma-separated keywords meta tag. Falls back to document tags if omitted.",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL Override",
      type: "url",
      description: "Optional canonical URL if cross-posted elsewhere.",
    }),
    defineField({
      name: "noIndex",
      title: "No-Index (Hide from Search Engines)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ogType",
      title: "Open Graph Type",
      type: "string",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Website", value: "website" },
        ],
        layout: "radio",
      },
      initialValue: "article",
    }),
    defineField({
      name: "ogImageMode",
      title: "OG Image Mode",
      type: "string",
      options: {
        list: [
          { title: "Auto-Generated Terminal OG Card (/og/...)", value: "generated" },
          { title: "Custom Uploaded Image (1200x630)", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "generated",
    }),
    defineField({
      name: "ogTitle",
      title: "OG Card Title Override",
      type: "string",
      hidden: ({ parent }) => parent?.ogImageMode === "custom",
    }),
    defineField({
      name: "ogDescription",
      title: "OG Card Description Override",
      type: "text",
      rows: 2,
      hidden: ({ parent }) => parent?.ogImageMode === "custom",
    }),
    defineField({
      name: "ogCategory",
      title: "OG Card Category Badge",
      type: "string",
      description: "e.g. ARTICLE, CASE STUDY, SYSTEM DESIGN",
      hidden: ({ parent }) => parent?.ogImageMode === "custom",
    }),
    defineField({
      name: "ogCtaText",
      title: "OG Card CTA Label",
      type: "string",
      description: "e.g. READ ARTICLE ↗ or VIEW CASE STUDY ↗",
      hidden: ({ parent }) => parent?.ogImageMode === "custom",
    }),
    defineField({
      name: "ogImage",
      title: "Custom OG Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.ogImageMode !== "custom",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "twitterCard",
      title: "Twitter Card Type",
      type: "string",
      options: {
        list: [
          { title: "Summary Large Image", value: "summary_large_image" },
          { title: "Summary", value: "summary" },
        ],
      },
      initialValue: "summary_large_image",
    }),
  ],
});
