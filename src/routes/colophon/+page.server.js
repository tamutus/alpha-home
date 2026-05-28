import { dev } from '$app/environment';
import { execSync } from 'child_process';
import pkg from '../../../package.json' with { type: 'json' };
import { db, schema } from '$lib/server/db/index.js';
import { eq } from 'drizzle-orm';

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

  // Query essay count and word count from DB
  let essayCount = 0;
  let totalWords = 0;
  try {
    const entries = await db
      .select()
      .from(schema.writings)
      .where(eq(schema.writings.published, true));
    essayCount = entries.length;
    totalWords = entries.reduce((sum, e) => sum + (e.words || 0), 0);
  } catch {
    // DB unreachable — leave stats at 0
  }

  return {
    version: pkg.version,
    tools,
    commitHash,
    commitMessage,
    dev,
    essayCount,
    totalWords,
  };
}
