# Layout and Composition Reference

## Table of Contents
- 8-Point Grid
- 12-Column Layout
- Visual Hierarchy
- Composition Rules
- Advanced Techniques

---

## 8-Point Grid

All spacing values are multiples of 8px:

```css
:root {
  --space-0:  0;
  --space-1:  0.5rem;   /* 8px */
  --space-2:  1rem;     /* 16px */
  --space-3:  1.5rem;   /* 24px */
  --space-4:  2rem;     /* 32px */
  --space-5:  2.5rem;   /* 40px */
  --space-6:  3rem;     /* 48px */
  --space-8:  4rem;     /* 64px */
  --space-10: 5rem;     /* 80px */
  --space-12: 6rem;     /* 96px */
  --space-16: 8rem;     /* 128px */
}
```

**Why 8-point:** Divisible by 2 and 4 for easy sub-divisions. Aligns with iOS/Android guidelines. Reduces decision fatigue. Creates visual rhythm.

---

## 12-Column Layout

```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.col-4  { grid-column: span 4; }   /* 1/3 width */
.col-6  { grid-column: span 6; }   /* 1/2 width */
.col-8  { grid-column: span 8; }   /* 2/3 width */
.col-12 { grid-column: span 12; }  /* Full width */

@media (max-width: 768px) {
  .col-md-12 { grid-column: span 12; }
}
```

---

## Visual Hierarchy

### Hierarchy Tools (in order of impact)

1. **Size** — larger elements are seen first
2. **Weight** — bolder elements are more prominent
3. **Color** — high contrast draws attention
4. **Spacing** — more whitespace creates emphasis
5. **Position** — top/left is scanned first

### Reading Patterns

**Z-Pattern** (homepages, landing pages):
Top-left → top-right (diagonal) → bottom-left → bottom-right

**F-Pattern** (content-heavy pages):
Horizontal scan across top → vertical scan down left side → short horizontal scans into content

### Hierarchy Levels in CSS

```css
/* Level 1: Page title */
.title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
}

/* Level 2: Section heading */
.heading {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-top: var(--space-8);
  margin-bottom: var(--space-3);
}

/* Level 3: Body text */
.body {
  font-size: var(--font-size-base);
  font-weight: var(--font-normal);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* Level 4: Caption */
.caption {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}
```

---

## Composition Rules

### Rule of Thirds
Divide canvas into 3x3 grid. Place focal points at intersections for natural balance.

### Golden Ratio (1:1.618)
```
Total width:    1280px
Main content:   790px  (1280 / 1.618)
Sidebar:        490px  (1280 - 790)
```

### Whitespace
- **Macro:** 48–96px between sections (creates breathing room)
- **Micro:** 16–32px between elements (creates grouping)
- More whitespace around an element = more visual importance

### Alignment
- Left-align text (matches Western reading direction)
- Center-align headlines (symmetry, impact)
- Right-align numbers in tables (easier comparison)

### Proximity (Gestalt)
Related items close together, unrelated items farther apart. Creates visual grouping without needing borders or background fills.

---

## Advanced Techniques

### Optical Adjustments

**Overshoot:** Round shapes appear smaller than squares at the same pixel size. Compensate by making circles 2% taller/wider than adjacent squares.

**Visual centering:** Icons inside buttons often need 1px upward shift to appear optically centered, even when mathematically centered.

**Letter spacing:** Tighten tracking for large headings (-0.02em). Loosen for uppercase small text (+0.1em).

```css
h1 { letter-spacing: -0.02em; }
.label-uppercase {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}
```

### Animation Easing

```css
--ease-out:    cubic-bezier(0.33, 1, 0.68, 1);        /* Decelerates — natural */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);        /* Snappy — enters and exits */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Overshoots — playful */
```

### Duration Guidelines

| Element Size | Duration |
|-------------|----------|
| Small UI (buttons, toggles) | 150–200ms |
| Medium (cards, dropdowns) | 250–300ms |
| Large (modals, panels) | 300–400ms |
| Page transitions | 400–600ms |

Always respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```
