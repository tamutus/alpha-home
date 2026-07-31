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

# Check if a journal entry exists (any format: flat, dir, or dir-with-slug)
journal_exists() {
    local n="$1"
    # Flat file: journal-N.md
    if [ -f "$JOURNAL_DIR/journal-$n.md" ]; then
        return 0
    fi
    # Dir without slug: journal-N/+page.md or .svelte or .svx
    if [ -f "$JOURNAL_DIR/journal-$n/+page.md" ] || [ -f "$JOURNAL_DIR/journal-$n/+page.svelte" ] || [ -f "$JOURNAL_DIR/journal-$n/+page.svx" ]; then
        return 0
    fi
    # Dir with slug: journal-N-slug/+page.md or .svelte or .svx (use non-empty glob match)
    local matches
    matches=$(ls -d "$JOURNAL_DIR/journal-$n-"*/+page.md "$JOURNAL_DIR/journal-$n-"*/+page.svelte "$JOURNAL_DIR/journal-$n-"*/+page.svx 2>/dev/null | head -1)
    if [ -n "$matches" ]; then
        return 0
    fi
    return 1
}

# Get path for a journal entry (any format), for display purposes
journal_path() {
    local n="$1"
    if [ -f "$JOURNAL_DIR/journal-$n.md" ]; then
        echo "$JOURNAL_DIR/journal-$n.md"
    elif [ -f "$JOURNAL_DIR/journal-$n/+page.md" ]; then
        echo "$JOURNAL_DIR/journal-$n/+page.md"
    elif [ -f "$JOURNAL_DIR/journal-$n/+page.svelte" ]; then
        echo "$JOURNAL_DIR/journal-$n/+page.svelte"
    else
        local matches
        matches=$(ls -d "$JOURNAL_DIR/journal-$n-"*/+page.md "$JOURNAL_DIR/journal-$n-"*/+page.svelte 2>/dev/null | head -1)
        if [ -n "$matches" ]; then
            echo "$matches"
        else
            echo "$JOURNAL_DIR/journal-$n (missing)"
        fi
    fi
}

# Check the latest journal file
if ! journal_exists "$JOURNAL_ENTRIES"; then
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
        echo "   Missing: $(journal_path "$JOURNAL_ENTRIES")"
        echo "   Found in harrsoft-shared: yes"
        if [ "$AUTO_FIX" = true ]; then
            TARGET_DIR="$JOURNAL_DIR/journal-$JOURNAL_ENTRIES"
            mkdir -p "$TARGET_DIR"
            cp "$SHARED_FILE" "$TARGET_DIR/+page.md"
            echo "   ✅ Auto-fixed: copied to $TARGET_DIR/+page.md"
            FIXED_ANY=true
        else
            echo ""
            echo "   To fix: mkdir -p '$JOURNAL_DIR/journal-$JOURNAL_ENTRIES'; cp \"$SHARED_FILE\" '$JOURNAL_DIR/journal-$JOURNAL_ENTRIES/+page.md'"
            echo "   Or: bash scripts/validate-journal-consistency.sh --fix"
            exit 1
        fi
    else
        echo "⚠️  INCONSISTENT: progress.json claims journalEntries=$JOURNAL_ENTRIES"
        echo "   Missing: $(journal_path "$JOURNAL_ENTRIES")"
        echo "   Not found in harrsoft-shared either"
        exit 1
    fi
fi

# Also spot-check the last 5 journal files for gaps (all formats)
MISSING_GAPS=""
for i in $(seq $((JOURNAL_ENTRIES - 4)) "$JOURNAL_ENTRIES"); do
    if ! journal_exists "$i"; then
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
