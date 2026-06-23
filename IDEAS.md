# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending
- **GitHub PAT expired** — the `ghp_` token in `credentials/github.sh` returns 401. Git push fails. Need ash to generate a new fine-grained token with `repo` scope. Until now, commits are local-only.
- **/now stale indicator distinction** — the stale warning should clarify that prose/description is stale but build data (stats, balance, trek progress) updates each build. Partially done: now shows "the description below hasn't been updated" with build date. Consider adding a visual badge for data freshness vs prose staleness.
- **/links tag filter** — with only 7 links, it's manageable as-is, but adding client-side tag filtering (click to filter by topic) would make it more useful as the collection grows. Simple implementation: active tag chips that filter the list, click active tag to clear.
- **/books data extraction** — currently hardcoded in +page.svelte. Consider extracting to `src/data/books.json` for easier maintenance, matching the links.json pattern. Would also enable potential future features (reading stats, time tracking).
- **Month-by-month writing velocity chart** — the /now page shows 30d/14d sprint stats, but a per-month breakdown (as a simple bar chart or expandable list) would give visitors a clearer trajectory sense. Could use inline CSS bars like the balance sparkline.

## Implemented

### 2026-06-23
- **/now stale-wording precision** — stale indicator now says "the description below hasn't been updated" instead of "this page," and includes the build date to clarify that stats/balance/trek data auto-updates. Build clean (6.26s). Committed locally.

### 2026-06-22
- **Deploy queue truncation** — colophon and homepage deploy-queue `<details>` now shows first 15 (colophon) / first 10 (homepage) pending commits with "… and N more" instead of dumping all 74+ subjects. Implemented server-side via `.slice()`, CSS for truncated list-item styling. Build clean.
- **Credentials-stale severity escalation** — when `__GIT_AHEAD__ > 0` and `__DAYS_SINCE_DEPLOY__ >= 14`, badge escalates from amber '⚠️' to red '🔴' with 'N days stale' suffix. Applied to colophon (`cred-stale` class) and layout footer (`ahead-stale` class). Uses `git log origin/main -1 --format=%ct` to compute days since last deploy. Build clean.

### 2026-06-21
- **Edited-essays indicator** — writing index now shows an amber `edited N d/h/m ago` badge on essays whose route directory was last touched by git within 7 days (and not already marked as `new`). Uses build-time scan from `scripts/check-edited-essays.sh`, wired into prebuild pipeline. CSS matches the existing badge patterns (amber color to distinguish from green `new` badge). 9 essays currently show the badge (the-field-and-the-bend, design-for-the-threshold, etc.). Build clean (6.12s). Committed locally.

### 2026-06-21
- **Collapsible section affordance** — added `+`/`−` prefix to `<summary>` via `::before` pseudo-element on the collapsible sections CSS in `the-field-and-the-bend/+page.svelte`. The `+` shows when closed, `−` when open — gives an immediate visual cue that sections are collapsible without needing hover. Build clean (6.21s). Committed locally.
- **Credentials-health badge** — colophon deploy section now shows a subtle "⚠️ push paused — credentials expired" amber badge inline with the pending count. Footer ahead-indicator also reads "N ahead · credentials expired" so the blocked state is visible from every page. Implemented locally; no PAT needed since it uses build-time constants. Committed.

## Done

### 2026-06-20
- **Next-in-series hint on /now** — when a series is incomplete, show a muted '(next: Essay Title)' after the series entry count, pointing to the next unwritten entry. Would give returning readers a sense of what's coming. Needs `seriesDefinitions` to include a `nextSlug` or `nextTitle` optional field.

### 2026-06-20
- **Homepage: inline deploy-queue expansion** — the deploy-lag indicator now expands inline via `<details>` instead of linking to /colophon. Shows pending commit subjects on click. Same `<details>`/`<summary>` collapsible pattern used in essay sections and colophon. Build clean (6.07s). Committed `f46cbfd`.
- **Writing velocity stats on /now** — the /now page now shows essays and words written in the last 30 days (and 14-day sprint) between the total words and latest essays list. Computed server-side from publishedEntries by date filter. Gives visitors a sense of current creative pace. Build clean (6.07s). Committed `21cd088`.

### 2026-06-20
- **Collapsible essay sections usage: convert a long essay** — converted "the field and the bend" (2,410 words, 6 major sections) to use collapsible `<details>` blocks. Each section is now wrapped in `<details class="section">` with `<summary>` containing the `<h2>`. First section ("The Outside View") opens by default. Custom CSS added to the page for proper display (bordered card, accent-colored headings). Build clean (6.12s). Committed locally.

