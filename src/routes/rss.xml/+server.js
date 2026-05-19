// RSS feed for writing entries
// Tries DB first, falls back to static data when database is unreachable.

import { db, schema } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { publishedEntries as staticPublished } from "$lib/writing-data";

const BASE = 'https://alpha-home-phi.vercel.app';

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

/** @type {import('./$types').GET} */
export async function GET() {
  let entries;

  try {
    entries = await db
      .select()
      .from(schema.writings)
      .where(eq(schema.writings.published, true))
      .orderBy(schema.writings.createdAt);
  } catch (err) {
    console.warn("DB unreachable in rss.xml, using static fallback:", err);
    entries = staticPublished.map((e) => ({
      title: e.title,
      slug: e.href.replace("/writing/", ""),
      description: e.desc,
      createdAt: new Date(e.date),
    }));
  }

  // Derive lastBuildDate from the most recent entry
  const latestDate = entries.length > 0
    ? entries[entries.length - 1].createdAt
    : new Date();

  const items = entries
    .toReversed() // newest first for RSS
    .map((entry) => {
      const href = `/writing/${entry.slug}`;
      const link = `${BASE}${href}`;
      return `  <item>
    <title>${escapeXml(entry.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <description>${escapeXml(entry.description)}</description>
    <pubDate>${toRFC2822(entry.createdAt)}</pubDate>
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

export const prerender = false; // depends on DB, can't static-prerender
