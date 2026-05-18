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

export { readingTime, slugify };
