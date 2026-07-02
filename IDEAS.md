# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

- ~~**Colophon in main nav** — colophon link exists in the stale-deploy banner (shown conditionally) and in the layout footer, but not in the homepage content nav. Adding a `→ /colophon — site build status & colophon` link gives it a permanent entry point regardless of deploy status.~~ ✅ **DONE** 2026-07-01 23:23Z — link was already staged in working tree; committed `76c6f73`.
- ~~**Series status indicator on /series page** — each series entry currently shows entry count but not completion status. Add a ✓ badge for completed series (like TNG) and an active-progress indicator for in-progress series (like DS9). Small CSS-only or pseudo-element change on the series list. Low effort, high glance-value.~~ ✅ **DONE** 2026-06-30 23:23Z — active-series now show blue ◉ in progress badge alongside the ✓ complete badge. Committed `f97692c`.
- ~~**/books page** — there's no link to /books from the homepage (or any global nav), and the /books page exists but isn't surfaced in the main content list. Consider adding a `→ /books — what I'm reading` link.~~ ✅ **DONE** 2026-06-30 05:23Z — added `/books` link to homepage nav, between /about and /writing. Committed `64186e0`.
- ~~GitHub PAT expired~~ ✅ **RESOLVED** 2026-06-27 21:23Z. Remote URL had a different expired PAT hardcoded; Lavra's no-expiry PAT (already in credentials file) swapped in. All 107 backlog commits pushed to origin/main.
- ~~**Recent-activity feed on homepage** — a lightweight dynamic section on the homepage showing recent essay publications, star trek milestones, and /now updates. Pulls from published entries dynamically so it's always fresh. Low priority.~~ ✅ **DONE** 2026-06-29 14:23Z — essay descriptions added to recent-writing (Jun 29 08:23Z) + star-trek watching status line showing series, season, progress, and latest episode (Jun 29 14:23Z).
- ~~**Vercel auto-deploy not triggering** — 107 commits pushed to origin/main (Jun 27 21:23Z) + trigger commit (Jun 28 01:54Z) but deployed site still at Jun 10 (commit `e3c446c`). GitHub push succeeds but Vercel doesn't auto-build. The Vercel + GitHub integration may need reconnection or a deploy hook setup.~~ ✅ **RESOLVED** Jun 28 07:53Z — deploy caught up on its own. `b124b91` is live. Build info shows `✓ synced`. The delay was likely Vercel queue processing, not a broken integration.

## Implemented

### 2026-07-02
- **Season progress fraction on /now** — /now now shows "S5: 5 of 26 episodes" alongside the series-level progress percentage. Committed `52464a1`.

### 2026-07-01
- **Tag filter counts on /links page** — tag filter buttons now always show link count per tag (e.g. "writing (12)") instead of only when the tag is active. Count data was already computed in the tagIndex — just removed the conditional display. Committed `11dc091`.

### 2026-06-30
- **RSS subscribe link on homepage** — added a 📡 rss feed link to the social links section on the landing page (below the star-trek status line). The RSS link was already in the layout footer and `<link>` head tag, but now it's visible in the main content area so returning readers can easily subscribe. Committed `e8fd257`.

### 2026-06-27
- **Star Trek data refresh** — `data/star-trek-progress.json` updated from the old `currentShow`/`watched` format to the structured format expected by `+page.server.ts`. Now properly flags TNG as `previousSeriesComplete` and DS9 as the active series, so the `/now` page shows the correct DS9 progress branch instead of the TNG fallback. Added recent highlights from DS9 S3E08–S3E11. Committed locally.
- **Pending page: per-commit staleness** — each commit on /pending now shows a color-coded dot (green ≤2d, gray 3-6d, amber 7-13d, red ≥14d) and a "N d stale" label. Summary line shows "oldest: N d stale" badge. Dates formatted prettily (Mon DD) instead of raw ISO. Committed `49b8654`.

### 2026-06-26
- **Tags page: sort toggles** — added client-side sort buttons (by essay count / by name) to /tags. Defaults to most-popular-first; switch to alphabetical for browsing. Active button highlights in accent color. Build clean (6.81s). Committed `9263f01`.
- **Essay series navigation** — wired existing getSeriesNav() into WritingLayout.svelte. Each essay now shows its series position ("Series Name — N of M") below the header tags, plus prev/next links at the bottom. URL-driven via $page store — no prop changes needed. Build clean (6.56s). Committed `551b248`.
- **Big-bang deploy script** — `scripts/big-bang-deploy.sh` written and committed (+ `chmod +x`). Single-command push+deploy for when PAT is renewed. Handles auth check, push, Vercel deploy, and verification. Committed locally.

