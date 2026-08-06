#!/usr/bin/env python3
"""
Sync journals from harrsoft-shared to the alpha-home site.
Converts shared .md format (markdown body) → site +page.md format (frontmatter + body).
"""
import re
import os
import subprocess
import sys
import json
from datetime import datetime, timezone

SITE_DIR = "/home/alpha/.openclaw/workspace/alpha-home"
SHARED_DIR = "/home/alpha/.openclaw/workspace/harrsoft-shared"
JOURNAL_DIR = os.path.join(SITE_DIR, "src/routes/writing")
PROGRESS_FILE = os.path.join(SITE_DIR, "data/star-trek-progress.json")
WORDCOUNTS_FILE = os.path.join(SITE_DIR, "data/season-word-counts.json")

# The word-count regen has been missed twice historically (J-492 committed a
# day late; S4 stale 20,653w vs 21,854w) — same drift class as recentHighlights
# stage 2. Policy (2026-08-05): check-and-warn by default; auto-recompute only
# when THIS run added journals (the sync owns the pipeline after its own
# writes, but won't clobber a possibly in-progress manual state otherwise).
# See alpha-home/IDEAS.md → "season-word-counts auto-regen after journal sync".

def count_journal_routes():
    """Count journal route dirs with a page file — same semantics as
    compute-season-word-counts.py (journal-* dirs with +page.md/+page.svx)."""
    n = 0
    for d in os.listdir(JOURNAL_DIR):
        if not d.startswith("journal-"):
            continue
        dir_path = os.path.join(JOURNAL_DIR, d)
        if os.path.isdir(dir_path):
            if (os.path.exists(os.path.join(dir_path, "+page.md"))
                    or os.path.exists(os.path.join(dir_path, "+page.svx"))
                    or os.path.exists(os.path.join(dir_path, "+page.svelte"))):
                n += 1
        elif os.path.exists(dir_path):
            n += 1
    return n


def check_word_counts(synced):
    """Check season-word-counts.json freshness vs the live route tree.
    Warn on any drift; auto-recompute when this run added journals."""
    routes = count_journal_routes()
    try:
        with open(WORDCOUNTS_FILE) as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        print(f"⚠️  WORD-COUNTS CHECK: cannot read {WORDCOUNTS_FILE} ({e}) — "
              f"re-run python3 scripts/compute-season-word-counts.py")
        return
    recorded = data.get("_meta", {}).get("total_checked")

    if synced > 0:
        # This run added routes → counts are stale by construction. Recompute
        # is trivially safe (pure re-derivation from canonical routes).
        print(f"⚠️  WORD-COUNTS CHECK: {synced} journal(s) synced — recomputing season word counts")
        _run_word_count_compute()
        return

    if recorded is None or recorded != routes:
        print(f"\n⚠️  WORD-COUNTS CHECK: data/season-word-counts.json is stale "
              f"(routes={routes}, recorded={recorded}).")
        print(f"   Fix: python3 scripts/compute-season-word-counts.py, then commit "
              f"data/season-word-counts.json (HEARTBEAT slot 5 step).")
    else:
        print(f"✅ WORD-COUNTS CHECK: {routes} routes match recorded {recorded} — fresh.")


def _run_word_count_compute():
    """Run compute-season-word-counts.py in the site dir (safe, idempotent)."""
    import subprocess
    r = subprocess.run(
        [sys.executable, "scripts/compute-season-word-counts.py"],
        cwd=SITE_DIR, capture_output=True, text=True,
    )
    print(r.stdout.strip())
    if r.returncode != 0:
        print(r.stderr.strip(), file=sys.stderr)
        print("⚠️  WORD-COUNTS CHECK: recompute failed — re-run manually.")
    else:
        print(f"✅ WORD-COUNTS CHECK: recomputed data/season-word-counts.json — "
              f"commit it with the journal sync.")

# Series-specific tags
SERIES_TAGS = {
    "Voyager": "voyager",
    "Deep Space Nine": "deep-space-nine",
    "The Next Generation": "the-next-generation",
}

