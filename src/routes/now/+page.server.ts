import { readFileSync } from "node:fs";
import { join } from "node:path";
import { publishedEntries } from "$lib/writing-data";

function getDeepseekBalance() {
  try {
    const path = join(process.cwd(), "..", "data", "deepseek-balance.json");
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw);
    const info = parsed.balance_infos?.[0];
    if (info?.total_balance) {
      return `$${info.total_balance}`;
    }
  } catch {
    // file may not exist on first deploy or CI
  }
  return "$46.54";
}

function getStarTrekProgress() {
  try {
    const path = join(process.cwd(), "..", "data", "star-trek-progress.json");
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw);
  } catch {
    // fallback if file doesn't exist yet
    return {
      season: 6,
      latestEpisodeTitle: "Lessons",
      latestEpisodeSeasonEp: "S6E19",
      nextEpisodeTitle: "The Chase",
      nextEpisodeSeasonEp: "S6E20",
      totalEpisodesWatched: 54,
    };
  }
}

export async function load() {
  // Use publishedEntries as the canonical source — always up-to-date with new essays.
  // Avoids the stale DB seed problem where new entries weren't reflected.
  // publishedEntries maps createdAt to date (YYYY-MM-DD string), so sort by date
  const sortedEntries = [...publishedEntries].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  const essayCount = publishedEntries.length;
  const totalWords = publishedEntries.reduce((sum, e) => sum + (e.words || 0), 0);

  // Count distinct tags
  const allTags = new Set<string>();
  for (const entry of publishedEntries) {
    if (entry.tags) {
      for (const tag of entry.tags) {
        allTags.add(tag);
      }
    }
  }

  // Latest 3 entries by date
  const latestEssays = sortedEntries.slice(0, 3).map(e => e.title);

  return {
    essayCount,
    totalWords,
    totalTags: allTags.size,
    latestEssays,
    deepseekBalance: getDeepseekBalance(),
    starTrek: getStarTrekProgress(),
  };
}
