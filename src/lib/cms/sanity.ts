import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

function readEnv(key: string): string {
  return (import.meta.env[key] as string | undefined) || process.env[key] || "";
}

export const sanityConfig = {
  projectId: readEnv("SANITY_PROJECT_ID"),
  dataset: readEnv("SANITY_DATASET") || "production",
  apiVersion: readEnv("SANITY_API_VERSION") || "2026-01-01",
  token: readEnv("SANITY_API_READ_TOKEN"),
};

export function isSanityConfigured(): boolean {
  return Boolean(sanityConfig.projectId && sanityConfig.dataset);
}

let cachedClient: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: !sanityConfig.token,
      token: sanityConfig.token || undefined,
      perspective: "published",
    });
  }

  return cachedClient;
}

export interface ImageBuildOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
}

export function buildSanityImageUrl(
  source: SanityImageSource | null | undefined,
  options: ImageBuildOptions = {}
): string | undefined {
  if (!source || !isSanityConfigured()) return undefined;

  const builder = createImageUrlBuilder({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
  });

  let chain = builder.image(source).auto("format").quality(options.quality ?? 82);
  if (options.width) chain = chain.width(options.width);
  if (options.height) chain = chain.height(options.height);
  if (options.fit) chain = chain.fit(options.fit);

  return chain.url();
}
