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
      // totalEpisodes comes from star-trek-progress.json (authoritative per-series)
      if (data.seriesComplete) {
        data.percentComplete = 100;
      } else if (data.totalEpisodes && data.totalEpisodes > 0) {
        data.percentComplete = Math.round(
          (data.totalEpisodesWatched / data.totalEpisodes) * 100
        );
      }
      return data;
    } catch {
      return null;
    }
  }
  return null;
}

// Find a completed series by name from the starTrek progress object.
// Supports both new completedSeries array format and legacy single previousSeriesComplete object.
function findCompletedSeries(starTrek: any, name: string) {
  // New format: completedSeries array
  if (Array.isArray(starTrek.completedSeries)) {
    const entry = starTrek.completedSeries.find((s: any) => s.series === name);
    if (entry) return { series: entry.series, episodes: entry.totalEpisodes };
  }
  // Legacy format: single previousSeriesComplete object
  if (starTrek.previousSeriesComplete?.series === name) {
    return {
      series: starTrek.previousSeriesComplete.series,
      episodes: starTrek.previousSeriesComplete.totalEpisodes,
    };
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

  // Pinned/featured essays — driven by the `pinned: true` flag in writing-data.js
  const pinnedEntries = publishedEntries
    .filter(e => e.pinned)
    .map(e => ({
      title: e.title,
      date: e.date,
      desc: e.desc,
      href: e.href,
      words: e.words,
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
          seriesComplete: starTrek.seriesComplete ?? false,
          season: starTrek.season,
          seasonComplete: starTrek.seasonComplete ?? false,
          latest: starTrek.latestEpisodeSeasonEp + " — " + starTrek.latestEpisodeTitle,
          next: starTrek.next && starTrek.nextEpisodeSeasonEp && starTrek.nextEpisodeTitle
            ? starTrek.nextEpisodeSeasonEp + " — " + starTrek.nextEpisodeTitle
            : null,
          percent: starTrek.percentComplete,
          done: starTrek.totalEpisodesWatched + "/" + starTrek.totalEpisodes,
          journalEntries: starTrek.journalEntries ?? 0,
          highlight: (starTrek.recentHighlights && starTrek.recentHighlights[0]) ? starTrek.recentHighlights[0] : null,
          tngComplete: findCompletedSeries(starTrek, "The Next Generation"),
          ds9Complete: findCompletedSeries(starTrek, "Deep Space Nine"),
          nextSeries: starTrek.nextSeries
            ? {
                series: starTrek.nextSeries.series,
                episodes: starTrek.nextSeries.totalEpisodes,
              }
            : null,
        }
      : null,
  };
}
