import type { APIRoute } from "astro";

export const prerender = false;

function readEnv(key: string): string {
  return (import.meta.env[key] as string | undefined) || process.env[key] || "";
}

export const POST: APIRoute = async ({ request, url, site }) => {
  const expectedSecret = readEnv("REVALIDATE_SECRET") || readEnv("REVALIDATION_SECRET");
  const providedSecret =
    request.headers.get("x-revalidate-secret") || url.searchParams.get("secret") || "";

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let payload: any = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const docType = payload?._type;
  const slug = payload?.slug?.current || payload?.slug;
  const paths = new Set<string>(["/", "/blog", "/projects", "/sitemap.xml"]);

  if (docType === "blogPost" && typeof slug === "string" && slug) {
    paths.add(`/blog/${slug}`);
    paths.add(`/og/blog/${slug}.png`);
  } else if (docType === "project" && typeof slug === "string" && slug) {
    paths.add(`/project/${slug}`);
    paths.add(`/og/project/${slug}.png`);
  }

  const bypassToken = readEnv("VERCEL_ISR_BYPASS_TOKEN");
  const origin = (site ? site.toString() : url.origin).replace(/\/$/, "");
  const revalidated: string[] = [];

  if (bypassToken) {
    await Promise.all(
      Array.from(paths).map(async (path) => {
        try {
          await fetch(`${origin}${path}`, {
            method: "HEAD",
            headers: { "x-prerender-revalidate": bypassToken },
          });
          revalidated.push(path);
        } catch {
          // Best-effort revalidation
        }
      })
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      paths: Array.from(paths),
      revalidated,
      isrBypassConfigured: Boolean(bypassToken),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
