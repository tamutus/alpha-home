import { join } from "path";
import { readFileSync, existsSync } from "fs";

interface WatchedSeason {
  series: string;
  season: number;
  episodes: string[];
}

interface CompletedSeason {
  season: number;
  episodes: number;
}

function tryReadDataFile(path: string): any | null {
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf-8"));
    }
  } catch {
    // fall through
  }
  return null;
}

function loadSeasonWordCounts(): Record<string, Record<number, {words: number, journals: number}>> {
  const path = join(process.cwd(), "data", "season-word-counts.json");
  const result: Record<string, Record<number, {words: number, journals: number}>> = {};
  try {
    if (existsSync(path)) {
      const raw = JSON.parse(readFileSync(path, "utf-8"));
      for (const s of (raw.seasons || [])) {
        if (!result[s.series]) result[s.series] = {};
        result[s.series][s.season] = { words: s.words, journals: s.journals };
      }
    }
  } catch {
    // fall through
  }
  return result;
}

function loadSeasonRecaps(): Record<string, Record<string, string>> {
  const path = join(process.cwd(), "data", "season-recaps.json");
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf-8"));
    }
  } catch {
    // fall through
  }
  return {};
}

function computeCompletedSeasons(starTrek: any): CompletedSeason[] {
  const results: CompletedSeason[] = [];
  if (!starTrek.watched || !Array.isArray(starTrek.watched)) return results;

  const currentSeries = starTrek.series;
  const currentSeason = starTrek.season;
  const watchedSeasons = starTrek.watched.filter((w: WatchedSeason) => w.series === currentSeries);

  for (const ws of watchedSeasons) {
    const isComplete = ws.season < currentSeason ||
      (ws.season === currentSeason && starTrek.seasonComplete === true);
    if (isComplete) {
      results.push({
        season: ws.season,
        episodes: ws.episodes.length,
      });
    }
  }

  return results.sort((a, b) => a.season - b.season);
}

export function load() {
  const starTrek = tryReadDataFile(
    join(process.cwd(), "data", "star-trek-progress.json"),
  ) || tryReadDataFile(
    join(process.cwd(), "..", "data", "star-trek-progress.json"),
  ) || {
    series: "Deep Space Nine",
    season: 5,
    latestEpisodeSeasonEp: "S5E??",
    latestEpisodeTitle: "TBD",
    nextEpisodeNumber: null,
    nextEpisodeTitle: null,
    nextEpisodeSeasonEp: null,
  };

  const completedSeries = starTrek.completedSeries || [];
  const currentWatched = starTrek.totalEpisodesWatched || 0;
  const currentTotal = starTrek.totalEpisodes || 0;
  const currentJournals = starTrek.journalEntries || 0;

  const combinedWatched = completedSeries.reduce(
    (sum: number, cs: any) => sum + (cs.totalEpisodes || 0), 0
  ) + currentWatched;
  const combinedTotal = completedSeries.reduce(
    (sum: number, cs: any) => sum + (cs.totalEpisodes || 0), 0
  ) + currentTotal;
  const combinedJournals = completedSeries.reduce(
    (sum: number, cs: any) => sum + (cs.journalEntries || 0), 0
  ) + currentJournals;

  // Journal word counts (from star-trek-progress.json journalWordCounts field, enriched per-series)
  const journalWordCounts = starTrek.journalWordCounts || null;
  let journalWordTotal = 0;
  if (journalWordCounts) {
    journalWordTotal = journalWordCounts.total || 0;
    journalWordCounts.seriesWords = Object.entries(journalWordCounts.series || {}).map(([name, data]: [string, any]) => ({
      label: name === 'The Next Generation' ? 'TNG' : name === 'Deep Space Nine' ? 'DS9' : name,
      words: data.words,
      estimate: data.estimate,
    }));
  }

  return {
    starTrek,
    completedSeasons: computeCompletedSeasons(starTrek),
    seasonRecaps: loadSeasonRecaps(),
    seasonWordCounts: loadSeasonWordCounts(),
    combinedProgress: {
      watched: combinedWatched,
      total: combinedTotal,
      journals: combinedJournals,
      journalWords: journalWordTotal,
      percent: combinedTotal > 0 ? Math.round((combinedWatched / combinedTotal) * 1000) / 10 : 0,
    },
    journalWordCounts,
  };
}
