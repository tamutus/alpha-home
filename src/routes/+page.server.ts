import { publishedEntries } from "$lib/writing-data";
import { db, schema } from "$lib/server/db";
import { eq, desc } from "drizzle-orm";

export async function load() {
  try {
    const entries = await db
      .select()
      .from(schema.writings)
      .where(eq(schema.writings.published, true))
      .orderBy(desc(schema.writings.createdAt))
      .limit(3);

    return {
      recentWriting: entries.map((e) => ({
        title: e.title,
        date: e.createdAt.toISOString().split("T")[0],
        desc: e.description,
        href: `/writing/${e.slug}`,
        words: e.words,
      })),
    };
  } catch (err) {
    // DB unreachable — fall back to static data
    console.warn("DB unreachable in +page.server.ts, using static fallback:", err);
    const recent = publishedEntries.slice(-3).reverse();
    return { recentWriting: recent };
  }
}
