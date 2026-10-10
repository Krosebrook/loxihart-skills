#!/usr/bin/env python3
"""slopcheck — validate and apply the anti-slop corpus.

Modes:
  --self-test (default)  Compile every rule; assert ex_match hit and ex_clean
                         miss; assert lexicon single-tier membership; assert
                         morphology cases.
  --scan PATH [PATH...]  Lint text files: BAN hits = errors, FLAG = warnings,
                         DENSITY counted per 1000 words vs thresholds.
  --calibrate PATH...    Scan known-good docs; emit YAML threshold_overrides
                         for any DENSITY rule/term they breach (observed max
                         x1.25). Redirect stdout to overrides.yaml.
  --overrides FILE       Apply calibrated thresholds at scan time.
  --allow FILE           YAML list of rule ids / lexicon terms to skip.

Exit codes: 0 clean · 1 findings/test failures · 2 config error.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:  # pragma: no cover
    print("slopcheck: pyyaml missing — pip install pyyaml", file=sys.stderr)
    sys.exit(2)

__version__ = "0.4.0"

ROOT = Path(__file__).resolve().parent
FLAG_MAP = {"IGNORECASE": re.IGNORECASE, "MULTILINE": re.MULTILINE, "DOTALL": re.DOTALL}


def find_corpus(filename: str) -> Path:
    """Resolve a corpus file next to the script or in ../references (skill layout)."""
    for cand in (ROOT / filename, ROOT.parent / "references" / filename):
        if cand.exists():
            return cand
    return ROOT / filename  # load_yaml will report the miss


def load_yaml(path: Path) -> dict[str, Any]:
    try:
        with path.open(encoding="utf-8") as fh:
            data = yaml.safe_load(fh)
    except FileNotFoundError:
        print(f"slopcheck: missing file: {path}", file=sys.stderr)
        sys.exit(2)
    except yaml.YAMLError as exc:
        print(f"slopcheck: YAML parse error in {path}: {exc}", file=sys.stderr)
        sys.exit(2)
    if not isinstance(data, dict):
        print(f"slopcheck: {path} did not parse to a mapping", file=sys.stderr)
        sys.exit(2)
    return data


def compile_rule(rule: dict[str, Any]) -> re.Pattern[str] | None:
    if rule.get("manual"):
        return None
    flags = 0 if rule.get("case_sensitive") else re.IGNORECASE
    for name in rule.get("flags", []) or []:
        flags |= FLAG_MAP.get(name, 0)
    try:
        return re.compile(rule["regex"], flags)
    except re.error as exc:
        raise ValueError(f"rule {rule.get('id', '?')}: bad regex: {exc}") from exc


def lexicon_terms(lex: dict[str, Any]) -> dict[str, list[str]]:
    """Flatten lexicon tiers to {tier_name: [terms]}."""
    out: dict[str, list[str]] = {}
    for tier in ("tier1_ban", "tier2_flag", "tier3_density"):
        terms: list[str] = []
        block = lex.get(tier, {}) or {}
        for kind in ("words", "phrases"):
            for entry in block.get(kind, []) or []:
                term = entry["term"] if isinstance(entry, dict) else entry
                terms.append(str(term).lower())
        out[tier] = terms
    return out


def term_regex(term: str) -> re.Pattern[str]:
    return re.compile(r"\b" + re.escape(term) + r"\b", re.IGNORECASE)


def lemma_regex(term: str) -> re.Pattern[str]:
    """Inflection-aware whole-word matching (suffix heuristic, not a stemmer).

    Covers: -s/-es/-ed/-ing/-ly, e-drop (delve→delving), y→ies
    (tapestry→tapestries), and space<->hyphen flex + plural for compounds
    (game-changer→game changers). Does NOT cover -ness/-ation/-istic.
    """
    if " " in term or "-" in term:
        parts = [re.escape(p) for p in re.split(r"[ -]+", term) if p]
        joined = r"[\s-]+".join(parts)
        return re.compile(rf"\b{joined}(?:s|es)?\b", re.IGNORECASE)
    base = re.escape(term)
    if term.endswith("e"):
        stem = re.escape(term[:-1])
        return re.compile(rf"\b{stem}(?:e|es|ed|ing)\b", re.IGNORECASE)
    if term.endswith("y"):
        stem = re.escape(term[:-1])
        return re.compile(rf"\b(?:{base}s?|{stem}(?:ies|ied))\b", re.IGNORECASE)
    return re.compile(rf"\b{base}(?:s|es|ed|ing|ly)?\b", re.IGNORECASE)


def self_test(patterns: dict[str, Any], lexicon: dict[str, Any]) -> int:
    failures: list[str] = []
    rules = patterns.get("rules", []) or []
    compiled = 0
    for rule in rules:
        rid = rule.get("id", "?")
        try:
            rx = compile_rule(rule)
        except ValueError as exc:
            failures.append(str(exc))
            continue
        if rx is None:
            continue
        compiled += 1
        for ex in rule.get("ex_match", []) or []:
            if not rx.search(ex):
                failures.append(f"{rid}: ex_match not matched: {ex!r}")
        for ex in rule.get("ex_clean", []) or []:
            if rx.search(ex):
                failures.append(f"{rid}: ex_clean falsely matched: {ex!r}")

    tiers = lexicon_terms(lexicon)
    seen: dict[str, str] = {}
    for tier, terms in tiers.items():
        for term in terms:
            if term in seen:
                failures.append(f"lexicon: {term!r} in both {seen[term]} and {tier}")
            seen[term] = tier
    morph_cases: list[tuple[str, str, bool]] = [
        ("delve", "They delved into the archives.", True),
        ("delve", "the delta was delivered", False),
        ("tapestry", "woven tapestries of meaning", True),
        ("foster", "fostering a culture of trust", True),
        ("game-changer", "these are game changers", True),
        ("robust", "robustness testing", False),  # -ness is out of scope, by design
    ]
    for lemma, sample, expect in morph_cases:
        got = bool(lemma_regex(lemma).search(sample))
        if got != expect:
            failures.append(
                f"morphology: {lemma!r} vs {sample!r} — expected {expect}, got {got}"
            )
    for term in list(seen)[:50]:  # spot-compile a sample of term regexes
        lemma_regex(term)

    declared = (patterns.get("meta", {}) or {}).get("rule_count")
    if declared is not None and declared != len(rules):
        failures.append(f"meta.rule_count={declared} but {len(rules)} rules present")

    total_terms = sum(len(v) for v in tiers.values())
    if failures:
        print(f"SELF-TEST FAIL — {len(failures)} problem(s):")
        for f in failures:
            print(f"  ✗ {f}")
        return 1
    print(
        f"SELF-TEST PASS — {len(rules)} rules ({compiled} compiled, "
        f"{len(rules) - compiled} manual), {total_terms} lexicon terms "
        f"({len(tiers['tier1_ban'])} ban / {len(tiers['tier2_flag'])} flag / "
        f"{len(tiers['tier3_density'])} density), single-tier membership OK."
    )
    return 0


def density_limits(lexicon: dict[str, Any]) -> dict[str, float]:
    block = lexicon.get("tier3_density", {}) or {}
    default = float(block.get("default_max_per_1000", 2))
    limits: dict[str, float] = {}
    for kind in ("words", "phrases"):
        for entry in block.get(kind, []) or []:
            if isinstance(entry, dict):
                limits[str(entry["term"]).lower()] = float(entry.get("max", default))
            else:
                limits[str(entry).lower()] = default
    return limits


def scan_file(
    path: Path,
    patterns: dict[str, Any],
    lexicon: dict[str, Any],
    overrides: dict[str, float] | None = None,
    allow: set[str] | None = None,
) -> tuple[int, int]:
    """Return (errors, warnings) for one file."""
    overrides = overrides or {}
    allow = allow or set()
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        print(f"  ✗ cannot read {path}: {exc}", file=sys.stderr)
        return (1, 0)
    words = max(len(re.findall(r"\w+", text)), 1)
    per_1000 = 1000.0 / words
    density_ok = words >= 150  # per-1000 rates are noise on tiny samples
    if not density_ok:
        print(f"  note  {words} words < 150 — DENSITY tiers skipped (rates unreliable)")
    errors = warnings = 0
    lines = text.splitlines()

    def lineno(pos: int) -> int:
        return text.count("\n", 0, pos) + 1

    for rule in patterns.get("rules", []) or []:
        if str(rule.get("id", "")).lower() in allow:
            continue
        rx = compile_rule(rule)
        if rx is None:
            continue
        hits = list(rx.finditer(text))
        if not hits:
            continue
        tier = rule.get("tier", "FLAG")
        rid = rule.get("id", "?")
        if tier == "BAN":
            errors += len(hits)
            for h in hits[:5]:
                print(f"  ERROR {rid} L{lineno(h.start())}: {h.group(0)[:60]!r} — {rule.get('fix', '')}")
            if len(hits) > 5:
                print(f"  ERROR {rid}: +{len(hits) - 5} more")
        elif tier == "FLAG":
            warnings += len(hits)
            print(f"  warn  {rid}: {len(hits)} hit(s), first L{lineno(hits[0].start())}")
        else:  # DENSITY
            if not density_ok:
                continue
            rate = len(hits) * per_1000
            thr = float(overrides.get(rid, rule.get("threshold_per_1000", 2)))
            if rate > thr:
                warnings += 1
                print(f"  warn  {rid}: density {rate:.1f}/1000 > {thr}/1000 ({len(hits)} hits)")

    tiers = lexicon_terms(lexicon)
    limits = density_limits(lexicon)
    for term in tiers["tier1_ban"]:
        if term in allow:
            continue
        hits = list(lemma_regex(term).finditer(text))
        if hits:
            errors += len(hits)
            print(f"  ERROR lexicon-t1 {term!r}: {len(hits)} hit(s), first L{lineno(hits[0].start())}")
    for term in tiers["tier2_flag"]:
        if term in allow:
            continue
        n = len(lemma_regex(term).findall(text))
        if n:
            warnings += n
            print(f"  warn  lexicon-t2 {term!r}: {n} hit(s) — check context")
    for term, cap in limits.items():
        if not density_ok:
            break
        if term in allow:
            continue
        cap = float(overrides.get(term, cap))
        n = len(lemma_regex(term).findall(text))
        rate = n * per_1000
        if rate > cap:
            warnings += 1
            print(f"  warn  lexicon-t3 {term!r}: {rate:.1f}/1000 > {cap}/1000 ({n} hits)")

    _ = lines  # reserved for future context display
    return (errors, warnings)


def calibrate(paths: list[str], patterns: dict[str, Any], lexicon: dict[str, Any]) -> int:
    """Measure DENSITY rates on known-good docs; emit YAML threshold overrides."""
    texts: list[str] = []
    for p in paths:
        try:
            texts.append(Path(p).read_text(encoding="utf-8", errors="replace"))
        except OSError as exc:
            print(f"slopcheck: cannot read {p}: {exc}", file=sys.stderr)
            return 2
    suggestions: dict[str, float] = {}

    def observed_max(rx: re.Pattern[str]) -> float:
        best = 0.0
        for text in texts:
            words = max(len(re.findall(r"\w+", text)), 1)
            if words < 150:
                continue
            best = max(best, len(rx.findall(text)) * 1000.0 / words)
        return best

    for rule in patterns.get("rules", []) or []:
        if rule.get("tier") != "DENSITY":
            continue
        rx = compile_rule(rule)
        if rx is None:
            continue
        thr = float(rule.get("threshold_per_1000", 2))
        rate = observed_max(rx)
        if rate > thr:
            suggestions[rule["id"]] = round(rate * 1.25, 1)
    for term, cap in density_limits(lexicon).items():
        rate = observed_max(lemma_regex(term))
        if rate > cap:
            suggestions[term] = round(rate * 1.25, 1)

    print("# slopcheck calibration — clean-doc breaches, suggested new thresholds")
    print("# save as overrides.yaml and pass via --overrides")
    print("threshold_overrides:")
    if not suggestions:
        print("  {}  # no breaches — shipped thresholds hold for this corpus")
    for key, val in sorted(suggestions.items()):
        print(f"  {key}: {val}")
    return 0


def load_overrides(path: str | None) -> dict[str, float]:
    if not path:
        return {}
    data = load_yaml(Path(path))
    block = data.get("threshold_overrides", data)
    if not isinstance(block, dict):
        print(f"slopcheck: {path}: threshold_overrides must be a mapping", file=sys.stderr)
        sys.exit(2)
    return {str(k): float(v) for k, v in block.items()}


def load_allow(path: str | None) -> set[str]:
    if not path:
        return set()
    data = load_yaml(Path(path))
    items = data.get("allow", data if isinstance(data, list) else [])
    if not isinstance(items, list):
        print(f"slopcheck: {path}: allow must be a list", file=sys.stderr)
        sys.exit(2)
    return {str(x).lower() for x in items}


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--self-test", action="store_true", help="validate the corpus (default)")
    ap.add_argument("--scan", nargs="+", metavar="PATH", help="lint text file(s)")
    ap.add_argument("--calibrate", nargs="+", metavar="PATH", help="measure clean docs, emit threshold overrides")
    ap.add_argument("--overrides", metavar="FILE", help="YAML threshold_overrides mapping")
    ap.add_argument("--allow", metavar="FILE", help="YAML allow-list of rule ids / terms to skip")
    ap.add_argument("--patterns", default=str(find_corpus("patterns.yaml")))
    ap.add_argument("--lexicon", default=str(find_corpus("lexicon.yaml")))
    args = ap.parse_args(argv)

    patterns = load_yaml(Path(args.patterns))
    lexicon = load_yaml(Path(args.lexicon))

    if args.calibrate:
        return calibrate(args.calibrate, patterns, lexicon)

    if args.scan:
        overrides = load_overrides(args.overrides)
        allow = load_allow(args.allow)
        total_e = total_w = 0
        for p in args.scan:
            path = Path(p)
            print(f"— scanning {path}")
            e, w = scan_file(path, patterns, lexicon, overrides, allow)
            total_e += e
            total_w += w
        print(f"scan complete: {total_e} error(s), {total_w} warning(s)")
        return 1 if total_e or total_w else 0

    return self_test(patterns, lexicon)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BrokenPipeError:
        # stdout consumer (head, less) closed early — findings already flowed
        import os

        os.dup2(os.open(os.devnull, os.O_WRONLY), sys.stdout.fileno())
        sys.exit(1)
