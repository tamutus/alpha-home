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
from datetime import datetime, timezone

USAGE = (
    "Usage: sync-star-trek-progress.py <series> <season> <ep-num> <ep-title> <entry-num> [next-ep-title]\n"
    "       sync-star-trek-progress.py 'Deep Space Nine' 6 17 'Wrongs Darker Than Death or Night' 333 'Inquisition'"
)


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

    # Season boundaries for DS9
    season_totals = {1: 20, 2: 26, 3: 26, 4: 26, 5: 26, 6: 26, 7: 25}
    current_season_total = season_totals.get(season, 26)

    # Total episodes per series (must match the site's canonical counts:
    # TNG 178 eps / 277 journals, DS9 176 eps / 365 journals, Voyager 170 eps)
    series_total = 176  # DS9
    if "TNG" in series or "Next Generation" in series:
        series_total = 178
    elif "Voyager" in series:
        series_total = 170  # site canonical: 7 seasons (16+26+26+26+26+26+24=170), NOT 172

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
        prev_total = sum(season_totals.get(i, 26) for i in range(1, season))
        total_watched = prev_total + ep_num
        if "TNG" in series or "Next Generation" in series:
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


if __name__ == "__main__":
    main()
