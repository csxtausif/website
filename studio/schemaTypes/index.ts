import { seoMeta } from "./objects/seoMeta";
import { blockContent } from "./objects/blockContent";
import { author } from "./documents/author";
import { tag } from "./documents/tag";
import { blogPost } from "./documents/blogPost";
import { project } from "./documents/project";
import { siteSeoSettings } from "./documents/siteSeoSettings";

export const schemaTypes = [
  seoMeta,
  blockContent,
  author,
  tag,
  blogPost,
  project,
  siteSeoSettings,
];
