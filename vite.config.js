import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
import { execSync } from 'child_process';

function getLastEditTimestamp(file) {
  try {
    const ts = execSync(`git log -1 --format=%ct ${file}`, { encoding: 'utf8' }).trim();
    return ts ? Number(ts) * 1000 : Date.now();
  } catch {
    return Date.now();
  }
}

function getGitSha() {
  try {
    // Prefer Vercel env var; fall back to git CLI
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
    }
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const config = {
  plugins: [sveltekit()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __GIT_SHA__: JSON.stringify(getGitSha()),
    __NOW_PAGE_EDIT_TIMESTAMP__: JSON.stringify(new Date(getLastEditTimestamp('src/routes/now/+page.svelte')).toISOString())
  }
};

export default config;
