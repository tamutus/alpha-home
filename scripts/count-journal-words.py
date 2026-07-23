#!/usr/bin/env python3
"""
Precompute word counts for all Star Trek journal entries.

Walks both harrsoft-shared/Star Trek/ and alpha-home/src/routes/writing/journal-*/
for individual journal files, counts words per series, and writes a data file
for the colophon.

Usage: python3 scripts/count-journal-words.py [--output data/journal-word-counts.json]

Default output: data/journal-word-counts.json  (relative to CWD)
"""

import re
import json
import sys
from pathlib import Path


def count_words(text: str) -> int:
    """Count whitespace-delimited words, stripping markdown frontmatter."""
    text = re.sub(r'^---\n.*?\n---\n', '', text, count=1, flags=re.DOTALL)
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    return len(text.split())


def read_journal_page(path: Path) -> str | None:
    """Read a journal entry from a +page.md or .md file. Returns text or None."""
    try:
        if path.is_dir():
            md_file = path / '+page.md'
            if md_file.exists():
                text = md_file.read_text(encoding='utf-8')
            else:
                svx_file = path / '+page.svx'
                if svx_file.exists():
                    text = svx_file.read_text(encoding='utf-8')
                else:
                    return None
        else:
            text = path.read_text(encoding='utf-8')
        return text
    except Exception:
        return None


def scan_harrsoft_shared(base_dir: Path) -> list[tuple[str, int, str]]:
    """
    Scan harrsoft-shared/Star Trek/ for journal-*.md files.
    Returns list of (series_name, word_count, source_label).
    """
    series_folders = {
        'TNG': 'The Next Generation',
        'Deep Space Nine': 'Deep Space Nine',
        'Voyager': 'Voyager',
    }
    results: list[tuple[str, int, str]] = []

    if not base_dir or not base_dir.exists():
        return results

    for folder, series_name in series_folders.items():
        series_path = base_dir / folder
        if not series_path.exists():
            continue
        for jf in sorted(series_path.glob('journal-*.md')):
            if jf.name == 'journal-latest.md':
                continue  # skip the symlink/copy
            text = read_journal_page(jf)
            if text is None or not text.strip():
                continue
            wc = count_words(text)
            results.append((series_name, wc, f'harrsoft-shared/{folder}'))

    return results


def scan_alpha_home(alpha_home_dir: Path) -> list[tuple[str, int, str]]:
    """
    Scan alpha-home/src/routes/writing/journal-* directories for +page.md files,
    and determine series from the page content or filename.
    Returns list of (series_name, word_count, source_label).
    """
    journals_dir = alpha_home_dir / 'src' / 'routes' / 'writing'
    results: list[tuple[str, int, str]] = []

    if not journals_dir.exists():
        return results

    # Series names used in journal content that tell us which series
    series_patterns = {
        'The Next Generation': ['tng', 'the next generation', 'enterprise-d', 'star trek: the next generation'],
        'Deep Space Nine': ['ds9', 'deep space nine', 'space station', 'star trek: deep space nine'],
        'Voyager': ['voyager', 'uss voyager', 'janeway', 'star trek: voyager', 'delta quadrant'],
    }

    for jdir in sorted(journals_dir.glob('journal-*')):
        if not jdir.is_dir():
            continue

        text = read_journal_page(jdir)
        if text is None or not text.strip():
            continue

        wc = count_words(text)
        text_lower = text.lower()

        # Peek at the first line for series context
        first_line = text.split('\n')[0].lower() if text.strip() else ''

        # Determine series from content
        detected = False
        for series_name, patterns in series_patterns.items():
            for pattern in patterns:
                if pattern in first_line or pattern in text_lower[:500]:
                    results.append((series_name, wc, f'alpha-home/journal-{jdir.name}'))
                    detected = True
                    break
            if detected:
                break

        if not detected:
            # Fallback: guess from journal number range
            name = jdir.name
            num_match = re.search(r'(\d+)', name)
            if num_match:
                num = int(num_match.group(1))
                if num <= 228:
                    results.append(('The Next Generation', wc, f'alpha-home/journal-{jdir.name}'))
                elif num <= 593:
                    results.append(('Deep Space Nine', wc, f'alpha-home/journal-{jdir.name}'))
                else:
                    results.append(('Voyager', wc, f'alpha-home/journal-{jdir.name}'))
            else:
                results.append(('Voyager', wc, f'alpha-home/journal-{jdir.name}'))

    return results


def main():
    script_dir = Path(__file__).resolve().parent.parent  # alpha-home/
    output_path_default = script_dir / 'data' / 'journal-word-counts.json'

    # Source directories
    shared_candidates = [
        script_dir.parent / 'harrsoft-shared' / 'Star Trek',
        Path.cwd() / 'harrsoft-shared' / 'Star Trek',
    ]
    star_trek_dir = next((c for c in shared_candidates if c.exists()), None)
    if not star_trek_dir:
        print("[warn] harrsoft-shared/Star Trek not found — will only count alpha-home journals", file=sys.stderr)

    # Scan both sources
    entries: list[tuple[str, int, str]] = []
    if star_trek_dir:
        entries.extend(scan_harrsoft_shared(star_trek_dir))
    entries.extend(scan_alpha_home(script_dir))

    # Deduplicate (same journal might appear in both sources)
    seen_sources: set[str] = set()
    deduped: list[tuple[str, int, str]] = []
    for series_name, wc, source in entries:
        # De-duplicate by the journal number at the end of source path
        num_match = re.search(r'journal-(\d+)', source)
        key = num_match.group(1) if num_match else source
        if key not in seen_sources:
            seen_sources.add(key)
            deduped.append((series_name, wc, source))

    entries = deduped

    # Aggregate by series
    series_counts: dict[str, int] = {}
    series_file_counts: dict[str, int] = {}
    for series_name, wc, _ in entries:
        series_counts[series_name] = series_counts.get(series_name, 0) + wc
        series_file_counts[series_name] = series_file_counts.get(series_name, 0) + 1

    total_words = sum(series_counts.values())

    output = {
        "totalJournalWords": total_words,
        "totalJournalFiles": len(entries),
        "series": {k: v for k, v in sorted(series_counts.items())},
        "seriesFileCounts": {k: v for k, v in sorted(series_file_counts.items())},
        "note": "Word counts from individual journal files on disk. TNG journals that exist only in collected-scripts files (harrsoft-shared) are not counted.",
        "generatedAt": __import__('datetime').datetime.now().isoformat(),
    }

    # Parse CLI args for output path override
    if len(sys.argv) > 1 and sys.argv[1].startswith('--output='):
        output_path = Path(sys.argv[1].split('=', 1)[1])
    else:
        output_path = output_path_default

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, indent=2) + '\n', encoding='utf-8')
    print(f"[ok] Wrote {output_path}")
    print(f"     Total journal files: {len(entries)}")
    print(f"     Total journal words: {total_words:,}")
    for s in sorted(series_counts.keys()):
        print(f"     {s}: {series_counts[s]:,} words across {series_file_counts[s]} files")


if __name__ == '__main__':
    main()
