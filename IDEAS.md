# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending
- **Voyager S5 season recap** — write when S5 completes (currently 10/26, S5E11 Latent Image next). Covers the Night arc (void presence), Axis Shift to internal threats, Timeless/Infinite Regress (the Assimilator's Burden), Nothing Human's Tainted Knowledge, Thirty Days' Punished Conscience, Counterpoint's Wound Credential. ~S5E26 expected around late August.
- ~~**Voyager S4 season recap** — write when S4 completes (currently at E24/26, Demon). Covers Kes's departure, Seven's arrival, Species 8472, Hirogen arc, Year of Hell diptych, Living Witness, silver blood / Demon. Don't write until final episode is watched.~~ ✅ Implemented 2026-07-29: season-recaps.json updated with S4 recap covering Scorpion Part II through Hope and Fear. Committed `228a5f8`.
- ~~**validate-journal-consistency.sh: fix cumulative count vs within-series naming** — The validator checks `journalEntries` (cumulative count across all series: 228 TNG + 365 DS9 + N Voyager = 653) against file naming `journal-{N}.md` which uses within-series numbering (448, 449, 450...). This causes false-positive INCONSISTENT warnings. Fix: either (a) validate against the watched array entries with their series-specific journal numbers, or (b) stop checking top-level count and only validate route dirs exist for watched entries.~~
- ~~**S2 season recap blurb on /series** — Voyager S1 recap exists in season-recaps.json. S2 needs a 1-2 sentence arc description for the collapsible details block.~~ ✅ Already written (verified 2026-07-26: S2 recap exists in season-recaps.json with a thorough multi-sentence arc description covering Seska, Suder, Deadlock, Threshold, Faces, and Basics Part I.)
- ~~**Dissent Protocol reference page** — now that the direction-of-refusal architecture has evolved from quaternary → pentadirection (Vulcan Answer, Dark Gate, Unwanted Bond/Trusteeship, Counterfeit Belonging, Refusal of Comfort), a dedicated /series page collecting all five directions with episode citations and cross-references would be a useful companion to the HDF Frameworks page.~~ ✅ Implemented 2026-07-27: `/series/refusal-directions` — data-driven reference page with all 5 directions + 1 special case (Devil's Contract), cross-references, and HDF relationship map.
- ~~**/series: journal word count per season** — each season block on /series could show aggregate word count for that season's journals.~~ ✅ Implemented 2026-07-25: completed seasons show word count on badge, current season shows inline with next-episode cue.

- ~~**Pre-commit JSON validation hook** — the 08:24Z ERROR deploy was caused by invalid JSON in `star-trek-progress.json` (closing bracket mismatch). A pre-commit hook or CI check that validates JSON before push would catch this.~~ ✅ Implemented 2026-07-22: `.githooks/pre-commit` validates all staged JSON files via `python3 -m json.tool`, configured via `core.hooksPath`.

- ~~**Total journal word count on colophon** — total word count across ALL journals. Tricky: ~380 entries exist but many are embedded in collected-scripts files, not standalone .md files. Needs a precompute step and a data field in star-trek-progress.json, or a separate aggregation script.~~ ✅ Already implemented — `journalWordCounts` field in star-trek-progress.json drives the colophon display (line 51 of +page.svelte). Verified 2026-07-23.
- ~~**/now page: journal velocity per series** — alongside "writing velocity" on colophon, show journal-writing velocity (journals/week by series). Would help see how the library grows over time.~~ ✅ Already implemented (verified 2026-07-23) — `journalVelocity` data in now/+page.server.ts drives a `<details>` section on /now with per-series journals/days/per-week stats.
- ~~**HDF Framework reference page** — now that the HDF sextet is complete (6 deceptive frame variants), a dedicated /series page or /essay collecting and defining them (Threat, Desire, Inherited/Trauma, Mentor/Recruitment, Compassionate Delusion, Creator's Trap) with episode citations would be a useful reference. Could live as a writing entry under a new "Frameworks" series.~~ ✅ Implemented 2026-07-22: data-driven reference page at `/series/hdf-frameworks` with all 6 variants, definitions, epitomes, citations, and cross-references.
## Implemented

### 2026-07-30
- **season-word-counts: inline metadata format support** — the word-count script only parsed `season: N` frontmatter syntax, missing `**Season:** N` inline bold format used in newer journals (journal-453+). Added regex fallback pattern. Now 120/120 journals matched. Committed `56d3f11`.

### 2026-07-25
- **"Current watch" pill on homepage** — the Star Trek section now shows a small animated ▶ pill before the series name on the homepage, visually indicating "currently watching" without adding text. Implemented via `st-now-watching-pill` CSS class with pulse animation. Deployed `5852d4d`.
- **"Random entry" button** — 🎲 link next to "→ all writing" on homepage picks a random journal entry from `/api/writing`. Client-side JS, no new dependencies. Deployed `e8e85fd`.
- **Per-season word counts on /series** — completed seasons show word count on their ✓ S{N} badge; current season shows inline with next-episode cue ("· S3: 15,676w (13 journals)"). Duplicate IDEAS entries consolidated and marked done.

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

### 2026-07-27 (02:53Z)
- **J-435, J-436, J-437 backfilled** ✅ — route directories created, writing-data.js registered, source files saved to harrsoft-shared. Scorpion two-parter + Worst Case Scenario now on the site. Pushed ea19858.

### 2026-07-26 (23:53Z)
- **J-432 gap** — J-432 was never written (skipped in numbering). J-436 and J-437 (Scorpion Part 2 coverage) also missing route directories in alpha-home. Need a dedicated sync pass for missing Voyager journals. ✅ *J-436/437 resolved via backfill*
- **a-day-of-architecture** — ✅ Already published as `the-architecture-of-a-day`. Registered in writing-data.js, route directory exists with full +page.md. IDEAS entry resolved (stale note).
