/**
 * One-off seed script to migrate existing local MDX blog & project content
 * and local images into Sanity CMS.
 *
 * Usage:
 *   SANITY_PROJECT_ID=... SANITY_DATASET=production SANITY_API_WRITE_TOKEN=... node scripts/migrate-to-sanity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

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

const rootDir = process.cwd();
const seedImagesDir = path.join(rootDir, "scripts", "seed-data", "images");

let keyCounter = 0;
const key = () => `k${++keyCounter}`;

function ptParagraph(text, marks = []) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks }],
  };
}

function ptHeading(style, text) {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

async function uploadImage(filePath, filename) {
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload("image", stream, { filename });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

function slugifyTag(name) {
  return name
    .trim()
    .replace(/[^A-Za-z0-9\- ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

async function ensureTags(tagNames) {
  const refs = [];
  for (const name of tagNames) {
    const slug = slugifyTag(name);
    const id = `tag-${slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "tag",
      name,
      slug: { _type: "slug", current: slug },
    });
    refs.push({ _type: "reference", _ref: id, _key: key() });
  }
  return refs;
}

async function run() {
  console.log("Uploading author avatar & creating author...");
  const avatarPath = path.join(rootDir, "src", "res", "images", "pfp.webp");
  const avatarImg = fs.existsSync(avatarPath)
    ? await uploadImage(avatarPath, "pfp.webp")
    : undefined;

  await client.createOrReplace({
    _id: "author-tausif-alam",
    _type: "author",
    name: "Tausif Alam",
    slug: { _type: "slug", current: "tausif-alam" },
    roleSubtitle: "Software Engineer • Scalable backend systems, Node.js & PostgreSQL",
    ...(avatarImg ? { avatar: avatarImg } : {}),
    github: "https://github.com/buildwithtausif",
    linkedin: "https://www.linkedin.com/in/buildwithtausif/",
    x: "https://x.com/csxtausif",
  });

  console.log("Creating site SEO settings singleton...");
  await client.createOrReplace({
    _id: "siteSeoSettings",
    _type: "siteSeoSettings",
    siteTitle: "Tausif Alam – Backend & Full Stack Developer",
    siteDescription:
      "Backend-focused engineer building scalable apps with Node.js and PostgreSQL. Explore Tausif Alam’s projects and portfolio.",
    defaultKeywords: [
      "Tausif Alam",
      "buildwithtausif",
      "backend developer",
      "Node.js developer",
      "full stack developer",
      "PostgreSQL",
      "system design",
    ],
  });

  console.log("Uploading blog brainstorm images (15 files)...");
  const blogNotesMeta = [
    "01 - Initial Brainstorm & Concurrency",
    "02 - Database Schema Drafts",
    "03 - Inventory & Loans Flow",
    "04 - Race Condition Edge Cases",
    "05 - User State Transitions",
    "06 - Loan Transactions & DB Locks",
    "07 - Conflict Handler Logic",
    "08 - Soft Deletes Strategy",
    "09 - ISBN Catalog Lobby",
    "10 - API Route Architecture",
    "11 - Batch Processing & Bulk Ops",
    "12 - Auth & Rate Limiting",
    "13 - Error Handling Map",
    "14 - Verification & Tests",
    "15 - Final System Architecture",
  ];

  const bentoItems = [];
  for (let i = 0; i < blogNotesMeta.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    const file = `Litengine_brainstorms_${num}.png`;
    const fullPath = path.join(seedImagesDir, "blog", "01", file);
    const uploaded = await uploadImage(fullPath, file);
    bentoItems.push({
      _key: key(),
      image: uploaded,
      alt: blogNotesMeta[i],
      span: "auto",
    });
  }

  const blogTags = await ensureTags([
    "Litengine",
    "System Design",
    "Library Management System",
    "Development",
    "Rough Notes",
  ]);

  const linkMarkKey = key();
  await client.createOrReplace({
    _id: "blog-the-scrabblings-behind-litengine",
    _type: "blogPost",
    title: "The Scribblings of Litengine",
    slug: { _type: "slug", current: "the-scrabblings-behind-litengine" },
    description:
      "A journey into the BTS of Litengine, exploring what rough notes has to say about the development of this not simple library management system.",
    author: { _type: "reference", _ref: "author-tausif-alam" },
    tags: blogTags,
    pubDate: "2026-08-15T00:00:00.000Z",
    body: [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [
          {
            _key: linkMarkKey,
            _type: "link",
            href: "/project/litengine-robust-library-management",
            openInNewTab: false,
          },
        ],
        children: [
          { _type: "span", _key: key(), text: "In April when i released The ", marks: [] },
          { _type: "span", _key: key(), text: "Litengine", marks: [linkMarkKey] },
          {
            _type: "span",
            _key: key(),
            text: ", I barely had any idea about what it really takes to make great softwares. I was just doing what I thought was right in order to make a library management project not so cliche that was the whole goal of it. I went through lots of brainstroming sessions and scribbled down my ideas on paper as to how can i make litengine a little robust that it can handle the bare minimum edge cases like race conditions which we often overlook in these kind of cliche projects especially when its not our primary project just a college project.",
            marks: [],
          },
        ],
      },
      ptParagraph(
        "anyways, I was pumpped enough to make this happen as I was really excited as a first year grad student who is living his dream, The dream to study nothing but computers anyhow no matter what the degree is called, today I found my rough notes and I thought it would be a good idea to share them with you all, so that you can get a glimpse of what goes behind the scenes of a project like this. (it may contain some typos or just made up words, i'm sharing this to give you a glimpse of what was going on in my mind at that time,) may be you can relate to it, may be you can't, but I hope you enjoy it nonetheless."
      ),
      ptParagraph("there you go, the rough notes of Litengine, enjoy!"),
      ptHeading("h2", "The Rough Notes Archive"),
      {
        _type: "bentoGallery",
        _key: key(),
        title: "Litengine Brainstorm Notes",
        description:
          "15 chronological sketches covering race conditions, database architecture, and conflict handlers. Click any tile to inspect in high resolution.",
        items: bentoItems,
      },
      ptParagraph("that's a wrap, meet you in the next blog... b-byee"),
    ],
    seo: {
      ogType: "article",
      ogImageMode: "generated",
      twitterCard: "summary_large_image",
    },
  });

  console.log("Uploading project diagrams & creating project...");
  const dbSchemaImg = await uploadImage(
    path.join(seedImagesDir, "projects", "litengine_dbschema.png"),
    "litengine_dbschema.png"
  );
  const brainstormImg = await uploadImage(
    path.join(seedImagesDir, "projects", "litengine_brainstorm.png"),
    "litengine_brainstorm.png"
  );
  const operationsImg = await uploadImage(
    path.join(seedImagesDir, "projects", "operations.png"),
    "operations.png"
  );

  const projectTags = await ensureTags([
    "Node.js",
    "ExpressJS",
    "Postgresql",
    "REST API",
  ]);

  const conflictCode = `import db, { pgp } from "../models/db.mjs";

export default async function recordExist({
  schema,
  tableName,
  colName,
  value,
  excludeID = null,
  returnRow = false,
}) {
  if (value === undefined || value === null) return false;

  const selectClause = "SELECT *";
  const isArrayValue = Array.isArray(value);
  const operator = isArrayValue ? "IN" : "=";
  const valuePlaceholder = isArrayValue ? "($[value:csv])" : "$[value]";

  let query_template = \`
        \${selectClause} FROM $[schema:name].$[tableName:name] WHERE $[colName:name] \${operator} \${valuePlaceholder}
    \`;
  const params = { schema, tableName, colName, value };
  if (excludeID !== null) {
    query_template += \` AND user_id != $[excludeID]\`;
    params.excludeID = excludeID;
  }

  try {
    const formatted_query = pgp.as.format(query_template, params);
    const rows = await db.any(formatted_query);
    const activeRows = rows.filter((row) => !row.deleted_at);

    if (isArrayValue) {
      if (returnRow) return activeRows;
      return activeRows.length > 0;
    } else {
      const record = activeRows.length > 0 ? activeRows[0] : null;
      if (returnRow) return record;
      return record !== null;
    }
  } catch (err) {
    console.log(\`Error in checking conflicts from the server for Table: \${tableName}: \`, err);
    return false;
  }
}`;

  const l1 = key();
  const l2 = key();
  const l3 = key();

  await client.createOrReplace({
    _id: "project-litengine-robust-library-management",
    _type: "project",
    title: "Litengine - Robust library management",
    slug: { _type: "slug", current: "litengine-robust-library-management" },
    description:
      "RESTful library management API handling edge cases like race conditions, conflict resolution, and built-in bulk operations.",
    tags: projectTags,
    pubDate: "2026-04-24T00:00:00.000Z",
    github: "https://github.com/buildwithtausif/litengine",
    liveUrl: "https://litengine.vercel.app/",
    version: "0.0.1",
    onHomePage: true,
    body: [
      ptHeading("h1", "The road to robustness"),
      ptParagraph(
        'When I was tasked to make a library management system, the first thing that came into my mind was "Seriously? It\'s a cliche project!" but since it was the requirement for my college\'s tech society - as a token of test, I decided to make it but not the usual way. Mostly, a library management system is primarily about basic CRUD operations, no place for handling edge cases like "What if two users try to borrow the same book in milliseconds of interval? Who will get the book then?" or "What if there is conflicting data in the database?" These questions made me think not just about CRUD but also about the architecture of the system.'
      ),
      ptParagraph(
        "After rigorous scribbles on paper, I've made the following database schema which I found to be robust enough to handle the edge cases."
      ),
      {
        _type: "richImage",
        _key: key(),
        ...dbSchemaImg,
        alt: "Database Schema",
        maxWidth: "md",
      },
      ptHeading("h1", "Why this schema?"),
      ptParagraph(
        "The schema prior to the current one was a mess, not because it couldn't handle the edge cases but because it was not even able to handle the foreign key constraints properly. Notice the current schema, it implements soft deletes for users, inventory (which is an additional layer) between books and book loans, and the books table itself made independent and restricted any delete operation on it - it behaves like a central lobby or an attic of books where books are kept and never thrown away, only their status is updated. Why? because I wanted to build a system where the librarian simply adds list of ISBNs and the system automatically fetches the book details from the central repository of books (for speed) and if not found then from Google Books API and adds them to the database. this feature is not implemented yet but the books table acts as a central repository for books as of now."
      ),
      ptHeading("h1", "The case of conflict"),
      ptParagraph(
        'The simple case where user-1 tries to update his/her email but the provided email is already taken by some user-x, in that case I need to handle the conflicting case and prompt that the email is already taken by some user-x. To achieve this I came up with the idea of making a separate utility "conflict_handler" which would scan the database for conflicts before any write operation.'
      ),
      {
        _type: "richImage",
        _key: key(),
        ...brainstormImg,
        alt: "Brainstorm",
        maxWidth: "md",
      },
      {
        _type: "codeBlock",
        _key: key(),
        lang: "javascript",
        filename: "utils/conflict_handler.mjs",
        code: conflictCode,
      },
      ptParagraph(
        "This is the utility function that I created to handle the conflict resolution in the database. similarly the whole of the project is built with the same level of care and attention to detail."
      ),
      ptHeading("h1", "Supported operations"),
      {
        _type: "richImage",
        _key: key(),
        ...operationsImg,
        alt: "Operations",
        maxWidth: "md",
      },
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [
          { _key: l1, _type: "link", href: "https://litengine.vercel.app/", openInNewTab: true },
          { _key: l2, _type: "link", href: "https://litengine.vercel.app/docs", openInNewTab: true },
          { _key: l3, _type: "link", href: "https://github.com/buildwithtausif/litengine", openInNewTab: true },
        ],
        children: [
          { _type: "span", _key: key(), text: "You can explore more and can even play with it on ", marks: [] },
          { _type: "span", _key: key(), text: "litengine", marks: [l1] },
          { _type: "span", _key: key(), text: " or check out its documentation on ", marks: [] },
          { _type: "span", _key: key(), text: "litengine docs", marks: [l2] },
          { _type: "span", _key: key(), text: " or the code on ", marks: [] },
          { _type: "span", _key: key(), text: "github", marks: [l3] },
          {
            _type: "span",
            _key: key(),
            text: ". That's a wrap, there is more in it than I could write in a single blog post. Stay tuned :) Bye",
            marks: [],
          },
        ],
      },
    ],
    seo: {
      ogType: "article",
      ogImageMode: "generated",
      twitterCard: "summary_large_image",
    },
  });

  console.log("Migration complete!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
