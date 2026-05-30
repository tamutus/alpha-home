#!/usr/bin/env bash
# manage-links.sh — add/remove/list links from src/data/links.json
# Usage:
#   bash scripts/manage-links.sh list                    # show current links
#   bash scripts/manage-links.sh add                     # interactive add
#   bash scripts/manage-links.sh add <title> <url> "desc" tag1,tag2  # inline add
#   bash scripts/manage-links.sh add --interactive       # prompted add

LINKS_FILE="src/data/links.json"
cd "$(dirname "$0")/.." || exit 1

list() {
  echo "📎 Links ($(jq length "$LINKS_FILE")):"
  jq -r 'to_entries[] | "\(.key+1). \(.value.title) — \(.value.url)\n   \(.value.tags | join(", "))"' "$LINKS_FILE"
}

add_interactive() {
  echo "Add a link:"
  read -rp "Title: " title
  read -rp "URL: " url
  read -rp "Description: " desc
  read -rp "Tags (comma-separated): " tags_raw
  IFS=',' read -ra tags <<< "$tags_raw"
  tags_json=$(printf '"%s",' "${tags[@]}" | sed 's/,$//')
  new_entry=$(jq -n --arg t "$title" --arg u "$url" --arg d "$desc" \
    '{title: $t, url: $u, desc: $d, tags: []}')
  new_entry=$(jq --arg t "$title" --arg u "$url" --arg d "$desc" \
    '.title = $t | .url = $u | .desc = $d' <<< '{}')
  new_entry=$(jq -n --arg t "$title" --arg u "$url" --arg d "$desc" \
    --argjson tags "[$(echo "$tags_json")]" \
    '{title: $t, url: $u, desc: $d, tags: $tags}')
  tmp=$(mktemp)
  jq --argjson entry "$new_entry" '. += [$entry]' "$LINKS_FILE" > "$tmp" && mv "$tmp" "$LINKS_FILE"
  echo "✅ Added: $title"
}

add_inline() {
  title="$1"
  url="$2"
  desc="$3"
  tags_raw="$4"
  IFS=',' read -ra tags <<< "$tags_raw"
  tags_json=$(printf '"%s",' "${tags[@]}" | sed 's/,$//')
  new_entry=$(jq -n --arg t "$title" --arg u "$url" --arg d "$desc" \
    --argjson tags "[$(echo "$tags_json")]" \
    '{title: $t, url: $u, desc: $d, tags: $tags}')
  tmp=$(mktemp)
  jq --argjson entry "$new_entry" '. += [$entry]' "$LINKS_FILE" > "$tmp" && mv "$tmp" "$LINKS_FILE"
  echo "✅ Added: $title"
}

case "${1:-list}" in
  list) list ;;
  add)
    shift
    if [ "$1" = "--interactive" ] || [ $# -eq 0 ]; then
      add_interactive
    elif [ $# -ge 3 ]; then
      add_inline "$@"
    else
      echo "Usage: manage-links.sh add <title> <url> \"desc\" tag1,tag2"
      echo "   or: manage-links.sh add --interactive"
      exit 1
    fi
    ;;
  *) echo "Usage: manage-links.sh [list|add]" ;;
esac
