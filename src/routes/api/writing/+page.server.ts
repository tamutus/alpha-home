import { publishedEntries } from "$lib/writing-data";

export async function load({ url }) {
  // Use publishedEntries as canonical source — always up to date with new essays.
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
  const offset = Number(url.searchParams.get("offset")) || 0;

  const sliced = publishedEntries.slice(offset, offset + limit);

  return {
    writings: sliced.map((e, i) => ({
      id: offset + i + 1,
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
