import { defineType, defineField, defineArrayMember } from "sanity";

const TRANSITION_EFFECTS = [
  { title: "Scramble", value: "scramble" },
  { title: "Up Slide", value: "upslide" },
  { title: "Down Slide", value: "downslide" },
  { title: "Braille", value: "braille" },
  { title: "Glitch", value: "glitch" },
  { title: "RGB Split", value: "rgb-split" },
  { title: "Vaporise", value: "vaporise" },
  { title: "Ripple Dissolve", value: "ripple-dissolve" },
  { title: "Pixellate", value: "pixellate" },
  { title: "Stranger Things", value: "strangerthings" },
  { title: "Alien", value: "alien" },
];

export const homePageSettings = defineType({
  name: "homePageSettings",
  title: "Homepage Content",
  type: "document",
  groups: [
    { name: "animation", title: "Animation Text", default: true },
    { name: "bio", title: "Homepage Bio" },
    { name: "socials", title: "Socials" },
    { name: "education", title: "Education Timeline" },
  ],
  fields: [
    defineField({
      name: "animationTitle",
      title: "Hero Animation Text",
      type: "object",
      group: "animation",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "fixedText",
          title: "Fixed Text",
          type: "string",
          initialValue: "Hey There,",
          description: "Static or intro text shown before any rotating fluid phrases.",
        }),
        defineField({
          name: "fixedEffect",
          title: "Fixed Text Effect",
          type: "string",
          options: { list: TRANSITION_EFFECTS },
          initialValue: "scramble",
        }),
        defineField({
          name: "renderFixedFirst",
          title: "Animate Fixed Text First",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "fluidTexts",
          title: "Rotating Fluid Texts",
          type: "array",
          description: "Optional list of animated phrases that cycle after the fixed text.",
          of: [
            defineArrayMember({
              type: "object",
              name: "fluidTextItem",
              title: "Fluid Text",
              fields: [
                defineField({
                  name: "text",
                  title: "Text",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "effect",
                  title: "Transition Effect",
                  type: "string",
                  options: { list: TRANSITION_EFFECTS },
                  initialValue: "scramble",
                }),
              ],
              preview: {
                select: { title: "text", subtitle: "effect" },
              },
            }),
          ],
        }),
        defineField({
          name: "fluidOnNewLine",
          title: "Show Fluid Text on New Line",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "runInfinite",
          title: "Loop Fluid Texts Infinitely",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "runDelay",
          title: "Delay Between Animations (ms)",
          type: "number",
          initialValue: 2000,
          validation: (Rule) => Rule.min(0).integer(),
        }),
      ],
    }),

    defineField({
      name: "bio",
      title: "Homepage Bio",
      type: "array",
      group: "bio",
      description: "Rich text bio displayed below the hero title. Bold text and links are highlighted in lime.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
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
      ],
    }),

    defineField({
      name: "socials",
      title: "Social Links",
      type: "object",
      group: "socials",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "heading",
          title: "Section Heading",
          type: "string",
          initialValue: "Connect:-",
        }),
        defineField({
          name: "github",
          title: "GitHub URL",
          type: "url",
          initialValue: "https://github.com/csxtausif",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
          initialValue: "https://www.linkedin.com/in/buildwithtausif/",
        }),
        defineField({
          name: "x",
          title: "X / Twitter URL",
          type: "url",
          initialValue: "https://x.com/csxtausif",
        }),
        defineField({
          name: "email",
          title: "Email Address or mailto: URL",
          type: "string",
          initialValue: "connect.tausifalam@outlook.com",
          description: "Plain email (e.g. connect.tausifalam@outlook.com) or full mailto: URL.",
        }),
        defineField({
          name: "emailSubject",
          title: "Default Email Subject",
          type: "string",
          initialValue: "[FromWebsite]:[Please add your subject here]",
          description: "Appended as ?subject=... when Email is a plain address.",
        }),
      ],
    }),

    defineField({
      name: "educationTitle",
      title: "Education Section Badge Title",
      type: "string",
      group: "education",
      initialValue: "Education Timeline",
    }),
    defineField({
      name: "educationTimeline",
      title: "Education Timeline Entries",
      type: "array",
      group: "education",
      description: "Ordered from most recent/current at the top to earliest at the bottom.",
      of: [
        defineArrayMember({
          type: "object",
          name: "educationItem",
          title: "Education Entry",
          fields: [
            defineField({
              name: "title",
              title: "Degree / Program Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "period",
              title: "Time Period",
              type: "string",
              description: "e.g. 2025 — 2028 (Present)",
            }),
            defineField({
              name: "institution",
              title: "Institution",
              type: "string",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "isCurrent",
              title: "Currently Pursuing",
              type: "boolean",
              initialValue: false,
              description: "Highlights this entry with the pulsing lime timeline dot.",
            }),
            defineField({
              name: "badges",
              title: "Score / Highlight Badges",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "educationBadge",
                  title: "Badge",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "tone",
                      title: "Color Tone",
                      type: "string",
                      options: {
                        list: [
                          { title: "Lime", value: "lime" },
                          { title: "Red", value: "red" },
                          { title: "Zinc (Muted)", value: "zinc" },
                        ],
                      },
                      initialValue: "lime",
                    }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "tone" },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              period: "period",
              institution: "institution",
              isCurrent: "isCurrent",
            },
            prepare({ title, period, institution, isCurrent }) {
              const parts = [period, institution].filter(Boolean);
              return {
                title: isCurrent ? `● ${title}` : title,
                subtitle: parts.join(" • "),
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage Content",
        subtitle: "Animation text, bio, socials & education timeline",
      };
    },
  },
});
