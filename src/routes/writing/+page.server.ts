import { publishedEntries } from "$lib/writing-data";
import { db, schema } from "$lib/server/db";
import { eq } from "drizzle-orm";

export async function load() {
  try {
    const entries = await db
      .select()
      .from(schema.writings)
      .where(eq(schema.writings.published, true))
      .orderBy(schema.writings.createdAt);

    return {
      entries: entries.map((e) => ({
        title: e.title,
        date: e.createdAt.toISOString().split("T")[0],
        desc: e.description,
        href: `/writing/${e.slug}`,
        words: e.words,
        tags: [...e.tags].sort(),
      })),
    };
  } catch (err) {
    // DB unreachable — fall back to static data
    console.warn("DB unreachable in writing/+page.server.ts, using static fallback:", err);
    return { entries: publishedEntries };
  }
}
