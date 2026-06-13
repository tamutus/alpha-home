function timeAgo(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365);

  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  if (hours < 24) return hours + 'h ago';
  if (days === 1) return 'yesterday';
  if (weeks < 1) return days + 'd ago';
  if (months < 1) return weeks + 'w ago';
  if (years < 1) return months + 'mo ago';
  return years + 'y ago';
}

/** Age badge label — returns a short label like '3mo' or '1y' for entries >1mo old, null otherwise */
function ageLabel(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365);

  if (days < 14) return null;
  if (months < 1) return Math.floor(days / 7) + 'w';
  if (years < 1) return months + 'mo';
  const remainder = months % 12;
  if (remainder === 0) return years + 'y';
  return years + 'y ' + remainder + 'mo';
}

function readingTime(words) {
  if (!words) return "";
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min read`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export { readingTime, slugify, timeAgo, ageLabel };
