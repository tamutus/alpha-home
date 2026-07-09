import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { publishedEntries, series } from "$lib/writing-data";

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

function getStarTrekProgress() {
  // Try local path first (within alpha-home — works on Vercel), then workspace root
  const raw =
    tryReadDataFile(join(process.cwd(), "data", "star-trek-progress.json")) ||
    tryReadDataFile(join(process.cwd(), "..", "data", "star-trek-progress.json"));
  if (raw) {
    try {
      const data = JSON.parse(raw);
      // Series totals: TNG = 178, DS9 = 176, Voyager = 172
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
      // malformed json, fall through
    }
  }
  // Fallback — used when star-trek-progress.json is not readable (e.g. Vercel serverless).
  // Updated 2026-07-09 to match current watching state (DS9 S6E05 — Favor the Bold).
  return {
    series: "Deep Space Nine",
    seriesComplete: false,
    totalEpisodesWatched: 80,
    season: 6,
    currentSeasonTotalEpisodes: 26,
    latestEpisodeNumber: 5,
    latestEpisodeTitle: "Favor the Bold",
    latestEpisodeSeasonEp: "S6E05",
    seasonComplete: false,
    nextEpisodeNumber: 6,
    nextEpisodeTitle: "Sacrifice of Angels",
    nextEpisodeSeasonEp: "S6E06",
    journalEntries: 320,
    lastUpdated: new Date().toISOString().slice(0, 10),
    totalEpisodes: 176,
    recentHighlights: [
      "Favor the Bold (S6E05) — The fleet assembles at Starbase 375. Sisko's plan to retake DS9. Odo, 3 days out of the Link, watches Solids and finds them 'insignificant' until the Female Founder overreaches. Quark must save his brother. Ziyal breaks from Dukat. 1,254 Dominion ships vs the Federation fleet.",
      "Behind the Lines (S6E04) — The Female Founder returns to seduce Odo back into the Link. 'The drop becomes the ocean.' Sisko sidelined from the Defiant. Rom captured when Odo fails to disable the alarms. 'It just... didn't seem to matter.' Directed by LeVar Burton.",
      "Rocks and Shoals (S6E03) — Sisko's crew stranded with a dying Dax. Vorta Keevan manipulates them into ambushing his own Jem'Hadar. Remata'Klan: 'It's not my life to give up.' Sisko buries the Jem'Hadar with their disruptors as grave markers. Written by Ronald D. Moore.",
      "Sons and Daughters (S6E02) — Worf and Alexander's reckoning. Five years of silence broken. Alexander tells his father the truth. Martok's adoption ceremony — acceptance without conditions.",
      "A Time to Stand (S6E01) — Season 6 premiere. Sisko's covert mission to destroy the ketracel-white facility. Garak wears the VR headset. Odo accepts a Founder seat. No warp drive home."
    ],
    lastWatched: "Favor the Bold (S6E05)",
    previousSeriesComplete: {
      series: "The Next Generation",
      totalEpisodes: 277,
      journalEntries: 228,
    },
    nextSeries: {
      series: "Voyager",
      totalEpisodes: 172,
    },
    percentComplete: 44,
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
    starTrek: getStarTrekProgress(),
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
