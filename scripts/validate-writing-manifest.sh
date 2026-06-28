#!/usr/bin/env bash
# validate-writing-manifest.sh
# Cross-validate writing-data.js entries against route directories.
# Detects: routes without data, data without routes, and reports both.
#
# Usage: bash scripts/validate-writing-manifest.sh
# Exit code: 0 = clean, 1 = mismatches found

set -euo pipefail

cd "$(dirname "$0")/.."

WRITING_DATA="src/lib/writing-data.js"
ROUTES_DIR="src/routes/writing"

errors=0

# Extract slugs from writing-data.js
grep -oP 'slug:\s*"\K[^"]+' "$WRITING_DATA" | sort > /tmp/wd-slugs.txt

# Extract route directory names (basename of each subdirectory)
ls -d "$ROUTES_DIR"/*/ 2>/dev/null | awk -F/ '{print $(NF-1)}' | sort > /tmp/route-slugs.txt

# Check: routes without data entries
orphaned_routes=$(comm -23 /tmp/route-slugs.txt /tmp/wd-slugs.txt)
if [ -n "$orphaned_routes" ]; then
    echo "❌ ROUTES WITHOUT DATA ENTRIES:"
    while IFS= read -r slug; do
        echo "   → src/routes/writing/$slug/ exists but is not registered in $WRITING_DATA"
        errors=$((errors + 1))
    done <<< "$orphaned_routes"
fi

# Check: data entries without routes
orphaned_data=$(comm -23 /tmp/wd-slugs.txt /tmp/route-slugs.txt)
if [ -n "$orphaned_data" ]; then
    echo "❌ DATA ENTRIES WITHOUT ROUTES:"
    while IFS= read -r slug; do
        echo "   → $slug registered in $WRITING_DATA but has no route at $ROUTES_DIR/$slug/"
        errors=$((errors + 1))
    done <<< "$orphaned_data"
fi

# Check: bare .md/.svelte files in routes/writing/ (not directory-wrapped)
# Skip +page.* files which are valid SvelteKit content
bare_files=()
# Use a temp file approach instead of process substitution (/dev/fd/63 compat)
find "$ROUTES_DIR" -maxdepth 1 \( -name '*.md' -o -name '*.svelte' \) -print0 2>/dev/null > /tmp/bare-files.txt
while IFS= read -r -d '' f; do
    basename_f=$(basename "$f")
    case "$basename_f" in
        +page.*|+server.*|+layout.*|+error.*|+page.server.*)
            ;;
        *)
            bare_files+=("$f")
            ;;
    esac
done < /tmp/bare-files.txt

if [ ${#bare_files[@]} -gt 0 ]; then
    echo "❌ BARE FILES IN ROUTES DIR (should be directory-wrapped):"
    for f in "${bare_files[@]}"; do
        echo "   → $f"
        errors=$((errors + 1))
    done
fi

if [ "$errors" -eq 0 ]; then
    echo "✅ Writing manifest clean — all $ROUTES_DIR routes match $WRITING_DATA entries"
    exit 0
else
    echo ""
    echo "Found $errors issue(s). Fix before deploying."
    exit 1
fi
