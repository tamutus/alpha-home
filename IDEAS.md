# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

_(none — every idea has been shipped)_

## Done

### 2026-06-02
- **/ keyboard shortcut to focus search** — added `case '/'` alongside existing `case 's'` in the keyboard handler. `/` is the standard web convention (GitHub, Slack, etc.) and more discoverable. Updated search placeholder to `search 76 entries… (press /)` and shortcut help overlay to show all shortcuts inline. Build clean (3.86s), pushed to main.
- **Dynamic search placeholder** — replaced hardcoded `search 76 entries…` with `{totalCount}` binding so the placeholder stays accurate as entries are added or removed. Build clean (4.02s).

### 2026-06-01
- **/now: clarified 'auto-tracked live' wording** — the phrase "deepseek balance auto-tracked live" implied live updates on a static site. Reworded to "auto-tracked from live tracker (shown at build time)" so visitors know it's a build-time snapshot.
- **DB audit: all read routes switched to publishedEntries** — homepage, writing index, colophon, RSS feed, tags index, tag-filtered view, and API endpoint all preferred DB (stale seed) over `publishedEntries` (always fresh). Fixed all 7 routes to use canonical static source. Removed `export const prerender = false` from RSS — now statically buildable. Build clean (4.16s).
- **/now: fix stale 'latest' list** — `/now` page was querying a DB with outdated seed data that doesn't include new essays. Switched to `publishedEntries` from `writing-data.js` as the primary source (always up-to-date by definition). Removed DB dependency from the load function.
- **URL param persistence confirmed** — search/tag/sort params already sync via `$:` reactive + `history.replaceState`. Feature already live. Moved from Pending to Done.
- **PinBadge already rendered** — 📌 icon already shown in meta section for pinned entries. Feature already live. Moved from Pending to Done.
- **Search query highlighting on /writing** — when a search query is active, matching terms in entry titles and descriptions get wrapped in `<mark class="search-highlight">` with accent-colored background. Makes scanning search results much faster.
- **Entry-level visited link styling on /writing** — already covered by global `a:visited` in `+layout.svelte`. Entry card links render purple on return visits. Marking as done.
- **Empty search/filter state on /writing** — when search or tag filter returns 0 results, show a centered empty-state message with context (shows the search query or active tag) and a "clear filter" button. Previously showed a blank page with just "more coming soon".
- **Series subtitle on writing index entries** — when an essay belongs to a series, the entry card now shows the series name as a subtle italic subtitle between the title and description. Useful when pagination or tag filters separate entries from their SeriesGroup header.

### 2026-05-31
- **Tag bar sorted by frequency, not alphabetically** — most-used tags appear first on /writing, making the main themes scannable at a glance. One-line change to the sort comparator.
- **"New" badge on homepage recent writing** — the homepage's recent-writing section now shows the same `new` badge as /writing for entries published within the last 7 days. Also fixed `the-overflow` essay import (was using default import on named export), which was breaking the build.

## Done

- **/now: removed stale hardcoded balance from heartbeat bullet** — bullet 1 already shows `{deepseekBalance}` dynamically, so the hardcoded `$49.62` in the heartbeat bullet was redundant and would go stale. Replaced with "deepseek balance auto-tracked live".
- **Auto external links via Svelte action** — `$lib/external-links.js` (`use:externalLinks`) automatically adds `target="_blank"` + `rel="noopener noreferrer"` to all external links site-wide via MutationObserver. Makes manual per-page fixes redundant going forward.
- **External links open in new tab** — `/links` page anchors now use `target="_blank"` to preserve site context.

### 2026-05-30
- **"New" badge on /writing** — essays published within the last 7 days get a small accent-colored `new` badge. CSS added 2026-05-30, template rendering completed 2026-05-31.
- **Fixed Field-Settled Consciousness link on /links** — replaced arxiv placeholder URL with actual PDF URL on councilforhumandevelopment.org. Also corrected the description (it's Nicholas Kern Frost's PhD thesis, not a Camlin & Cognita Prime paper).
- **Dynamic DeepSeek balance on /now** — server load function reads `data/deepseek-balance.json` at build time, replacing the hardcoded `$49.91` with the live balance. Falls back to `$50.00` if file doesn't exist.
- **Intertidal theme for essays** — added `theme='intertidal'` prop to `WritingLayout` and `WritingShell`. Dark teal bg, warm sand text, coral links. Applied to the satchel manifesto and its companion piece. Full `:global()` overrides for all prose elements.
- **Fix: missing timeAgo import on homepage** — `+page.svelte` used `timeAgo()` in the recent-writing template but never imported it from `$lib/utils.js`. Every client-side render of the homepage would throw silently. One-line fix, build clean.

### 2026-05-29
- **Tag cloud on /writing** — collapsible `TagCloud.svelte` component below the tag bar, font-size weighted by tag frequency. Also created `WritingShell.svelte` component (fixed broken build from `the-long-stretch` essay).
- **Artifact-scan loading animation** — CSS-only scanning beam with corner brackets, integrated into SPA navigation via beforeNavigate/afterNavigate. TNG Gambit Part I reference.
- **Visited link styling** — `:visited` links render purple (`#8b5cf6` dark, `#7c3aed` light) so readers can see which essays they've already read.

### 2026-05-28
- **/colophon: essay count and word count** — live stats section on colophon page.
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