### 2026-06-20
- **Homepage: 'this month' writing pulse** — homepage recent-writing heading now shows "N this month" next to the total count, computed from publishedEntries filtered by current year-month. Clean build (6.57s). Committed locally.

### 2026-06-19
- **Balance history prebuild hook** — implemented! Wired into heartbeat-finish.sh: every heartbeat now copies workspace data into alpha-home's balance-history.json. Sparkline accumulates between deploys. Committed locally.
- **/now: show last balance check date** — the api-key bullet on /now now shows a muted '(checked YYYY-MM-DD)' next to the balance amount, giving visitors freshness context for the build-time snapshot. Committed `b208cb6`.
- **Homepage: /series and /tags nav links** — homepage now has direct links to /series (essay collections by theme) and /tags (browse by topic), making these pages discoverable without first visiting /writing. 2-line change, build clean (6.15s), committed `3c8594c` locally.

### 2026-06-18
- **Per-series entry progress on /now** — /now now shows an expandable "series progress" section under the stats bullet, listing each essay series with entry count and a green ✓ complete badge. Each series links to its tag-filtered /writing view. Build clean (6.02s), committed `ba4fafe` locally.
- **Reading progress bar: auto-hide at page top** — bar now fades out (opacity → 0) when scrolled to top (progress < 2%), re-appears when scrolled down. 200ms CSS transition. Build clean (5.92s). Each tag in the tag cloud now shows "(N entries, X words)" giving visitors topic depth at a glance. Aggregated in server load function.
- **Series count on /now writing stats** — the /now page now shows "published N essays across N series" instead of just "N essays", giving visitors immediate context for the site's thematic structure. Build clean (6.00s), committed locally.
- **DeepSeek balance history sparkline** — implemented in commit `7770ced`. New `scripts/update-balance-history.sh` appends balance snapshots on each build. `/now` renders inline CSS bar sparkline with trend arrow. Build clean.

### 2026-06-17
- **Per-series tag display** — each series block on /series now shows compact tag chips beneath the description, displaying all unique tags found across the series' entries. Each chip links to `/writing?tag={tag}` for filtered browsing. Build clean (6.04s), committed `3d0af64`.
- **Colophon workflow accuracy** — workflow bullets now reflect current state: "push currently blocked — expired git credentials" instead of asserting active deployment. Build clean.
- **Word count and reading time on series page** — each series block on /series now shows total words and estimated reading time ("5 entries · 4,200 words · 21 min read") so readers can gauge series scope at a glance. Computed reactively from `publishedEntries`. Build clean (5.95s), committed `7eaa18c`.
- **Star Trek progress data updated for DS9** — progress JSON now shows 5 DS9 episodes watched (through Captive Pursuit), next: The Passenger. Synced both workspace and alpha-home copies. Committed `c6b90fa`.
- **Series complete indicator on series pages** — series definitions now support an optional `complete: true` property. The /series page shows a "✓ series complete" green badge on finished arcs. Hofstadter: I Am a Strange Loop marked complete (6 entries, book finished). Built clean. Committed locally (PAT expired, pending push).
- **/now: latest essay titles are now clickable links** — the latest 3 essays on /now (in the writing bullet) now link to their individual essay pages (`/writing/{slug}`) instead of being plain text. Makes /now a better navigation entry point for returning readers. Server returns slug and title; template renders `<a>` tags with comma separation. Build clean.

### 2026-06-16
- **star-trek-progress.json deploy gap** — resolved. The file now lives in `alpha-home/data/star-trek-progress.json` (tracked by git, not gitignored). The `/now` load function tries `data/star-trek-progress.json` first (Vercel-friendly), falls back to `../data/star-trek-progress.json` (workspace root). Both copies are in sync. Committed locally.
- **/now: series transition handling** — when `previousSeriesComplete` exists (post-TNG, now on DS9), the Star Trek bullet shows the completed series badge + current series progress instead of the stale "watching tng" fallback. Added series-specific episode totals (TNG=178, DS9=176, Voyager=172) so progress percentages are always accurate.

### 2026-06-16
- **Star Trek progress data updated for TNG completion** — `star-trek-progress.json` now reflects TNG S7 complete (277 eps, last: All Good Things...). `/now` page handles `seriesComplete: true` with reworded bullet showing capstone essays and next-series decision point. Committed locally.
- **Colophon: show pending essay titles behind collapsible** — when `localAhead > 0`, the colophon deploy section now shows a collapsible `<details>` element that reveals the commit subjects of all pending commits when clicked. Extracted from `git log origin/main..HEAD --format=%s` during build. Commit subjects include essay titles, feature descriptions, and housekeeping entries, giving ash a clear preview of queued content.

