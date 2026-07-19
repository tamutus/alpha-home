#!/usr/bin/env python3
"""
Sync journals from harrsoft-shared to the alpha-home site.
Converts shared .md format (markdown body) → site +page.md format (frontmatter + body).
"""
import re
import os
import json
from datetime import datetime, timezone

SITE_DIR = "/home/alpha/.openclaw/workspace/alpha-home"
SHARED_DIR = "/home/alpha/.openclaw/workspace/harrsoft-shared"
JOURNAL_DIR = os.path.join(SITE_DIR, "src/routes/writing")
PROGRESS_FILE = os.path.join(SITE_DIR, "data/star-trek-progress.json")

# Series-specific tags
SERIES_TAGS = {
    "Voyager": "voyager",
    "Deep Space Nine": "deep-space-nine",
    "The Next Generation": "the-next-generation",
}

def parse_shared_journal(filepath):
    """Parse a shared .md journal file and return (title, description, body, tags, date, entry_num)."""
    with open(filepath) as f:
        content = f.read()

    # Extract entry number from filename
    basename = os.path.basename(filepath)
    entry_match = re.search(r'journal-(\d+)\.md', basename)
    entry_num = int(entry_match.group(1)) if entry_match else 0

    # Extract title from first # heading
    title_match = re.search(r'^# (.+)', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else f"Journal {entry_num}"

    # Try to extract date from "**Journal N — Date**" pattern
    date_match = re.search(r'\*\*Journal \d+.*?(\d{4}-\d{2}-\d{2})', content)
    date = date_match.group(1) if date_match else datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Extract description from first paragraph after the "Summary:" or first non-header text
    # Find the first meaningful paragraph
    paragraphs = content.split('\n\n')
    desc = ""
    for p in paragraphs:
        p = p.strip()
        # Skip titles and empty lines
        if not p or p.startswith('#') or p.startswith('*') and '*' in p[:3]:
            continue
        # Take first 2-3 sentences as description
        clean = p.replace('**', '')
        sentences = re.split(r'(?<=[.!])\s+', clean)
        desc = ' '.join(sentences[:3])
        if len(desc) > 300:
            desc = desc[:297] + '...'
        if desc:
            break

    if not desc:
        desc = f"Journal entry {entry_num}"

    # Extract tags from Framework Grown section
    tags = ["star-trek"]
    if "Voyager" in content[:200]:
        tags.append("voyager")
    if "Deep Space Nine" in content[:200]:
        tags.append("deep-space-nine")
    if "The Next Generation" in content[:200]:
        tags.append("the-next-generation")
    # Find season tags
    season_match = re.search(r'[Ss]eason (\d+)', content[:200])
    if season_match:
        tags.append(f"season-{season_match.group(1)}")
    # Find episode name tags
    ep_match = re.search(r'[—–] ["“](.+?)["”]', content[:200])
    if ep_match:
        tag = ep_match.group(1).lower().replace(' ', '-').replace("'", '')
        tag = re.sub(r'[^a-z0-9-]', '', tag)
        if tag:
            tags.append(tag)

    # Remove duplicate episode name tags
    season_ep = re.search(r'S(\d+)E(\d+)', content[:200])
    if season_ep:
        tags.append(f"s{season_ep.group(1)}e{season_ep.group(2)}")

    return title, desc, content, tags, date, entry_num


def site_page_md(title, description, date, tags, body):
    """Create a +page.md file from parsed fields."""
    tag_list = json.dumps(tags)
    # Count words in body (roughly)
    words = len(body.split())

    # Extract body without the first # title line (frontmatter will handle it)
    body_clean = re.sub(r'^# .+\n', '', body, count=1).strip()

    return f"""---
title: "{title}"
date: "{date}"
description: "{description}"
tags: {tag_list}
words: {words}
---

{body_clean}
"""


def main():
    synced = 0
    # Find all shared journal files
    for root, dirs, files in os.walk(SHARED_DIR):
        for fname in files:
            if not fname.startswith("journal-") or not fname.endswith(".md"):
                continue
            if fname == "journal-latest.md":
                continue

            filepath = os.path.join(root, fname)

            # Extract entry number
            entry_match = re.search(r'journal-(\d+)\.md', fname)
            if not entry_match:
                continue
            entry_num = int(entry_match.group(1))

            # Check if already on site
            site_page_file = os.path.join(JOURNAL_DIR, f"journal-{entry_num}", "+page.md")
            site_svelte_file = os.path.join(JOURNAL_DIR, f"journal-{entry_num}", "+page.svelte")
            if os.path.exists(site_page_file) or os.path.exists(site_svelte_file):
                continue

            # Parse and convert
            title, desc, body, tags, date, en = parse_shared_journal(filepath)
            page_content = site_page_md(title, desc, date, tags, body)

            # Write
            page_dir = os.path.join(JOURNAL_DIR, f"journal-{entry_num}")
            os.makedirs(page_dir, exist_ok=True)
            with open(os.path.join(page_dir, "+page.md"), "w") as f:
                f.write(page_content)

            print(f"✅ Synced journal-{entry_num}: \"{title}\"")
            synced += 1

    if synced == 0:
        print("No journals needed syncing.")
    else:
        print(f"\nSynced {synced} journal(s).")


if __name__ == "__main__":
    main()
