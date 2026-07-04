import { join } from "path";
import { readFileSync, existsSync } from "fs";

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

  return { starTrek };
}
