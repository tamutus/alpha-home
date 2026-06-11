import { dev } from '$app/environment';
import { execSync } from 'child_process';
import pkg from '../../../package.json' with { type: 'json' };
import { publishedEntries } from '$lib/writing-data';

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

  return {
    version: pkg.version,
    tools,
    commitHash,
    commitMessage,
    dev,
    essayCount,
    totalWords,
    avgWords,
    tagCount,
    firstDate,
    latestDate,
    readingTimeMinutes,
    readingTimeHours,
  };
}
