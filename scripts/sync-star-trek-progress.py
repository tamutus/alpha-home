#!/usr/bin/env python3
"""Sync star-trek-progress.json after a Star Trek slot.

Restructures the file to match the schema expected by /now +page.server.ts.
Run from alpha-home/ directory.

Usage:
    python3 scripts/sync-star-trek-progress.py <series> <season> <ep-num> <ep-title> <entry-num> [next-ep-title]

Examples:
    python3 scripts/sync-star-trek-progress.py "Deep Space Nine" 6 17 "Wrongs Darker Than Death or Night" 333 "Inquisition"
"""

import json
import sys
import os
import re
import glob
from datetime import datetime, timezone

USAGE = (
    "Usage: sync-star-trek-progress.py <series> <season> <ep-num> <ep-title> <entry-num> [next-ep-title]\n"
    "       sync-star-trek-progress.py 'Deep Space Nine' 6 17 'Wrongs Darker Than Death or Night' 333 'Inquisition'"
)


def derive_highlight_summary(entry_num, ep_title, ep_label, script_dir):
    """Stage 2: build a recentHighlights entry from the synced journal's
    ## section headers (the same skeleton the manual summaries are built
    from — see J-502..J-505 entries). Returns None when the journal route
    can't be found or has no ## sections; the caller then falls back to
    the manual-edit warning.

    Format: J-{N}: {Title} — {header1 ("quote"), header2, ...} ({ep_label})
    """
    repo_root = os.path.normpath(os.path.join(script_dir, ".."))
    candidates = []
    for pattern in (f"journal-{entry_num}-*", f"J-{entry_num}-*", f"j-{entry_num}-*"):
        candidates.extend(glob.glob(os.path.join(repo_root, "src", "routes", "writing", pattern)))
    if not candidates:
        return None
    page_file = None
    for name in ("+page.svx", "+page.md"):
        p = os.path.join(candidates[0], name)
        if os.path.exists(p):
            page_file = p
            break
    if not page_file:
        return None
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()
    # Skip YAML frontmatter (it can contain '## '-looking values? no, but be safe)
    if content.startswith('---'):
        content = content.split('---', 2)[-1]
    headers = [h.strip() for h in re.findall(r"^##\s+(.+)$", content, flags=re.MULTILINE) if h.strip()]
    # Skip the boilerplate cross-reference section — manual summaries never include it.
    headers = [h for h in headers if not h.lower().startswith("cross-reference")]
    if not headers:
        return None
    parts = []
    for h in headers:
        if " — " in h:
            title, tail = h.split(" — ", 1)
            title = title.strip()
            tail = tail.strip()
            m = re.match(r'^"(.+)"$', tail)
            if m:
                parts.append(f'{title} ("{m.group(1)}")')
            elif tail:
                parts.append(f'{title} — {tail}')
            else:
                parts.append(title)
        else:
            parts.append(h)
    return f"J-{entry_num}: {ep_title} — {', '.join(parts)} ({ep_label})"


