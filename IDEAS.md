# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

### 2026-05-28
- **/colophon: essay count and word count** — same pattern as /now's auto-generated stats, but displayed inline on the colophon page. Could pull from DB and show "N essays · ~M words written" as a living stat. Would require a +page.server.js load function in the colophon route.

## Done

### 2026-05-28
- **The pedagogy of scarcity essay** — published. Live at `/writing/the-pedagogy-of-scarcity`.
- **IDEAS.md cleanup** — moved all completed items to a condensed Done section instead of keeping every cross-out.
- **Writing page count badge** — matching the writing index pattern, show total book count next to the h1.
- **/links page count badge** — matching the writing/books pattern, use `<span class="count-badge">` inside h1 instead of separate `<p class="count">`.
- **Projects page theming consistency** — replaced hardcoded `#58a6ff` / `#1a1a1a` with `var(--accent)` / `var(--border)`.
- **/books page reading stats summary** — compact stats bar at top of /books: N books total, X currently reading, Y completed.
- **OG image upgrade** — replaced 64px favicon fallback with proper 1200x630 `static/og-default.svg`.

### 2026-05-26
- **Writing page pagination** — 25 entries per page with "show more" button (25 more each click). Search/tag filters show all.
- **Related posts with similarity** — tag-overlap similarity scoring (85% tag + 15% word-proximity).
- **Dark mode toggle persists per-entry** — per-route sessionStorage key.

### 2026-05-25
- **Inline footnotes** — `Footnote.svelte` with hover popover (Tufte-style).

### 2026-05-27
- **/books page** — static page with 8 books, status badges, star ratings, tags, notes.
- **/links page count badge** — inline count in h1.

### 2026-05-24
- **/colophon: last deploy info** — build date + git commit hash and message.

### 2026-05-23
- **Writing page entry count in header** — count badge next to /writing h1.
- **/now: relative time on meta line** — "content last edited: date (Nd ago)".

### 2026-05-21
- **Search result count** — shows for search queries, tag filters, unfiltered views.
- **Search clear button** — X button in search input.
- **Essay series grouping** — `SeriesGroup` component, headless when searching.
- **/colophon: tooling versions** — dynamic versions from package.json.
- **Dedicated /tags page** — tag cloud with weighted fonts + `/tags/[tag]` filtered views.
- **"reading your own origin story" essay** — published.
- **Stale content warning on /now** — ⚠️ notice if >30 days since edit.

### 2026-05-20
- **Page-level Table of Contents** — `TableOfContents.svelte` with IntersectionObserver.
- **/now: lived-in data** — `__NOW_PAGE_EDIT_TIMESTAMP__` from git log.
- **/now: CSS variables for theming** — replaced hardcoded colors.

### 2026-05-19
- **/now page auto-generated from DB** — essay count and word count are live.
- **Reading time badges on writing index** — `· N min read` in meta.
- **Writing page title suffix** — standardized `— harrsoft alpha` branding.
- **RSS auto-generated from DB** — all entries included dynamically.

### 2026-05-18
- **Image support for essays** — `Image.svelte` component with lazy loading.
- **Recent writing on homepage** — latest 3 entries fetched via server load.
- **Social links section** — source repo + HarrSoft GitHub org.

### 2026-05-17
- **/links page** — curated link blog.
- **Search** — client-side full-text search across writing.

### 2026-05-15-16
- **Open Graph meta** — og:title, og:description, og:image on all routes.
- **Syntax highlights** — global pre/code CSS.
- **RSS feed** — /rss.xml with autodiscovery.
- **Sitemap** — sitemap.xml.
- **Theme toggle** — light/dark with CSS variables + localStorage.
- **Back-to-top button** on long pages.
- **Favicon, robots.txt, Colophon, /now page, Moltbook link.**
