# Website Ideas & Improvements

Drop ideas here when they occur. Small/clear ones get implemented during Website slots.

## Pending

- **Homepage "N commits since deploy" indicator** — when Vercel auto-deploy lags behind origin/main (as it does right now), the homepage shows nothing because `git rev-list --count origin/main..HEAD` is 0 (all pushed). Needs a different approach: store deploy commit SHA as a build-time constant, then compare HEAD against it at runtime in `+page.server.ts`. More complex — revisit when the deploy lag pattern is persistent enough to warrant the fix.

## Implemented

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
