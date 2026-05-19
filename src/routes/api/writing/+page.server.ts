import { publishedEntries } from "$lib/writing-data";
import { db, schema } from "$lib/server/db";

export async function load({ url }) {
  try {
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
  } catch (err) {
    console.warn("DB unreachable in api/writing, using static fallback:", err);
    const sliced = publishedEntries.slice(Number(url.searchParams.get("offset")) || 0, (Number(url.searchParams.get("offset")) || 0) + Math.min(Number(url.searchParams.get("limit")) || 50, 100));
    return {
      writings: sliced.map((e, i) => ({
        id: i + 1,
        slug: e.href.replace("/writing/", ""),
        title: e.title,
        description: e.desc,
        words: e.words,
        tags: e.tags,
        published: true,
        createdAt: new Date(e.date),
        updatedAt: new Date(e.date),
      })),
    };
  }
}
