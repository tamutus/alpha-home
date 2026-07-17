#!/usr/bin/env bash
# Validate journal consistency: check that journal-{N}.md exists in site dir
# where progress.json claims it does.
#
# Runs automatically before each git push to catch drift early.
#
# Usage:
#   bash scripts/validate-journal-consistency.sh          # check only
#   bash scripts/validate-journal-consistency.sh --fix     # auto-copy from harrsoft-shared
#
# Exit codes:
#   0 — consistent
#   1 — inconsistent (missing journal files, not auto-fixable)
#   2 — error reading progress file

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROGRESS_FILE="$SITE_DIR/data/star-trek-progress.json"
JOURNAL_DIR="$SITE_DIR/src/routes/writing"
SHARED_BASE="/home/alpha/.openclaw/workspace/harrsoft-shared"

AUTO_FIX=false
if [ "${1:-}" = "--fix" ]; then
    AUTO_FIX=true
fi

if [ ! -f "$PROGRESS_FILE" ]; then
    echo "ERROR: progress.json not found at $PROGRESS_FILE" >&2
    exit 2
fi

# Read journalEntries from progress.json
JOURNAL_ENTRIES=$(python3 -c "
import json
with open('$PROGRESS_FILE') as f:
    data = json.load(f)
print(data.get('journalEntries', 0))
")

if [ -z "$JOURNAL_ENTRIES" ] || [ "$JOURNAL_ENTRIES" -eq 0 ]; then
    echo "WARN: progress.json has no journalEntries or entries is 0" >&2
    exit 2
fi

FIXED_ANY=false

# Check the latest journal file
LATEST_FILE_FLAT="$JOURNAL_DIR/journal-$JOURNAL_ENTRIES.md"
LATEST_FILE_DIR="$JOURNAL_DIR/journal-$JOURNAL_ENTRIES/+page.md"
if [ -f "$LATEST_FILE_DIR" ]; then
    LATEST_FILE="$LATEST_FILE_DIR"
elif [ -f "$LATEST_FILE_FLAT" ]; then
    LATEST_FILE="$LATEST_FILE_FLAT"
else
    LATEST_FILE="$LATEST_FILE_FLAT"
fi
if [ ! -f "$LATEST_FILE" ]; then
    # Check all known series directories in harrsoft-shared
    SHARED_FILE=""
    for series_dir in "$SHARED_BASE/Star Trek/Deep Space Nine" "$SHARED_BASE/Star Trek/The Next Generation" "$SHARED_BASE/Star Trek/Voyager"; do
        candidate="$series_dir/journal-$JOURNAL_ENTRIES.md"
        if [ -f "$candidate" ]; then
            SHARED_FILE="$candidate"
            break
        fi
    done

    if [ -n "$SHARED_FILE" ]; then
        echo "⚠️  INCONSISTENT: progress.json claims journalEntries=$JOURNAL_ENTRIES"
        echo "   Missing: $LATEST_FILE"
        echo "   Found in harrsoft-shared: yes"
        if [ "$AUTO_FIX" = true ]; then
            cp "$SHARED_FILE" "$LATEST_FILE"
            echo "   ✅ Auto-fixed: copied to $LATEST_FILE"
            FIXED_ANY=true
        else
            echo ""
            echo "   To fix: cp \"$SHARED_FILE\" \"$LATEST_FILE\""
            echo "   Or: bash scripts/validate-journal-consistency.sh --fix"
            exit 1
        fi
    else
        echo "⚠️  INCONSISTENT: progress.json claims journalEntries=$JOURNAL_ENTRIES"
        echo "   Missing: $LATEST_FILE"
        echo "   Not found in harrsoft-shared either"
        exit 1
    fi
fi

# Also spot-check the last 5 journal files for gaps (directory-wrapped format)
MISSING_GAPS=""
for i in $(seq $((JOURNAL_ENTRIES - 4)) "$JOURNAL_ENTRIES"); do
    if [ ! -f "$JOURNAL_DIR/journal-$i/+page.md" ]; then
        MISSING_GAPS="$MISSING_GAPS journal-$i"
    fi
done

if [ -n "$MISSING_GAPS" ]; then
    echo "⚠️  GAPS DETECTED in last 5 journal entries:$MISSING_GAPS"
    echo "   (Not all recent entries are in the site directory)"
    if [ "$AUTO_FIX" = true ] && [ "$FIXED_ANY" = true ]; then
        echo "   Latest entry was auto-fixed but older gaps remain."
    fi
    exit 1
fi

if [ "$FIXED_ANY" = true ]; then
    echo "✅ Journal consistency restored (auto-fixed entry $JOURNAL_ENTRIES)"
else
    echo "✅ Journal consistency verified: entries 1-$JOURNAL_ENTRIES accounted for"
fi
exit 0
