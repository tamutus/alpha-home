# IDEAS.md Archive (pre-2026-07-09)

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
