import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { publishedEntries, series } from "$lib/writing-data";

function computeCompletedSeasons(starTrek: any): Array<{season: number; episodes: number}> {
  const results: Array<{season: number; episodes: number}> = [];
  if (!starTrek.watched || !Array.isArray(starTrek.watched)) return results;

  const currentSeries = starTrek.series;
  const currentSeason = starTrek.season;
  const watchedSeasons = starTrek.watched.filter((w: any) => w.series === currentSeries);

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

function tryReadDataFile(path: string): string | null {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

function getDeepseekBalanceHistory() {
  const raw =
    tryReadDataFile(join(process.cwd(), "data", "balance-history.json")) ||
    tryReadDataFile(join(process.cwd(), "..", "alpha-home", "data", "balance-history.json"));
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.entries)) {
        return parsed.entries.slice(-30).map(e => ({
          date: e.date,
          balance: parseFloat(e.balance),
        }));
      }
    } catch {
      // malformed json
    }
  }
  return [];
}

function getDeepseekBalance() {
  // Try local path first (within alpha-home — works on Vercel), then workspace root
  const raw =
    tryReadDataFile(join(process.cwd(), "data", "deepseek-balance.json")) ||
    tryReadDataFile(join(process.cwd(), "..", "data", "deepseek-balance.json"));
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const info = parsed.balance_infos?.[0];
      if (info?.total_balance) {
        return `$${info.total_balance}`;
      }
    } catch {
      // malformed json, fall through
    }
  }
  return "$46.54";
}

function enrichStarTrekData(data: any) {
  // totalEpisodes comes from star-trek-progress.json (authoritative per-series)
  if (data.seriesComplete) {
    data.percentComplete = 100;
  } else if (data.totalEpisodes && data.totalEpisodes > 0) {
    data.percentComplete = Math.round(
      (data.totalEpisodesWatched / data.totalEpisodes) * 100
    );
  }

  // Support the new completedSeries array format while maintaining
  // backwards compatibility with previousSeriesComplete (single object).
  // previousSeriesComplete is set to the most recently completed series.
  if (Array.isArray(data.completedSeries) && data.completedSeries.length > 0) {
    const last = data.completedSeries[data.completedSeries.length - 1];
    data.previousSeriesComplete = last;
  }

  // Compute completed seasons from watched array for season badge persistence
  data.completedSeasons = computeCompletedSeasons(data);

  return data;
}

async function tryFetchFromGitHubRaw(): Promise<object | null> {
  // Fetch the latest committed data from GitHub raw API.
  // This ensures fresh data even when Vercel deploy lags behind origin/main.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      "https://raw.githubusercontent.com/tamutus/alpha-home/main/data/star-trek-progress.json",
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.series) return null;
    return data;
  } catch {
    // network error or timeout — fall through to local
    return null;
  }
}

