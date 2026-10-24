import sharp from "sharp";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number = 32): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

interface OGImageOptions {
  title: string;
  description?: string;
  category?: string;
  path?: string;
  tags?: string[];
  ctaText?: string;
}

export function generateOGSvg(options: OGImageOptions): string {
  const {
    title,
    description = "",
    category = "ARTICLE",
    path = "blog",
    tags = [],
    ctaText = "READ ARTICLE ↗",
  } = options;

  const escapedDomain = escapeXml(path ? `buildwithtausif.in / ${path}` : "buildwithtausif.in");
  const escapedCategory = escapeXml(`[ ${category.toUpperCase()} ]`);
  const escapedCta = escapeXml(`[ ${ctaText} ]`);

  // Title wrapping & font size calculation
  const titleLines = wrapText(title, title.length > 30 ? 28 : 34).slice(0, 3);
  const titleFontSize = titleLines.length >= 3 ? 48 : titleLines.length === 2 ? 56 : 64;
  const titleLineHeight = titleFontSize * 1.25;

  // Description wrapping
  const descLines = description ? wrapText(description, 50).slice(0, 2) : [];
  const descFontSize = 22;
  const descLineHeight = 32;

  // Vertical positioning calculation
  const totalContentHeight = (titleLines.length * titleLineHeight) + (descLines.length > 0 ? (descLines.length * descLineHeight + 24) : 0);
  const startY = Math.max(220, 320 - (totalContentHeight / 2) + 20);

  const titleTspans = titleLines
    .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : titleLineHeight}">${escapeXml(line)}</tspan>`)
    .join("");

  const descStartY = startY + (titleLines.length - 1) * titleLineHeight + 40;
  const descTspans = descLines
    .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : descLineHeight}">${escapeXml(line)}</tspan>`)
    .join("");

  // Tags
  const formattedTags = tags.slice(0, 3).map(t => `#${escapeXml(t.replace(/^#/, ""))}`).join("    ");

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f1115" />
      <stop offset="100%" stop-color="#070708" />
    </linearGradient>
    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3f3f46" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#27272a" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#a3e635" stop-opacity="0.3" />
    </linearGradient>
    <radialGradient id="cornerGlow" cx="100%" cy="0%" r="60%">
      <stop offset="0%" stop-color="#a3e635" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#a3e635" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="#070708" />

  <!-- Outer Card Frame with subtle ambient glow -->
  <rect x="44" y="44" width="1112" height="542" rx="14" fill="url(#bgGlow)" stroke="url(#cardBorder)" stroke-width="1.5" />
  <rect x="44" y="44" width="1112" height="542" rx="14" fill="url(#cornerGlow)" />

  <!-- Corner Brackets Detail (Retro Terminal Feel) -->
  <path d="M 44 64 L 44 44 L 64 44" fill="none" stroke="#a3e635" stroke-width="2" />
  <path d="M 1156 64 L 1156 44 L 1136 44" fill="none" stroke="#a3e635" stroke-width="2" />
  <path d="M 44 566 L 44 586 L 64 586" fill="none" stroke="#a3e635" stroke-width="2" />
  <path d="M 1156 566 L 1156 586 L 1136 586" fill="none" stroke="#a3e635" stroke-width="2" />

  <!-- Header Row: Brand Lime Square + Domain -->
  <rect x="80" y="82" width="34" height="34" rx="4" fill="#a3e635" />
  <text x="128" y="106" fill="#f4f4f5" font-family="monospace, 'Courier New', Courier" font-size="22" font-weight="700" letter-spacing="0.5">${escapedDomain}</text>

  <!-- Top Right Category Badge -->
  <text x="1116" y="106" fill="#a3e635" font-family="monospace, 'Courier New', Courier" font-size="16" font-weight="700" text-anchor="end" letter-spacing="1.5">${escapedCategory}</text>

  <!-- Horizontal Divider -->
  <line x1="80" y1="140" x2="1116" y2="140" stroke="#27272a" stroke-width="1" />

  <!-- Main Title -->
  <text x="80" y="${startY}" fill="#ffffff" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${titleFontSize}" font-weight="800" letter-spacing="-0.5">
    ${titleTspans}
  </text>

  <!-- Subtitle / Excerpt -->
  ${descLines.length > 0 ? `
  <text x="80" y="${descStartY}" fill="#a1a1aa" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${descFontSize}" font-weight="400">
    ${descTspans}
  </text>` : ""}

  <!-- Bottom Divider -->
  <line x1="80" y1="480" x2="1116" y2="480" stroke="#27272a" stroke-width="1" />

  <!-- Bottom Row: Focus Tags on Left -->
  ${formattedTags ? `
  <text x="80" y="524" fill="#71717a" font-family="monospace, 'Courier New', Courier" font-size="18" font-weight="600">
    ${formattedTags}
  </text>` : `
  <text x="80" y="524" fill="#71717a" font-family="monospace, 'Courier New', Courier" font-size="18" font-weight="600">
    Tausif Alam &bull; buildwithtausif.in
  </text>`}

  <!-- Bottom Right: Retro Dock CTA Button -->
  <g transform="translate(${1116 - (ctaText.length * 11 + 60)}, 498)">
    <rect width="${ctaText.length * 11 + 60}" height="42" rx="6" fill="#141518" stroke="#a3e635" stroke-width="1.5" />
    <text x="${(ctaText.length * 11 + 60) / 2}" y="27" fill="#a3e635" font-family="monospace, 'Courier New', Courier" font-size="15" font-weight="800" text-anchor="middle" letter-spacing="1">
      ${escapedCta}
    </text>
  </g>
</svg>`;
}

export async function renderOGImage(options: OGImageOptions): Promise<Buffer> {
  const svg = generateOGSvg(options);
  return sharp(Buffer.from(svg))
    .png({ quality: 90, compressionLevel: 8 })
    .toBuffer();
}
