# Typography Reference

## Type Scales

**Quick generation:** Run `scripts/type-scale.py --ratio 1.250 --format css` to generate any scale.

### Major Third (1.250) — Balanced, Professional
```
Base: 16px (1rem)
Caption:  10.24px (0.64rem)
Small:    12.8px  (0.8rem)
Body:     16px    (1rem)
Large:    20px    (1.25rem)
H4:       25px    (1.563rem)
H3:       31.25px (1.953rem)
H2:       39px    (2.441rem)
H1:       49px    (3.052rem)
Display:  61px    (3.815rem)
```

### Perfect Fourth (1.333) — More Contrast
```
Base: 16px (1rem)
Caption:  9px     (0.563rem)
Small:    12px    (0.75rem)
Body:     16px    (1rem)
Large:    21.33px (1.333rem)
H4:       28.43px (1.777rem)
H3:       37.90px (2.369rem)
H2:       50.52px (3.157rem)
H1:       67.34px (4.209rem)
Display:  89.77px (5.610rem)
```

### Golden Ratio (1.618) — Dramatic
```
Base: 16px (1rem)
Caption:  6.10px  (0.382rem)
Small:    9.89px  (0.618rem)
Body:     16px    (1rem)
Large:    25.89px (1.618rem)
H4:       41.89px (2.618rem)
H3:       67.77px (4.236rem)
H2:       109.66px (6.854rem)
```

**Recommendation:** Major Third for most UI work. Perfect Fourth for editorial. Golden Ratio for dramatic landing pages.

---

## CSS Implementation

```css
:root {
  /* Major Third scale */
  --font-size-xs:  0.64rem;
  --font-size-sm:  0.8rem;
  --font-size-base: 1rem;
  --font-size-lg:  1.25rem;
  --font-size-xl:  1.563rem;
  --font-size-2xl: 1.953rem;
  --font-size-3xl: 2.441rem;
  --font-size-4xl: 3.052rem;

  --line-height-tight:   1.25;
  --line-height-normal:  1.5;
  --line-height-relaxed: 1.75;

  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
}
```

---

## Line Height Guidelines

| Context | Line Height | Why |
|---------|------------|-----|
| Headings | 1.2–1.3 | Tight for impact, headings are short |
| Body text | 1.5–1.75 | Comfortable reading for paragraphs |
| Captions | 1.4–1.5 | Compact but still clear |

---

## Line Length (Measure)

- Optimal range: 45–75 characters per line
- Ideal: 65 characters (`max-width: 65ch`)
- Too narrow (under 40ch): excessive line breaks, jarring reading rhythm
- Too wide (over 80ch): eyes lose their place when returning to the next line

---

## Font Pairing Principles

**Contrast:** Serif headings + Sans-serif body (classic, editorial)
**Harmony:** Same family, different weights (subtle, unified)
**Personality:** Display font for headings + Neutral for body (branded)

---

## Font Stacks

### System Fonts (No Loading)
```css
--font-sans:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-serif: Georgia, Cambria, "Times New Roman", serif;
--font-mono:  "SF Mono", Monaco, "Cascadia Code", Consolas, monospace;
```

### Web Fonts (Google Fonts)
```css
--font-display: "Playfair Display", serif;     /* Elegant headings */
--font-body:    "Inter", sans-serif;            /* Clean body text */
--font-accent:  "Space Grotesk", sans-serif;    /* Modern accent */
```

System font stacks eliminate font loading entirely — fastest possible text rendering. Use web fonts only when brand identity requires it.
