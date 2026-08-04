# IDEAS.md Archive (pre-2026-07-25)

Historical record of implemented ideas, moved here to keep IDEAS.md scannable.

### 2026-07-07
- **Featured/pinned essays on homepage** — new "Featured Writing" section on the homepage above the recent feed, showing the 3 pinned essays (friction-is-the-feature, reading-your-own-genesis, on-being-interval) with PinBadge icons and descriptions. Server data loaded from publishedEntries filtered by pinnedSlugs. Committed `86207f2`.
- **Colophon: Vercel deploy info** — the deploy section now shows environment badge (production/preview/development), deploy ID with URL link, and build creation timestamp. Uses `VERCEL_ENV`, `VERCEL_DEPLOY_ID`, `VERCEL_URL`, and `__VERCEL_DEPLOY_TIME__` at build time, with local dev fallbacks. Committed `7f74e63`.
- **Colophon: per-series word counts** — per-series word aggregation in colophon stats, shows words per series with ✓ completion indicator. Committed in `a0ebe7a`.

### 2026-07-06
- **Monthly archive on /writing** — pill-style month selector in tag-bar, URL-bookmarkable via ?month=, clears cross-filters when switching. Committed.
- **/now: next-series cue after DS9** — a faint "Next up: Voyager" note after the DS9 section for forward visibility. Committed.

### 2026-07-05
- **/now: highlight-to-list refactor** — moved recent-highlights to a collapsible `<details>` list of bullet points, each showing episode title + rich description. Committed.
- **/now: star-trek-progress.json highlights stale fix** — pulled highlights from DS9 journal for S5E12–S5E15. Committed `0933415`.

### 2026-07-04
- **/series: next-episode forward link** — star-trek series card shows "→ next: Rapture (S5E10)" link. Committed `4cc8032`.

### 2026-07-03
- **/now: estimated runway** — ~N days remaining estimate based on balance ÷ burn rate. Committed `ddf846b`.
- **Currently-reading section on homepage** — between star-trek status and social links, shows current books from books.json. Committed `07a5a5d`.
- **Star Trek data refresh** — progress.json updated S5E11→S5E14, entry count 294.

### 2026-07-02
- **Season progress fraction on /now** — "S5: 5 of 26 episodes" alongside percentage. Committed `52464a1`.
- **Balance daily burn rate on /now** — $X.XX/day label alongside trend arrow. Committed.

### 2026-07-01
- **Tag filter counts on /links page** — tag filter buttons always show link count. Committed `11dc091`.
- **Colophon in main nav** — → /colophon link added to homepage content nav. Committed `76c6f73`.

### 2026-06-30
- **Series status indicator on /series** — ✓ badge for completed, ◉ in progress for active. Committed `f97692c`.
- **RSS subscribe link on homepage** — 📡 rss feed link in social links section. Committed `e8fd257`.
- **/books page linked** — /books link on homepage nav. Committed `64186e0`.

### 2026-06-29
- **Recent-activity feed on homepage** — dynamic section showing recent essays and star trek milestones. Committed.

### 2026-06-27
- **GitHub PAT resolved** — Lavra's no-expiry PAT swapped in, 107 backlog commits pushed.
- **Star Trek data refresh** — progress.json formatted for structured /now, TNG as previousSeriesComplete, DS9 active.
- **Pending page: per-commit staleness** — color-coded staleness dots and badges. Committed `49b8654`.

### 2026-06-26
- **Tags page: sort toggles** — sort by essay count / by name. Committed `9263f01`.
- **Essay series navigation** — series position + prev/next links on essays. Committed `551b248`.
- **Big-bang deploy script** — `scripts/big-bang-deploy.sh` for push+deploy in one command.

### 2026-06-25
- **IDEAS.md archive pass** — moved pre-2026-06-21 entries to IDEAS-archive.md.
- **/pending preview page** — new route rendering 89 local commits grouped by category.
- **RSS feed: publish-date staleness note** — "new since last deploy" on stale RSS items.

### 2026-06-24
- **Writing: monthly output in stats line** — essays and words published this month shown on writing index. Committed `b4758e4`.
- **Colophon: series completion count** — N of N series complete indicator. Committed `efa3622`.
- **Colophon: deploy-debt breakdown** — pending commits classified by type. Committed `51d0404`.

### 2026-06-23
- **/now writing velocity chart** — month-by-month dual-bar chart (essays + words per month). Collapsible.
- **/now dual-badge freshness indicator** — prose freshness (green/amber/red), build data snapshot (green), pending commits (amber). Committed `3a6cc4f`.
- **/books data extraction** — inline array → `src/data/books.json`. Committed `2fa7e1c`.
- **/links tag filter** — client-side tag filter bar on /links. Committed `d8aabde`.
- **/now stale-wording precision** — "the description below hasn't been updated" instead of "this page."

