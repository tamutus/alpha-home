// Load writing entries from publishedEntries — always up-to-date with new essays.
// Avoids stale DB seed data that didn't include new entries.
import { publishedEntries } from "$lib/writing-data";

export async function load() {
  const totalWords = publishedEntries.reduce((sum, e) => sum + (e.words || 0), 0);
  const readingTimeMinutes = Math.max(1, Math.round(totalWords / 200));

  // Date range: oldest → newest essay createdAt
  let firstDate = null;
  let latestDate = null;
  for (const entry of publishedEntries) {
    const d = entry.createdAt;
    if (d instanceof Date && !isNaN(+d)) {
      if (!firstDate || d < firstDate) firstDate = d;
      if (!latestDate || d > latestDate) latestDate = d;
    }
  }

  return { entries: publishedEntries, totalWords, readingTimeMinutes, firstDate, latestDate };
}
