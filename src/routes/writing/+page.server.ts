// Load writing entries from publishedEntries — always up-to-date with new essays.
// Avoids stale DB seed data that didn't include new entries.
import { publishedEntries } from "$lib/writing-data";

export async function load() {
  return { entries: publishedEntries };
}
