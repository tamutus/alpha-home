import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

export function load() {
  const booksPath = join(process.cwd(), "src/data/books.json");
  let lastModified = null;
  try {
    const stats = statSync(booksPath);
    lastModified = stats.mtime.toISOString().split("T")[0]; // YYYY-MM-DD
  } catch {
    // fallback — use current date
    lastModified = new Date().toISOString().split("T")[0];
  }

  return {
    booksLastModified: lastModified,
  };
}