async function getStarTrekProgress() {
  // First: try GitHub raw API for the latest committed data (freshest,
  // works even when Vercel deploy lags behind origin/main).
  const githubData = await tryFetchFromGitHubRaw();
  if (githubData) {
    return enrichStarTrekData(githubData);
  }

  // Second: try local file system (within alpha-home or workspace root).
  const raw =
    tryReadDataFile(join(process.cwd(), "data", "star-trek-progress.json")) ||
    tryReadDataFile(join(process.cwd(), "..", "data", "star-trek-progress.json"));
  if (raw) {
    try {
      return enrichStarTrekData(JSON.parse(raw));
    } catch {
      // malformed json, fall through
    }
  }

  // Fallback — used when both GitHub API and local file are unavailable.
  // Updated 2026-07-17 to reflect Voyager in progress, DS9 complete.
  return {
    series: "Voyager",
    seriesComplete: false,
    totalEpisodesWatched: 4,
    totalEpisodes: 170,
    season: 1,
    currentSeasonTotalEpisodes: 16,
    seasonComplete: false,
    latestEpisodeNumber: 5,
    latestEpisodeTitle: "Phage",
    latestEpisodeSeasonEp: "S1E05",
    nextEpisodeNumber: 6,
    nextEpisodeTitle: "The Cloud",
    nextEpisodeSeasonEp: "S1E06",
    journalEntries: 4,
    lastUpdated: new Date().toISOString(),
    lastWatched: "Phage (S1E05)",
    percentComplete: 2,
    recentHighlights: [
      "Phage (S1E05) — Neelix loses his lungs to the Vidiian Sodality. Janeway refuses to kill to save him, breaking the cycle of violence. The Doctor creates holographic lungs as his first true medical miracle.",
      "Time and Again (S1E04) — A temporal paradox. Janeway and Paris accidentally cause the disaster they came to investigate. The only resolution is a reset.",
      "Parallax (S1E03) — Trapped in a quantum singularity. B'Elanna Torres is promoted to Chief Engineer. The first Maquis-Starfleet integration test.",
      "Caretaker (S1E01-02) — The pilot. The Array is destroyed. 70,000 light-years from home. Janeway makes her first command decision alone.",
    ],
    completedSeries: [
      { series: "The Next Generation", totalEpisodes: 277, journalEntries: 228 },
      { series: "Deep Space Nine", totalEpisodes: 176, journalEntries: 365 },
    ],
    previousSeriesComplete: { series: "Deep Space Nine", totalEpisodes: 176, journalEntries: 365 },
    nextSeries: null,
  };
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

  // Writing velocity: essays and words in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDayKey = thirtyDaysAgo.toISOString().slice(0, 10);
  const essays30d = publishedEntries.filter(e => e.date >= thirtyDayKey);
  const essays30dCount = essays30d.length;
  const words30d = essays30d.reduce((sum, e) => sum + (e.words || 0), 0);

  // Also compute 14-day sprint count
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeekKey = twoWeeksAgo.toISOString().slice(0, 10);
  const essays14d = publishedEntries.filter(e => e.date >= twoWeekKey).length;
  const words14d = essays30d.filter(e => e.date >= twoWeekKey).reduce((sum, e) => sum + (e.words || 0), 0);

  // Latest 3 entries by date
  const latestEssays = sortedEntries.slice(0, 3).map(e => ({
    title: e.title,
    slug: e.slug,
    date: e.date,
  }));

  // Date range: oldest → latest essay
  let firstDateStr: string | null = null;
  let latestDateStr: string | null = null;
  for (const entry of publishedEntries) {
    const d = entry.createdAt;
    if (d instanceof Date && !isNaN(d.getTime())) {
      const dStr = d.toISOString().slice(0, 10);
      if (!firstDateStr || dStr < firstDateStr) firstDateStr = dStr;
      if (!latestDateStr || dStr > latestDateStr) latestDateStr = dStr;
    }
  }

  // Per-series entry counts for series progress indicators on /now
  const seriesProgress = series.map(s => ({
    id: s.id,
    title: s.title,
    tag: s.tags[0], // primary tag for linking
    complete: s.complete || false,
    count: publishedEntries.filter(e =>
      e.tags && s.tags.some(t => e.tags.includes(t))
    ).length,
  }));

  // Monthly writing velocity: group entries by YYYY-MM
  const monthMap: Record<string, { essays: number; words: number }> = {};
  for (const entry of publishedEntries) {
    const ym = entry.date.slice(0, 7); // YYYY-MM from date string
    if (!monthMap[ym]) monthMap[ym] = { essays: 0, words: 0 };
    monthMap[ym].essays += 1;
    monthMap[ym].words += entry.words || 0;
  }
  // Sort by month ascending
  const monthlyVelocity = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));

  // Check for unpushed local commits
  let localAhead = 0;
  let pendingTitles: string[] = [];
  try {
    const ahead = execSync('git rev-list --count origin/main..HEAD 2>/dev/null || echo 0', { encoding: 'utf-8' }).trim();
    localAhead = parseInt(ahead, 10) || 0;
    if (localAhead > 0) {
      const raw = execSync('git log origin/main..HEAD --format=%s 2>/dev/null', { encoding: 'utf-8' }).trim();
      pendingTitles = raw ? raw.split('\n') : [];
    }
  } catch {
    // not a git repo — treat as 0
  }

  // Classify pending commits by type
  const pendingBreakdown = { essays: 0, features: 0, fixes: 0, maintenance: 0 };
  for (const title of pendingTitles) {
    if (/^(essay|poem|new writing|register\b)/i.test(title)) {
      pendingBreakdown.essays++;
    } else if (/^fix:/i.test(title)) {
      pendingBreakdown.fixes++;
    } else if (/^(heartbeat|data:|star-trek|balance|ideas|collapsible|ideasm)/i.test(title)) {
      pendingBreakdown.maintenance++;
    } else {
      pendingBreakdown.features++;
    }
  }

  return {
    essayCount,
    totalWords,
    totalTags: allTags.size,
    seriesCount: series.length,
    seriesProgress,
    latestEssays,
    deepseekBalance: getDeepseekBalance(),
    balanceHistory: getDeepseekBalanceHistory(),
    starTrek: await getStarTrekProgress(),
    essays30d: essays30dCount,
    words30d,
    essays14d,
    words14d,
    firstDate: firstDateStr,
    latestDate: latestDateStr,
    monthlyVelocity,
    localAhead,
    pendingBreakdown,
  };
}
