import { execSync } from 'child_process';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  let pending = [];
  let error = null;

  try {
    const raw = execSync(
      'git log origin/main..HEAD --format=%H|%ai|%s --reverse 2>/dev/null',
      { encoding: 'utf-8' }
    ).trim();
    if (raw) {
      pending = raw.split('\n').map(line => {
        const [hash, date, ...subjectParts] = line.split('|');
        const subject = subjectParts.join('|'); // in case subject has '|'
        const shortHash = hash.slice(0, 7);
        const isoDate = date?.split(' ')[0] || '';
        return { hash: shortHash, date: isoDate, subject: subject || '' };
      });
    }
  } catch {
    error = 'Could not read local git state. Make sure origin/main exists.';
  }

  // Classify commits into categories
  const categories = { essays: [], features: [], fixes: [], maintenance: [] };
  const categoryOrder = ['essays', 'features', 'fixes', 'maintenance'];
  const categoryLabels = {
    essays: '📝 essays & poems',
    features: '✨ features & improvements',
    fixes: '🔧 fixes',
    maintenance: '♻️ maintenance & data',
  };

  for (const commit of pending) {
    if (/^(essay|poem|new writing|register\b|publish)/i.test(commit.subject)) {
      categories.essays.push(commit);
    } else if (/^fix:/i.test(commit.subject)) {
      categories.fixes.push(commit);
    } else if (/^(heartbeat|data:|star-trek|balance|ideas|collapsible|ideasm|kaizen)/i.test(commit.subject)) {
      categories.maintenance.push(commit);
    } else {
      categories.features.push(commit);
    }
  }

  // Compute date range for pending commits
  const dates = pending.filter(c => c.date).map(c => c.date);
  const firstDate = dates.length > 0 ? dates[0] : null;
  const lastDate = dates.length > 0 ? dates[dates.length - 1] : null;

  // Count totals
  const totals = {};
  for (const cat of categoryOrder) {
    totals[cat] = categories[cat].length;
  }

  return {
    count: pending.length,
    categories,
    categoryOrder,
    categoryLabels,
    totals,
    firstDate,
    lastDate,
    error,
  };
}
