export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  ogType?: "article" | "website";
  ogImageMode?: "generated" | "custom";
  ogTitle?: string;
  ogDescription?: string;
  ogCategory?: string;
  ogCtaText?: string;
  ogImageUrl?: string;
  ogImageAlt?: string;
  twitterCard?: "summary_large_image" | "summary";
}

export interface AuthorInfo {
  name: string;
  roleSubtitle?: string;
  avatarUrl?: string;
  github?: string;
  linkedin?: string;
  x?: string;
}

export interface HeadingItem {
  depth: number;
  slug: string;
  text: string;
}

export interface BentoItemData {
  src: string;
  fullSrc?: string;
  alt: string;
  title?: string;
  caption?: string;
  span?: "normal" | "wide" | "tall" | "large";
}

export type WidgetBlock =
  | {
      _type: "richImage";
      _key?: string;
      src: string;
      fullSrc?: string;
      alt: string;
      caption?: string;
      maxWidth?: "md" | "full";
    }
  | {
      _type: "bentoGallery";
      _key?: string;
      title?: string;
      description?: string;
      items: BentoItemData[];
    }
  | {
      _type: "codeBlock";
      _key?: string;
      lang?: string;
      filename?: string;
      code: string;
    }
  | {
      _type: "terminalWidget";
      _key?: string;
      user?: string;
      host?: string;
      path?: string;
      command: string;
      data: { label: string; value: string }[];
    }
  | {
      _type: "calloutBox";
      _key?: string;
      variant?: "note" | "tip" | "warning" | "danger";
      title?: string;
      body: string;
    }
  | {
      _type: "embedCard";
      _key?: string;
      url: string;
      label: string;
      description?: string;
      badge?: string;
    }
  | {
      _type: "videoEmbed";
      _key?: string;
      url: string;
      caption?: string;
      aspectRatio?: "16/9" | "4/3" | "1/1";
    };

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  pubDate: Date;
  updatedAt: string;
  readTimeMinutes: number;
}

export interface BlogPostDetail extends BlogPostSummary {
  author: AuthorInfo;
  tldrTakeaways: string[];
  body: unknown[];
  seo: SeoMeta | null;
}

export interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  pubDate: Date;
  updatedAt: string;
  github?: string;
  liveUrl?: string;
  version?: string;
  onHomePage: boolean;
  readTimeMinutes: number;
}

export interface ProjectDetail extends ProjectSummary {
  tldrTakeaways: string[];
  body: unknown[];
  seo: SeoMeta | null;
}

export interface SiteSeoSettings {
  siteTitle?: string;
  siteDescription?: string;
  defaultKeywords?: string[];
  homeSeo?: SeoMeta | null;
  blogIndexSeo?: SeoMeta | null;
  projectsIndexSeo?: SeoMeta | null;
}

export type TransitionEffect =
  | "scramble"
  | "upslide"
  | "downslide"
  | "braille"
  | "glitch"
  | "rgb-split"
  | "vaporise"
  | "ripple-dissolve"
  | "pixellate"
  | "strangerthings"
  | "alien";

export interface AnimationFluidItem {
  text: string;
  effect?: TransitionEffect;
}

export interface AnimationTitleSettings {
  fixedText?: string;
  fixedEffect?: TransitionEffect;
  renderFixedFirst?: boolean;
  fluidTexts?: AnimationFluidItem[];
  fluidOnNewLine?: boolean;
  runInfinite?: boolean;
  runDelay?: number;
}

export interface SocialLinksSettings {
  heading?: string;
  github?: string;
  linkedin?: string;
  x?: string;
  email?: string;
  emailSubject?: string;
}

export interface EducationBadge {
  label: string;
  tone?: "lime" | "red" | "zinc";
}

export interface EducationTimelineItem {
  title: string;
  period?: string;
  institution?: string;
  location?: string;
  isCurrent?: boolean;
  badges?: EducationBadge[];
}

export interface HomePageSettings {
  animationTitle?: AnimationTitleSettings;
  bio?: unknown[];
  socials?: SocialLinksSettings;
  educationTitle?: string;
  educationTimeline?: EducationTimelineItem[];
}

export interface OgRouteData {
  title: string;
  description?: string;
  category: string;
  path: string;
  tags: string[];
  ctaText: string;
}
