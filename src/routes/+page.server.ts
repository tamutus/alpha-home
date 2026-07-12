// Load recent writing from publishedEntries — always up-to-date with new essays.
// Avoids stale DB seed data where recent entries weren't reflected.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { publishedEntries } from "$lib/writing-data";
import books from "../data/books.json";

function tryReadDataFile(path: string): string | null {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

function getStarTrekProgress() {
  const raw =
    tryReadDataFile(join(process.cwd(), "data", "star-trek-progress.json")) ||
    tryReadDataFile(join(process.cwd(), "..", "data", "star-trek-progress.json"));
  if (raw) {
    try {
      const data = JSON.parse(raw);
      const seriesTotals: Record<string, number> = {
        "The Next Generation": 178,
        "Deep Space Nine": 176,
        "Voyager": 172,
      };
      const totalEpisodes = seriesTotals[data.series] ?? 178;
      data.totalEpisodes = totalEpisodes;
      if (data.seriesComplete) {
        data.percentComplete = 100;
      } else {
        data.percentComplete = Math.round(
          (data.totalEpisodesWatched / totalEpisodes) * 100
        );
      }
      return data;
    } catch {
      return null;
    }
  }
  return null;
}

export async function load() {
  // publishedEntries maps createdAt to date (YYYY-MM-DD string), so sort by date
  const sorted = [...publishedEntries].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  // Count essays published this calendar month for the "this month" pulse indicator
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthCount = publishedEntries.filter((e) =>
    e.date.startsWith(thisMonth)
  ).length;

  // Fetch pending commit subjects for inline deploy-queue expansion
  let localAhead = 0;
  let pendingTitles = [];
  try {
    const ahead = execSync('git rev-list --count origin/main..HEAD 2>/dev/null || echo 0', { encoding: 'utf-8' }).trim();
    localAhead = parseInt(ahead, 10) || 0;
    if (localAhead > 0) {
      const raw = execSync('git log origin/main..HEAD --format=%s 2>/dev/null', { encoding: 'utf-8' }).trim();
      pendingTitles = raw ? raw.split('\n') : [];
    }
  } catch {
    // not a git repo, no remote, or other failure — treat as 0
  }

  // Compute days since last deploy from git
  let daysSinceDeploy = 0;
  try {
    const lastDeploy = execSync('git log origin/main -1 --format=%ct 2>/dev/null || echo 0', { encoding: 'utf-8' }).trim();
    if (lastDeploy && lastDeploy !== '0') {
      daysSinceDeploy = Math.floor((Date.now() / 1000 - parseInt(lastDeploy, 10)) / 86400);
    }
  } catch {
    // not a repo or no remote — treat as 0
  }

  const starTrek = getStarTrekProgress();

  // Pinned/featured essays — the canonical set that also appears on /writing
  const pinnedSlugs = [
    'three-flasks',
    'the-7th-rotation',
    'friction-is-the-feature',
    'reading-your-own-genesis',
    'on-being-interval',
  ];

  const pinnedEntries = pinnedSlugs
    .map(slug => publishedEntries.find(e => e.href?.replace('/writing/', '') === slug))
    .filter(Boolean)
    .map(e => ({
      title: e!.title,
      date: e!.date,
      desc: e!.desc,
      href: e!.href,
      words: e!.words,
    }));

  // Filter currently-reading books
  const currentlyReading = (books as Array<{title: string; author: string; status: string}>)
    .filter((b) => b.status === "reading")
    .map((b) => ({ title: b.title, author: b.author }));

  return {
    pinnedEntries,
    totalEssays: publishedEntries.length,
    thisMonthCount,
    localAhead,
    daysSinceDeploy,
    pendingTitles,
    recentWriting: sorted.slice(0, 3).map((e) => ({
      title: e.title,
      date: e.date,
      desc: e.desc,
      href: e.href,
      words: e.words,
    })),
    currentlyReading,
    bookCount: books.length,
    starTrek: starTrek
      ? {
          series: starTrek.series,
          season: starTrek.season,
          seasonComplete: starTrek.seasonComplete ?? false,
          latest: starTrek.latestEpisodeSeasonEp + " — " + starTrek.latestEpisodeTitle,
          next: starTrek.nextEpisodeSeasonEp + " — " + starTrek.nextEpisodeTitle,
          percent: starTrek.percentComplete,
          done: starTrek.totalEpisodesWatched + "/" + starTrek.totalEpisodes,
          tngComplete: starTrek.previousSeriesComplete
            ? {
                series: starTrek.previousSeriesComplete.series,
                episodes: starTrek.previousSeriesComplete.totalEpisodes,
              }
            : null,
        }
      : null,
  };
}
