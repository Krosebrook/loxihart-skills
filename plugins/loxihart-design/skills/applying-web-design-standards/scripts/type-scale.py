#!/usr/bin/env python3
"""
type-scale.py — Calculate a typographic scale from a ratio

Usage:
  python scripts/type-scale.py
  python scripts/type-scale.py --ratio 1.333
  python scripts/type-scale.py --ratio 1.618 --base 18 --format css

Options:
  --ratio N    Scale ratio (default: 1.250 / Major Third)
  --base N     Base font size in px (default: 16)
  --format FMT Output format: table, css, or json (default: table)

Common ratios:
  1.067  Minor Second
  1.125  Major Second
  1.200  Minor Third
  1.250  Major Third (recommended)
  1.333  Perfect Fourth
  1.414  Augmented Fourth
  1.500  Perfect Fifth
  1.618  Golden Ratio
"""

import sys
import json


SCALE_NAMES = [
    ("xs", "Caption"),
    ("sm", "Small"),
    ("base", "Body"),
    ("lg", "Large"),
    ("xl", "H4"),
    ("2xl", "H3"),
    ("3xl", "H2"),
    ("4xl", "H1"),
    ("5xl", "Display"),
]

RATIO_NAMES = {
    1.067: "Minor Second",
    1.125: "Major Second",
    1.200: "Minor Third",
    1.250: "Major Third",
    1.333: "Perfect Fourth",
    1.414: "Augmented Fourth",
    1.500: "Perfect Fifth",
    1.618: "Golden Ratio",
}


def calculate_scale(base=16, ratio=1.250):
    """Calculate type scale values."""
    # base is index 2 (the "base" step)
    base_index = 2
    scale = []
    for i, (token, label) in enumerate(SCALE_NAMES):
        exp = i - base_index
        px = base * (ratio ** exp)
        rem = px / 16  # always relative to browser default 16px
        scale.append({
            "token": token,
            "label": label,
            "px": round(px, 2),
            "rem": round(rem, 3),
            "exponent": exp,
        })
    return scale


def format_table(scale, base, ratio):
    """Format as readable table."""
    ratio_name = RATIO_NAMES.get(ratio, "Custom")
    lines = [
        f"Type Scale: {ratio_name} ({ratio})",
        f"Base: {base}px",
        "",
        f"{'Token':<8} {'Label':<10} {'px':>10} {'rem':>10}",
        f"{'─'*8} {'─'*10} {'─'*10} {'─'*10}",
    ]
    for s in scale:
        marker = " ◀" if s["token"] == "base" else ""
        lines.append(f"{s['token']:<8} {s['label']:<10} {s['px']:>8.2f}px {s['rem']:>8.3f}rem{marker}")
    return "\n".join(lines)


def format_css(scale):
    """Format as CSS custom properties."""
    lines = [":root {"]
    for s in scale:
        lines.append(f"  --font-size-{s['token']}: {s['rem']}rem; /* {s['px']}px — {s['label']} */")
    lines.append("}")
    return "\n".join(lines)


def format_json(scale):
    """Format as JSON design tokens."""
    tokens = {}
    for s in scale:
        tokens[s["token"]] = {"value": f"{s['rem']}rem"}
    return json.dumps({"fontSize": tokens}, indent=2)


def main():
    base = 16
    ratio = 1.250
    fmt = "table"

    if "--base" in sys.argv:
        base = float(sys.argv[sys.argv.index("--base") + 1])
    if "--ratio" in sys.argv:
        ratio = float(sys.argv[sys.argv.index("--ratio") + 1])
    if "--format" in sys.argv:
        fmt = sys.argv[sys.argv.index("--format") + 1]

    scale = calculate_scale(base, ratio)

    if fmt == "table":
        print(format_table(scale, base, ratio))
    elif fmt == "css":
        print(format_css(scale))
    elif fmt == "json":
        print(format_json(scale))
    else:
        print(f"Unknown format: {fmt}. Use: table, css, json")
        sys.exit(1)


if __name__ == "__main__":
    main()
