#!/usr/bin/env python3
"""
Compute per-season journal word counts for Star Trek series.

Scans journal markdown files in src/routes/writing/, extracts season info
from frontmatter, tags, headings, and content references, and accumulates
word counts per (series, season).

Output: data/season-word-counts.json
"""

import os
import re
import json
import sys

WRITING_DIR = "src/routes/writing"
OUTPUT_FILE = "data/season-word-counts.json"


def extract_metadata(text, dirname):
    meta = {"season": None, "series": None}

    # Get journal number from directory name
    journal_num = None
    jm = re.search(r"journal-(\d+)", dirname)
    if jm:
        journal_num = int(jm.group(1))

    # Helper: map series name string
    def map_series(raw):
        raw = raw.strip().lower()
        m = {
            "voyager": "Voyager", "ds9": "DS9", "deep space nine": "DS9",
            "tng": "TNG", "the next generation": "TNG",
        }
        return m.get(raw, None)

    # --- Try frontmatter ---
    fm_match = re.search(r"^---\n(.*?)\n---", text, re.DOTALL)
    if fm_match:
        fm_text = fm_match.group(1)
        fm_season = re.search(r"season:\s*(\d+)", fm_text)
        fm_series = re.search(r'series:\s*"?([\w\s]+)"?', fm_text)
        if fm_season:
            meta["season"] = int(fm_season.group(1))
        if fm_series:
            meta["series"] = map_series(fm_series.group(1))

    if meta["series"] and meta["season"]:
        return meta

    # --- Body text analysis (after frontmatter) ---
    body = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.DOTALL)
    first_lines = "\n".join(body.split("\n")[:10])
    full_search = text[:2000]  # search wider area (frontmatter + title + tags)

    # Pattern: series name + S?E? in title (e.g. "DS9 S7E07 — ...", "Voyager S1E06 — ...")
    title_ep = re.search(
        r"(Voyager|DS9|TNG|Deep Space Nine)\s+S(\d+)E(\d+)",
        full_search, re.IGNORECASE,
    )
    if title_ep:
        if not meta["season"]:
            meta["season"] = int(title_ep.group(2))
        if not meta["series"]:
            meta["series"] = map_series(title_ep.group(1))

    # S?E? pattern anywhere in first lines
    if not meta["season"]:
        ep_ref = re.search(r"\bS(\d+)E(\d+)\b", first_lines)
        if ep_ref:
            meta["season"] = int(ep_ref.group(1))
            # Also infer series from prefix
            series_prefix = re.search(
                r"(DS9|Voyager|TNG)\s+S" + ep_ref.group(1) + r"E",
                first_lines, re.IGNORECASE,
            )
            if series_prefix and not meta["series"]:
                meta["series"] = map_series(series_prefix.group(1))

    # Tags: season-1, s1e14, s2e02
    if not meta["season"]:
        tag_season = re.search(r"season-(\d+)", text)
        if tag_season:
            meta["season"] = int(tag_season.group(1))

    if not meta["season"]:
        tag_ep = re.search(r's(\d+)e(\d+)', text, re.IGNORECASE)
        if tag_ep:
            meta["season"] = int(tag_ep.group(1))

    # Heading pattern: "# DS9 Journal — Entry 343" or "# Voyager S2E02 ..."
    if not meta["series"]:
        heading = re.search(r"^#\s+(DS9|Voyager|TNG)\b", first_lines, re.IGNORECASE)
        if heading:
            meta["series"] = map_series(heading.group(1))

    # Infer series from journal number
    if not meta["series"] and journal_num:
        if journal_num <= 228:
            meta["series"] = "TNG"
        elif journal_num <= 393:
            meta["series"] = "DS9"
        else:
            meta["series"] = "Voyager"

    # Last resort: full body search for S?E?
    if meta["series"] == "DS9" and not meta["season"]:
        broad = re.search(r"\bS(\d+)E(\d+)\b", body)
        if broad:
            meta["season"] = int(broad.group(1))

    return meta


def word_count(text):
    text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.DOTALL)
    return len(text.split())


def main():
    results = {}

    total = 0
    matched = 0
    unmatched = []

    for d in sorted(os.listdir(WRITING_DIR)):
        if not d.startswith("journal-"):
            continue
        md_path = os.path.join(WRITING_DIR, d, "+page.md")
        if not os.path.exists(md_path):
            continue

        total += 1
        text = open(md_path).read()
        meta = extract_metadata(text, d)
        wc = word_count(text)

        if meta["series"] and meta["season"]:
            matched += 1
            key = (meta["series"], meta["season"])
            if key not in results:
                results[key] = {"words": 0, "journals": 0}
            results[key]["words"] += wc
            results[key]["journals"] += 1
        else:
            unmatched.append(f"  [?] {d}: series={meta['series']}, season={meta['season']}")

    for u in unmatched:
        print(u, file=sys.stderr)

    output = {"seasons": []}
    for (series, season), data in sorted(results.items()):
        output["seasons"].append({
            "series": series, "season": season,
            "words": data["words"], "journals": data["journals"],
        })

    output["_meta"] = {"total_checked": total, "matched": matched, "unmatched": len(unmatched)}

    series_order = {"Voyager": 0, "DS9": 1, "TNG": 2}
    output["seasons"].sort(key=lambda x: (series_order.get(x["series"], 9), x["season"]))

    os.makedirs("data", exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {OUTPUT_FILE}")
    print(f"   {total} journals scanned")
    print(f"   {matched} matched to a season")
    print(f"   {len(unmatched)} unmatched")
    print(f"   {len(results)} season-series groups")
    for s in output["seasons"]:
        print(f"   {s['series']} S{s['season']}: {s['words']:,} words ({s['journals']} journals)")


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    main()
