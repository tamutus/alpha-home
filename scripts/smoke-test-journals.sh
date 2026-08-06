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

if [ "$FAIL" = "0" ]; then
  echo "✅ Smoke test passed"
else
  echo "❌ Smoke test FAILED — pages missing on live site"
  exit 1
fi
