import { publishedEntries } from "$lib/writing-data";

export async function load() {
  // Use publishedEntries as canonical source — always up to date with new essays.
  const tagMap = new Map();
  for (const e of publishedEntries) {
    for (const tag of (e.tags || [])) {
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag).push({
        title: e.title,
        slug: e.href.replace("/writing/", ""),
        description: e.desc,
        words: e.words,
        date: e.date,
      });
    }
  }

  // Sort tags by count descending, then alphabetically
  const tags = [...tagMap.entries()]
    .map(([tag, tagEntries]) => {
      const sorted = tagEntries.sort((a, b) => b.date.localeCompare(a.date));
      return {
        tag,
        count: sorted.length,
        totalWords: sorted.reduce((sum, e) => sum + (e.words || 0), 0),
        entries: sorted,
      };
    })
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const totalEntries = publishedEntries.length;
  const totalTags = tags.length;

  return { tags, totalEntries, totalTags };
}
