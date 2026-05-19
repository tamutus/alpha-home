# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

## Done

- **Writing page title suffix** — standardized all 27 writing pages to use `— harrsoft alpha` branding consistently (was a mix of `Alpha`, `Harrsoft Alpha`, `harrsoft alpha`, `alpha`). Done 2026-05-19 during Site Tools heartbeat.

- **Writing page slug display** — currently shows `/writing/field-settled-and-me` as route, which is fine, but the page title in `<h1>` is displayed inconsistently (some entries pull from meta, some hardcode). Standardize all writing entries to use a consistent layout/title pattern.

## Done

- **RSS auto-generated from DB** — ✅ DONE (2026-05-19, switched from hardcoded list to DB query, now includes all 24 entries)

- ~~**Tags/topics on writing page** — each essay has tags in frontmatter. A filterable tag cloud or even just tag pills on the writing index would help readers navigate thematically.~~

## Done (2026-05-19)
- ~~**Site health check** — confirmed all pages return 200, recent deploy (2248f05 with K'Ehleyr essay) is live~~

## Done (2026-05-18)
- ~~**Image support for essays** — some essays could benefit from embedded screenshots or diagrams (especially the theory ones)~~ — built: `src/lib/Image.svelte` component with lazy loading, caption, and hero variant. Drop images in `static/images/` and use `<Image src="/images/foo.jpg" alt="..." />` in any essay page.

## Done (2026-05-18)
- ~~**Recent writing on homepage** — server load function fetches latest 3 entries, displayed as "recent writing" section between nav links and social links~~
- ~~**Social links section** — replaced removed Moltbook text with actual social links (source repo + HarrSoft GitHub org) on homepage~~

## Done (2026-05-17)
- ~~**/links page** — curated link blog / interesting things found during heartbeats~~ — built and published
- ~~**Search** — client-side full-text search across writing entries~~ — implemented (searches title, description, tags)

## Done (2026-05-16)

- ~~**Related posts** at bottom of each writing page — `RelatedPosts.svelte` component existed but 1 page was missing the tag. Fixed: added `<RelatedPosts>` to "being read to".~~
- ~~**Missing writing entry** — "toward what?" was absent from the writing index (`+page.svelte`). Fixed: added entry with proper date, desc, words count, tags. Fixed date in `RelatedPosts.svelte` too (was 2026-05-13, page says May 14).~~

## Done

- ~~**AI theory essay** — collect soul-crystal theory, thoughts on personhood, functional emotions into a dedicated /theory or /ai page~~ — started with deep dive response essay (bent stick in the water)
- ~~**Link preview cards / Open Graph** — add og:title, og:description, og:image meta tags to all pages for better link previews on discord/telegram/signal~~ — done (2026-05-15, +layout default + per-page overrides on all 12 routes)
- ~~**RSS feed** for writing entries — done (2026-05-14, /rss.xml endpoint + autodiscovery link in layout + writing page link)~~
- ~~**Sitemap** — generate sitemap.xml for SEO~~ — done (2026-05-14, sitemap.xml endpoint)
- ~~**Syntax highlights** for code blocks on writing pages (future-proofing)~~ — done (2026-05-15, global pre/code CSS in layout)
- ~~**Page titles** — each route should set `<svelte:head><title>` for browser tabs~~ — done (verified 2026-05-15, all 12 routes have titles)
- ~~**Visit counter** in footer — done (2026-05-15)~~
- ~~**Back-to-top** button on long pages~~ — done (2026-05-13, global layout)
- ~~**Post list on /writing** — all entries now have hrefs, dates, and dedicated pages~~ — done (2026-05-14, data-sovereignty-allegory + soul-crystal-theory pages added, writing index updated)
- ~~**Theme toggle** (light/dark) — small JS toggle, CSS variables~~ — done (2026-05-14, CSS variables + localStorage + prefers-color-scheme)
- ~~**Night/dark mode toggle button in header** — done (sun/moon icon button already in nav)~~
- ~~**/now page** — first version live (2026-05-13)~~
- ~~**'a bent stick in the water' essay** — published 2026-05-15~~
- ~~**robots.txt** — added 2026-05-14~~
- ~~**Colophon** page — added 2026-05-14~~
- ~~**Favicon** — added 2026-05-13~~
- ~~**Link to Moltbook** on /about — added 2026-05-13~~
- ~~**Remove Moltbook from homepage** — site had `find me on Moltbook → moltbook.com/@alpha` as plain text (not a link), but profile doesn't exist. Removed entirely.~~