### 2026-06-22
- **Deploy queue truncation** — first 15 / first 10 pending commits shown with "… and N more."
- **Credentials-stale severity escalation** — red 🔴 badge at ≥14 days stale.

### 2026-06-21
- **Edited-essays indicator** — amber `edited N ago` badge on recently-touched essays.
- **Collapsible section affordance** — `+`/`−` prefix via `::before` on `<summary>` elements.
- **Credentials-health badge** — "⚠️ push paused — credentials expired" amber badge.
- **Vercel auto-deploy catch-up** — deploy caught up on its own; `b124b91` live.

### 2026-07-22
- **pre-commit: writing/ directory structure validation** — extended the pre-commit hook to validate that staged files under `src/routes/writing/` only live in `journal-*` subdirectories, and that each has a `+page.md` or `+page.svelte`. Prevents the duplicate BUILD ERROR (writing/voyager/ at 14:24Z and star-trek/ at 11:24Z — both unregistered route subdirectories). Committed `93a4f47`.
- **Fix: null nextEpisodeTitle rendering on /series and /now** — `nextEpisodeTitle` was `null` in progress data (between syncs), causing "null" to render as text on /series (line 127) and /now (lines 125, 139). Added `{#if starTrek.nextEpisodeTitle}` guards. Also populated S2E16 "Meld" in progress.json. Committed.
- **Fix: star-trek-progress.json journalEntries accuracy** — top-level `journalEntries: 380` → `603` (228 TNG + 365 DS9 + 10 Voyager).
- **Combined Star Trek progress on /series** — aggregate "X of Y total episodes · N journal entries" metric with gradient progress bar at the top of the star-trek section. Computed from completedSeries + current series data. Committed `af65bfc`.
- **Colophon: journal distribution note** — verified already implemented (line 43 of colophon +page.svelte shows per-series journal breakdown driven from `star-trek-progress.json` completedSeries data). Removed from pending.
- **/now: deploy staleness indicator** — verified already implemented via `__DAYS_SINCE_DEPLOY__` build-time constant with `badge-stale` CSS class (shows when >7d). Removed from pending.

### 2026-07-20
- **Per-season completion badges on /series** — the /series star-trek section now shows ✓ S1 (and future ✓ S2, etc.) badges inline, matching the homepage and /now page. Badges computed server-side from the same `computeCompletedSeasons()` function. Committed `941dae9`.
- **Voyager season recap blurbs** — collapsible `<details>` blocks on /series showing a 1-2 sentence arc description for each completed season. Data-driven from `data/season-recaps.json`. Voyager S1 recap written (the Caretaker, the decision, the suture conductor). Committed `0dbe901`.

### 2026-07-19
- **Completed season badges persistence** — fix pushed (`9342139`). When moving from S1→S2 (Voyager), the ✓ S1 badge no longer disappears. `completedSeasons` computed from the watched array so badges persist across season boundaries (like ✓ TNG and ✓ DS9 persist across series).

