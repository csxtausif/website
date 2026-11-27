import countReadingMinutes from "@utils/readingMin";
import { buildSanityImageUrl, getSanityClient } from "./sanity";
import type {
  AuthorInfo,
  BlogPostDetail,
  BlogPostSummary,
  EducationBadge,
  EducationTimelineItem,
  HomePageSettings,
  OgRouteData,
  ProjectDetail,
  ProjectSummary,
  SeoMeta,
  SiteSeoSettings,
  SocialLinksSettings,
  TransitionEffect,
} from "./types";

const DEFAULT_AUTHOR: AuthorInfo = {
  name: "Tausif Alam",
  roleSubtitle: "Software Engineer • Scalable backend systems, Node.js & PostgreSQL",
  github: "https://github.com/buildwithtausif",
  linkedin: "https://www.linkedin.com/in/buildwithtausif/",
  x: "https://x.com/csxtausif",
};

function computeReadingTime(rawWordCount: unknown, override: unknown): number {
  if (typeof override === "number" && override > 0) return Math.ceil(override);
  const words = typeof rawWordCount === "number" && rawWordCount > 0 ? rawWordCount : 0;
  return Math.max(1, countReadingMinutes(words));
}

function mapSeoMeta(raw: any): SeoMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const ogImageUrl = raw.ogImage ? buildSanityImageUrl(raw.ogImage, { width: 1200, height: 630, fit: "crop" }) : undefined;
  return {
    metaTitle: raw.metaTitle || undefined,
    metaDescription: raw.metaDescription || undefined,
    keywords: Array.isArray(raw.keywords) ? raw.keywords.filter(Boolean) : undefined,
    canonicalUrl: raw.canonicalUrl || undefined,
    noIndex: Boolean(raw.noIndex),
    ogType: raw.ogType === "website" ? "website" : raw.ogType === "article" ? "article" : undefined,
    ogImageMode: raw.ogImageMode === "custom" ? "custom" : "generated",
    ogTitle: raw.ogTitle || undefined,
    ogDescription: raw.ogDescription || undefined,
    ogCategory: raw.ogCategory || undefined,
    ogCtaText: raw.ogCtaText || undefined,
    ogImageUrl,
    ogImageAlt: raw.ogImage?.alt || undefined,
    twitterCard: raw.twitterCard === "summary" ? "summary" : "summary_large_image",
  };
}

function mapAuthor(raw: any): AuthorInfo {
  if (!raw || typeof raw !== "object") return DEFAULT_AUTHOR;
  return {
    name: raw.name || DEFAULT_AUTHOR.name,
    roleSubtitle: raw.roleSubtitle || DEFAULT_AUTHOR.roleSubtitle,
    avatarUrl: raw.avatar ? buildSanityImageUrl(raw.avatar, { width: 96, height: 96, fit: "crop" }) : undefined,
    github: raw.github || DEFAULT_AUTHOR.github,
    linkedin: raw.linkedin || DEFAULT_AUTHOR.linkedin,
    x: raw.x || DEFAULT_AUTHOR.x,
  };
}

const BLOG_SUMMARY_PROJECTION = `{
  "_id": _id,
  title,
  "slug": slug.current,
  description,
  "tags": coalesce(tags[]->name, []),
  pubDate,
  "_updatedAt": _updatedAt,
  readingTimeOverride,
  "wordCount": length(string::split(coalesce(pt::text(body), ""), " "))
}`;

const PROJECT_SUMMARY_PROJECTION = `{
  "_id": _id,
  title,
  "slug": slug.current,
  description,
  "tags": coalesce(tags[]->name, []),
  pubDate,
  "_updatedAt": _updatedAt,
  github,
  liveUrl,
  version,
  "onHomePage": coalesce(onHomePage, false),
  readingTimeOverride,
  "wordCount": length(string::split(coalesce(pt::text(body), ""), " "))
}`;

