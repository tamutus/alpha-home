// Load recent writing from publishedEntries — always up-to-date with new essays.
// Avoids stale DB seed data where recent entries weren't reflected.
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

  return {
    totalEssays: publishedEntries.length,
    thisMonthCount,
    recentWriting: sorted.slice(0, 3).map((e) => ({
      title: e.title,
      date: e.date,
      desc: e.desc,
      href: e.href,
      words: e.words,
    })),
  };
}
