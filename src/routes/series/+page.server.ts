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

  return {
    starTrek,
    completedSeasons: computeCompletedSeasons(starTrek),
  };
}
