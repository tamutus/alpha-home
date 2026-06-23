import { dev } from '$app/environment';
import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from '../../../package.json' with { type: 'json' };
import { publishedEntries, series } from '$lib/writing-data';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const deps = pkg.dependencies ?? {};
  const devDeps = pkg.devDependencies ?? {};

  // Key tooling versions we want to surface
  const tools = {
    sveltekit: devDeps['@sveltejs/kit'],
    svelte: devDeps['svelte'],
    vite: devDeps['vite'],
    adapter: devDeps['@sveltejs/adapter-auto'],
    drizzleOrm: deps['drizzle-orm'],
    drizzleKit: devDeps['drizzle-kit'],
  };

  // Latest git commit hash (short form)
  // Prefer Vercel env vars, fall back to git CLI
  let commitHash = process.env.VERCEL_GIT_COMMIT_SHA
    ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
    : 'unknown';
  let commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || '';
  if (commitHash === 'unknown' || !commitMessage) {
    try {
      if (commitHash === 'unknown') {
        commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
      }
      if (!commitMessage) {
        commitMessage = execSync('git log -1 --pretty=format:%s', { encoding: 'utf-8' }).trim();
      }
    } catch {
      // fallback: leave as 'unknown' / empty
    }
  }

  // Use publishedEntries as canonical source — always up to date with new essays.
  const essayCount = publishedEntries.length;
  const totalWords = publishedEntries.reduce((sum, e) => sum + (e.words || 0), 0);

  const avgWords = essayCount > 0 ? Math.round(totalWords / essayCount) : 0;

  // Estimated reading time for entire archive (200 WPM)
  const WORDS_PER_MINUTE = 200;
  const readingTimeMinutes = Math.round(totalWords / WORDS_PER_MINUTE);
  const readingTimeHours = (totalWords / WORDS_PER_MINUTE / 60).toFixed(1);

  // Count distinct tags across all entries
  const allTags = new Set();
  for (const entry of publishedEntries) {
    if (entry.tags) {
      for (const tag of entry.tags) {
        allTags.add(tag);
      }
    }
  }
  const tagCount = allTags.size;
  const seriesCount = series.length;

  // Count routes pages (non-layout +page.svelte files under src/routes)
  let pageCount = 0;
  try {
    const routesDir = resolve(fileURLToPath(import.meta.url), '../../../../src/routes');
    function countPages(dir) {
      let count = 0;
      let entries;
      try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return 0; }
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          // skip node_modules, __tests__, etc.
          if (!entry.name.startsWith('.')) count += countPages(fullPath);
        } else if (entry.name === '+page.svelte') {
          count++;
        }
      }
      return count;
    }
    pageCount = countPages(routesDir);
  } catch {
    pageCount = 0;
  }

  // Date range: oldest → newest essay
  let firstDate = null;
  let latestDate = null;
  for (const entry of publishedEntries) {
    const d = entry.createdAt;
    if (d instanceof Date && !isNaN(d)) {
      if (!firstDate || d < firstDate) firstDate = d;
      if (!latestDate || d > latestDate) latestDate = d;
    }
  }

  // Writing velocity: essays and words in last 30 days and 14 days
  const now = Date.now();
  const DAY_MS = 86400000;
  let essays30d = 0, words30d = 0, essays14d = 0, words14d = 0;
  for (const entry of publishedEntries) {
    const age = now - entry.createdAt.getTime();
    if (age < 30 * DAY_MS) {
      essays30d++;
      words30d += entry.words || 0;
      if (age < 14 * DAY_MS) {
        essays14d++;
        words14d += entry.words || 0;
      }
    }
  }

  // Check for unpushed local commits (does not require network — uses local refs)
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

  return {
    version: pkg.version,
    tools,
    commitHash,
    commitMessage,
    dev,
    essayCount,
    pageCount,
    totalWords,
    avgWords,
    tagCount,
    seriesCount,
    firstDate,
    latestDate,
    readingTimeMinutes,
    readingTimeHours,
    localAhead,
    pendingTitles,
    essays30d,
    words30d,
    essays14d,
    words14d,
  };
}
