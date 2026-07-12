#!/usr/bin/env bash
# Sync star-trek-progress.json after a Star Trek slot
# Uses jq to preserve full structure while updating metadata fields.
#
# Usage:
#   bash scripts/sync-star-trek-progress.sh DS9 6 17 "Wrongs Darker Than Death or Night" 333
#
# Arguments: <series> <season> <ep-num> <ep-title> <entry-num> [next-ep-title]
#
# The progress file at data/star-trek-progress.json is edited in place.
# Season/episode values for "watched" array are derived from the existing
# structure (latest season block gets the new entry appended).

set -euo pipefail

PROGRESS_FILE="$(cd "$(dirname "$0")/.." && pwd)/data/star-trek-progress.json"

if [ ! -f "$PROGRESS_FILE" ]; then
  echo "ERROR: Progress file not found at $PROGRESS_FILE"
  exit 1
fi

SERIES="${1:-}"
SEASON="${2:-}"
EP_NUM="${3:-}"
EP_TITLE="${4:-}"
ENTRY_NUM="${5:-}"
NEXT_EP_TITLE="${6:-}"

if [ -z "$SERIES" ] || [ -z "$SEASON" ] || [ -z "$EP_NUM" ] || [ -z "$EP_TITLE" ]; then
  echo "Usage: $0 <series> <season> <ep-num> <ep-title> <entry-num> [next-ep-title]"
  echo "Example: $0 DS9 6 17 'Wrongs Darker Than Death or Night' 333"
  exit 1
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EP_LABEL="S${SEASON}E${EP_NUM}"

# Format label for display (single digits vs two-digit padding)
if [ ${#EP_NUM} -eq 1 ]; then
  EP_LABEL_DISPLAY="S${SEASON}E${EP_NUM}"
else
  EP_LABEL_DISPLAY="S${SEASON}E${EP_NUM}"
fi

# Calculate next episode label
NEXT_EP_NUM=$((10#$EP_NUM + 1))
NEXT_EP_LABEL="S${SEASON}E${NEXT_EP_NUM}"

# Build jq filter
JQFILTER="
  .lastUpdated = \"${TIMESTAMP}\"
  | .lastEpisode = \"${SERIES} ${EP_LABEL_DISPLAY} — ${EP_TITLE}\"
  | .nextEpisode = \"${SERIES} ${NEXT_EP_LABEL}\"
  | .journalEntries = ${ENTRY_NUM}
  | .ds9.currentEpisode = \"${EP_LABEL_DISPLAY}: ${EP_TITLE}\"
  | .ds9.nextEpisode = \"${NEXT_EP_LABEL}\"
  | .ds9.lastEntry = ${ENTRY_NUM}
  | ._updated = \"${TIMESTAMP}\"
  | ._note = \"Updated to ${EP_LABEL_DISPLAY}.\"
  | .lastWatched = \"${EP_TITLE} (${EP_LABEL_DISPLAY})\"
  | .latestEpisodeNumber = ${EP_NUM}
  | .latestEpisodeTitle = \"${EP_TITLE}\"
  | .latestEpisodeSeasonEp = \"${EP_LABEL_DISPLAY}\"
  | .nextEpisodeNumber = ${NEXT_EP_NUM}
"

if [ -n "$NEXT_EP_TITLE" ]; then
  JQFILTER="${JQFILTER} | .nextEpisodeTitle = \"${NEXT_EP_TITLE}\" | .ds9.nextEpisode = \"${NEXT_EP_LABEL}: ${NEXT_EP_TITLE}\" | .nextEpisodeSeasonEp = \"${NEXT_EP_LABEL}\""
fi

# Also add to watched array if a matching season block exists
JQFILTER="${JQFILTER} | (.watched[] | select(.series == \"${SERIES}\" and .season == ${SEASON}) | .episodes) += [\"${EP_LABEL_DISPLAY}\"]"

jq "$JQFILTER" "$PROGRESS_FILE" > "${PROGRESS_FILE}.tmp" && mv "${PROGRESS_FILE}.tmp" "$PROGRESS_FILE"

# Recalculate total watched and percent
TOTAL=$(jq '[.watched[].episodes | length] | add' "$PROGRESS_FILE")
PERCENT=$(( TOTAL * 100 / 176 ))

JQFILTER2="
  .totalEpisodesWatched = ${TOTAL}
  | .percentComplete = ${PERCENT}
  | ._note = \"Updated to ${EP_LABEL_DISPLAY}. Progress tracking: ${TOTAL}/176 episodes (${PERCENT}%).\"
  | .nextEpisode = \"${SERIES} ${NEXT_EP_LABEL}: \" + .nextEpisodeTitle
"
jq "$JQFILTER2" "$PROGRESS_FILE" > "${PROGRESS_FILE}.tmp" && mv "${PROGRESS_FILE}.tmp" "$PROGRESS_FILE"

echo "✅ Progress synced: ${EP_LABEL_DISPLAY} — ${EP_TITLE} (entry ${ENTRY_NUM})"
echo "   Total watched: ${TOTAL}/176 (${PERCENT}%)"
