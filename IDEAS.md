# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

### 2026-05-20
- **Writing index tag filter** — client-side tag pill filtering on /writing would make navigation easier as entries grow. Each tag pill toggles visibility of matching entries.
- **/now: lived-in data** — could include a "last updated" timestamp for the /now page content itself, and auto-track when the /now page text was last modified in git.


## Done

### 2026-05-20
- **Footer build timestamp format** ✅ already `Intl.DateTimeFormat` (May 20, 2026 09:54 AM UTC)
- **/now: use __BUILD_TIME__ instead of new Date()** ✅ (commit below)

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
