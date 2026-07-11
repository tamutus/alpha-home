import { publishedEntries } from "$lib/writing-data";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
  const offset = Number(url.searchParams.get("offset")) || 0;

  const sliced = publishedEntries.slice(offset, offset + limit);

  const writings = sliced.map((e, i) => ({
    id: offset + i + 1,
    slug: e.href.replace("/writing/", ""),
    title: e.title,
    description: e.desc,
    words: e.words,
    tags: e.tags,
    published: true,
    createdAt: e.date,
    updatedAt: e.date,
  }));

  return new Response(JSON.stringify({ writings, total: publishedEntries.length }), {
    headers: { "content-type": "application/json" },
  });
}
