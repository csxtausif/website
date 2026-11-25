import { defineType, defineField } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "roleSubtitle",
      title: "Bio Subtitle",
      type: "string",
      initialValue: "Software Engineer • Scalable backend systems, Node.js & PostgreSQL",
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "github", title: "GitHub URL", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "x", title: "X / Twitter URL", type: "url" }),
  ],
});