def parse_shared_journal(filepath):
    """Parse a shared .md journal file and return (title, description, body, tags, date, entry_num, has_frontmatter)."""
    with open(filepath) as f:
        content = f.read()

    # Extract entry number from filename — supports all conventions seen in the
    # shared repo: journal-448-waking-moments.md, J-496-the-voyager-conspiracy.md,
    # j-442-the-raven.md, 452.md, 465-in-the-flesh.md
    basename = os.path.basename(filepath)
    entry_match = re.search(r'(?:journal-|J-|j-)?(\d+)(?:-[a-z0-9-]+)?\.md', basename)
    entry_num = int(entry_match.group(1)) if entry_match else 0

    # Newer journals (J-493+) carry full YAML frontmatter already in site format.
    # Detect it and prefer those fields over regex scraping.
    has_frontmatter = False
    if content.startswith('---'):
        fm_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
        if fm_match:
            has_frontmatter = True
            fm = {}
            for line in fm_match.group(1).splitlines():
                m = re.match(r'^([a-zA-Z_]+):\s*(.*)$', line)
                if m:
                    fm[m.group(1)] = m.group(2).strip().strip('"')
            if fm.get('title'):
                title = fm['title']
            else:
                title_match = re.search(r'^# (.+)', content, re.MULTILINE)
                title = title_match.group(1).strip() if title_match else f"Journal {entry_num}"
            date = fm.get('date') or datetime.now(timezone.utc).strftime("%Y-%m-%d")
            tags = ["star-trek"]
            if fm.get('series'):
                tags.append(fm['series'].lower().replace(' ', '-'))
            if fm.get('season'):
                tags.append(f"season-{fm['season']}")
            if fm.get('episode'):
                tags.append(f"s{fm['season']}e{fm['episode']}")
            return title, '', content, tags, date, entry_num, has_frontmatter

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

    return title, desc, content, tags, date, entry_num, has_frontmatter


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
    # Find all shared journal files — any of the naming conventions:
    #   journal-448-waking-moments.md   (old style)
    #   J-496-the-voyager-conspiracy.md (new style, since ~J-444)
    #   j-442-the-raven.md / 452.md     (misc subdir stragglers)
    for root, dirs, files in os.walk(SHARED_DIR):
        for fname in files:
            if not fname.endswith(".md"):
                continue
            if not re.match(r'(?:journal-|J-|j-)?\d+(?:-[a-z0-9-]+)?\.md', fname):
                continue
            if fname == "journal-latest.md":
                continue

            filepath = os.path.join(root, fname)

            # Extract entry number
            entry_match = re.search(r'(?:journal-|J-|j-)?(\d+)', fname)
            if not entry_match:
                continue
            entry_num = int(entry_match.group(1))

            # Check if already on site — matches BOTH the plain `journal-{num}/`
            # convention and the named `journal-{num}-{slug}/` convention (the
            # site has used named dirs since ~J-424; syncing plain dirs for
            # those would create duplicate routes).
            # NOTE (2026-08-03 J-497 beat): a named dir that exists at all is
            # treated as already-synced — the old check required the page file
            # to exist, so a degraded bare-number stub in shared
            # (Writing/Journals/journal-450.md) could clobber the rich
            # handwritten journal-450-hunters/ route when the page file was
            # missing. The named route is the canonical one; never re-derive it.
            already = False
            for d in os.listdir(JOURNAL_DIR):
                if not d.startswith(f"journal-{entry_num}"):
                    continue
                if not d.startswith(f"journal-{entry_num}-") and d != f"journal-{entry_num}":
                    continue  # e.g. journal-4240 doesn't count
                # Named route exists → already synced, regardless of page file.
                already = True
                break
            if already:
                continue

            # Parse and convert
            title, desc, body, tags, date, en, has_fm = parse_shared_journal(filepath)

            # Newer journals already carry site-format frontmatter → copy as .svx
            # (Quote.svelte imports need .svx; frontmatter preserved verbatim).
            # Older journals get the regex-scraped conversion to +page.md.
            if has_fm:
                page_content = body  # frontmatter + body, already in site format
                page_name = "+page.svx"
            else:
                page_content = site_page_md(title, desc, date, tags, body)
                page_name = "+page.md"

            # Write — preserve the slug when the shared file has one, so routes
            # stay stable across re-syncs (journal-496 stays journal-496-...).
            slug_match = re.search(r'(?:journal-|J-|j-)?\d+-(.+?)(?:\.md)?$', fname)
            dir_name = f"journal-{entry_num}-{slug_match.group(1)}" if slug_match else f"journal-{entry_num}"
            page_dir = os.path.join(JOURNAL_DIR, dir_name)
            os.makedirs(page_dir, exist_ok=True)
            with open(os.path.join(page_dir, page_name), "w") as f:
                f.write(page_content)

            print(f"✅ Synced {dir_name}: \"{title}\"")
            synced += 1

    if synced == 0:
        print("No journals needed syncing.")
    else:
        print(f"\nSynced {synced} journal(s).")

    check_word_counts(synced)

    # Regenerate the complete journal index (src/lib/generated/journal-index.json)
    # so newly synced journals are walkable from the /writing front door even
    # before they're registered in writing-data.js (2026-08-06 index-gap fix).
    try:
        r = subprocess.run(
            [sys.executable, os.path.join(os.path.dirname(__file__), "build-journal-index.py")],
            capture_output=True, text=True, timeout=120,
        )
        if r.returncode == 0:
            print(r.stdout.strip())
        else:
            print(f"⚠️ journal-index regen failed: {r.stderr.strip()[:300]}")
    except Exception as e:
        print(f"⚠️ journal-index regen skipped: {e}")


if __name__ == "__main__":
    main()
