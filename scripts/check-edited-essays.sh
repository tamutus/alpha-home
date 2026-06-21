#!/usr/bin/env bash
# check-edited-essays.sh
# Build-time script: scans git history for each essay route directory.
# Writes a JSON object (slug → last-edit-timestamp) for essays edited within last 7 days.
set -euo pipefail
cd "$(dirname "$0")/.."

NOW=$(date +%s)
SEVEN_DAYS=$((NOW - 604800))
OUTPUT="src/lib/generated/edited-essays.json"
mkdir -p "$(dirname "$OUTPUT")"

# Gather entries
entries=""
sep=""
for dir in src/routes/writing/*/; do
  slug=$(basename "$dir")
  [ "$slug" = "_page" ] && continue
  ts=$(git log -1 --format="%at" -- "$dir" 2>/dev/null || echo "0")
  [ -z "$ts" ] && ts=0
  if [ "$ts" -gt "$SEVEN_DAYS" ]; then
    entries="${entries}${sep}\"${slug}\": ${ts}"
    sep=", "
  fi
done

printf '{ %s }\n' "$entries" > "$OUTPUT"
echo "[check-edited] Wrote $(wc -c < "$OUTPUT") bytes to $OUTPUT"