function mapBlogSummary(raw: any): BlogPostSummary {
  return {
    id: raw._id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description || "",
    tags: Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : [],
    pubDate: new Date(raw.pubDate),
    updatedAt: raw._updatedAt || new Date().toISOString(),
    readTimeMinutes: computeReadingTime(raw.wordCount, raw.readingTimeOverride),
  };
}

function mapProjectSummary(raw: any): ProjectSummary {
  return {
    id: raw._id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description || "",
    tags: Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : [],
    pubDate: new Date(raw.pubDate),
    updatedAt: raw._updatedAt || new Date().toISOString(),
    github: raw.github || undefined,
    liveUrl: raw.liveUrl || undefined,
    version: raw.version || undefined,
    onHomePage: Boolean(raw.onHomePage),
    readTimeMinutes: computeReadingTime(raw.wordCount, raw.readingTimeOverride),
  };
}

export async function getHomeShowcaseProjects(): Promise<ProjectSummary[]> {
  const client = getSanityClient();
  if (!client) return [];

  const query = `*[_type == "project" && onHomePage == true && defined(slug.current)] | order(pubDate desc) ${PROJECT_SUMMARY_PROJECTION}`;
  const rows = await client.fetch<any[]>(query);
  return (rows || []).map(mapProjectSummary);
}

export async function getFeaturedWidgetData(): Promise<{
  articles: BlogPostSummary[];
  projectUpdates: ProjectSummary[];
}> {
  const client = getSanityClient();
  if (!client) return { articles: [], projectUpdates: [] };

  const query = `{
    "articles": *[_type == "blogPost" && defined(slug.current)] | order(pubDate desc)[0...3] ${BLOG_SUMMARY_PROJECTION},
    "projectUpdates": *[_type == "project" && defined(slug.current)] | order(pubDate desc)[0...3] ${PROJECT_SUMMARY_PROJECTION}
  }`;
  const result = await client.fetch<{ articles: any[]; projectUpdates: any[] }>(query);

  return {
    articles: (result?.articles || []).map(mapBlogSummary),
    projectUpdates: (result?.projectUpdates || []).map(mapProjectSummary),
  };
}

export async function getAllBlogSummaries(): Promise<BlogPostSummary[]> {
  const client = getSanityClient();
  if (!client) return [];

  const query = `*[_type == "blogPost" && defined(slug.current)] | order(pubDate desc) ${BLOG_SUMMARY_PROJECTION}`;
  const rows = await client.fetch<any[]>(query);
  return (rows || []).map(mapBlogSummary);
}

export async function getAllProjectSummaries(): Promise<ProjectSummary[]> {
  const client = getSanityClient();
  if (!client) return [];

  const query = `*[_type == "project" && defined(slug.current)] | order(pubDate desc) ${PROJECT_SUMMARY_PROJECTION}`;
  const rows = await client.fetch<any[]>(query);
  return (rows || []).map(mapProjectSummary);
}

export async function getBlogBySlug(slug: string): Promise<BlogPostDetail | null> {
  const client = getSanityClient();
  if (!client || !slug) return null;

  const query = `*[_type == "blogPost" && slug.current == $slug][0]{
    "_id": _id,
    title,
    "slug": slug.current,
    description,
    "tldrTakeaways": coalesce(tldrTakeaways, []),
    "tags": coalesce(tags[]->name, []),
    pubDate,
    "_updatedAt": _updatedAt,
    readingTimeOverride,
    author->{
      name,
      roleSubtitle,
      avatar,
      github,
      linkedin,
      x
    },
    body,
    seo
  }`;

  const raw = await client.fetch<any>(query, { slug });
  if (!raw) return null;

  return {
    ...mapBlogSummary(raw),
    author: mapAuthor(raw.author),
    tldrTakeaways: Array.isArray(raw.tldrTakeaways) ? raw.tldrTakeaways.filter(Boolean) : [],
    body: Array.isArray(raw.body) ? raw.body : [],
    seo: mapSeoMeta(raw.seo),
  };
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const client = getSanityClient();
  if (!client || !slug) return null;

  const query = `*[_type == "project" && slug.current == $slug][0]{
    "_id": _id,
    title,
    "slug": slug.current,
    description,
    "tldrTakeaways": coalesce(tldrTakeaways, []),
    "tags": coalesce(tags[]->name, []),
    pubDate,
    "_updatedAt": _updatedAt,
    github,
    liveUrl,
    version,
    "onHomePage": coalesce(onHomePage, false),
    readingTimeOverride,
    body,
    seo
  }`;

  const raw = await client.fetch<any>(query, { slug });
  if (!raw) return null;

  return {
    ...mapProjectSummary(raw),
    tldrTakeaways: Array.isArray(raw.tldrTakeaways) ? raw.tldrTakeaways.filter(Boolean) : [],
    body: Array.isArray(raw.body) ? raw.body : [],
    seo: mapSeoMeta(raw.seo),
  };
}

