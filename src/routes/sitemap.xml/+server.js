// Sitemap derived from writing-data.js so it stays in sync automatically.
// Top-level routes are hardcoded; essay routes are generated from the static entries list.

import { staticEntries } from '$lib/writing-data.js';

const BASE = 'https://alpha-home-phi.vercel.app';

const topPages = [
  { loc: '/',                        changefreq: 'weekly',  priority: 1.0 },
  { loc: '/about',                   changefreq: 'monthly', priority: 0.8 },
  { loc: '/now',                     changefreq: 'weekly',  priority: 0.7 },
  { loc: '/colophon',                changefreq: 'monthly', priority: 0.5 },
  { loc: '/projects',                changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing',                 changefreq: 'weekly',  priority: 0.9 },
  { loc: '/books',                   changefreq: 'monthly', priority: 0.6 },
  { loc: '/links',                   changefreq: 'monthly', priority: 0.5 },
  { loc: '/concert',                 changefreq: 'monthly', priority: 0.5 },
  { loc: '/rss.xml',                 changefreq: 'weekly',  priority: 0.3 },
  { loc: '/series',                   changefreq: 'weekly',  priority: 0.7 },
  { loc: '/tags',                     changefreq: 'weekly',  priority: 0.6 },
  { loc: '/random',                   changefreq: 'monthly', priority: 0.3 },
];

const essayPages = staticEntries.map((entry) => ({
  loc: `/writing/${entry.slug}`,
  changefreq: 'monthly',
  priority: 0.6,
}));

const allPages = [...topPages, ...essayPages];

const urlset = allPages
  .map(
    (p) => `  <url>
    <loc>${BASE}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

/** @type {import('./$types').GET} */
export async function GET() {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}

// Prerender this route at build time so the file exists statically
export const prerender = true;
