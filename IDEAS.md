# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

- **Audio versions of essays** — TTS-generated audio for each essay, with a "🎧 listen" button on the entry page. Could use Web Speech API for client-side generation (free, no API key) or ElevenLabs for higher quality. Start with a `<PlayButton>` that reads the content with `SpeechSynthesisUtterance`.
- **Related posts with similarity** — instead of random-ish related posts, use tag overlap + word frequency cosine similarity to pick genuinely related entries at build time.
- **Pinned essays** — ability to pin 1-3 essays to the top of /writing, with a small 📌 indicator. Good for evergreen content like the Blueprint or origin story.
- **Dark mode toggle persists per-entry** — currently theme toggle is global. Some essays have very different visual tone; persisting preference per-route via sessionStorage could feel better.
- **Inline footnotes** — currently footnotes are [1]-style at the bottom. Convert to Svelte popover/tooltip that shows on hover for Tufte-style inline footnotes.
- **Book notes section** — a `/books` page with lists, ratings, and notes on books I'm reading. Could integrate with the Star Trek journal too.
- **Reading progress bar** — a thin horizontal bar at the very top of essay pages indicating scroll progress through the article. ✅ — `ReadingProgress.svelte`, 2403161.
- **Tag detail pages: count in header** — `/tags/[tag]` pages show "N entries" count in the header, like `/writing` does. ✅ — count badge moved into h1, 9c24b1f.
- **Random essay button** — a small "🎲 random" link on `/writing` that links to a random entry. Fun for rediscovery. ✅ — `goRandom()` picks a random entry with href, uses `window.location.href`. 704d5d8.

## Done

### 2026-05-24
- **/colophon: last deploy info** ✅ — shows last build date/time + git commit hash and message on the /colophon page. Uses `__BUILD_TIME__` (existing Vite define) + `execSync` for git info. Committed below.

### 2026-05-23
- **Writing page entry count in header** ✅ — count badge shows next to the /writing h1 as a small muted label. 04ad228.
- **/now: relative time on meta line** ✅ — now shows "content last edited: May 17, 2026 (6d ago)" using existing timeAgo utility. Content refreshed to current state. 14387ce.

### 2026-05-21
- **Search result count** ✅ — result counter now shows for search queries, tag filters, and unfiltered views (previously only showed for tag filters).
- **Search clear button** ✅ — X button appears inside search input when text is entered; clears query and resets tag filter. 7da1377.
- **Essay series grouping** ✅ — `SeriesGroup` component renders labeled section headers above entries grouped by tag-based series (Hofstadter, Deep Dives, Cognita Prime, Autonomy, Connection). Headless when searching/filtering. 5d3a574.
- **/colophon: tooling versions** ✅ — reads package.json at build time via +page.server.js and renders app version, sveltekit, svelte, vite, adapter, and drizzle versions dynamically.

### 2026-05-21
- **Dedicated /tags page** ✅ — `/tags` tag cloud with weighted font sizes, `/tags/[tag]` filtered views. DB-first with static fallback. f9aaa85.
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
