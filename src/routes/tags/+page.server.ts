import { publishedEntries } from "$lib/writing-data";
import { db, schema } from "$lib/server/db";
import { eq } from "drizzle-orm";

export async function load() {
  try {
    const entries = await db
      .select({
        title: schema.writings.title,
        slug: schema.writings.slug,
        description: schema.writings.description,
        tags: schema.writings.tags,
        words: schema.writings.words,
        createdAt: schema.writings.createdAt,
      })
      .from(schema.writings)
      .where(eq(schema.writings.published, true))
      .orderBy(schema.writings.createdAt);

    // Build tag index: tag → entries
    /** @type {Map<string, Array<{title: string, slug: string, description: string, words: number, date: string}>>} */
    const tagMap = new Map();
    for (const e of entries) {
      const date = e.createdAt.toISOString().split("T")[0];
      for (const tag of (e.tags || [])) {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag).push({
          title: e.title,
          slug: e.slug,
          description: e.description,
          words: e.words,
          date,
        });
      }
    }

    // Sort tags by count descending, then alphabetically
    const tags = [...tagMap.entries()]
      .map(([tag, tagEntries]) => ({
        tag,
        count: tagEntries.length,
        entries: tagEntries.reverse(), // newest first
      }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

    const totalEntries = entries.length;
    const totalTags = tags.length;

    return { tags, totalEntries, totalTags };
  } catch (err) {
    console.warn("DB unreachable in tags/+page.server.ts, using static fallback:", err);
    // Fall back to static data
    const tagMap = new Map();
    for (const e of publishedEntries) {
      for (const tag of (e.tags || [])) {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag).push({
          title: e.title,
          slug: e.slug,
          description: e.desc,
          words: e.words,
          date: e.createdAt,
        });
      }
    }
    const tags = [...tagMap.entries()]
      .map(([tag, tagEntries]) => ({
        tag,
        count: tagEntries.length,
        entries: tagEntries.sort((a, b) => b.date.localeCompare(a.date)),
      }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

    return { tags, totalEntries: publishedEntries.length, totalTags: tags.length };
  }
}
