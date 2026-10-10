#!/usr/bin/env python3
"""
palette-generator.py — Generate a 9-step HSL color palette from a base hue

Usage:
  python scripts/palette-generator.py 240
  python scripts/palette-generator.py 240 --format css
  python scripts/palette-generator.py 240 --format json
  python scripts/palette-generator.py 240 --name blue --format css

Args:
  hue: 0-360 (red=0, orange=30, yellow=60, green=120, cyan=180, blue=240, purple=270, pink=330)

Options:
  --name NAME    Color name for CSS variable prefix (default: "primary")
  --format FMT   Output format: css, json, or both (default: both)
  --saturation N Base saturation percentage (default: 75)

Generates a 9-step scale (50-900) following the pattern:
  Lightest steps: high lightness, high saturation
  Darkest steps: low lightness, reduced saturation (avoids oversaturation)
"""

import sys
import json


def generate_palette(hue, name="primary", base_saturation=75):
    """Generate 9-step HSL palette from a single hue."""
    steps = [
        {"step": 50,  "s": min(base_saturation + 25, 100), "l": 97},
        {"step": 100, "s": min(base_saturation + 20, 100), "l": 92},
        {"step": 200, "s": min(base_saturation + 15, 100), "l": 85},
        {"step": 300, "s": min(base_saturation + 10, 100), "l": 75},
        {"step": 400, "s": min(base_saturation + 5, 100),  "l": 65},
        {"step": 500, "s": base_saturation,                 "l": 55},
        {"step": 600, "s": max(base_saturation - 5, 20),    "l": 45},
        {"step": 700, "s": max(base_saturation - 10, 20),   "l": 35},
        {"step": 800, "s": max(base_saturation - 15, 20),   "l": 25},
        {"step": 900, "s": max(base_saturation - 20, 20),   "l": 15},
    ]

    palette = []
    for s in steps:
        palette.append({
            "step": s["step"],
            "hsl": f"hsl({hue}, {s['s']}%, {s['l']}%)",
            "name": f"{name}-{s['step']}",
        })
    return palette


def to_css(palette):
    """Convert palette to CSS custom properties."""
    lines = [":root {"]
    for color in palette:
        lines.append(f"  --{color['name']}: {color['hsl']};")
    lines.append("}")
    return "\n".join(lines)


def to_json(palette):
    """Convert palette to JSON token format."""
    tokens = {}
    for color in palette:
        tokens[str(color["step"])] = {"value": color["hsl"]}
    return json.dumps(tokens, indent=2)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    hue = int(sys.argv[1])
    if hue < 0 or hue > 360:
        print("Hue must be 0-360")
        sys.exit(1)

    name = "primary"
    fmt = "both"
    saturation = 75

    if "--name" in sys.argv:
        name = sys.argv[sys.argv.index("--name") + 1]
    if "--format" in sys.argv:
        fmt = sys.argv[sys.argv.index("--format") + 1]
    if "--saturation" in sys.argv:
        saturation = int(sys.argv[sys.argv.index("--saturation") + 1])

    palette = generate_palette(hue, name, saturation)

    print(f"Generated palette for hue {hue} ({name}):")
    print()

    if fmt in ("css", "both"):
        print("/* CSS Custom Properties */")
        print(to_css(palette))
        print()

    if fmt in ("json", "both"):
        print("/* JSON Tokens */")
        print(to_json(palette))


if __name__ == "__main__":
    main()
