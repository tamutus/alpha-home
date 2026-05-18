import { db, schema } from "$lib/server/db";

export async function load({ url }) {
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
  const offset = Number(url.searchParams.get("offset")) || 0;

  const entries = await db
    .select()
    .from(schema.writings)
    .where(schema.writings.published)
    .orderBy(schema.writings.createdAt)
    .limit(limit)
    .offset(offset);

  return {
    writings: entries.map((e) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      description: e.description,
      words: e.words,
      tags: e.tags,
      published: e.published,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    })),
  };
}
