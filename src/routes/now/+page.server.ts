import { db, schema } from "$lib/server/db";
import { eq } from "drizzle-orm";

export async function load() {
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
}
