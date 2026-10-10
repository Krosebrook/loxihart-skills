# Typography System

Font choices, scale, pairing rules, and loading patterns for frontend-design outputs.

---

## Core Rule

Font choice is a design decision. It is locked in the brief.
Never default to system-ui, Inter, Roboto, or Arial as primary typeface.
These are acceptable as fallback in font stacks — never as the named choice.

---

## Approved Profile Fonts

### Loxihart Profile
```
Heading:  Space Grotesk 700 — geometric, technical, authoritative
Body:     Inter 400/500 — neutral legibility, high density
Code:     IBM Plex Mono — structured, readable, brand-consistent
```

### FlashFusion Profile
```
Heading:  Instrument Serif 400 — editorial, grounded, authoritative
Body:     Geist 400/500 — neutral, high legibility
Code:     Geist Mono 400 — clean, proportional
```

### Custom Profile Options (suggest based on context)
| Aesthetic | Display | Body | Code |
|---|---|---|---|
| Editorial/magazine | Playfair Display | Source Serif 4 | — |
| Brutalist/raw | Bebas Neue | Space Mono | Space Mono |
| Luxury/refined | Cormorant Garamond | Jost | — |
| Retro-tech | Share Tech Mono | DM Sans | Share Tech Mono |
| Soft/organic | Fraunces | Nunito | — |
| Industrial | Barlow Condensed | Barlow | Fira Code |
| Art deco | Josefin Sans | EB Garamond | — |

---

## Type Scale

### Loxihart Scale (dense, information-heavy)
```css
--text-xs:   11px;   /* timestamps, labels, badges */
--text-sm:   13px;   /* secondary body, table cells */
--text-base: 14px;   /* primary body */
--text-md:   16px;   /* section labels, form labels */
--text-lg:   20px;   /* card headers, subsection titles */
--text-xl:   24px;   /* page titles */
--text-2xl:  32px;   /* hero metrics, stat callouts */
```

### FlashFusion Scale (breathing room, consumer-grade)
```css
--text-xs:   12px;
--text-sm:   14px;
--text-base: 16px;
--text-md:   20px;
--text-lg:   24px;
--text-xl:   32px;
--text-2xl:  48px;
--text-3xl:  64px;
```

---

## Line Height

```css
--leading-tight:   1.2;  /* headlines, large display text */
--leading-snug:    1.35; /* subheadings, UI labels */
--leading-normal:  1.5;  /* body text */
--leading-relaxed: 1.65; /* prose, long-form content */
```

---

## Font Loading Pattern

**Google Fonts — preferred for Claude artifacts:**

```html
<!-- Preconnect first -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load only needed weights — never load all -->
<!-- Loxihart example -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">

<!-- FlashFusion example -->
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
```

```css
/* Always include font-display: swap behavior — Google Fonts includes this
   when using display=swap param. For self-hosted, add explicitly: */
@font-face {
  font-display: swap;
}
```

---

## Font Stack Pattern

Always include a fallback chain. Never single-font:

```css
/* Space Grotesk */
font-family: 'Space Grotesk', 'DM Sans', sans-serif;

/* Instrument Serif */
font-family: 'Instrument Serif', Georgia, serif;

/* Geist */
font-family: 'Geist', system-ui, sans-serif;

/* IBM Plex Mono */
font-family: 'IBM Plex Mono', 'Fira Code', monospace;

/* Geist Mono */
font-family: 'Geist Mono', 'Courier New', monospace;
```

---

## Typographic Rules

**Weights**
- Max 2 weights per component
- Never bold body text for emphasis alone — use color or spacing
- Display/hero text: 700–800. Body: 400–500. Labels: 500–600.

**Sizing**
- Never go below 11px for any rendered text
- Body copy minimum: 14px on desktop, 16px on mobile
- Prose max-width: 65ch — never let paragraphs stretch full-width

**Spacing**
- Letter-spacing on uppercase labels: 0.05em–0.08em
- Letter-spacing on headings > 32px: -0.01em to -0.02em (optical tightening)
- Never positive letter-spacing on body text

**Hierarchy**
- Every screen has exactly one h1 — not multiple
- Heading levels are semantic, not just visual sizing
- Date / metadata / secondary text: use `--text-secondary` color, not smaller font

---

## Anti-Patterns

| Pattern | Why it fails |
|---|---|
| `font-family: Inter` as the only font | 40% of AI UIs. Instant generic signal. |
| All caps body text | Destroys readability. Use sparingly for labels only. |
| Font size below 11px | Inaccessible. WCAG failure. |
| 3+ font families | Visual noise. One display + one body is the ceiling. |
| Unloaded Google Font (no preconnect) | Layout shift on load. |
| Bold used for color-only emphasis | Redundant + creates weight bloat. |
