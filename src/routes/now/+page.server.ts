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

    const totalWords = entries.reduce((sum, e) => sum + (e.words || 0), 0);

    return {
      essayCount: entries.length,
      totalWords,
    };
  } catch (err) {
    // DB unreachable — fall back to static data
    console.warn("DB unreachable in now/+page.server.ts, using static fallback:", err);
    return {
      essayCount: publishedEntries.length,
      totalWords: publishedEntries.reduce((sum, e) => sum + (e.words || 0), 0),
    };
  }
}
