#!/usr/bin/env python3
"""
contrast-checker.py — WCAG 2.2 contrast ratio calculator

Usage:
  python scripts/contrast-checker.py "#3b82f6" "#ffffff"
  python scripts/contrast-checker.py "rgb(59,130,246)" "#fff"
  python scripts/contrast-checker.py "#333" "#f5f5f5" --verbose

Checks against WCAG 2.2 AA requirements:
  Normal text (< 18px):    4.5:1 minimum
  Large text (>= 18px):    3:1 minimum
  UI components/graphics:  3:1 minimum
"""

import sys
import re


def hex_to_rgb(hex_str):
    """Convert hex color to RGB tuple."""
    h = hex_str.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def rgb_str_to_tuple(rgb_str):
    """Convert 'rgb(r,g,b)' string to tuple."""
    match = re.match(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', rgb_str)
    if match:
        return tuple(int(x) for x in match.groups())
    return None


def parse_color(color_str):
    """Parse any color format to RGB tuple."""
    color_str = color_str.strip()
    if color_str.startswith('#'):
        return hex_to_rgb(color_str)
    if color_str.startswith('rgb'):
        return rgb_str_to_tuple(color_str)
    raise ValueError(f"Unsupported color format: {color_str}")


def relative_luminance(r, g, b):
    """Calculate relative luminance per WCAG 2.2 spec."""
    def linearize(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)


def contrast_ratio(color1, color2):
    """Calculate contrast ratio between two RGB tuples."""
    l1 = relative_luminance(*color1)
    l2 = relative_luminance(*color2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def main():
    if len(sys.argv) < 3:
        print('Usage: python contrast-checker.py <foreground> <background> [--verbose]')
        print('  Formats: "#3b82f6", "#fff", "rgb(59,130,246)"')
        sys.exit(1)

    fg_str = sys.argv[1]
    bg_str = sys.argv[2]
    verbose = '--verbose' in sys.argv

    try:
        fg = parse_color(fg_str)
        bg = parse_color(bg_str)
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)

    ratio = contrast_ratio(fg, bg)

    # WCAG 2.2 AA thresholds
    passes_normal = ratio >= 4.5
    passes_large = ratio >= 3.0
    passes_ui = ratio >= 3.0

    print(f"Foreground: {fg_str} → rgb({fg[0]}, {fg[1]}, {fg[2]})")
    print(f"Background: {bg_str} → rgb({bg[0]}, {bg[1]}, {bg[2]})")
    print(f"Contrast ratio: {ratio:.2f}:1")
    print()
    print(f"{'PASS' if passes_normal else 'FAIL'} Normal text (< 18px):   {ratio:.2f}:1 (need 4.5:1)")
    print(f"{'PASS' if passes_large else 'FAIL'}  Large text (>= 18px):  {ratio:.2f}:1 (need 3.0:1)")
    print(f"{'PASS' if passes_ui else 'FAIL'}  UI components:         {ratio:.2f}:1 (need 3.0:1)")

    if verbose:
        l_fg = relative_luminance(*fg)
        l_bg = relative_luminance(*bg)
        print(f"\nForeground luminance: {l_fg:.4f}")
        print(f"Background luminance: {l_bg:.4f}")

    sys.exit(0 if passes_normal else 1)


if __name__ == '__main__':
    main()
