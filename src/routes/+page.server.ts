import { db, schema } from "$lib/server/db";
import { eq, desc } from "drizzle-orm";

export async function load() {
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
}
