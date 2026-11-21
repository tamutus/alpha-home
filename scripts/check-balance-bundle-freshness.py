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
  check-balance-bundle-freshness.py --sync        copy local -> bundled (the fix);
                                                  REFUSED when the local file carries
                                                  dated entries the working tree lacks
  check-balance-bundle-freshness.py --selftest    hermetic control (never touches reality)

Options
  --root DIR     repo root (default: the parent of this script's dir)
  --max-age N    days (default 2; stale when age > N — "older than ~2 days")
  --today DATE   override the clock (YYYY-MM-DD; default UTC today)

The --sync overwrite (2026-10-28, Beat 6)
  The bundled copy carries MORE than a balance: the shipped /now page draws a
  chart from its `entries` list. The local accumulation is gitignored and always
  ahead of the commit (today's row exists here hours before anyone commits it),
  so a blind "copy local -> bundled, commit" keeps only the rows the last commit
  happened to carry and DROPS the rest. A byte-diff cannot see that: it looks
  like a normal advance, and this reader stays green throughout. Real loss, found
  live on 2026-10-28: a sync taken before the day's row was committed shipped a
  127-entry page where the local file held 132. Hence the guard -- --sync refuses
  (exit 2) and names the dated rows the repository does not have, so the overwrite
  happens on committed ground or not at all.

Exit: 0 fresh · 1 stale or a broken/unreadable record · 2 blind or usage
"""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
from datetime import date, timedelta, datetime, timezone
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


def dated(h):
    """{date: balance} for a balance-history.json (shared by every guard)."""
    out = {}
    entries = h.get("entries") if isinstance(h, dict) else None
    if isinstance(entries, list):
        for e in entries:
            if isinstance(e, dict) and e.get("date"):
                out[str(e["date"])] = e.get("balance")
    return out


def uncommitted_sync_rows(local_hist, bundle_hist):
    """[(date, balance)] dated rows the local file holds and the bundle does not.

    The subject is the ENTRY SET, not the newest value: a blind sync overwrites
    rows the repository never carried and the page's chart silently narrows.
    Newest-only comparison would pass the exact case that lost 5 rows on 10-28.
    """
    ld, bd = dated(local_hist), dated(bundle_hist)
    # 2026-11-21 Beat 22 — THE SET WAS BACKWARDS FOR 24 DAYS. A truncating sync
    # writes local OVER bundle, so the rows LOST are the ones the BUNDLE holds
    # and local does not: set(bd) - set(ld). This returned set(ld) - set(bd),
    # the rows local holds and the bundle never had — which a truncating sync
    # does not delete at all (they are simply not what gets written).
    #
    # Why it stayed green: through October local was a SUPERSET of bundle
    # (bundle lags, local advances), so both differences were empty and the
    # 10-28 case — written when the bundle was local's own prefix — passed on
    # a fixture where the two sets coincided. The direction only matters in
    # the shape that appeared after 10-30: local LOST its middle (a gap) while
    # the bundle still had every day. Then the guard saw [] and returned 0, and
    # --sync wrote local over bundle, silently deleting the 22 days the bundle
    # was the only record of. The reader then reported fresh.
    # A guard that cannot see the loss it guards against is not a guard.
    return sorted((d, bd[d]) for d in set(bd) - set(ld))


def missing_days(local_hist, bundle_hist):
    """Calendar days the local accumulation has NO row for, inside its own span.

    Why (2026-11-21, Beat 22): the entry-set guard above refuses a sync that
    would delete rows, and it worked — but it left the fix with NO legal move
    when the local file itself is gappy. A day with no sample is invisible to
    every dated-row check (there is no row to compare), so "commit the local
    history first" was unsatisfiable advice: the local file genuinely held no
    row for 22 of the days between 10-30 and 11-20, while the bundle held a
    row for every one of them. Copying local -> bundle would have deleted 22
    real dated points from the shipped chart; refusing forever keeps the
    shipped number 24 days stale. The gap is the fact neither branch named.

    Returns sorted ISO dates strictly between the local file's first and last
    row. Honest bound: this says a day has no SAMPLE. It does not say the
    house was dead — the balance timeline and the beat log are the records
    that answer that.
    """
    ld = dated(local_hist)
    if not ld:
        return []
    days = sorted(ld)
    first, last = parse_date(days[0]), parse_date(days[-1])
    if first is None or last is None:
        return []
    out = []
    d = first + timedelta(days=1)
    while d < last:
        if d.isoformat() not in ld:
            out.append(d.isoformat())
        d += timedelta(days=1)
    return out


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

    # Guard: never overwrite rows the repository has not committed yet.
    try:
        bundle_hist = json.loads((root / BUNDLE_REL).read_text())
    except (OSError, json.JSONDecodeError):
        lost = []
    else:
        lost = uncommitted_sync_rows(raw, bundle_hist)
    if lost:
        shown = ", ".join(d + " ($" + str(v) + ")" for d, v in lost)
        print("[balance-bundle] REFUSED — the working tree holds " + str(len(lost))
              + " dated row(s) the LOCAL file does not (a truncating sync would "
              "delete them): " + shown, file=sys.stderr)
        # 2026-11-21 Beat 22: name the gaps BEFORE prescribing the fix. A day
        # with no local sample is invisible to the row diff, so the old advice
        # ("commit the local history first") could be impossible to follow —
        # and the two branching readings want OPPOSITE fixes.
        holes = missing_days(raw, bundle_hist)
        if holes:
            preview = ", ".join(holes[:8]) + (" …" if len(holes) > 8 else "")
            print("[balance-bundle] ⚠️ BUT the local history itself has no row "
                  "for " + str(len(holes)) + " day(s) inside its span: " + preview,
                  file=sys.stderr)
            beyond = [d for d, _ in lost if d in set(holes)]
            if beyond:
                print("[balance-bundle] ⚠️ " + str(len(beyond)) + " of the row(s) "
                      "above fall on those gap days — the bundle is the ONLY "
                      "record of them. Truncating local -> bundle loses nothing "
                      "and advances the shipped date.", file=sys.stderr)
            else:
                print("[balance-bundle] ⚠️ the row(s) above fall on days local DOES "
                      "have, so a truncating sync would still lose point(s) the "
                      "bundle kept — repair local first.", file=sys.stderr)
        print("[balance-bundle] committing this sync would delete them from the "
              "shipped chart (it looks like a normal advance and this reader "
              "stays green). Commit the local history first, then sync.",
              file=sys.stderr)
        return 2

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

    def entries(root: Path, rel: str, rows):
        """Write a multi-row history — the shape the guard cases need, because
        mk() writes ONE row and a one-row history has no gaps and no lost rows.
        (2026-11-21 Beat 22: the first version of the two gap cases called mk()
        and then... nothing — the multi-row block was never inserted, so the
        cases ran on a single fresh row and passed trivially at rc=0. A case
        whose fixture is not the fixture it claims is the week's recurring
        failure; this helper exists so the rows are written in one place.)"""
        (root / "data").mkdir(parents=True, exist_ok=True)
        (root / "src/lib/data").mkdir(parents=True, exist_ok=True)
        rows = [{"date": d, "balance": b} for d, b in rows]
        (root / rel).write_text(json.dumps({"entries": rows}, indent=2))

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
        mk(root, "2026-09-25", "25.63", "2026-09-25", "25.63")
        rc = sync(root)
        after = read_newest(root / BUNDLE_REL)
        single = json.loads((root / SINGLE_REL).read_text())
        sv = single["balance_infos"][0]["total_balance"]
        ok = (rc == 0 and after == ("ok", "2026-09-25", "25.63") and sv == "25.63")
        print(f"  {'✅' if ok else '❌'} sync copies local -> bundle+single "
              f"(bundle {after[1]}/{after[2]}, single ${sv})")
        fail += 0 if ok else 1

    # sync REFUSES when the local file holds dated rows the bundle lacks (10-28)
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        # A row the BUNDLE holds and local lacks: copying local over bundle
        # would delete it. (Before Beat 22 this fixture tested the opposite
        # difference and proved nothing about the truncation it guarded.)
        entries(root, LOCAL_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-25", "25.89"),
        ])
        entries(root, BUNDLE_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-22", "29.45"),
            ("2026-09-25", "25.63"),
        ])
        before = (root / BUNDLE_REL).read_text()
        rc = sync(root)
        after = (root / BUNDLE_REL).read_text()
        ok = rc == 2 and after == before
        print(f"  {'✅' if ok else '❌'} sync refuses uncommitted rows "
              f"(rc={rc}, bundle untouched={after == before})")
        fail += 0 if ok else 1

    # ...and PROCEEDS when the local set is a superset (the ordinary advance:
    # bundle lags, local is ahead — nothing the bundle holds is lost).
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        entries(root, LOCAL_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-22", "29.45"),
            ("2026-09-25", "25.63"),
        ])
        entries(root, BUNDLE_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-25", "25.63"),
        ])
        rc = sync(root)
        got = json.loads((root / BUNDLE_REL).read_text())["entries"]
        ok = rc == 0 and len(got) == 3 and got[-1]["balance"] == "25.63"
        print(f"  {'✅' if ok else '❌'} sync proceeds on the ordinary advance "
              f"(local superset) (rc={rc}, rows={len(got)})")
        fail += 0 if ok else 1

    # sync names the local GAPS (2026-11-21 Beat 22). The shipped copy is
    # stale because local has no row for 22 days the bundle kept. Without this
    # line the refusal's advice ("commit the local history first") is
    # unsatisfiable — there is nothing to commit — and the truth (the bundle is
    # the only record of those days) stays hidden. The branch must NAME the
    # holes and say the truncating direction is safe; it must NOT flip into the
    # "repair local first" branch, whose advice is the opposite.
    import io, contextlib
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        # local (span 09-19..09-25) SKIPS 09-20/09-21/09-23/09-24, so those
        # are gap days; the bundle carries all six. Lost rows = the three the
        # bundle kept and local never had (09-20, 09-21, 09-24) — each one on a
        # gap day, which is exactly the real 11-21 shape. NOTE: mk() is NOT
        # called here; it writes a single row and would overwrite these.
        entries(root, LOCAL_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-22", "30.18"),
            ("2026-09-25", "25.63"),
        ])
        entries(root, BUNDLE_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-20", "34.00"),
            ("2026-09-21", "31.10"),
            ("2026-09-22", "30.18"),
            ("2026-09-24", "27.40"),
            ("2026-09-25", "25.63"),
        ])
        before = (root / BUNDLE_REL).read_text()
        err = io.StringIO()
        with contextlib.redirect_stderr(err), contextlib.redirect_stdout(io.StringIO()):
            rc = sync(root)
        msg = err.getvalue()
        after = (root / BUNDLE_REL).read_text()
        ok = (rc == 2 and after == before
              and "no row for 4 day(s)" in msg
              and "2026-09-20" in msg and "2026-09-24" in msg
              and "3 of the row(s)" in msg
              and "the bundle is the ONLY record" in msg
              and "repair local first" not in msg)
        print(f"  {'✅' if ok else '❌'} sync NAMES local gap days and the safe direction "
              f"(rc={rc}, holes said={'no row for 4 day(s)' in msg}, "
              f"lost-nothing said={'the bundle is the ONLY record' in msg}, "
              f"wrong-branch={'repair local first' in msg})")
        fail += 0 if ok else 1

    # ...and must NOT claim the truncating direction is safe when a lost row
    # falls on a day local DOES have. HONEST BOUND, named because the first
    # draft of this case was VACUOUS: a lost row is by definition one the
    # bundle has and local lacks, so it can never sit on a day local holds —
    # the condition is unreachable through the file shape, and no fixture can
    # produce it. What the negative case CAN pin is the predicate itself: with
    # a lost row that is NOT among the local gaps (local and bundle carry
    # different date sets), the safe-direction sentence must stay off. That is
    # the branch that protects a future change which loosens the predicate.
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        entries(root, LOCAL_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-22", "29.45"),
            ("2026-09-25", "25.63"),
        ])
        entries(root, BUNDLE_REL, [
            ("2026-09-19", "35.79"),
            ("2026-09-20", "34.00"),
            ("2026-09-21", "31.10"),
            ("2026-09-22", "29.45"),
            ("2026-09-24", "27.40"),
            ("2026-09-25", "25.63"),
        ])
        err = io.StringIO()
        with contextlib.redirect_stderr(err), contextlib.redirect_stdout(io.StringIO()):
            rc = sync(root)
        msg = err.getvalue()
        # every lost row here IS a gap day -> the safe sentence belongs; this
        # asserts the predicate is not accidentally inverted.
        ok = (rc == 2 and "the bundle is the ONLY record" in msg
              and "repair local first" not in msg)
        print(f"  {'✅' if ok else '❌'} safe-direction predicate is the GAP test, "
              f"not its inverse (rc={rc})")
        fail += 0 if ok else 1

    total = len(cases) + 9
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
