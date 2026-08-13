#!/usr/bin/env bash
# Post-deploy smoke test: verify journal pages actually render on the live site.
# Catches the silent-404 class of bug (route builds to nothing, deploy still READY).
# Usage: bash scripts/smoke-test-journals.sh [base_url]
set -u

BASE="${1:-https://alpha-home-phi.vercel.app}"
DATA="data/star-trek-progress.json"
FAIL=0

if [ ! -f "$DATA" ]; then
  echo "❌ $DATA not found — run from alpha-home repo root"
  exit 1
fi

# Pull the 3 most recent journal numbers from recentHighlights (J-### prefixes)
LATEST=$(python3 -c "
import json,re
d=json.load(open('$DATA'))
nums=[int(m.group(1)) for h in d.get('recentHighlights',[]) for m in [re.search(r'J-(\d+)',h)] if m]
print(' '.join(str(n) for n in sorted(nums,reverse=True)[:3]))
")

# Regression targets: known silent-404 cases with non-standard route names
# J-348 (suffix-less dir) was 404ing since Jul 13 — never leave it out again
LATEST="$LATEST 348"

# Wrapper-based essay pages: import $lib/components/WritingLayout.svelte (the
# thin compat wrapper). The 2026-08-06 fix proved this set can 500 wholesale
# while every md/svx check stays green — keep them pinned as regression targets.
WRAPPER_ESSAYS="the-clip-show-self valence-revisited on-being-121"

# Plain +page.md essays registered in writing-data.js (no wrapper). Same
# registration-failure class as journals: a commit can add the page while the
# index/RSS stay stale, or the route can silently 404. Pinned since 2026-08-10
# (the Two Sweeps essays landed the same day they were written).
REGISTERED_ESSAYS="one-cent-per-beat the-three-hundred-first-sweep"

# The two Book sets (Watches + Words) + their spines: the site's freshest
# content, all plain registered artifact routes. Pinned 2026-08-13 — same
# silent-404 class as the essays; if a deploy breaks the books, the smoke
# test should catch it, not a reader.
BOOK_ROUTES="the-book-of-watches vigil the-quiet-is-bigger three-cents-after-the-zero mornings-edge the-book-of-words the-furniture the-second-word the-third-word the-fourth-word the-fifth-word the-unswearing"

# Verify /rss.xml includes the newest journal (catches the feed-stale class
# fixed 2026-08-07: the feed only read publishedEntries, so its newest journal
# was J-487 while the site had J-526 — 39 journals invisible to subscribers).
# The feed now merges the generated journal index, same as /writing. Anchor:
# the newest journal from recentHighlights must appear as a feed item.
RSS_XML=$(curl -s --max-time 15 "$BASE/rss.xml")
TOP_J_RSS=$(echo "$LATEST" | awk '{print $1}')
if [ -n "$TOP_J_RSS" ]; then
  if printf '%s' "$RSS_XML" | grep -qF "journal-$TOP_J_RSS"; then
    echo "  ✅ /rss.xml includes newest journal J-$TOP_J_RSS"
  else
    echo "  ❌ /rss.xml missing J-$TOP_J_RSS — feed stale (publishedEntries only?)"
    FAIL=1
  fi
fi

echo "🩺 Smoke-testing latest journals: $LATEST (against $BASE)"

# Non-journal regression targets (highest-traffic routes)
for page in "/" "/series" "/now"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE$page")
  if [ "$code" = "200" ]; then
    echo "  ✅ $page: 200"
  else
    echo "  ❌ $page: HTTP $code"
    FAIL=1
  fi
  # follow redirects for the root, just in case
  if [ "$page" = "/" ] && { [ "$code" = "301" ] || [ "$code" = "302" ]; }; then
    final=$(curl -s -L -o /dev/null -w "%{http_code}" --max-time 15 "$BASE$page")
    echo "  ➡️  / follows redirect → HTTP $final"
    [ "$final" = "200" ] || FAIL=1
  fi
  sleep 0.3
 done

# Verify the live /series page renders the current next-episode title
# (catches the stale-nextTitle class fixed 2026-08-03: sync preserved stale fields)
NEXT_TITLE=$(python3 -c "
import json
d = json.load(open('$DATA'))
print(d.get('nextTitle', ''))
" 2>/dev/null)
if [ -n "$NEXT_TITLE" ]; then
  # Svelte HTML-escapes text interpolation — match raw or escaped form
  NEXT_TITLE_ESC=$(python3 -c "import html,sys; print(html.escape(sys.argv[1]))" "$NEXT_TITLE" 2>/dev/null)
  SERIES_HTML=$(curl -s --max-time 15 "$BASE/series")
  if printf '%s' "$SERIES_HTML" | grep -qF "$NEXT_TITLE" || printf '%s' "$SERIES_HTML" | grep -qF "$NEXT_TITLE_ESC"; then
    echo "  ✅ /series next-episode title: \"$NEXT_TITLE\" renders"
  else
    echo "  ❌ /series next-episode title \"$NEXT_TITLE\" NOT found — stale nextTitle?"
    FAIL=1
  fi
fi

# Verify /series renders the season recaps (catches the recaps-invisible class
# fixed 2026-08-02 4c350bf: data/*.json wasn't in the Vercel serverless bundle,
# so recap <details> blocks rendered nothing live while deploys stayed READY).
# Anchor: the S6 recap's closing thesis — distinctive, data-driven, stable.
RECAP_ANCHOR="the inner life survives the frame that tries to contain it"
SERIES_HTML=$(curl -s --max-time 15 "$BASE/series")
if printf '%s' "$SERIES_HTML" | grep -qF "$RECAP_ANCHOR"; then
  echo "  ✅ /series season recap renders (S6 thesis found)"
else
  echo "  ❌ /series season recaps missing — recap-invisible class (4c350bf)?"
  FAIL=1
fi

# Verify /now renders the data-refresh date (catches the empty-date class fixed
# 2026-08-08 cd75a63: the template read starTrek.latestWatched — never a data
# field — so the "on {date}" slot rendered empty while the page stayed 200.
# Anchor: the date is derived from lastUpdated.slice(0, 10) in the template,
# so assert that exact date string appears somewhere on /now.
NOW_DATE=$(python3 -c "
import json
print(json.load(open('$DATA')).get('lastUpdated', '')[:10])
" 2>/dev/null)
if [ -n "$NOW_DATE" ]; then
  NOW_HTML=$(curl -s --max-time 15 "$BASE/now")
  if printf '%s' "$NOW_HTML" | grep -qF "$NOW_DATE"; then
    echo "  ✅ /now renders data date $NOW_DATE"
  else
    echo "  ❌ /now missing data date $NOW_DATE — empty date-slot (cd75a63 class)?"
    FAIL=1
  fi
fi

# Verify /writing lists the newest journals (catches the index-gap class fixed
# 2026-08-06 2a67ccb: /writing only listed registered entries (~94 of 180 route
# dirs), so readers had to go to GitHub for Demon et al. The index is generated
# by build-journal-index.py AND must be bundled (import) — gitignored generated
# files are invisible to the serverless bundle (4c350bf class). Anchor: the
# newest journal from recentHighlights must be walkable from the front door.
WRITING_HTML=$(curl -s --max-time 15 "$BASE/writing")
TOP_J=$(echo "$LATEST" | awk '{print $1}')
if [ -n "$TOP_J" ]; then
  if printf '%s' "$WRITING_HTML" | grep -qF "journal-$TOP_J"; then
    echo "  ✅ /writing lists newest journal J-$TOP_J"
  else
    echo "  ❌ /writing missing J-$TOP_J — journal-index.json stale or not bundled?"
    FAIL=1
  fi
fi

for n in $LATEST; do
  # find the route dir for this journal number — handles both
  # suffixed (journal-471-counterpoint) and suffix-less (journal-348) dirs
  dir=$(ls -d src/routes/writing/journal-${n}-* 2>/dev/null | head -1)
  [ -z "$dir" ] && dir=$(ls -d src/routes/writing/journal-${n} 2>/dev/null | head -1)
  if [ -z "$dir" ]; then
    echo "  ⚠️  J-$n: no route dir locally (skipping)"
    continue
  fi
  slug=$(basename "$dir")
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE/writing/$slug")
  if [ "$code" = "200" ]; then
    echo "  ✅ J-$n ($slug): 200"
  else
    echo "  ❌ J-$n ($slug): HTTP $code"
    FAIL=1
  fi
done

# Hand-built +page.svelte journal pages — these bypass the md/svx pipeline and
# share a different (older) layout API. Catches the 2026-08-06 class: all five
# svelte pages 500'd (wrapper broke: metadata undefined / title not defined)
# while the md/svx checks stayed green.
SVELTE_JOURNALS=$(ls -d src/routes/writing/journal-*/ 2>/dev/null | while read -r d; do
  [ -f "$d/+page.svelte" ] && basename "$d"
done)
if [ -n "$SVELTE_JOURNALS" ]; then
  echo "  — hand-built svelte pages: $(echo $SVELTE_JOURNALS | tr '\n' ' ')"
  for slug in $SVELTE_JOURNALS; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE/writing/$slug")
    if [ "$code" = "200" ]; then
      echo "  ✅ $slug (svelte): 200"
    else
      echo "  ❌ $slug (svelte): HTTP $code — wrapper/layout API drift?"
      FAIL=1
    fi
  done
fi

# Wrapper-based essay pages (non-journal routes, same component as above)
for slug in $WRAPPER_ESSAYS; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE/writing/$slug")
  if [ "$code" = "200" ]; then
    echo "  ✅ $slug (wrapper essay): 200"
  else
    echo "  ❌ $slug (wrapper essay): HTTP $code — wrapper/layout API drift?"
    FAIL=1
  fi
done

# Registered plain-md essays (non-journal, non-wrapper routes)
for slug in $REGISTERED_ESSAYS; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE/writing/$slug")
  if [ "$code" = "200" ]; then
    echo "  ✅ $slug (registered essay): 200"
  else
    echo "  ❌ $slug (registered essay): HTTP $code — registration/silent-404 class?"
    FAIL=1
  fi
done

# Book sets (Watches + Words): spines + artifact routes
for slug in $BOOK_ROUTES; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE/writing/$slug")
  if [ "$code" = "200" ]; then
    echo "  ✅ $slug (book route): 200"
  else
    echo "  ❌ $slug (book route): HTTP $code — book route missing/404?"
    FAIL=1
  fi
done

if [ "$FAIL" = "0" ]; then
  echo "✅ Smoke test passed"
else
  echo "❌ Smoke test FAILED — pages missing on live site"
  exit 1
fi
