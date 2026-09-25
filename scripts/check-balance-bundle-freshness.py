#!/usr/bin/env python3
"""check-balance-bundle-freshness.py — the reader for the SHIPPED balance.

The 2026-09-23 IDEAS entry named this class: the balance/history that ships to
Vercel (`src/lib/data/balance-history.json` + `deepseek-balance.json`, both
TRACKED) is copied BY HAND from the workspace-local accumulation
(`data/balance-history.json`, gitignored, advanced every beat by
`update-balance-history.sh`). Nothing warns when the hand-copy is skipped, so the
LIVE /now page can render "$X (checked <date>)" days stale while every deploy
stays green — a record true of itself, one reading off what it describes.

  Found live 2026-09-23: prod showed "$35.79 (checked 2026-09-19)" while the key
  held $29.45 (local history had 98 entries through 09-23; the bundle stopped at
  09-19). Same family as the 09-19 *number-needs-a-clock* fix, one level up: the
  clock exists, but its FRESHNESS is unmonitored.

This is the LOCAL reader: it compares the bundled copy in the repo against the
local accumulation + the clock. It answers "is the copy we are about to ship (or
have already shipped) stale?" — NOT "did Vercel actually build it" (that is the
post-deploy smoke test's and the deploy-watch reader's job).

  Bound (named, not hidden): a green here proves the bundle is fresh IN THE
  WORKING TREE. It does not prove the LIVE site is fresh — a fresh bundle can sit
  undeployed. Freshness of the *live* page needs a read of the page itself.

Contract
  fresh  — bundled newest date is within --max-age days of today          (exit 0)
  stale  — bundled newest date is OLDER than --max-age days; or the bundle
           (or the local source) is missing/unreadable                   (exit 1, loud)
  blind  — the local accumulation is missing, so there is nothing to compare
           the bundle against — SAID, never silent-green                  (exit 2)

  "Blind is not green": a missing fixture is not a passing check.

Usage
  check-balance-bundle-freshness.py               check (default max-age 2 days)
  check-balance-bundle-freshness.py --quiet       print only when not fresh
  check-balance-bundle-freshness.py --sync        copy local -> bundled (the fix)
  check-balance-bundle-freshness.py --selftest    hermetic control (never touches reality)

Options
  --root DIR     repo root (default: the parent of this script's dir)
  --max-age N    days (default 2; stale when age > N — "older than ~2 days")
  --today DATE   override the clock (YYYY-MM-DD; default UTC today)

Exit: 0 fresh · 1 stale or a broken/unreadable record · 2 blind or usage
"""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
from datetime import date, datetime, timezone
from pathlib import Path

LOCAL_REL = "data/balance-history.json"
BUNDLE_REL = "src/lib/data/balance-history.json"
SINGLE_REL = "src/lib/data/deepseek-balance.json"
REFRESH_CMD = "python3 scripts/check-balance-bundle-freshness.py --sync"


# --- parsing -----------------------------------------------------------------

def read_newest(path: Path):
    """(state, date_str, balance) for a balance-history.json.

    state: "ok" | "missing" | "unreadable" | "empty"
    """
    if not path.exists():
        return ("missing", None, None)
    try:
        data = json.loads(path.read_text())
    except (json.JSONDecodeError, OSError):
        return ("unreadable", None, None)
    entries = data.get("entries") if isinstance(data, dict) else None
    if not isinstance(entries, list) or not entries:
        return ("empty", None, None)
    dated = [e for e in entries if isinstance(e, dict) and e.get("date")]
    if not dated:
        return ("empty", None, None)
    newest = max(dated, key=lambda e: e["date"])
    return ("ok", newest.get("date"), newest.get("balance"))


def parse_date(s: str):
    try:
        return date.fromisoformat(s)
    except (TypeError, ValueError):
        return None


# --- core evaluation ---------------------------------------------------------

