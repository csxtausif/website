// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
const isDev = env.NODE_ENV === "development" || process.env.NODE_ENV === "development";
const siteUrl = env.SITE_URL || (isDev ? "http://localhost:4321" : "https://www.buildwithtausif.in");
const bypassToken = env.VERCEL_ISR_BYPASS_TOKEN || process.env.VERCEL_ISR_BYPASS_TOKEN;

console.log(`\n🚀 Environment: ${isDev ? "development" : "production"}`);
console.log(`🌍 Configured Site URL: ${siteUrl}\n`);

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: "server",
  adapter: vercel({
    isr: bypassToken
      ? { expiration: 3600, bypassToken }
      : { expiration: 3600 },
  }),
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
