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

echo "🩺 Smoke-testing latest journals: $LATEST (against $BASE)"

for n in $LATEST; do
  # find the route dir for this journal number
  dir=$(ls -d src/routes/writing/journal-${n}-* 2>/dev/null | head -1)
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
