// Load recent writing from publishedEntries — always up-to-date with new essays.
// Avoids stale DB seed data where recent entries weren't reflected.
import { execSync } from "node:child_process";
import { publishedEntries } from "$lib/writing-data";

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

  return {
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
  };
}
