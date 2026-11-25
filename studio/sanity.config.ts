import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || "";
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || "production";

if (!projectId) {
  console.warn(
    "\n⚠️  Missing SANITY_STUDIO_PROJECT_ID in studio/.env (see studio/.env.example). Studio requires a valid Sanity projectId.\n"
  );
}

export default defineConfig({
  name: "csxtausif-studio",
  title: "csxtausif CMS",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site SEO & Settings")
              .id("siteSeoSettings")
              .child(S.document().schemaType("siteSeoSettings").documentId("siteSeoSettings")),
            S.divider(),
            S.documentTypeListItem("blogPost").title("Blog Posts"),
            S.documentTypeListItem("project").title("Projects"),
            S.divider(),
            S.documentTypeListItem("tag").title("Tags"),
            S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