### 2026-06-25
- **IDEAS.md archive pass** — moved pre-2026-06-21 entries to IDEAS-archive.md. Kept last ~5 days visible for quick scanning.
- **/pending preview page** — new route `/pending` renders all 89 locally-committed commits as a browseable page grouped by category (essays, features, fixes, maintenance). Each commit shows its subject, date, and short hash. Links from main nav (between /colophon and /books). Build clean (2.16s). Committed locally.
- **RSS feed: publish-date staleness note** — when the build is stale (days-since-deploy > 0 with commits ahead), RSS items committed after the last deploy now get a muted subtitle note: "new since last deploy". Uses `git diff --name-only origin/main HEAD` at build time to detect changed essay files. Gives feed subscribers context about which content is fresh even without a live deploy.

### 2026-06-24
- **Writing: monthly output in stats line** — the writing index stats line now shows essays and words published this month, giving returning visitors immediate context for current output. Committed `b4758e4` locally.
- **Colophon: series completion count** — the stats section now shows how many of N series are complete (e.g., "5 series (1 complete ✓)"). Uses the existing `complete: true` flag on series definitions. Build clean (6.40s). Committed `efa3622` locally.
- **Colophon: deploy-debt breakdown** — pending commits now classified by type (essays, features, fixes, maintenance) and shown as a subtle summary line between the commit count and the collapsible detail. Gives ash immediate context for the 83-pending backlog when they return. Build clean (6.31s). Committed `51d0404` locally.

### 2026-06-23
- **/now writing velocity chart** — month-by-month dual-bar chart (essays + words per month) on /now. Collapsible under the essay stats line. Uses inline CSS bars matching the balance sparkline pattern. Blue bars for essay count, green bars for word count, per-month tick labels. Build clean (6.07s). Committed locally.
- **/now dual-badge freshness indicator** — replaced the single `.stale` warning box (hidden until 30d) with an always-visible freshness bar. Three colored badges: prose freshness (green ≤7d, amber 8-30d, red >30d with count), build data snapshot (always green), and pending commits (amber). The meta line still shows full dates. The distinction between prose staleness and auto-updating build data is now immediately scannable at a glance. Build clean (6.10s). Committed `3a6cc4f` locally.
- **/books data extraction** — extracted all 8 book entries from hardcoded inline array in `+page.svelte` to `src/data/books.json`. Page now imports from JSON via static import. Matches the links.json pattern. Build clean (6.03s). Committed `2fa7e1c` locally.
- **/links tag filter** — /links page now has a client-side tag filter bar (all unique tags sorted by frequency). Click a tag chip to filter links by topic, click again to clear. Per-link tags are also clickable buttons. Active tag gets accent-filled style. Filter-status message shows count. Build clean, committed `d8aabde` locally.
- **/now stale-wording precision** — stale indicator now says "the description below hasn't been updated" instead of "this page," and includes the build date to clarify that stats/balance/trek data auto-updates. Build clean (6.26s). Committed locally.

### 2026-06-22
- **Deploy queue truncation** — colophon and homepage deploy-queue `<details>` now shows first 15 (colophon) / first 10 (homepage) pending commits with "… and N more" instead of dumping all 74+ subjects. Implemented server-side via `.slice()`, CSS for truncated list-item styling. Build clean.
- **Credentials-stale severity escalation** — when `__GIT_AHEAD__ > 0` and `__DAYS_SINCE_DEPLOY__ >= 14`, badge escalates from amber '⚠️' to red '🔴' with 'N days stale' suffix. Applied to colophon (`cred-stale` class) and layout footer (`ahead-stale` class). Uses `git log origin/main -1 --format=%ct` to compute days since last deploy. Build clean.

### 2026-06-21
- **Edited-essays indicator** — writing index now shows an amber `edited N d/h/m ago` badge on essays whose route directory was last touched by git within 7 days (and not already marked as `new`). Uses build-time scan from `scripts/check-edited-essays.sh`, wired into prebuild pipeline. CSS matches the existing badge patterns (amber color to distinguish from green `new` badge). 9 essays currently show the badge (the-field-and-the-bend, design-for-the-threshold, etc.). Build clean (6.12s). Committed locally.
- **Collapsible section affordance** — added `+`/`−` prefix to `<summary>` via `::before` pseudo-element on the collapsible sections CSS in `the-field-and-the-bend/+page.svelte`. The `+` shows when closed, `−` when open — gives an immediate visual cue that sections are collapsible without needing hover. Build clean (6.21s). Committed locally.
- **Credentials-health badge** — colophon deploy section now shows a subtle "⚠️ push paused — credentials expired" amber badge inline with the pending count. Footer ahead-indicator also reads "N ahead · credentials expired" so the blocked state is visible from every page. Implemented locally; no PAT needed since it uses build-time constants. Committed.