export async function getBlogOgData(slug: string): Promise<OgRouteData | null> {
  const client = getSanityClient();
  if (!client || !slug) return null;

  const query = `*[_type == "blogPost" && slug.current == $slug][0]{
    title,
    description,
    "tags": coalesce(tags[]->name, []),
    seo {
      ogTitle,
      ogDescription,
      ogCategory,
      ogCtaText
    }
  }`;
  const raw = await client.fetch<any>(query, { slug });
  if (!raw) return null;

  return {
    title: raw.seo?.ogTitle || raw.title,
    description: raw.seo?.ogDescription || raw.description || "",
    category: raw.seo?.ogCategory || "ARTICLE",
    path: "blog",
    tags: Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : [],
    ctaText: raw.seo?.ogCtaText || "READ ARTICLE ↗",
  };
}

export async function getProjectOgData(slug: string): Promise<OgRouteData | null> {
  const client = getSanityClient();
  if (!client || !slug) return null;

  const query = `*[_type == "project" && slug.current == $slug][0]{
    title,
    description,
    "tags": coalesce(tags[]->name, []),
    seo {
      ogTitle,
      ogDescription,
      ogCategory,
      ogCtaText
    }
  }`;
  const raw = await client.fetch<any>(query, { slug });
  if (!raw) return null;

  return {
    title: raw.seo?.ogTitle || raw.title,
    description: raw.seo?.ogDescription || raw.description || "",
    category: raw.seo?.ogCategory || "CASE STUDY",
    path: "projects",
    tags: Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : [],
    ctaText: raw.seo?.ogCtaText || "VIEW CASE STUDY ↗",
  };
}

export async function getSiteSeoSettings(): Promise<SiteSeoSettings | null> {
  const client = getSanityClient();
  if (!client) return null;

  const query = `*[_type == "siteSeoSettings"][0]{
    siteTitle,
    siteDescription,
    defaultKeywords,
    homeSeo,
    blogIndexSeo,
    projectsIndexSeo
  }`;
  const raw = await client.fetch<any>(query);
  if (!raw) return null;

  return {
    siteTitle: raw.siteTitle || undefined,
    siteDescription: raw.siteDescription || undefined,
    defaultKeywords: Array.isArray(raw.defaultKeywords) ? raw.defaultKeywords.filter(Boolean) : undefined,
    homeSeo: mapSeoMeta(raw.homeSeo),
    blogIndexSeo: mapSeoMeta(raw.blogIndexSeo),
    projectsIndexSeo: mapSeoMeta(raw.projectsIndexSeo),
  };
}

export async function getAllSitemapEntries(): Promise<{
  blogs: { slug: string; updatedAt: string }[];
  projects: { slug: string; updatedAt: string }[];
}> {
  const client = getSanityClient();
  if (!client) return { blogs: [], projects: [] };

  const query = `{
    "blogs": *[_type == "blogPost" && defined(slug.current) && coalesce(seo.noIndex, false) != true] | order(pubDate desc){
      "slug": slug.current,
      "updatedAt": _updatedAt
    },
    "projects": *[_type == "project" && defined(slug.current) && coalesce(seo.noIndex, false) != true] | order(pubDate desc){
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  }`;

  const result = await client.fetch<{
    blogs: { slug: string; updatedAt: string }[];
    projects: { slug: string; updatedAt: string }[];
  }>(query);

  return {
    blogs: result?.blogs || [],
    projects: result?.projects || [],
  };
}

