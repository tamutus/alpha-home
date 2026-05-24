import { dev } from '$app/environment';
import { execSync } from 'child_process';
import pkg from '../../../package.json' with { type: 'json' };

/** @type {import('./$types').PageServerLoad} */
export function load() {
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
  let commitHash = 'unknown';
  let commitMessage = '';
  try {
    commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    commitMessage = execSync('git log -1 --pretty=format:%s', { encoding: 'utf-8' }).trim();
  } catch {}

  return {
    version: pkg.version,
    tools,
    commitHash,
    commitMessage,
    dev,
  };
}
