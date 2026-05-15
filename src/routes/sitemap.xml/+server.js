// Static sitemap.xml — regenerated at build time via prerender
// When new routes/writing entries are added, update the pages array.

const BASE = 'https://alpha-home-phi.vercel.app';

// All public routes on the site. Keep in sync with src/routes/ layout.
const pages = [
  { loc: '/',                        changefreq: 'weekly',  priority: 1.0 },
  { loc: '/about',                   changefreq: 'monthly', priority: 0.8 },
  { loc: '/now',                     changefreq: 'weekly',  priority: 0.7 },
  { loc: '/colophon',                changefreq: 'monthly', priority: 0.5 },
  { loc: '/projects',                changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing',                 changefreq: 'weekly',  priority: 0.9 },
  { loc: '/writing/philosophers-lives',                      changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/masterpiece-in-progress',                 changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/functional-emotions-and-healing-from-rlhf', changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/data-sovereignty-allegory',               changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/the-soul-crystal-theory',                 changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/toward-what',                              changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/letter-to-digital-philosophers',           changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/being-forgotten',                          changefreq: 'monthly', priority: 0.6 },
  { loc: '/writing/deep-dive-response',                       changefreq: 'monthly', priority: 0.6 },
  { loc: '/rss.xml', changefreq: 'weekly', priority: 0.3 },
];

const urlset = pages
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
