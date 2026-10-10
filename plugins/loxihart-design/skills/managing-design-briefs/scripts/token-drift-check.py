#!/usr/bin/env python3
"""
token-drift-check.py
Scans text or code files for deprecated FlashFusion v2 tokens and cross-profile contamination.
Usage:
    python token-drift-check.py <file_or_stdin>
    cat output.html | python token-drift-check.py
    python token-drift-check.py --profile flashfusion output.jsx
"""

import sys
import argparse
import re
from pathlib import Path

# ── Deprecated FlashFusion v2 → v3 (May 2026) ──────────────────────────────
FF_V2_DEPRECATED = [
    ("Instrument Sans",        "Geist",                        "FONT",    "HIGH"),
    ("JetBrains Mono",         "Geist Mono",                   "FONT",    "HIGH"),
    ("Poppins",                "Instrument Serif (heading only)","FONT",   "MEDIUM"),
    ("#0F0618",                "#0B0B14",                       "SURFACE", "HIGH"),
    ("#1A0B2E",                "#13131F",                       "SURFACE", "HIGH"),
    ("#F472B6",                "#EC4899",                       "ACCENT",  "HIGH"),
    ("90deg",                  "135deg (gradient direction)",   "GRADIENT","MEDIUM"),
    ("bg-black",               "rgba bg + blur(12px)",          "CARD",    "HIGH"),
]

# ── Cross-profile contamination ─────────────────────────────────────────────
INT_IN_FF = [
    ("#0a0a0f",                "Loxihart surface — wrong in FlashFusion",   "SURFACE", "HIGH"),
    ("Space Grotesk",          "Loxihart heading font — wrong in FlashFusion","FONT",   "HIGH"),
    ("IBM Plex Mono",          "Loxihart mono font — wrong in FlashFusion",  "FONT",    "HIGH"),
    ("hsl(262, 83%, 68%)",     "Loxihart violet variant — use #8B5CF6",      "ACCENT",  "HIGH"),
    ("hsl(262,83%,68%)",       "Loxihart violet variant (no spaces)",        "ACCENT",  "HIGH"),
]

FF_IN_INT = [
    ("backdrop-filter: blur",  "FlashFusion glass — not for Loxihart",       "EFFECT",  "HIGH"),
    ("blur(12px)",             "FlashFusion blur — not for Loxihart",         "EFFECT",  "HIGH"),
    ("#8B5CF6",                "FlashFusion violet — not for Loxihart",       "ACCENT",  "HIGH"),
    ("#A855F7",                "FlashFusion violet highlight — not Loxihart", "ACCENT",  "HIGH"),
    ("Instrument Serif",       "FlashFusion display font — not Loxihart",    "FONT",    "HIGH"),
    ("Geist Mono",             "FlashFusion mono — not Loxihart",            "FONT",    "HIGH"),
]

SEVERITY_ORDER = {"HIGH": 0, "MEDIUM": 1, "LOW": 2}


def scan(text: str, profile: str = "flashfusion") -> list[dict]:
    findings = []

    # Always scan for v2 deprecated tokens when profile is FlashFusion
    if profile.lower() in ("flashfusion", "ff", "both"):
        for token, replacement, token_type, severity in FF_V2_DEPRECATED:
            if token.lower() in text.lower():
                # Find line numbers
                lines = [i + 1 for i, line in enumerate(text.splitlines())
                         if token.lower() in line.lower()]
                findings.append({
                    "token": token,
                    "replacement": replacement,
                    "type": token_type,
                    "severity": severity,
                    "lines": lines,
                    "category": "FlashFusion v2 deprecated",
                })

    # Cross-profile: Loxihart tokens in FlashFusion output
    if profile.lower() in ("flashfusion", "ff", "both"):
        for token, note, token_type, severity in INT_IN_FF:
            if token.lower() in text.lower():
                lines = [i + 1 for i, line in enumerate(text.splitlines())
                         if token.lower() in line.lower()]
                findings.append({
                    "token": token,
                    "replacement": f"Remove — {note}",
                    "type": token_type,
                    "severity": severity,
                    "lines": lines,
                    "category": "Cross-profile: Loxihart token in FlashFusion",
                })

    # Cross-profile: FlashFusion tokens in Loxihart output
    if profile.lower() in ("int", "both"):
        for token, note, token_type, severity in FF_IN_INT:
            if token.lower() in text.lower():
                lines = [i + 1 for i, line in enumerate(text.splitlines())
                         if token.lower() in line.lower()]
                findings.append({
                    "token": token,
                    "replacement": f"Remove — {note}",
                    "type": token_type,
                    "severity": severity,
                    "lines": lines,
                    "category": "Cross-profile: FlashFusion token in Loxihart",
                })

    # Sort by severity
    findings.sort(key=lambda f: SEVERITY_ORDER.get(f["severity"], 99))
    return findings


def format_report(findings: list[dict], source: str, profile: str) -> str:
    if not findings:
        return (
            f"\n✓ Token drift audit: CLEAN\n"
            f"  Source: {source}\n"
            f"  Profile: {profile.upper()}\n"
            f"  No deprecated tokens or cross-profile contamination found.\n"
        )

    high   = [f for f in findings if f["severity"] == "HIGH"]
    medium = [f for f in findings if f["severity"] == "MEDIUM"]
    low    = [f for f in findings if f["severity"] == "LOW"]

    lines = [
        "",
        "✗ Token drift audit: FAILURES FOUND",
        f"  Source: {source}",
        f"  Profile: {profile.upper()}",
        f"  HIGH: {len(high)}  MEDIUM: {len(medium)}  LOW: {len(low)}",
        "",
    ]

    for severity_label, group in [("HIGH", high), ("MEDIUM", medium), ("LOW", low)]:
        if not group:
            continue
        lines.append(f"── {severity_label} ({'fix required' if severity_label == 'HIGH' else 'document as known risk'}) ──")
        for f in group:
            line_refs = f"line(s) {', '.join(str(l) for l in f['lines'])}" if f["lines"] else "location unknown"
            lines.append(f"  [{f['type']}] {f['token']!r}")
            lines.append(f"    Category:    {f['category']}")
            lines.append(f"    Location:    {line_refs}")
            lines.append(f"    Replace with: {f['replacement']}")
            lines.append("")

    lines.append("Action required: Fix all HIGH findings before delivering.")
    lines.append("Document MEDIUM findings as 'Known risk' in the brief.")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Scan for deprecated FlashFusion v2 tokens and cross-profile contamination."
    )
    parser.add_argument("file", nargs="?", help="File to scan (reads stdin if omitted)")
    parser.add_argument(
        "--profile",
        choices=["flashfusion", "ff", "int", "both"],
        default="flashfusion",
        help="Which profile to check against (default: flashfusion)",
    )
    args = parser.parse_args()

    if args.file:
        path = Path(args.file)
        if not path.exists():
            print(f"Error: file not found: {args.file}", file=sys.stderr)
            sys.exit(1)
        text = path.read_text(encoding="utf-8", errors="replace")
        source = str(path)
    else:
        text = sys.stdin.read()
        source = "stdin"

    findings = scan(text, args.profile)
    print(format_report(findings, source, args.profile))

    # Exit 1 if any HIGH findings — useful for CI / pre-commit hooks
    if any(f["severity"] == "HIGH" for f in findings):
        sys.exit(1)


if __name__ == "__main__":
    main()
