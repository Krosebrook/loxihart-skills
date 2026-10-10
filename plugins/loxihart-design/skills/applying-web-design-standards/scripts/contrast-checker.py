#!/usr/bin/env python3
"""
contrast-checker.py — WCAG 2.2 contrast ratio calculator

Usage:
  python scripts/contrast-checker.py "#3b82f6" "#ffffff"
  python scripts/contrast-checker.py "hsl(240,75%,55%)" "#fff"

Checks WCAG 2.2 AA requirements:
  Normal text (< 18px):    4.5:1 minimum
  Large text (>= 18px):    3:1 minimum
  UI components/graphics:  3:1 minimum
"""

import sys
import re
import math


def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def hsl_to_rgb(h, s, l):
    s, l = s / 100, l / 100
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = l - c / 2
    if h < 60:   r1, g1, b1 = c, x, 0
    elif h < 120: r1, g1, b1 = x, c, 0
    elif h < 180: r1, g1, b1 = 0, c, x
    elif h < 240: r1, g1, b1 = 0, x, c
    elif h < 300: r1, g1, b1 = x, 0, c
    else:         r1, g1, b1 = c, 0, x
    return (round((r1+m)*255), round((g1+m)*255), round((b1+m)*255))


def parse_color(s):
    s = s.strip()
    if s.startswith('#'):
        return hex_to_rgb(s)
    m = re.match(r'hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)', s)
    if m:
        return hsl_to_rgb(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    m = re.match(r'rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)', s)
    if m:
        return tuple(int(x) for x in m.groups())
    raise ValueError(f"Cannot parse: {s}")


def luminance(r, g, b):
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(c1, c2):
    l1, l2 = luminance(*c1), luminance(*c2)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)


if len(sys.argv) < 3:
    print("Usage: python contrast-checker.py <foreground> <background>")
    sys.exit(1)

fg, bg = parse_color(sys.argv[1]), parse_color(sys.argv[2])
ratio = contrast(fg, bg)

print(f"Contrast: {ratio:.2f}:1")
print(f"  {'PASS' if ratio >= 4.5 else 'FAIL'}  Normal text  (need 4.5:1)")
print(f"  {'PASS' if ratio >= 3.0 else 'FAIL'}  Large text   (need 3.0:1)")
print(f"  {'PASS' if ratio >= 3.0 else 'FAIL'}  UI elements  (need 3.0:1)")
