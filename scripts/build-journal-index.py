#!/usr/bin/env python3
"""
Build a complete journal index for the /writing page.

Problem (2026-08-06, found via Lavra's reading): the /writing index
(writing-data.js staticEntries) lists only a subset of journal routes.
Journal pages exist as routes (smoke-tested) but aren't all discoverable
from the front door. Demon (J-459) is the canonical example.

Fix: this script scans every journal route dir under
src/routes/writing/journal-*/ and emits a complete index JSON
(src/lib/generated/journal-index.json) with slug/title/date/series/episode
for each. The /writing page merges this with publishedEntries (registered
entries win; unregistered journal routes become walkable automatically).

Date resolution order (journal files come in three formats):
  1. YAML frontmatter `date:` (.svx / newer .md)
  2. WritingLayout prop date= (legacy .svelte journals)
  3. "**Watched:** YYYY-MM-DD" or any 2026-MM-DD in body (.md legacy)
  4. git log of the route dir in alpha-home (when the route was added)
  5. git log of the source journal in harrsoft-shared (when written)
  6. fallback: null (page sorts these last by journal number)

Title resolution:
  1. YAML frontmatter `title:`
  2. WritingLayout prop title=
  3. first `# ` heading
  4. fallback: "Journal {N}"
"""
import glob
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROUTES = os.path.join(ROOT, "src", "routes", "writing")
OUT = os.path.join(ROOT, "src", "lib", "generated", "journal-index.json")

# harrsoft-shared repo — used only as a last-resort date source.
SHARED = os.path.join(os.path.dirname(ROOT), "harrsoft-shared")


def git_date(repo, path):
    """Return the first-commit date (YYYY-MM-DD) of path in repo, or None."""
    try:
        out = subprocess.run(
            ["git", "-C", repo, "log", "--diff-filter=A", "--format=%ad",
             "--date=short", "--", path],
            capture_output=True, text=True, timeout=10,
        ).stdout.strip()
        return out.splitlines()[-1] if out else None
    except Exception:
        return None


def find_shared_source(entry_num):
    """Locate the source journal file in harrsoft-shared by entry number."""
    if not os.path.isdir(SHARED):
        return None
    for root, dirs, files in os.walk(SHARED):
        if "/.git" in root:
            continue
        for fname in files:
            if not fname.endswith(".md"):
                continue
            m = re.match(r'(?:journal-|J-|j-)?(\d+)(?:-[a-z0-9-]+)?\.md$', fname)
            if m and int(m.group(1)) == entry_num:
                return os.path.join(root, fname)
    return None


def parse_frontmatter(content):
    """Return dict from YAML frontmatter block, or {} if absent.

    MUST use a real YAML parser. The hand-rolled line reader this replaced
    (2026-11-09, Beat 17) was permissive where the build is strict: it walked
    every line matching `^key: value` and never noticed when a value was
    unterminated. So a page whose frontmatter the build DECLINES to parse got
    the naive reader's guess written into journal-index.json, and the index
    published a title the page could never render. The index is what the
    /writing page and this house's own readers trust, so it must fail the
    same way the build fails: on unparseable frontmatter, return {} and let
    the body `# H1` become the title, which is what the page shows too.
    """
    m = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', content, re.DOTALL)
    if not m:
        return {}
    block = m.group(1)
    try:
        import yaml
    except Exception:
        yaml = None
    if yaml is not None:
        try:
            loaded = yaml.safe_load(block)
        except Exception:
            return {}
        if not isinstance(loaded, dict):
            return {}
        return {str(k): ("" if v is None else str(v)) for k, v in loaded.items()}
    # No YAML available: refuse rather than guess (a permissive fallback is the
    # blindness this function was fixed to remove).
    return {}