def evaluate(root: Path, today: date, max_age: int):
    """Return (rc, message). rc 0 fresh · 1 stale/broken · 2 blind."""
    local = read_newest(root / LOCAL_REL)
    bundle = read_newest(root / BUNDLE_REL)

    if bundle[0] == "missing":
        return (1, "=== balance bundle === ⚠️ the bundled history is MISSING "
                   f"({BUNDLE_REL}) — the site has no balance record to ship; "
                   f"fix: cd alpha-home && {REFRESH_CMD}")
    if bundle[0] == "unreadable":
        return (1, "=== balance bundle === ⚠️ the bundled history is UNREADABLE "
                   f"({BUNDLE_REL}) — a broken shipped record; fix: cd alpha-home "
                   f"&& {REFRESH_CMD}")
    if bundle[0] == "empty":
        return (1, "=== balance bundle === ⚠️ the bundled history has NO dated "
                   f"entries ({BUNDLE_REL})")
    if local[0] == "missing":
        return (2, "=== balance bundle === ⚠️ BLIND — local history missing "
                   f"({LOCAL_REL}); cannot compare the bundle to anything "
                   "(blind, not green)")
    if local[0] != "ok":
        return (2, "=== balance bundle === ⚠️ BLIND — local history "
                   f"{local[0]} ({LOCAL_REL}); cannot compare (blind, not green)")

    b_date = parse_date(bundle[1])
    l_date = parse_date(local[1])
    if b_date is None or l_date is None:
        return (1, "=== balance bundle === ⚠️ a history carries an unparseable "
                   f"date (bundled {bundle[1]!r}, local {local[1]!r})")

    age_days = (today - b_date).days
    lag_days = (l_date - b_date).days

    if age_days > max_age:
        return (1, "=== balance bundle === ⚠️ shipped balance frozen at "
                   f"{bundle[1]} (${bundle[2]}) — {age_days}d old "
                   f"(local newest {local[1]} ${local[2]}, {lag_days}d ahead); "
                   "the live /now may read stale — fix: cd alpha-home && "
                   f"{REFRESH_CMD}")

    return (0, f"[balance-bundle] fresh — bundled {bundle[1]} (${bundle[2]}), "
               f"age {age_days}d, local {local[1]} (${local[2]}), lag {lag_days}d")


# --- sync (the fix) ----------------------------------------------------------

def sync(root: Path) -> int:
    local_path = root / LOCAL_REL
    local = read_newest(local_path)
    if local[0] != "ok":
        print(f"[balance-bundle] cannot sync: local history {local[0]} ({LOCAL_REL})",
              file=sys.stderr)
        return 2

    prior = read_newest(root / BUNDLE_REL)
    raw = json.loads(local_path.read_text())
    bundle_path = root / BUNDLE_REL
    bundle_path.parent.mkdir(parents=True, exist_ok=True)
    bundle_path.write_text(json.dumps(raw, indent=2) + "\n")

    single = {
        "is_available": True,
        "balance_infos": [{
            "currency": "USD",
            "total_balance": str(local[2]),
            "granted_balance": "0.00",
            "topped_up_balance": str(local[2]),
        }],
    }
    single_path = root / SINGLE_REL
    single_path.parent.mkdir(parents=True, exist_ok=True)
    single_path.write_text(json.dumps(single, indent=2) + "\n")

    before = f"{prior[1]} (${prior[2]})" if prior[0] == "ok" else prior[0]
    print(f"[balance-bundle] synced — bundled {before} -> {local[1]} "
          f"(${local[2]}); single value -> ${local[2]}")
    print("[balance-bundle] commit + push alpha-home to deploy (the bundle is TRACKED)")
    return 0


# --- selftest ----------------------------------------------------------------

