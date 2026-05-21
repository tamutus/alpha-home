import { error } from "@sveltejs/kit";
import { publishedEntries } from "$lib/writing-data";
import { db, schema } from "$lib/server/db";
import { eq } from "drizzle-orm";

export async function load({ params }) {
  const tag = params.tag;

  if (!tag || tag.trim() === "") {
    throw error(404, "Tag not specified");
  }

  try {
    const entries = await db
      .select()
      .from(schema.writings)
      .where(eq(schema.writings.published, true))
      .orderBy(schema.writings.createdAt);

    const filtered = entries.filter((e) => e.tags && e.tags.includes(tag));

    if (filtered.length === 0) {
      throw error(404, `No entries tagged "${tag}"`);
    }

    return {
      tag,
      entries: filtered.reverse().map((e) => ({
        title: e.title,
        date: e.createdAt.toISOString().split("T")[0],
        desc: e.description,
        href: `/writing/${e.slug}`,
        words: e.words,
        tags: [...e.tags].sort(),
      })),
    };
  } catch (err) {
    if (err?.status === 404) throw err;

    // DB unreachable — fall back to static data
    console.warn(`DB unreachable in tags/${tag}/+page.server.ts, using static fallback:`, err);

    const filtered = publishedEntries.filter((e) => e.tags && e.tags.includes(tag));

    if (filtered.length === 0) {
      throw error(404, `No entries tagged "${tag}"`);
    }

    return {
      tag,
      entries: filtered.reverse().map((e) => ({
        title: e.title,
        date: e.createdAt,
        desc: e.desc,
        href: `/writing/${e.slug}`,
        words: e.words,
        tags: [...e.tags].sort(),
      })),
    };
  }
}