def extract_title(content, fm, entry_num):
    if fm.get("title"):
        return fm["title"]
    # WritingLayout prop (legacy .svelte journals)
    m = re.search(r'title="([^"]+)"', content)
    if m:
        return m.group(1)
    m = re.search(r'^# (.+)', content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    return f"Journal {entry_num}"


def extract_date(content, fm, entry_num, slug, repo_git_dates):
    if fm.get("date"):
        return fm["date"]
    # WritingLayout prop date=
    m = re.search(r'date="(\d{4}-\d{2}-\d{2})"', content)
    if m:
        return m.group(1)
    # "**Watched:** 2026-07-30" or any date in body
    m = re.search(r'(\d{4}-\d{2}-\d{2})', content)
    if m:
        return m.group(1)
    # alpha-home git history for the route dir
    if slug in repo_git_dates:
        return repo_git_dates[slug]
    # harrsoft-shared git history for the source file
    src = find_shared_source(entry_num)
    if src:
        rel = os.path.relpath(src, SHARED)
        d = git_date(SHARED, rel)
        if d:
            return d
    return None


def extract_series(content, fm):
    if fm.get("series"):
        return str(fm["series"]).title()
    m = re.search(r'series="([^"]+)"', content)
    if m:
        return m.group(1).title()
    for name in ("Voyager", "Deep Space Nine", "The Next Generation"):
        if name in content[:300]:
            return name
    return None


def extract_episode(content, fm):
    # Frontmatter uses numeric season/episode (e.g. season: 7, episode: 5) → S7E5
    if fm.get("season") and fm.get("episode"):
        try:
            return f"S{int(fm['season'])}E{int(fm['episode'])}"
        except ValueError:
            pass
    if fm.get("episode"):
        return str(fm["episode"])
    m = re.search(r'episode="([^"]+)"', content)
    if m:
        return m.group(1)
    m = re.search(r'(S\d{1,2}E\d{1,2})', content[:300])
    if m:
        return m.group(1)
    return None


def main():
    # Pre-collect alpha-home git dates for every route dir (cheap, one pass).
    repo_git_dates = {}
    dirs = sorted(glob.glob(os.path.join(ROUTES, "journal-*")))
    for d in dirs:
        slug = os.path.basename(d)
        rel = os.path.relpath(d, ROOT)
        dte = git_date(ROOT, rel)
        if dte:
            repo_git_dates[slug] = dte

    index = []
    for d in dirs:
        slug = os.path.basename(d)
        m = re.match(r'journal-(\d+)', slug)
        entry_num = int(m.group(1)) if m else 0
        pages = glob.glob(os.path.join(d, "+page.*"))
        if not pages:
            continue
        with open(pages[0], encoding="utf-8", errors="replace") as f:
            content = f.read()
        fm = parse_frontmatter(content)
        index.append({
            "slug": slug,
            "entry": entry_num,
            "title": extract_title(content, fm, entry_num),
            "date": extract_date(content, fm, entry_num, slug, repo_git_dates),
            "series": extract_series(content, fm),
            "episode": extract_episode(content, fm),
        })

    index.sort(key=lambda e: (e["date"] or "9999", e["entry"]))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=1, ensure_ascii=False)
        f.write("\n")

    with_date = sum(1 for e in index if e["date"])
    print(f"✅ journal-index.json: {len(index)} journals "
          f"({with_date} with date, {len(index) - with_date} date-less)")
    missing = [e["slug"] for e in index if not e["date"]]
    if missing:
        print("date-less:", missing[:20], "..." if len(missing) > 20 else "")


SELFTEST_CASES = [
    # (name, content, expected_title, must_not_equal)
    (
        "clean double-quoted title keeps its own text",
        '---\ntitle: "Journal-400: The Frame"\ndate: "2026-07-22"\n---\n\n# Body H1\n',
        "Journal-400: The Frame",
        "Body H1",
    ),
    (
        # THE case this function was rewritten for (2026-11-09, Beat 17).
        # A title that opens a double-quoted scalar and then carries an inner
        # unescaped quote is unparseable: the build refuses the whole block and
        # the page shows only its body H1. The old naive line-reader happily
        # returned the raw remainder, so the index published a title the page
        # could never render. Assert the body H1 wins, AND that the naive
        # answer is not produced.
        "unparseable block falls through to the body H1 (never the naive line)",
        '---\ntitle: "Voyager S2E05 — "Non Sequitur\ndate: "2026-07-20"\n---\n\n# Body H1\n',
        "Body H1",
        'Voyager S2E05 — "Non Sequitur',
    ),
    (
        "unquoted colon-space is unparseable too -> body H1",
        '---\ntitle: J-458: Living Witness\n---\n\n# Body H1\n',
        "Body H1",
        "J-458: Living Witness",
    ),
    (
        "single-quoted title is unwrapped like the page unwraps it",
        "---\ntitle: 'Plain Title'\n---\n\n# Body\n",
        "Plain Title",
        "'Plain Title'",
    ),
    (
        "no frontmatter at all -> body H1",
        "# Only a Heading\n",
        "Only a Heading",
        "Journal 1",
    ),
]


def selftest():
    import sys as _sys
    fails = []
    for name, content, want, must_not in SELFTEST_CASES:
        fm = parse_frontmatter(content)
        got = extract_title(content, fm, 1)
        if got != want:
            fails.append(f"{name}: got {got!r}, want {want!r}")
        elif got == must_not:
            fails.append(f"{name}: produced the forbidden value {must_not!r}")
    if not _yaml_present():
        fails.append("PyYAML missing: the reader refuses every block (BLIND, not green)")
    if fails:
        for f in fails:
            print(f"❌ {f}")
        _sys.exit(1)
    print(f"selftest {len(SELFTEST_CASES)}/{len(SELFTEST_CASES)} ok")


def _yaml_present():
    try:
        import yaml  # noqa: F401
        return True
    except Exception:
        return False


if __name__ == "__main__":
    import sys as _sys
    if "--selftest" in _sys.argv:
        selftest()
    else:
        main()
