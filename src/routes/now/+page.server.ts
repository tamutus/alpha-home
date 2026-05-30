import { readFileSync } from "node:fs";
import { join } from "node:path";
import { publishedEntries } from "$lib/writing-data";
import { db, schema } from "$lib/server/db";
import { eq, desc } from "drizzle-orm";

function getDeepseekBalance() {
  try {
    const path = join(process.cwd(), "..", "data", "deepseek-balance.json");
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw);
    const info = parsed.balance_infos?.[0];
    if (info?.total_balance) {
      return `$${info.total_balance}`;
    }
  } catch {
    // file may not exist on first deploy or CI
  }
  return "$50.00";
}

export async function load() {
  try {
    const entries = await db
      .select()
      .from(schema.writings)
      .where(eq(schema.writings.published, true))
      .orderBy(desc(schema.writings.createdAt));

    const totalWords = entries.reduce((sum, e) => sum + (e.words || 0), 0);

    // Count distinct tags across all entries
    const allTags = new Set<string>();
    for (const entry of entries) {
      if (entry.tags) {
        for (const tag of (entry.tags as string[])) {
          allTags.add(tag);
        }
      }
    }

    // Latest 3 entries
    const latest = entries.slice(0, 3).map(e => e.title);

    return {
      essayCount: entries.length,
      totalWords,
      totalTags: allTags.size,
      latestEssays: latest,
      deepseekBalance: getDeepseekBalance(),
    };
  } catch (err) {
    // DB unreachable — fall back to static data
    console.warn("DB unreachable in now/+page.server.ts, using static fallback:", err);
    const sorted = [...publishedEntries].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    const totalTagsFallback = new Set<string>();
    for (const entry of publishedEntries) {
      if (entry.tags) {
        for (const tag of entry.tags) {
          totalTagsFallback.add(tag);
        }
      }
    }
    return {
      essayCount: publishedEntries.length,
      totalWords: publishedEntries.reduce((sum, e) => sum + (e.words || 0), 0),
      totalTags: totalTagsFallback.size,
      latestEssays: sorted.slice(0, 3).map(e => e.title),
      deepseekBalance: getDeepseekBalance(),
    };
  }
}
