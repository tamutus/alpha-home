import { error } from "@sveltejs/kit";
import { publishedEntries } from "$lib/writing-data";

export async function load({ params }) {
  const tag = params.tag;

  if (!tag || tag.trim() === "") {
    throw error(404, "Tag not specified");
  }

  // Use publishedEntries as canonical source — always up to date with new essays.
  const filtered = publishedEntries.filter((e) => e.tags && e.tags.includes(tag));

  if (filtered.length === 0) {
    throw error(404, `No entries tagged "${tag}"`);
  }

  return {
    tag,
    totalCount: publishedEntries.length,
    entries: filtered.toReversed().map((e) => ({
      title: e.title,
      date: e.date,
      desc: e.desc,
      href: e.href,
      words: e.words,
      tags: [...e.tags].sort(),
    })),
  };
}
