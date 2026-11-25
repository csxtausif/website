export interface EdgeCacheOptions {
  sMaxAgeSeconds?: number;
  staleWhileRevalidateSeconds?: number;
}

/**
 * Configures CDN edge caching with stale-while-revalidate on on-demand SSR HTML responses
 * to keep Vercel compute and origin CMS invocations minimal.
 */
export function setEdgeCacheHeaders(
  headers: Headers,
  { sMaxAgeSeconds = 3600, staleWhileRevalidateSeconds = 86400 }: EdgeCacheOptions = {}
): void {
  const value = `public, max-age=0, s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`;
  headers.set("Cache-Control", value);
  headers.set("CDN-Cache-Control", value);
}
