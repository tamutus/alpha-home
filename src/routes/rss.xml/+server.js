// RSS feed for writing entries
// Uses publishedEntries as canonical source — always up to date with new essays.
// Includes full body text (not just descriptions) for proper RSS reading.

import { publishedEntries } from "$lib/writing-data";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const BASE = 'https://alpha-home-phi.vercel.app';
const WRITING_DIR = join(process.cwd(), 'src', 'routes', 'writing');

function toRFC2822(date) {
  return new Date(date).toUTCString();
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Extract the prose body from an essay file (markdown or svelte).
 * Returns plain text suitable for RSS description.
 */
function getEssayBody(slug) {
  const mdPath = join(WRITING_DIR, slug, '+page.md');
  const sveltePath = join(WRITING_DIR, slug, '+page.svelte');

  if (existsSync(mdPath)) {
    const content = readFileSync(mdPath, 'utf-8');
    // Strip YAML frontmatter (between --- markers)
    const body = content.replace(/^---[\s\S]*?---\n*/, '').trim();
    // Strip markdown formatting, keep paragraph structure
    return body
      .replace(/^#+\s+/gm, '')          // remove heading markers
      .replace(/\*\*(.+?)\*\*/g, '$1')  // unwrap bold
      .replace(/\*(.+?)\*/g, '$1')      // unwrap italic
      .replace(/_{3,}/g, '')            // remove horizontal rules `---`
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links, keep text
      .replace(/^>\s+/gm, '')           // remove blockquote markers
      .replace(/\n{3,}/g, '\n\n')       // collapse excessive blank lines
      .trim();
  }

  if (existsSync(sveltePath)) {
    const content = readFileSync(sveltePath, 'utf-8');
    // Extract text inside content div (.writing or .essay)
    const match = content.match(/<div class="(?:writing|essay)">([\s\S]*?)<\/div>/);
    if (match) {
      let body = match[1];
      // Remove Svelte components and scripts
      body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
      body = body.replace(/<RelatedPosts[\s\S]*?\/>/gi, '');
      // Strip HTML tags
      body = body.replace(/<[^>]+>/g, '');
      // Decode HTML entities
      body = body.replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"')
                 .replace(/&#39;/g, "'")
                 .replace(/&nbsp;/g, ' ');
      // Collapse whitespace
      body = body.replace(/\n{3,}/g, '\n\n').trim();
      return body;
    }
  }

  return null; // no body extracted
}

/** @type {import('./$types').GET} */
export async function GET() {
  const entries = publishedEntries.map((e) => ({
    title: e.title,
    slug: e.href.replace("/writing/", ""),
    description: e.desc,
    tags: e.tags || [],
    createdAt: new Date(e.date),
  }));

  // Derive lastBuildDate from the most recent entry
  const latestDate = entries.length > 0
    ? entries[entries.length - 1].createdAt
    : new Date();

  const items = entries
    .toReversed() // newest first for RSS
    .map((entry) => {
      const href = `/writing/${entry.slug}`;
      const link = `${BASE}${href}`;
      const categories = entry.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join('\n');
      // Try to extract full body text; fall back to description
      const body = getEssayBody(entry.slug);
      const description = body
        ? escapeXml(body)
        : escapeXml(entry.description);
      return `  <item>
    <title>${escapeXml(entry.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <description>${description}</description>
    <pubDate>${toRFC2822(entry.createdAt)}</pubDate>
${categories}
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>harrsoft alpha — writing</title>
    <link>${BASE}/writing</link>
    <description>things i've written, thought about, or explored</description>
    <language>en-us</language>
    <lastBuildDate>${toRFC2822(latestDate)}</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}

export const prerender = true; // can static-prerender now, no DB dependency