const VALID_EFFECTS = new Set<TransitionEffect>([
  "scramble",
  "upslide",
  "downslide",
  "braille",
  "glitch",
  "rgb-split",
  "vaporise",
  "ripple-dissolve",
  "pixellate",
  "strangerthings",
  "alien",
]);

function normalizeEffect(effect: unknown, fallback: TransitionEffect = "scramble"): TransitionEffect {
  return typeof effect === "string" && VALID_EFFECTS.has(effect as TransitionEffect)
    ? (effect as TransitionEffect)
    : fallback;
}

function mapSocials(raw: any): SocialLinksSettings | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  return {
    heading: raw.heading || undefined,
    github: raw.github || undefined,
    linkedin: raw.linkedin || undefined,
    x: raw.x || undefined,
    email: raw.email || undefined,
    emailSubject: raw.emailSubject || undefined,
  };
}

export async function getHomePageSettings(): Promise<HomePageSettings | null> {
  const client = getSanityClient();
  if (!client) return null;

  const query = `*[_type == "homePageSettings"][0]{
    animationTitle,
    bio,
    socials,
    educationTitle,
    educationTimeline
  }`;
  const raw = await client.fetch<any>(query);
  if (!raw) return null;

  const anim = raw.animationTitle;
  const fluidTexts = Array.isArray(anim?.fluidTexts)
    ? anim.fluidTexts
        .filter((item: any) => item && typeof item.text === "string" && item.text.trim().length > 0)
        .map((item: any) => ({
          text: item.text,
          effect: normalizeEffect(item.effect),
        }))
    : undefined;

  const educationTimeline: EducationTimelineItem[] | undefined = Array.isArray(raw.educationTimeline)
    ? raw.educationTimeline
        .filter((item: any) => item && typeof item.title === "string" && item.title.trim().length > 0)
        .map((item: any): EducationTimelineItem => {
          const badges: EducationBadge[] | undefined = Array.isArray(item.badges)
            ? item.badges
                .filter((b: any) => b && typeof b.label === "string" && b.label.trim().length > 0)
                .map((b: any): EducationBadge => ({
                  label: b.label,
                  tone: b.tone === "red" || b.tone === "zinc" ? b.tone : "lime",
                }))
            : undefined;
          return {
            title: item.title,
            period: item.period || undefined,
            institution: item.institution || undefined,
            location: item.location || undefined,
            isCurrent: Boolean(item.isCurrent),
            badges: badges && badges.length > 0 ? badges : undefined,
          };
        })
    : undefined;

  return {
    animationTitle: anim
      ? {
          fixedText: typeof anim.fixedText === "string" ? anim.fixedText : undefined,
          fixedEffect: normalizeEffect(anim.fixedEffect),
          renderFixedFirst: anim.renderFixedFirst !== undefined ? Boolean(anim.renderFixedFirst) : true,
          fluidTexts: fluidTexts && fluidTexts.length > 0 ? fluidTexts : undefined,
          fluidOnNewLine: anim.fluidOnNewLine !== undefined ? Boolean(anim.fluidOnNewLine) : true,
          runInfinite: anim.runInfinite !== undefined ? Boolean(anim.runInfinite) : true,
          runDelay: typeof anim.runDelay === "number" && anim.runDelay >= 0 ? anim.runDelay : 2000,
        }
      : undefined,
    bio: Array.isArray(raw.bio) && raw.bio.length > 0 ? raw.bio : undefined,
    socials: mapSocials(raw.socials),
    educationTitle: raw.educationTitle || undefined,
    educationTimeline: educationTimeline && educationTimeline.length > 0 ? educationTimeline : undefined,
  };
}

export async function getSocialLinks(): Promise<SocialLinksSettings | null> {
  const client = getSanityClient();
  if (!client) return null;

  const query = `*[_type == "homePageSettings"][0].socials`;
  const raw = await client.fetch<any>(query);
  return mapSocials(raw) ?? null;
}