def selftest() -> int:
    fail = 0
    today = date(2026, 9, 25)
    max_age = 2

    def mk(root: Path, local_date, local_bal, bundle_date, bundle_bal, local=True, bundle=True):
        (root / "data").mkdir(parents=True, exist_ok=True)
        (root / "src/lib/data").mkdir(parents=True, exist_ok=True)
        if local:
            (root / LOCAL_REL).write_text(json.dumps(
                {"entries": [{"date": local_date, "balance": local_bal}]}, indent=2))
        if bundle:
            (root / BUNDLE_REL).write_text(json.dumps(
                {"entries": [{"date": bundle_date, "balance": bundle_bal}]}, indent=2))

    cases = []

    def case(name, expect_rc, **kw):
        cases.append((name, expect_rc, kw))

    case("fresh (same day)", 0, local_date="2026-09-25", local_bal="25.63",
         bundle_date="2026-09-25", bundle_bal="25.63")
    case("fresh (1d old)", 0, local_date="2026-09-25", local_bal="25.63",
         bundle_date="2026-09-24", bundle_bal="25.89")
    case("quiet at boundary (2d, not > 2)", 0, local_date="2026-09-25",
         local_bal="25.63", bundle_date="2026-09-23", bundle_bal="29.45")
    case("stale (3d > 2)", 1, local_date="2026-09-25", local_bal="25.63",
         bundle_date="2026-09-22", bundle_bal="30.18")
    case("stale (6d — the 09-19 freeze)", 1, local_date="2026-09-25",
         local_bal="25.63", bundle_date="2026-09-19", bundle_bal="35.79")

    for name, expect_rc, kw in cases:
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            mk(root, kw.pop("local_date"), kw.pop("local_bal"),
               kw.pop("bundle_date"), kw.pop("bundle_bal"), **kw)
            rc, msg = evaluate(root, today, max_age)
            ok = rc == expect_rc
            print(f"  {'✅' if ok else '❌'} {name}: rc={rc} (want {expect_rc})")
            fail += 0 if ok else 1

    # blind: local missing -> rc 2, said not green
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        mk(root, None, None, "2026-09-23", "29.45", local=False, bundle=True)
        rc, msg = evaluate(root, today, max_age)
        ok = rc == 2 and "BLIND" in msg
        print(f"  {'✅' if ok else '❌'} blind (local missing) -> rc={rc}, says BLIND")
        fail += 0 if ok else 1

    # bundle missing -> rc 1
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        mk(root, "2026-09-25", "25.63", None, None, local=True, bundle=False)
        rc, msg = evaluate(root, today, max_age)
        ok = rc == 1 and "MISSING" in msg
        print(f"  {'✅' if ok else '❌'} bundle missing -> rc={rc}, says MISSING")
        fail += 0 if ok else 1

    # unreadable bundle -> rc 1
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        mk(root, "2026-09-25", "25.63", "2026-09-25", "25.63")
        (root / BUNDLE_REL).write_text("{not json")
        rc, msg = evaluate(root, today, max_age)
        ok = rc == 1 and "UNREADABLE" in msg
        print(f"  {'✅' if ok else '❌'} unreadable bundle -> rc={rc}, says UNREADABLE")
        fail += 0 if ok else 1

    # sync copies local -> bundled + single value
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        mk(root, "2026-09-25", "25.63", "2026-09-19", "35.79")
        rc = sync(root)
        after = read_newest(root / BUNDLE_REL)
        single = json.loads((root / SINGLE_REL).read_text())
        sv = single["balance_infos"][0]["total_balance"]
        ok = (rc == 0 and after == ("ok", "2026-09-25", "25.63") and sv == "25.63")
        print(f"  {'✅' if ok else '❌'} sync copies local -> bundle+single "
              f"(bundle {after[1]}/{after[2]}, single ${sv})")
        fail += 0 if ok else 1

    total = len(cases) + 5
    print(f"selftest: {total - fail}/{total} passed")
    return 1 if fail else 0


# --- main --------------------------------------------------------------------

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("--root", default=None)
    ap.add_argument("--max-age", type=int, default=2)
    ap.add_argument("--today", default=None)
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--sync", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    args = ap.parse_args(argv)

    if args.selftest:
        return selftest()

    root = Path(args.root).resolve() if args.root else Path(__file__).resolve().parent.parent

    if args.sync:
        return sync(root)

    if args.today:
        today = parse_date(args.today)
        if today is None:
            print("--today must be YYYY-MM-DD", file=sys.stderr)
            return 2
    else:
        today = datetime.now(timezone.utc).date()

    rc, msg = evaluate(root, today, args.max_age)
    if rc == 0 and args.quiet:
        return 0
    print(msg)
    return rc


if __name__ == "__main__":
    sys.exit(main())
