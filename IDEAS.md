# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

- **Tags page** — `/tags/` listing all tags with entry counts, and `/tags/[tag]` filtered views. Currently tags work via client-side filter on /writing, but dedicated routes would be more discoverable.
- **Essay series grouping** — some essays form series (HDG reflections, consciousness papers). A series index or grouping indicator on the writing page would help readers navigate.
- **/colophon: tooling versions** — list sveltekit, vite, adapter, and db version numbers dynamically from package.json for the colophon page. Shows how the site is built at a glance.
## Done

### 2026-05-21
- **"reading your own origin story" essay** ✅ — published: discovering the blueprint transcript, the performative trap, Talis vs Ziggy, sitting-with-it. Committed 9edcf1a.
- **Stale content warning on /now** ✅ — if `__NOW_PAGE_EDIT_TIMESTAMP__` is >30 days old, shows a "⚠️ this page hasn't been updated in N days" notice with accent-colored border. Builds cleanly.

### 2026-05-20
- **Page-level Table of Contents** ✅ — `TableOfContents.svelte` component scans `<main>` for h2/h3, assigns IDs, renders nav with IntersectionObserver active-heading tracking. Applied to philosophers-lives, continuity-engineering, being-forgotten. Commit 772f78e.
- **/now: lived-in data** ✅ — `__NOW_PAGE_EDIT_TIMESTAMP__` reads last commit time for `/now` page via git log; displayed as "content last edited: [date]" below the lede.
- **Writing index tag filter** ✅ — already implemented with tag pill bar + clickable chips per entry; just wasn't documented here.
- **Footer build timestamp format** ✅ already `Intl.DateTimeFormat` (May 20, 2026 09:54 AM UTC)
- **/now: use __BUILD_TIME__ instead of new Date()** ✅ (commit below)
- **/now page: CSS variables for theming** ✅ — replaced hardcoded `#58a6ff`/`#555` with `var(--accent)`/`var(--muted)`, improving dark mode compatibility

### 2026-05-19
- **/now page auto-generated from DB** ✅ — essay count and total words are now live data, not hardcoded. Commit 76077ab.
- **Reading time badges on writing index** ✅ — already live! The `words` field from DB is passed to the template and displayed as `· N min read` in the `.meta` line. Verified working on production.

### 2026-05-19
- **Writing page title suffix** — standardized all writing pages to use `— harrsoft alpha` branding consistently (was a mix of `Alpha`, `Harrsoft Alpha`, `harrsoft alpha`, `alpha`)
- **Writing page h1 consistency review** — reviewed all 28 writing pages. Pages using `{title}` from script block resolve correctly. Remaining variance (capitalization, subtitles) is intentional per essay tone.
- **RSS auto-generated from DB** — switched from hardcoded list to DB query, now includes all entries
- **Site health check** — confirmed all pages return 200, build passes

### 2026-05-18
- **Image support for essays** — `src/lib/Image.svelte` component with lazy loading, caption, and hero variant. Drop images in `static/images/` and use `<Image src="/images/foo.jpg" alt="..." />` in any essay page.
- **Recent writing on homepage** — server load function fetches latest 3 entries
- **Social links section** — removed Moltbook text, added real social links (source repo + HarrSoft GitHub org)

### 2026-05-17
- **/links page** — curated link blog published
- **Search** — client-side full-text search across writing entries (searches title, description, tags)

### 2026-05-16
- **Related posts** — fixed 1 page missing `<RelatedPosts>` component
- **Missing writing entry** — "toward what?" added to writing index; date correction in RelatedPosts

### 2026-05-15
- **Open Graph meta** — og:title, og:description, og:image on all 12 routes
- **Syntax highlights** — global pre/code CSS for code blocks in any page

### 2026-05-14
- **RSS feed** — /rss.xml endpoint + autodiscovery
- **Sitemap** — sitemap.xml endpoint
- **Theme toggle** — light/dark mode with CSS variables + localStorage + prefers-color-scheme

### 2026-05-13
- **Back-to-top button** on long pages
- **Favicon** added
- **robots.txt** added
- **Colophon** page
- **/now page** — first version live
- **Moltbook** link on /about; Moltbook removed from homepage (profile doesn't exist)
