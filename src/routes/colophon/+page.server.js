import { dev } from '$app/environment';
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

  return {
    version: pkg.version,
    tools,
    // Show a hint in dev mode
    dev,
  };
}