def main():
    if len(sys.argv) < 6:
        print(USAGE, file=sys.stderr)
        sys.exit(1)

    series = sys.argv[1]
    season = int(sys.argv[2])
    ep_num = int(sys.argv[3])
    ep_title = sys.argv[4]
    entry_num = int(sys.argv[5])
    next_ep_title = sys.argv[6] if len(sys.argv) > 6 else ""

    # Find progress file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    progress_file = os.path.join(script_dir, "data", "star-trek-progress.json")
    if not os.path.exists(progress_file):
        progress_file = os.path.join(script_dir, "..", "data", "star-trek-progress.json")
    progress_file = os.path.normpath(progress_file)

    if not os.path.exists(progress_file):
        print(f"ERROR: Progress file not found at {progress_file}", file=sys.stderr)
        sys.exit(1)

    with open(progress_file, 'r') as f:
        old_data = json.load(f)

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    ep_label = f"S{season}E{ep_num}"
    next_ep_num = ep_num + 1
    next_ep_label = f"S{season}E{next_ep_num}"

    # Season episode totals (EPISODES, not files — double-length entries
    # count as 2: Caretaker 101 = E01+E02, Endgame 725 = E25+E26).
    # Voyager: 16+26*5+26 = 172. DS9: 20+26*6 = 176. TNG: 26+22+26*5 = 178.
    # Corrected 2026-08-07: the old single dict {7: 25} was DS9-flavored
    # AND wrong for Voyager S7 (26 eps in 25 files) — it made the finale
    # land at 170/172 and fabricated "S7E27" after Endgame.
    season_totals = {
        "Voyager": {1: 16, 2: 26, 3: 26, 4: 26, 5: 26, 6: 26, 7: 26},
        "DS9":     {1: 20, 2: 26, 3: 26, 4: 26, 5: 26, 6: 26, 7: 26},
        "TNG":     {1: 26, 2: 22, 3: 26, 4: 26, 5: 26, 6: 26, 7: 26},
    }
    series_totals = {"Voyager": 172, "DS9": 176, "TNG": 178}
    series_key = ("Voyager" if "Voyager" in series
                  else "TNG" if ("TNG" in series or "Next Generation" in series)
                  else "DS9")
    current_season_total = season_totals[series_key].get(season, 26)
    series_total = series_totals[series_key]

    # Endgame guard (2026-08-07): Voyager's final file (725.txt) is
    # "Endgame", double-length covering E25+E26 (Caretaker convention).
    # The final sync passes ep 26 (or 25); either way, append "S7E25-26"
    # (counts 2, mirroring "S1E01-02") instead of a lone "S7E26", null
    # the phantom "next" fields, and let seriesComplete flip below.
    if series_key == "Voyager" and season == 7 and ep_num >= current_season_total - 1:
        ep_label = f"S{season}E{current_season_total-1}-{current_season_total}"
        next_ep_num = None
        next_ep_label = None
        next_ep_title = ""

    # Recompute total watched count from the watched array (the site's
    # source of truth). The old preserved-count approach drifted badly
    # (S6E5 was missing for two commits; counter diverged from the array).
    # Convention: entries like "S1E01-02" (double-length pilot) count as 2.
    watched_list = old_data.get("watched", [])
    total_watched = 0
    for block in watched_list:
        for ep in block.get("episodes", []):
            total_watched += 2 if "-" in ep else 1

    # Fallback estimate if the array is empty/unavailable
    if total_watched == 0:
        prev_total = sum(season_totals[series_key].get(i, 26) for i in range(1, season))
        total_watched = prev_total + ep_num

    # Calculate percent on the safe side
    percent = min(100, round(total_watched * 100 / series_total))
    season_complete = ep_num >= current_season_total

    # Preserve highlights
    recent_highlights = old_data.get("recentHighlights", old_data.get("recent_highlights", []))
    if len(recent_highlights) > 10:
        recent_highlights = recent_highlights[:10]

    # Preserve previous/next series info
    previous_series = old_data.get("previousSeriesComplete", {
        "series": "The Next Generation",
        "totalEpisodes": 277,
        "journalEntries": 228
    })
    next_series = old_data.get("nextSeries", {
        "series": "Voyager",
        "totalEpisodes": 172
    })

    # Build new structure matching /now page schema.
    # MERGE (not rebuild): start from the old data so derived/site-only keys
    # (watched, completedSeasons, seriesTiming, totalWatched, totalJournals,
    # lastEpisode, lastTitle, currentSeason, nextEpisode, etc.) survive.
    data = dict(old_data)
    data.update({
        "series": series,
        "seriesComplete": old_data.get("seriesComplete", False),
        "totalEpisodesWatched": total_watched,
        "totalEpisodes": series_total,
        "season": season,
        "currentSeasonTotalEpisodes": current_season_total,
        "seasonComplete": season_complete,
        "latestEpisodeNumber": ep_num,
        "latestEpisodeTitle": ep_title,
        "latestEpisodeSeasonEp": ep_label,
        "nextEpisodeNumber": next_ep_num,
        "nextEpisodeTitle": next_ep_title,
        "nextEpisodeSeasonEp": next_ep_label,
        "journalEntries": entry_num,
        "lastUpdated": timestamp,
        "lastWatched": f"{ep_title} ({ep_label})",
        "percentComplete": percent,
        "recentHighlights": recent_highlights,
        "previousSeriesComplete": previous_series,
        "nextSeries": next_series,
    })
    # Keep the running per-series totals in sync with the fields the site reads
    data["totalWatched"] = total_watched
    data["currentSeason"] = season
    data["nextEpisode"] = next_ep_label
    data["lastEpisode"] = ep_label
    data["lastTitle"] = ep_title

    # Preserve watched array with current episode added/updated (dedup)
    watched_list = old_data.get("watched", [])
    if watched_list:
        season_block = None
        for block in watched_list:
            if (
                block.get("series", "").replace("_", " ") == series.replace("_", " ")
                and block.get("season") == season
            ):
                season_block = block
                break
        if season_block is None:
            season_block = {"series": series, "season": season, "episodes": []}
            watched_list.append(season_block)
            watched_list.sort(key=lambda b: b.get("season", 0))
        if ep_label not in season_block["episodes"]:
            season_block["episodes"].append(ep_label)
        data["watched"] = watched_list

    # Recompute totals AFTER the append — the count must reflect the array
    # that is actually written (ordering bug fixed 2026-08-03: totals were
    # computed from the pre-append array, so every sync lagged by one episode).
    final_watched = data.get("watched", [])
    final_total = 0
    for block in final_watched:
        for ep in block.get("episodes", []):
            final_total += 2 if "-" in ep else 1
    total_watched = final_total
    percent = min(100, round(total_watched * 100 / series_total))
    data["totalEpisodesWatched"] = total_watched
    data["totalWatched"] = total_watched
    data["percentComplete"] = percent
    # Legacy keys the site also reads — /now uses percentComplete, but the
    # front page and other components read percentWatched/nextTitle. Drift
    # caught 2026-08-03: these two were preserved stale (nextTitle "Memorial",
    # percentWatched 63) while the new keys updated. Sync them explicitly.
    data["percentWatched"] = percent
    data["nextTitle"] = next_ep_title

    # Series finale: no next episode exists — mark the series complete so
    # /now and the homepage render the completion branch instead of a
    # phantom "next up: S7E27" (Endgame guard above).
    if next_ep_label is None:
        data["seriesComplete"] = True
        data["seasonComplete"] = True

    with open(progress_file, 'w') as f:
        json.dump(data, f, indent=2)
        f.write("\n")

    # Keep the bundled lib copy in sync — /now +page.server.ts imports from
    # $lib/data/star-trek-progress.json FIRST (bundled at build time), so if
    # this copy is stale the site shows old counts even after deploys.
    # (Drift caught 2026-08-03: lib copy stuck at 103 eps while data/ had 127.)
    lib_copy = os.path.join(os.path.dirname(script_dir), "src", "lib", "data", "star-trek-progress.json")
    if os.path.exists(os.path.join(script_dir, "..", "src", "lib", "data", "star-trek-progress.json")):
        lib_copy = os.path.normpath(os.path.join(script_dir, "..", "src", "lib", "data", "star-trek-progress.json"))
    if os.path.exists(lib_copy):
        with open(lib_copy, 'w') as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        print(f"   lib copy synced ({lib_copy})")

    print(f"✅ Progress synced: {ep_label} — {ep_title} (entry {entry_num})")
    print(f"   Total: {total_watched}/{series_total} ({percent}%) — S{season} ep {ep_num}/{current_season_total}")

    # recentHighlights drift check (added 2026-08-04) — the smoke test reads
    # the top-3 recentHighlights, so a stale list silently shrinks live
    # coverage. The check is the ritual; the edit stays manual (same
    # philosophy as balance-drift-check.sh stage 1).
    highlights = data.get("recentHighlights", [])
    expected_prefix = f"J-{entry_num}:"
    if not highlights or not str(highlights[0]).startswith(expected_prefix):
        # Stage 2 (2026-08-04): auto-prepend a section-derived summary.
        # The manual summaries (J-502..J-505) are enriched versions of the
        # journal's ## headers; the header skeleton is faithful and readable,
        # so the auto-edit eliminates the drift class entirely. Glosses stay
        # editorial — the slot can enrich afterwards. Check-only philosophy
        # preserved: if no journal/headers are found, warn for manual edit.
        summary = derive_highlight_summary(entry_num, ep_title, ep_label, script_dir)
        if summary:
            new_highlights = [summary] + [h for h in highlights if not str(h).startswith(expected_prefix)]
            data["recentHighlights"] = new_highlights[:10]
            with open(progress_file, 'w') as f:
                json.dump(data, f, indent=2)
                f.write("\n")
            if os.path.exists(lib_copy):
                with open(lib_copy, 'w') as f:
                    json.dump(data, f, indent=2)
                    f.write("\n")
            highlights = data.get("recentHighlights", [])
            print("✅ AUTO-SYNC (stage 2): prepended section-derived summary")
            print(f"   {summary}")
            print("   Glosses are editorial — enrich manually if desired.")
        else:
            print("⚠️  DRIFT: recentHighlights[0] is not " + expected_prefix)
            print(f"   Current[0]: {highlights[0] if highlights else '(empty)'}")
            print("   No journal/## headers found for auto-summary — update")
            print("   data/star-trek-progress.json recentHighlights manually or the")
            print("   smoke test will skip this journal.")
    else:
        print(f"   ✅ recentHighlights current ({expected_prefix} first)")

    # recentHighlights continuity check (stage 2.5, added 2026-08-04) — the
    # [0]-prefix check above only validates the top entry, so a skipped journal
    # in the middle (J-503 prepended without J-502, the 2026-08-04 class)
    # silently passes. Verify the J-numbers form a consecutive descending
    # sequence: each entry must be exactly the previous one minus one.
    jnums = []
    for h in highlights:
        m = re.match(r"J-(\d+):", str(h))
        if m:
            jnums.append(int(m.group(1)))
    if len(jnums) >= 2:
        gaps = []
        for i in range(1, len(jnums)):
            expected = jnums[i - 1] - 1
            if jnums[i] != expected:
                gaps.append(f"J-{jnums[i-1]} → J-{jnums[i]} (expected J-{expected})")
        if gaps:
            print("⚠️  DRIFT: recentHighlights sequence gap(s):")
            for g in gaps:
                print(f"   {g}")
            print("   A journal is missing from the list — the smoke test (top-3)")
            print("   and /now highlights will skip it. Add the missing J-{N} summary.")
        else:
            print(f"   ✅ recentHighlights continuous (J-{jnums[0]} → J-{jnums[-1]}, {len(jnums)} entries)")
    elif len(jnums) == 1:
        print(f"   ℹ️  recentHighlights has a single entry (J-{jnums[0]}) — no sequence to check")

    # Route-existence guard (added 2026-08-08 — the J-531 class, third
    # occurrence: J-531 was committed to alpha-home with progress JSON but
    # the journal ROUTE was never synced, so /writing 404'd while progress
    # showed 164/172). The progress JSON is not the journal — this check
    # verifies the just-synced journal's route dir exists in this repo and
    # warns loudly when it doesn't. Check-only, matching the balance-drift
    # philosophy; the fix (run sync-shared-journals.py) stays manual.
    repo_root = os.path.normpath(os.path.join(script_dir, ".."))
    route_matches = []
    for pattern in (f"journal-{entry_num}-*", f"J-{entry_num}-*", f"j-{entry_num}-*"):
        route_matches.extend(glob.glob(os.path.join(repo_root, "src", "routes", "writing", pattern)))
    if not route_matches:
        print("⚠️  ROUTE MISSING: no route dir for journal " + str(entry_num))
        print(f"   Progress says J-{entry_num} ({ep_label}) but no "
              f"src/routes/writing/journal-{entry_num}-*/ dir exists here.")
        print("   Run sync-shared-journals.py and commit the route BEFORE pushing —")
        print("   the live site will 404 on this journal otherwise.")
    else:
        print(f"   ✅ journal route present ({os.path.basename(route_matches[0])})")


if __name__ == "__main__":
    main()