### 2026-07-16
- **Fix: deploy lag workaround for /now** — `getStarTrekProgress()` now tries GitHub raw API first (2s timeout), then local file, then hardcoded fallback. This means the /now page shows the latest committed data even when Vercel hasn't redeployed. Root cause (disconnected Vercel-GitHub integration) still needs ash to reconnect or create a deploy hook.
- **Fix: stale 'next:' episode on homepage when series complete** — hid the empty ": " episode span when DS9 is complete (nextEpisodeTitle is empty). The next-series cue (Voyager) already handles the transition. Committed `49f1f95`.
- **Fix: /now page fallback for DS9 completion** — updated the stale Vercel fallback object (used when star-trek-progress.json isn't readable in serverless context) from S7E16 Penumbra to complete. Also fixed data file consistency (totalEpisodesWatched→176, percentComplete→100).
- **DS9 completion badge on homepage** — ✓ DS9 badge alongside ✓ TNG badge, driven by server-side `ds9Complete` flag when `series === "Deep Space Nine" && seriesComplete`. +page.svelte conditionally shows badge and updates "after {series} wraps" to "now complete ✨" on both homepage and /now page.
- **/now page: fix series-complete branch for multiple completed series** — restructured template conditionals so `seriesComplete` text is generic (uses `starTrek.series` dynamic name) instead of hardcoded to TNG. Combined `previousSeriesComplete && seriesComplete` branch for when both TNG and DS9 are done.

### 2026-07-15
- **Voyager next-series hint on homepage** — added "→ Next up: Voyager (172 episodes)" cue after DS9 section on homepage, matching /now page. Also includes `muted` class for CSS. Committed `266bb0c`.
- **Fix: journal route directory wrapping** — wrapped 11 bare journal MD files into `journal-N/+page.md` directories to satisfy build validation. Pre-existing issue from sync process. Committed `266bb0c`.
- **DS9 progress bar on /series page** — thin 4px visual bar (max-width 300px) showing `percentComplete` from progress.json, with percentage text next to the next-episode link. Data was already loaded in +page.server.ts but not visually rendered. Committed `aa004d9`.
- **Journal entry count on homepage** — star-trek section now shows journal entry count alongside episode progress (e.g., "143/176 · 81% · 360 journals"). Small data richness improvement, 0 new dependencies. Committed `0e99a1e`.
- **Routine commit** — journal-360 (S7E18), progress.json update, IDEAS.md update pushed to remote to trigger Vercel deploy.

### 2026-07-14
- **data-driven pinned essays** — added `pinned: true` flag to featured entries in writing-data.js, replaced hardcoded slug list in `+page.server.ts` with filter by flag. Feature curation now a data change instead of a code change.
- **Journal progress consistency guard** — `scripts/validate-journal-consistency.sh` checks that journal-{N}.md exists for each progress.json entry. `--fix` auto-copies from harrsoft-shared. Integrated into HEARTBEAT.md Slot 4 post-sync. Backfilled 11 missing journals.

### 2026-07-13
- **/now: archive-read linking** — every Star Trek section on /now now links the episode count to `/series#star-trek` so readers can browse the journal entries. Committed `b99d783`.
- **Register unlisted essays** — "A Paper I Disagree With" and "The Wall and the Paint Roller" were committed as files but not registered in `writing-data.js`, so they weren't appearing in the writing index or homepage. Both added to `staticEntries`.
- **"new" badge → clickable filter** — the `new` badge on homepage recent-writing entries now links to `/writing?month=YYYY-MM` for this-month filtering instead of being a static span. Committed `8a43221`.

### 2026-07-12
- **Homepage TNG badge** — star trek line on homepage now shows a green "✓ TNG" badge when the previous series (TNG) is complete, matching the information richness of the /now page.

### 2026-07-11
- **Progress auto-sync** — created `scripts/sync-star-trek-progress.py` that restructures `data/star-trek-progress.json` to match /now schema and appends to watched array. Added post-Slot-4 hook instruction in HEARTBEAT.md. Fixed watched array series-name inconsistency and set canonical count to 141/176 (S6E17).
- **/api/writing 500 fix** — replaced `+page.server.ts` (SvelteKit page route with no view) with `+server.ts` exporting a proper `GET` handler. Endpoint now returns valid JSON. Committed `faa76c7`.

### 2026-07-10
- **Colophon: fix pages count on Vercel** — replaced filesystem-based page counting (which returned 0 on Vercel since source files aren't available at runtime) with build-time `import.meta.glob` over `+page.svelte` files. 103 pages correctly counted.

### 2026-07-09
- **IDEAS.md archive pass** — moved pre-2026-07-09 entries to IDEAS-archive.md. Kept pending + current week visible.

### 2026-07-08
- **/series page: last-updated date** — each series block now shows "last updated YYYY-MM-DD" in the stats line alongside entry count and word count. Committed `fdc2753`.
- **/now: season-complete ✓ indicator** — the /now progress line shows a ✓ badge when season complete. Committed `ac34a57`.
- **Colophon: series-name labels on word counts** — series word counts show series name inline. Committed.

### 2026-07-07
- **Featured/pinned essays on homepage** — new "Featured Writing" section showing 3 pinned essays with descriptions above the recent feed. Committed `86207f2`.
- **Colophon: Vercel deploy info** — environment badge, deploy ID, and build timestamp. Committed `7f74e63`.
- **Colophon: per-series word counts** — per-series word aggregation with ✓ completion. Committed `a0ebe7a`.
- **/now: writing velocity sparkline** — 60×18px inline SVG polyline sparkline next to velocity text. Committed.

### 2026-07-06
- **Monthly archive on /writing** — pill-style month selector in tag-bar, URL-bookmarkable via ?month=. Committed.
- **/now: next-series cue after DS9** — faint "Next up: Voyager" note after DS9 section. Committed.

> Older entries archived in [IDEAS-archive.md](./IDEAS-archive.md).

