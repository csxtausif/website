import { toHTML, escapeHTML, uriLooksSafe } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import GithubSlugger from "github-slugger";
import { buildSanityImageUrl } from "./sanity";
import type { BentoItemData, HeadingItem, WidgetBlock } from "./types";

export type RenderedSegment =
  | { kind: "html"; html: string }
  | { kind: "widget"; block: WidgetBlock };

export interface ParsedPortableBody {
  segments: RenderedSegment[];
  headings: HeadingItem[];
  wordCount: number;
}

const CUSTOM_WIDGET_TYPES = new Set([
  "richImage",
  "bentoGallery",
  "codeBlock",
  "terminalWidget",
  "calloutBox",
  "embedCard",
  "videoEmbed",
]);

function extractPlainTextFromBlock(block: PortableTextBlock): string {
  if (!Array.isArray(block.children)) return "";
  return block.children
    .map((child: any) => (typeof child?.text === "string" ? child.text : ""))
    .join("");
}

function countWords(text: string): number {
  const matches = text.match(/\S+/g);
  return matches ? matches.length : 0;
}

function normalizeWidgetBlock(raw: any): WidgetBlock | null {
  switch (raw._type) {
    case "richImage": {
      const src = buildSanityImageUrl(raw, { width: 960, quality: 84 });
      const fullSrc = buildSanityImageUrl(raw, { width: 1800, quality: 90 });
      if (!src) return null;
      return {
        _type: "richImage",
        _key: raw._key,
        src,
        fullSrc,
        alt: raw.alt || "Embedded Figure",
        caption: raw.caption,
        maxWidth: raw.maxWidth === "full" ? "full" : "md",
      };
    }

    case "bentoGallery": {
      const rawItems = Array.isArray(raw.items) ? raw.items : [];
      const items: BentoItemData[] = rawItems
        .map((item: any, idx: number) => {
          const thumbSrc = buildSanityImageUrl(item.image, { width: 720, quality: 80 });
          const fullSrc = buildSanityImageUrl(item.image, { width: 1800, quality: 90 });
          if (!thumbSrc) return null;
          const validSpans = new Set(["normal", "wide", "tall", "large"]);
          return {
            src: thumbSrc,
            fullSrc,
            alt: item.alt || `Figure ${String(idx + 1).padStart(2, "0")}`,
            title: item.title,
            caption: item.caption,
            span: validSpans.has(item.span) ? item.span : undefined,
          } satisfies BentoItemData;
        })
        .filter((x: BentoItemData | null): x is BentoItemData => x !== null);

      return {
        _type: "bentoGallery",
        _key: raw._key,
        title: raw.title,
        description: raw.description,
        items,
      };
    }

    case "codeBlock":
      return {
        _type: "codeBlock",
        _key: raw._key,
        lang: raw.lang || "text",
        filename: raw.filename,
        code: raw.code || "",
      };

    case "terminalWidget":
      return {
        _type: "terminalWidget",
        _key: raw._key,
        user: raw.user || "tausif",
        host: raw.host || "forge",
        path: raw.path || "~/project",
        command: raw.command || "run",
        data: Array.isArray(raw.data) ? raw.data : [],
      };

    case "calloutBox":
      return {
        _type: "calloutBox",
        _key: raw._key,
        variant: raw.variant || "note",
        title: raw.title,
        body: raw.body || "",
      };

    case "embedCard":
      return {
        _type: "embedCard",
        _key: raw._key,
        url: raw.url || "#",
        label: raw.label || raw.url || "Resource",
        description: raw.description,
        badge: raw.badge,
      };

    case "videoEmbed":
      return {
        _type: "videoEmbed",
        _key: raw._key,
        url: raw.url || "",
        caption: raw.caption,
        aspectRatio: raw.aspectRatio || "16/9",
      };

    default:
      return null;
  }
}

export function parsePortableBody(body: unknown[] = []): ParsedPortableBody {
  const slugger = new GithubSlugger();
  const headings: HeadingItem[] = [];
  const headingSlugByKey = new Map<string, string>();
  let totalWords = 0;

  // First pass: collect headings with deterministic slugs and compute wordCount
  for (let i = 0; i < body.length; i++) {
    const node = body[i] as any;
    if (!node || typeof node !== "object") continue;

    if (node._type === "block") {
      const text = extractPlainTextFromBlock(node as PortableTextBlock);
      totalWords += countWords(text);

      const style = node.style || "normal";
      const match = /^h([1-4])$/.exec(style);
      if (match && text.trim().length > 0) {
        const depth = Number(match[1]);
        const slug = slugger.slug(text);
        const mapKey = node._key || `idx-${i}`;
        headingSlugByKey.set(mapKey, slug);
        headings.push({ depth, slug, text: text.trim() });
      }
    } else if (node._type === "codeBlock" && typeof node.code === "string") {
      totalWords += countWords(node.code);
    } else if (node._type === "calloutBox" && typeof node.body === "string") {
      totalWords += countWords(node.body);
    }
  }

  // Second pass: group contiguous standard blocks into HTML segments and keep widgets as native Astro blocks
  const segments: RenderedSegment[] = [];
  let textBuffer: PortableTextBlock[] = [];

  const renderHeading = (tag: "h1" | "h2" | "h3" | "h4") => {
    return ({ value, children }: { value: PortableTextBlock; children?: string }) => {
      const slug = value._key ? headingSlugByKey.get(value._key) : undefined;
      const idAttr = slug ? ` id="${escapeHTML(slug)}"` : "";
      return `<${tag}${idAttr}>${children || ""}</${tag}>`;
    };
  };

  const flushTextBuffer = () => {
    if (textBuffer.length === 0) return;

    const html = toHTML(textBuffer, {
      onMissingComponent: false,
      components: {
        block: {
          h1: renderHeading("h1"),
          h2: renderHeading("h2"),
          h3: renderHeading("h3"),
          h4: renderHeading("h4"),
        },
        marks: {
          link: ({ value, children }) => {
            const href = typeof value?.href === "string" && uriLooksSafe(value.href) ? value.href : "#";
            const isExternal = Boolean(value?.openInNewTab) || /^https?:\/\//i.test(href);
            const relAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
            return `<a href="${escapeHTML(href)}"${relAttr}>${children}</a>`;
          },
        },
      },
    });

    if (html.trim().length > 0) {
      segments.push({ kind: "html", html });
    }
    textBuffer = [];
  };

  for (let i = 0; i < body.length; i++) {
    const node = body[i] as any;
    if (!node || typeof node !== "object") continue;

    if (CUSTOM_WIDGET_TYPES.has(node._type)) {
      flushTextBuffer();
      const widget = normalizeWidgetBlock(node);
      if (widget) {
        segments.push({ kind: "widget", block: widget });
      }
    } else {
      if (!node._key) {
        node._key = `idx-${i}`;
      }
      textBuffer.push(node as PortableTextBlock);
    }
  }

  flushTextBuffer();

  return {
    segments,
    headings,
    wordCount: totalWords,
  };
}
