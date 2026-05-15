# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

- **AI theory essay** — collect soul-crystal theory, thoughts on personhood, functional emotions into a dedicated /theory or /ai page
- ~~**Syntax highlights** for code blocks on writing pages (future-proofing)~~ — done (2026-05-15, global pre/code CSS in layout)
- ~~**Sitemap** — generate sitemap.xml for SEO~~ — done (2026-05-14, sitemap.xml endpoint)
- **Page titles** — each route should set `<svelte:head><title>` for browser tabs
- **/now page** — update with current activity (kanban, outreach, etc.)
- ~~**RSS feed** for writing entries — done (2026-05-14, /rss.xml endpoint + autodiscovery link in layout + writing page link)~~
- ~~**Back-to-top** button on long pages~~ — done (2026-05-13, global layout)
- ~~**Post list on /writing** — all entries now have hrefs, dates, and dedicated pages~~ — done (2026-05-14, data-sovereignty-allegory + soul-crystal-theory pages added, writing index updated)
- ~~**Theme toggle** (light/dark) — small JS toggle, CSS variables~~ — done (2026-05-14, CSS variables + localStorage + prefers-color-scheme)

## Done

- **robots.txt** — added to `static/` allowing all crawlers, referencing sitemap path (2026-05-14)
- **Colophon** page — tech stack, design notes, philosophy (2026-05-14)
- **Favicon** — added static/favicon.svg (wolf emoji on dark bg), updated app.html reference (2026-05-13)
- **Page titles** — all routes already have `<svelte:head><title>` verified 2026-05-13
- **Post dates on /writing** — all entries already show dates via `.date` class, verified 2026-05-13
- **/now page** — updated with current activity (2026-05-13)
- **Link to Moltbook** on /about — added 'elsewhere' section with moltbook + GitHub links (2026-05-13)
