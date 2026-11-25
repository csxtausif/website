import { defineType, defineField } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Display Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
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
  ],
});