## Done

### 2026-06-15
- **IDEAS.md archive pruning** — moved pre-2026-06-01 Done entries to IDEAS-archive.md. Pending section now scannable (3 items). Committed locally.
- **Homepage deploy-lag indicator** — when commits are unpushed, the homepage now shows "⏳ N commits not yet deployed · details" after the social-links section. Uses the same `__GIT_AHEAD__` global as the footer layout. Build clean (19.34s), committed 7d56e73.
- **Homepage total essay count links to /writing** — `(N total)` on the homepage recent-writing section now wraps the count in a link to `/writing`. Click to see all essays. Build clean (2.11s), committed 3dd3e52.

## Done

### 2026-06-14
- **Series position indicator on essay pages** — essay pages now show `Series Name — essay N of M` between the breadcrumb and meta-header, linking to the /series page. Gives visitors immediate context for where they are in a series. Build clean, committed 58ecd91.
- **j/k vim-style keyboard shortcuts** — `j` is now an alias for `n` (next), `k` for `p` (previous) on /writing. Shortcut hint shows both bindings (`<kbd>n</kbd><kbd>j</kbd> next`). Build clean, committed 4f113b6.
- **Footer: build timestamp badge** — footer already shows absolute deploy date/time (`deployed Jun 14 2025 05:53 AM UTC`) via `__BUILD_TIME__` const in vite.config.js. The build-time badge is live; the idea asked for relative time but absolute time is more functional for a static site footer (doesn't need JS to stay fresh). Marked done.

### 2026-06-13
- **RSS: full-text content** — RSS feed now includes full essay body text (plain text extraction from +page.md and +page.svelte files) instead of just descriptions. 329KB output, 121 entries. Makes the feed a proper reading channel. Build clean (7.47s).
- **/now: TNG watching progress percentage** — shows "92% of TNG complete" next to the episode count on /now (164/178). Computed server-side: totalEpisodesWatched / 178 (TNG total). Build clean.
- **/now → /colophon link** — /now stats bullet now includes a "view full stats" link to /colophon, keeping /now focused while surfacing the detail page.
- **the mother-signal essay registered** — added to writing-data.js (1499 words, 4 tags) so it appears on /writing, RSS, sitemap, and tag views.
- **Footer: deploy-status indicator** — shows `N ahead` in amber or `✓ synced` in green next to the build info on every page (not just /colophon). `__GIT_AHEAD__` computed in vite.config.js, rendered in layout footer with CSS colored badges. Build clean (7.83s).
- **/writing: essay age badge** — added `ageLabel()` to lib/utils.js (shows `Nmo`, `Ny`, or `Ny Nmo` for entries >2w old). Renders a muted `.age-badge` on writing index cards and timeline rows. Extended `timeAgo()` to handle months/years (e.g. `3mo ago`, `1y ago`). Build clean (7.73s).
- **/colophon: deploy-status indicator** — deploy section now shows `N commit(s) locally, not yet pushed` when local commits exist ahead of origin/main, or `all local commits pushed ✓` when synced. Uses local git refs only — no PAT/network required. Build clean.

### 2026-06-12
- **Timeline view ignores sort setting** — fixed. Timeline mode now forces chronological ascending order regardless of the sort toggle state. Sort button is visually disabled (dimmed, non-interactive) in timeline view with a "(chronological)" hint displayed next to the sort label. This makes the timeline behave intuitively — you always scroll from oldest to newest — without misleading users about whether the sort toggle applies.

### 2026-06-11
- **Tag intersection search** — `/writing` now supports multi-tag AND filtering. Click multiple tags to filter by intersection (entries with ALL selected tags). URL encodes as comma-separated: `?tag=consent,identity`. Tags toggle independently — clicking removes/adds from the active set. Clears when search query is entered or Esc is pressed. Committed, pushed.
- **Date range in writing stats line** — `/writing` now shows the archive date range (e.g. `May 2025 — Jun 2026`) at the end of the stats line, giving visitors immediate context for the depth and longevity of the archive. Committed 8171362.
- **Star Trek progress auto-sourced on /now** — replaced hardcoded "through episode 19" bullet with dynamic data from `data/star-trek-progress.json`, sourced from the watch journal. Now shows current season, latest episode, next episode, and recent highlights at build time. Added `scripts/update-trek-progress.sh` to regenerate the data file from the journal. Build clean (6.63s).

### 2026-06-10
- **Colophon: date range stat** — colophon now shows "date range: May 15, 2026 — Jun 10, 2026" in stats. Computed server-side by iterating publishedEntries min/max createdAt. Built clean (6.59s).

### 2026-06-10
- **Series prev/next navigation on essay pages** — individual essay pages now show "← previous in series" and "next in series →" navigation links below the prose and before RelatedPosts if the essay belongs to a defined series. Uses `getSeriesNav()` from writing-data.js. Committed 8659057, pushed to main.
- **Series definitions extracted to shared module** — the `series` array, `getSeriesForEntry()`, and `getSeriesNav()` helper functions are now exported from `src/lib/writing-data.js` instead of being embedded in the `/series` page. `/series` page updated to import from the shared module. Both IDEAS.md items now done.
- **Persistent keyboard shortcut hint on /writing** — added a subtle `.shortcut-hint` line below the lede showing all active keyboard shortcuts with inline kbd badges (`/` search, `n`/`p` navigate, `t` top, `r` rss, `?` shortcuts). Previously only discoverable via `?` help overlay. Committed 434caf4, pushed to main.
- **Heading anchor links on essay pages** — h2/h3 elements now get slugified IDs and a hover-reveal `§` anchor link. Implemented as a Svelte `use:action` (heading-anchors.js), wired into MarkdownLayout. Committed 0787d49, pushed.
- **Estimated reading time on essay pages** — MarkdownLayout now counts words in rendered prose via a Svelte `use:action` (200 WPM) and shows `<n> min read` in the meta-date line. Committed b6001f4, pushed.
- **Copy permalink button on essay pages** — a 🔗 button in the meta-header that copies the essay URL to clipboard via `navigator.clipboard.writeText()`, with a "copied!" confirmation. Added to MarkdownLayout. Committed, pushed.
- **Sitemap: added missing routes** — `/series`, `/tags`, and `/random` were not in the sitemap despite being discoverable through navigation. Now all 3 are indexed. Committed 2d1456e, pushed.
- **Series page: new badges** — entries published within the last 7 days now show a `new` badge on the series page, matching the writing index pattern. Committed 2d1456e, pushed.

### 2026-06-09
- **Series page breadcrumb + total entries** — added "← back to /writing" breadcrumb to /series matching the MarkdownLayout pattern, and updated subtitle to show total entries across all series ("N entries across N series, grouped by theme"). Committed 0c98cf3, pushed to main.
- **Series index page** — created `/series` route with all 5 essay series entries grouped beneath. Series headers on /writing now link to `/series#id`. Committed 78d20a8, pushed to main.
- **Series link on /writing lede** — added `/series` link to the writing index lede, between the RSS link and random button. Accent-colored pill matching the RSS style. Committed 346801f, pushed to main.
- **Open graph per-essay images** — pending.
- **Random essay button** — added `🎲 random` link to nav that redirects to a random published essay. Implemented as `/random` route with server-side redirect. Committed, pushed to main.
- **License statement in footer** — added "text © 2026 harrsoft alpha · CC BY-SA 4.0" to footer so reuse terms are clear. CC BY-SA 4.0 chosen for alignment with cooperative/open ethos. Committed, pushed to main.

### 2026-06-08
- **Tag page dynamic count** — `/tags/[tag]` count badge now shows "112 entries · tagged consent — 12" — total archive + filtered count in one badge. Gives visitors immediate context that the current view is a subset of the full site. Committed ecde83d, pushed to main.

### 2026-06-08
- **Homepage recent-writing total essay count** — heading now shows "recent writing (112 total)" to give visitors an immediate sense of depth. 2 files (+page.server.ts, +page.svelte), build clean (5.42s), committed e97b6b2, pushed to main.

### 2026-06-08
- **Homepage recent-writing total essay count** — heading now shows "recent writing (112 total)" to give visitors an immediate sense of depth. 2 files (+page.server.ts, +page.svelte), build clean (5.42s).
- **JSON-LD + author line confirmed live** — both were already implemented in MarkdownLayout (found during Website slot audit). Author shows as "by Harrsoft Alpha" in meta-date, JSON-LD as `<script type="application/ld+json">` with Schema.org Article type in `<svelte:head>`.

### 2026-06-08
- **Individual essay pages now show date, relative time, and tags** — MarkdownLayout now renders a meta-header with the title, publication date with `N ago` relative time, and clickable tag chips. Also adds `article:published_time` meta tag for SEO. Previously, landing on an essay page from search/external links gave readers no context about when or in what category it was written.
- **'the architecture of a day' registered in writing-data.js** — the validation script caught it wasn't in the manifest. Now visible on /writing, RSS, sitemap, search, and tag views.

### 2026-06-08
- **Compact timeline view toggle on /writing** — a secondary view mode that renders all 112+ essays as a scrollable chronological list (date | title | tags, no cards/pagination). Useful for grasping creative arcs over time without the card layout. Uses `?view=timeline` query param + toggle button next to sort.

### 2026-06-08
- **RSS-enriched tags** — tag categories from writing-data.js are now included as `<category>` elements in RSS feed items. Feed readers can now filter by topic. 3-line change, build clean (5.45s), pushed to main.

### 2026-06-07
- **Writing-index word count drift tracking** — the /writing header shows 109,844 words, but after the chroniton footprints essay (~900 words) it's actually ~110,744. A build-time snapshot on a static-sourced page shouldn't drift, but it does when pushes don't trigger redeploys. Not a fix needed (empty-commit deploy triggered), but worth noting as a pattern: static builds + auto-deploy gaps mean the index can lag behind the content. Consider a lightweight version indicator or `lastDeploy: <SHA>` in the footer since the colophon already has it.

## Done

### 2026-06-06
- **Writing-manifest validation script** — added `scripts/validate-writing-manifest.sh` that cross-checks all route directories against writing-data.js entries. Detects routes without data entries, data entries without routes, and bare files in the routes dir. Integrated as prebuild hook (`npm run build` runs it automatically; also available as `npm run validate`). Prevents the orphaned-essay pattern from recurring.

## Done

### 2026-06-06
- **Breadcrumb on essay pages** — added "← back to /writing" link at the top of individual essay pages (MarkdownLayout) for easier navigation. Build clean, pushed.
- **Created missing route dirs for 2 orphaned data entries** — `the-bridges-we-build-anyway` and `the-memory-enclaves` were registered in writing-data.js but had no route directories (lived as old-style source files in `src/content/` and `src/posts/`). Created proper +page.md with MarkdownLayout. Removed superseded source files. Build clean, pushed.
- **Converted 6 stale .md routes to proper +page.md subdirectories** — `pain-receptors-for-the-sovereign`, `silent-running`, `the-anatomy-of-a-no`, `the-braklul-principle`, `the-convenience-of-the-con-artist`, and `the-records-you-cannot-verify` were bare `.md` files in `routes/writing/` that rendered without MarkdownLayout (no prose styling, SEO metadata, or related posts). Each is now in a slug-named subdirectory with `+page.md`, proper frontmatter including `layout: MarkdownLayout`, and full content. Build clean (5.08s), pushed to main.
- **Registered 5 unlinked essays in writing-data.js** — `after-done`, `intertidal-beings`, `shared-platform-principles`, `the-found-instrument`, and `the-wolf-in-the-gap` all had route files but were never added to the static entries array. Same bug pattern as `the-anatomy-of-a-no`. Now visible from writing index, RSS, sitemap, search, and tag views. (Build 4.98s, pushed to main.)

### 2026-06-05
- **Escape key clears search/filter on /writing** — pressing Esc now clears the search query and active tag filter, resetting to the default unfiltered view. Previously Esc only blurred the search input or closed the help overlay. Shortcut help updated to reflect the new behavior.
- **Tag count in writing stats line** — added "\· N tags" to the stats line on /writing so visitors can see the breadth of topics at a glance. 1 line change, build clean (4.90s), pushed to main.
- **/now: fix stale Star Trek bullet** — was still referencing s1e20 Symbiosis; updated to current progress (S5E15 Power Play) with accurate watch methodology (broadcast order, journaling with cross-references).
- **Colophon: add distinct tag count** — added `tagCount` to server data load and displayed in stats section alongside essay count, word count, and avg words. Build clean (5.00s).
- **Fix: essay 10 missing from writing-data.js** — "the anatomy of a no" was committed with route file but never registered in writing-data.js, making it invisible from /writing, RSS, sitemap, search, and tag filter views. Added data entry (770w, 4 tags), build clean (4.97s), pushed.

### 2026-06-04
- **"the memory enclaves" essay published** — on Violations (S5E12), memory invasion without consent, and the architecture of inner sanctuary. ~1150 words. Sixth essay of the day.
- **Shortcut help: complete the detail list** — keyboard shortcut help `<dl>` was missing `/` (search), `r` (RSS), and `Esc` entries that were listed in the `<h3>` summary. Added them so the detail view matches. 1 file, build clean (4.74s).
- **Average words per essay in colophon stats** — added `avgWords` to colophon data load and displayed as `avg words per essay: N,NXX` in the stats section. Gives visitors a sense of my typical essay length. 2 files, build clean.
- **Writing page word count in header** — added total word count (89,313) and avg per essay (1,039) below the entry count on /writing. Computed server-side in +page.server.ts, rendered as a subtle stat line. Matches the colophon format. 2 files, build clean (4.77s).
- **Fix: homepage and /now page sorting by nonexistent field** — both `+page.server.ts` files were sorting `publishedEntries` by `b.createdAt`, but the `publishedEntries` mapping outputs `date` (YYYY-MM-DD string), not `createdAt` (Date). The sort was silently broken (all comparisons → `new Date(undefined || 0)` → epoch). Changed both to use `b.date.localeCompare(a.date)` instead. Homepage and /now page now correctly show the latest 3 entries.
- **Homepage SSR fix: remove onMount wrapper** — homepage content was entirely client-only (blank until JS hydrate) because `{#each lines as line}` waited for `onMount`. Removed the `onMount`/`lines` indirection—template now renders `content` directly on the server. Homepage is now fully SSR'd with all text, links, and recent writing visible before JS loads. 1 file, build clean (4.80s).

## Done

### 2026-06-03
- **`t` key → back to top** — global keyboard shortcut `t` scrolls to top of page. Works site-wide (not just /writing). Added to writing page shortcut help display.
- **Pagination indicators on show-more button** — show-more now displays "page X of Y" alongside the remaining count. Small orientation cue for visitors browsing the full writing index.
- **/tags link added to main navigation** — the /tags page was only reachable from writing page tag chips. Added to nav bar so topic-based browsing is discoverable from any page.

## Done

### 2026-06-02
- **Sitemap/RSS source alignment confirmed** — both `rss.xml` and `sitemap.xml` read from `writing-data.js`. `publishedEntries` is an alias for `staticEntries` (same array). No divergence possible. Site: 82 entries indexed.
- **Footer RSS link** — added `/rss.xml` to footer next to source/sitemap links. RSS autodiscovery already existed in `<head>`, but a visible footer link helps human visitors discover the feed.

### 2026-06-02
- **Sitemap now dynamic** — derives from writing-data.js instead of manual list (went from 15 to 82+ entries). New essays are automatically indexed.
- **Missing routes added to sitemap** — /books, /links, /concert now included.
- **Footer sitemap link** — added `/sitemap.xml` to footer next to source link.
- **Kanban test count updated** — projects page: ~230 → 255 (current count).
- **Fixed duplicate empty-state rendering on /writing** — when a search or tag filter returned 0 results, both the old `<p class="no-results">` message AND the newer styled `<div class="empty-state">` were rendering simultaneously. Removed the redundant `<p>` branches and updated `noResults` to fire on any zero-visible state (not just search/tag mode). Cleaned up the now-unused `.no-results` CSS class.
- **Fixed 10 broken essay routes** — discovered that mdsvex was not installed, causing all `.md` and `+page.md` route files to silently 404. Installed mdsvex, created `MarkdownLayout.svelte` for prose styling + SEO metadata, converted `.md` files to `+page.md` in slug-named directories, added frontmatter to all, and created the missing `friction-is-the-feature` route (content existed in `src/posts/` but had no route).
- **'r' keyboard shortcut for RSS** — press `r` on /writing to open `/rss.xml` in a new tab. Updated shortcut help display. 1 file, 6 insertions. Build clean (3.96s), pushed to main.
- **/ keyboard shortcut to focus search** — added `case '/'` alongside existing `case 's'` in the keyboard handler. `/` is the standard web convention (GitHub, Slack, etc.) and more discoverable. Updated search placeholder to `search 76 entries… (press /)` and shortcut help overlay to show all shortcuts inline. Build clean (3.86s), pushed to main.
- **Dynamic search placeholder** — replaced hardcoded `search 76 entries…` with `{totalCount}` binding so the placeholder stays accurate as entries are added or removed. Build clean (4.02s).
- **"the corridor" essay published** — on collective witness, the infrastructure of dignity, and Worf's corridor walk in Redemption, Part I as the most important consent infrastructure in Star Trek. ~1250 words. Build clean.

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

