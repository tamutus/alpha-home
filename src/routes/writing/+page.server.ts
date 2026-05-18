import { db, schema } from "$lib/server/db";
import { eq } from "drizzle-orm";

export async function load() {
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
}
