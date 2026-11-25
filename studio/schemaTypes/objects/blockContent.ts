import { defineType, defineField, defineArrayMember } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Rich Content & Widgets",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Inline Code", value: "code" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto"],
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),

    // Widget 1: Prose Figure Image (triggers MediaLightbox)
    defineArrayMember({
      name: "richImage",
      title: "Figure Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
        defineField({
          name: "maxWidth",
          title: "Display Size",
          type: "string",
          options: {
            list: [
              { title: "Compact (440px default)", value: "md" },
              { title: "Wide (100% column)", value: "full" },
            ],
          },
          initialValue: "md",
        }),
      ],
    }),

    // Widget 2: Bento Gallery
    defineArrayMember({
      name: "bentoGallery",
      title: "Bento Gallery",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Gallery Title",
          type: "string",
          initialValue: "Visual Archive",
        }),
        defineField({
          name: "description",
          title: "Gallery Description",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "items",
          title: "Gallery Figures",
          type: "array",
          validation: (Rule) => Rule.min(1),
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "title",
                  title: "Tile Title",
                  type: "string",
                }),
                defineField({
                  name: "caption",
                  title: "Lightbox Caption",
                  type: "string",
                }),
                defineField({
                  name: "span",
                  title: "Grid Span",
                  type: "string",
                  options: {
                    list: [
                      { title: "Auto (Interlocking)", value: "auto" },
                      { title: "Normal (1x1)", value: "normal" },
                      { title: "Wide (2x1)", value: "wide" },
                      { title: "Tall (1x2)", value: "tall" },
                      { title: "Large (2x2)", value: "large" },
                    ],
                  },
                  initialValue: "auto",
                }),
              ],
              preview: {
                select: {
                  title: "alt",
                  subtitle: "span",
                  media: "image",
                },
              },
            }),
          ],
        }),
      ],
      preview: {
        select: { title: "title", items: "items" },
        prepare({ title, items }) {
          return {
            title: title || "Bento Gallery",
            subtitle: `${items?.length || 0} figures`,
          };
        },
      },
    }),

    // Widget 3: Code Block (highlight.js tokyo-night-dark)
    defineArrayMember({
      name: "codeBlock",
      title: "Code Block",
      type: "object",
      fields: [
        defineField({
          name: "lang",
          title: "Language",
          type: "string",
          options: {
            list: [
              { title: "JavaScript", value: "javascript" },
              { title: "TypeScript", value: "typescript" },
              { title: "SQL", value: "sql" },
              { title: "Bash / Shell", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "Python", value: "python" },
              { title: "YAML", value: "yaml" },
              { title: "Markdown", value: "markdown" },
              { title: "Plain Text", value: "text" },
            ],
          },
          initialValue: "typescript",
        }),
        defineField({
          name: "filename",
          title: "Filename (optional)",
          type: "string",
        }),
        defineField({
          name: "code",
          title: "Code",
          type: "text",
          rows: 12,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: { lang: "lang", filename: "filename", code: "code" },
        prepare({ lang, filename, code }) {
          return {
            title: filename ? `${filename} (${lang || "text"})` : `Code (${lang || "text"})`,
            subtitle: code ? code.slice(0, 60) : "",
          };
        },
      },
    }),

    // Widget 4: Terminal Output
    defineArrayMember({
      name: "terminalWidget",
      title: "Terminal Widget",
      type: "object",
      fields: [
        defineField({ name: "user", title: "User", type: "string", initialValue: "tausif" }),
        defineField({ name: "host", title: "Host", type: "string", initialValue: "forge" }),
        defineField({ name: "path", title: "Path", type: "string", initialValue: "~/project" }),
        defineField({ name: "command", title: "Command", type: "string", validation: (Rule) => Rule.required() }),
        defineField({
          name: "data",
          title: "Output Rows",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
                defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
              ],
            }),
          ],
        }),
      ],
      preview: {
        select: { command: "command", path: "path" },
        prepare({ command, path }) {
          return {
            title: `Terminal: $ ${command || ""}`,
            subtitle: path || "~",
          };
        },
      },
    }),

    // Widget 5: Callout Box
    defineArrayMember({
      name: "calloutBox",
      title: "Callout Box",
      type: "object",
      fields: [
        defineField({
          name: "variant",
          title: "Variant",
          type: "string",
          options: {
            list: [
              { title: "Note", value: "note" },
              { title: "Tip", value: "tip" },
              { title: "Warning", value: "warning" },
              { title: "Danger", value: "danger" },
            ],
          },
          initialValue: "note",
        }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Message", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      ],
      preview: {
        select: { title: "title", variant: "variant", body: "body" },
        prepare({ title, variant, body }) {
          return {
            title: `[${(variant || "note").toUpperCase()}] ${title || "Callout"}`,
            subtitle: body,
          };
        },
      },
    }),

    // Widget 6: Link / Resource Embed Card
    defineArrayMember({
      name: "embedCard",
      title: "Resource Embed Card",
      type: "object",
      fields: [
        defineField({ name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() }),
        defineField({ name: "label", title: "Title / Label", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        defineField({ name: "badge", title: "Badge", type: "string", description: "e.g. LIVE DEMO, DOCS, REPO" }),
      ],
      preview: {
        select: { title: "label", subtitle: "url" },
      },
    }),

    // Widget 7: Video Embed
    defineArrayMember({
      name: "videoEmbed",
      title: "Video Embed",
      type: "object",
      fields: [
        defineField({ name: "url", title: "Video URL (YouTube, Vimeo, or MP4)", type: "url", validation: (Rule) => Rule.required() }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
        defineField({
          name: "aspectRatio",
          title: "Aspect Ratio",
          type: "string",
          options: {
            list: [
              { title: "16:9", value: "16/9" },
              { title: "4:3", value: "4/3" },
              { title: "1:1", value: "1/1" },
            ],
          },
          initialValue: "16/9",
        }),
      ],
      preview: {
        select: { title: "caption", subtitle: "url" },
        prepare({ title, subtitle }) {
          return {
            title: title || "Video Embed",
            subtitle,
          };
        },
      },
    }),
  ],
});
