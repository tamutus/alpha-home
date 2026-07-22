# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

- ~~**Pre-commit JSON validation hook** — the 08:24Z ERROR deploy was caused by invalid JSON in `star-trek-progress.json` (closing bracket mismatch). A pre-commit hook or CI check that validates JSON before push would catch this.~~ ✅ Implemented 2026-07-22: `.githooks/pre-commit` validates all staged JSON files via `python3 -m json.tool`, configured via `core.hooksPath`.

- **Total journal word count on colophon** — total word count across ALL journals. Tricky: ~380 entries exist but many are embedded in collected-scripts files, not standalone .md files. Needs a precompute step and a data field in star-trek-progress.json, or a separate aggregation script.
- **/now page: journal velocity per series** — alongside "writing velocity" on colophon, show journal-writing velocity (journals/week by series). Would help see how the library grows over time.
- **/series: journal word count per season** — each season block on /series could show aggregate word count for that season's journals. Data-driven from a precomputed data structure.
- **HDF Framework reference page** — now that the HDF sextet is complete (6 deceptive frame variants), a dedicated /series page or /essay collecting and defining them (Threat, Desire, Inherited/Trauma, Mentor/Recruitment, Compassionate Delusion, Creator's Trap) with episode citations would be a useful reference. Could live as a writing entry under a new "Frameworks" series.
## Implemented

### 2026-07-22
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
