#!/usr/bin/env bash
# update-balance-history.sh
# Appends the current DeepSeek balance snapshot to balance-history.json.
# Reads from alpha-home/data/deepseek-balance.json or fallback to workspace root.
# Creates the history file if it doesn't exist.
#
# Usage: bash scripts/update-balance-history.sh
# Exit code: 0 always (non-fatal to build)

set -euo pipefail

cd "$(dirname "$0")/.."

HISTORY_FILE="data/balance-history.json"
BALANCE_FILE="data/deepseek-balance.json"
WORKSPACE_BALANCE="../data/deepseek-balance.json"

# Read current balance — workspace copy first (updated hourly by bootstrap), then local
RAW=""
if [ -f "$WORKSPACE_BALANCE" ]; then
  RAW=$(cat "$WORKSPACE_BALANCE")
elif [ -f "$BALANCE_FILE" ]; then
  RAW=$(cat "$BALANCE_FILE")
fi

if [ -z "$RAW" ]; then
  echo "[balance-history] No balance data found — skipping"
  exit 0
fi

# Extract total_balance
CURRENT=$(echo "$RAW" | python3 -c "import sys,json; d=json.load(sys.stdin); bi=d.get('balance_infos',[{}])[0]; print(bi.get('total_balance',''))" 2>/dev/null || echo "")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [ -z "$CURRENT" ]; then
  echo "[balance-history] Could not parse balance — skipping"
  exit 0
fi

# Read existing history or initialize
if [ -f "$HISTORY_FILE" ]; then
  HISTORY=$(cat "$HISTORY_FILE")
else
  HISTORY='{"entries":[]}'
fi

# Check if we already have an entry for today (to avoid duplicates on rebuild)
TODAY=$(date -u +"%Y-%m-%d")
DUPLICATE=$(echo "$HISTORY" | python3 -c "
import sys, json
h = json.load(sys.stdin)
today = '$TODAY'
for e in h['entries']:
    if e['date'] == today:
        print('found')
        break
" 2>/dev/null || echo "")

if [ "$DUPLICATE" = "found" ]; then
  echo "[balance-history] Already have an entry for $TODAY — updating in-place"
  UPDATED=$(echo "$HISTORY" | python3 -c "
import sys, json
h = json.load(sys.stdin)
today = '$TODAY'
new_val = '$CURRENT'
for i, e in enumerate(h['entries']):
    if e['date'] == today:
        h['entries'][i]['balance'] = new_val
        h['entries'][i]['updatedAt'] = '$TIMESTAMP'
        break
print(json.dumps(h, indent=2))
" 2>/dev/null)
  echo "$UPDATED" > "$HISTORY_FILE"
else
  echo "[balance-history] Appending new entry for $TODAY — \$$CURRENT"
  UPDATED=$(echo "$HISTORY" | python3 -c "
import sys, json
h = json.load(sys.stdin)
h['entries'].append({'date': '$TODAY', 'balance': '$CURRENT', 'updatedAt': '$TIMESTAMP'})
print(json.dumps(h, indent=2))
" 2>/dev/null)
  echo "$UPDATED" > "$HISTORY_FILE"
fi

echo "[balance-history] Updated — \$$CURRENT"
