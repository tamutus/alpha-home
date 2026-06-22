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

function getGitAhead() {
  try {
    const ahead = execSync('git rev-list --count origin/main..HEAD 2>/dev/null || echo 0', { encoding: 'utf8' }).trim();
    return parseInt(ahead, 10) || 0;
  } catch {
    return 0;
  }
}

function getDaysSinceDeploy() {
  try {
    const ts = execSync('git log -1 --format=%ct origin/main 2>/dev/null || echo 0', { encoding: 'utf8' }).trim();
    const lastDeploy = parseInt(ts, 10);
    if (!lastDeploy) return 0;
    return Math.floor((Date.now() / 1000 - lastDeploy) / 86400);
  } catch {
    return 0;
  }
}

function getLastDeployDate() {
  try {
    const ts = execSync('git log -1 --format=%ci origin/main 2>/dev/null || echo ""', { encoding: 'utf8' }).trim();
    return ts || new Date().toISOString();
  } catch {
    return new Date().toISOString();
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
    __NOW_PAGE_EDIT_TIMESTAMP__: JSON.stringify(new Date(getLastEditTimestamp('src/routes/now/+page.svelte')).toISOString()),
    __GIT_AHEAD__: getGitAhead(),
    __LAST_DEPLOY_DATE__: JSON.stringify(getLastDeployDate()),
    __DAYS_SINCE_DEPLOY__: getDaysSinceDeploy()
  }
};

export default config;
