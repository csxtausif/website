/**
 * Seed script to populate the `homePageSettings` singleton in Sanity CMS
 * with the existing homepage animation title, bio, socials, and education timeline.
 *
 * Usage:
 *   node scripts/seed-homepage.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

for (const envFile of [".env", ".env.local"]) {
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envPath);
  }
}

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN environment variables.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2026-01-01",
  token,
  useCdn: false,
});

export const HOME_PAGE_SETTINGS_DOC = {
  _id: "homePageSettings",
  _type: "homePageSettings",
  animationTitle: {
    fixedText: "Hey There,",
    fixedEffect: "scramble",
    renderFixedFirst: true,
    fluidTexts: [],
    fluidOnNewLine: true,
    runInfinite: true,
    runDelay: 2000,
  },
  bio: [
    {
      _type: "block",
      _key: "bio-p1",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "bio-p1-s1",
          text: "You’ve found my corner of the internet. I’m Tausif — a ",
          marks: [],
        },
        {
          _type: "span",
          _key: "bio-p1-s2",
          text: "software engineer",
          marks: ["strong"],
        },
        {
          _type: "span",
          _key: "bio-p1-s3",
          text: " I share my thoughts, insights, projects and sometimes a philosophical rant, welcome to my oasis!",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "bio-p2",
      style: "normal",
      markDefs: [
        {
          _key: "bio-link-projects",
          _type: "link",
          href: "/projects",
          openInNewTab: false,
        },
        {
          _key: "bio-link-blog",
          _type: "link",
          href: "/blog",
          openInNewTab: false,
        },
      ],
      children: [
        {
          _type: "span",
          _key: "bio-p2-s1",
          text: "If you’re looking for someone to help bring your ideas to life, take a look at my ",
          marks: [],
        },
        {
          _type: "span",
          _key: "bio-p2-s2",
          text: "projects",
          marks: ["bio-link-projects"],
        },
        {
          _type: "span",
          _key: "bio-p2-s3",
          text: " for a glimpse of what I build. And if you’d like to understand how I think, check out my ",
          marks: [],
        },
        {
          _type: "span",
          _key: "bio-p2-s4",
          text: "blog",
          marks: ["bio-link-blog"],
        },
        {
          _type: "span",
          _key: "bio-p2-s5",
          text: ".",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: "bio-p3",
      style: "normal",
      markDefs: [
        {
          _key: "bio-link-email",
          _type: "link",
          href: "mailto:connect.tausifalam@outlook.com?subject=[FromWebsite]:[Please add your subject here]",
          openInNewTab: false,
        },
      ],
      children: [
        {
          _type: "span",
          _key: "bio-p3-s1",
          text: "Want to connect? Reach out via email — ",
          marks: [],
        },
        {
          _type: "span",
          _key: "bio-p3-s2",
          text: "click here",
          marks: ["bio-link-email"],
        },
      ],
    },
  ],
  socials: {
    heading: "Connect:-",
    github: "https://github.com/csxtausif",
    linkedin: "https://www.linkedin.com/in/buildwithtausif/",
    x: "https://x.com/csxtausif",
    email: "connect.tausifalam@outlook.com",
    emailSubject: "[FromWebsite]:[Please add your subject here]",
  },
  educationTitle: "Education Timeline",
  educationTimeline: [
    {
      _type: "educationItem",
      _key: "edu-bca",
      title: "Bachelor's of Computer Application",
      period: "2025 — 2028 (Present)",
      institution: "Guru Gobind Singh Indraprastha University",
      location: "Delhi, India",
      isCurrent: true,
      badges: [
        {
          _type: "educationBadge",
          _key: "badge-bca-sgpa",
          label: "Current SGPA: 9.64",
          tone: "lime",
        },
        {
          _type: "educationBadge",
          _key: "badge-bca-cgpa",
          label: "CGPA: 9.55",
          tone: "red",
        },
      ],
    },
    {
      _type: "educationItem",
      _key: "edu-hs",
      title: "High School - PCM (2023-2024)",
      isCurrent: false,
      badges: [
        {
          _type: "educationBadge",
          _key: "badge-hs-cgpa",
          label: "CGPA: 8.45",
          tone: "zinc",
        },
      ],
    },
  ],
};

async function run() {
  console.log(`Seeding homePageSettings in ${projectId}/${dataset}...`);
  await client.createOrReplace(HOME_PAGE_SETTINGS_DOC);
  console.log("Successfully seeded homePageSettings!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
