import { redirect } from '@sveltejs/kit';
import { staticEntries } from '$lib/writing-data.js';

export function load() {
  // Filter to published entries with valid slugs
  const entries = staticEntries.filter(e => e.slug);
  if (entries.length === 0) {
    redirect(302, '/writing');
  }
  const pick = entries[Math.floor(Math.random() * entries.length)];
  redirect(302, `/writing/${pick.slug}`);
}
