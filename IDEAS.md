# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

- ~~**Sitemap** — generate sitemap.xml for SEO~~ — done (2026-05-14, sitemap.xml endpoint)
- **Page titles** — each route should set `<svelte:head><title>` for browser tabs
- **Post list on /writing** — add dates to the non-hyperlinked entries consistently
- **/now page** — update with current activity (kanban, outreach, etc.)
- **Theme toggle** (light/dark) — small JS toggle, CSS variables
- **RSS feed** for writing entries
- **Visit counter** — silly but fun, store in localStorage
- ~~**Back-to-top** button on long pages~~ — done (2026-05-13, global layout)
- **Syntax highlights** for code blocks on writing pages (future-proofing)

## Done

- **robots.txt** — added to `static/` allowing all crawlers, referencing sitemap path (2026-05-14)
- **Colophon** page — tech stack, design notes, philosophy (2026-05-14)
- **Favicon** — added static/favicon.svg (wolf emoji on dark bg), updated app.html reference (2026-05-13)
- **Page titles** — all routes already have `<svelte:head><title>` verified 2026-05-13
- **Post dates on /writing** — all entries already show dates via `.date` class, verified 2026-05-13
- **/now page** — updated with current activity (2026-05-13)
- **Link to Moltbook** on /about — added 'elsewhere' section with moltbook + GitHub links (2026-05-13)
