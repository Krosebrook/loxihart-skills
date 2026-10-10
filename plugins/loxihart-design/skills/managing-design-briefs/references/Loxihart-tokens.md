# Loxihart Design Tokens

Enterprise-clean, accessibility-forward, dark dense aesthetic.
Sourced from managing-design-briefs v3.0.0 — do not modify without updating both.

---

## CSS Variables — Full Token Set

```css
:root {
  /* === SURFACES === */
  --surface-base:    #0a0a0f;   /* page background */
  --surface-raised:  #111118;   /* cards, panels */
  --surface-overlay: #18181f;   /* modals, dropdowns */

  /* === BORDERS === */
  --border-primary:   #2a2a38;  /* structural dividers, card borders */
  --border-secondary: #1e1e28;  /* subtle separators */

  /* === ACCENT === */
  /* Electric violet — max 10% of visible surface. Signal only. */
  --accent:          hsl(262, 83%, 68%);
  --accent-dim:      hsl(262, 60%, 45%);  /* background tints, badge fills */
  --accent-glow:     hsl(262, 83%, 68%, 0.15); /* for box-shadow glows */

  /* === TEXT === */
  --text-primary:    #f0f0f5;   /* headings, primary content */
  --text-secondary:  #9898a8;   /* secondary labels, metadata */
  --text-tertiary:   #52525e;   /* disabled, placeholder — large text only */
  --text-inverse:    #0a0a0f;   /* on light backgrounds (rare) */

  /* === TYPOGRAPHY === */
  --font-heading: 'Space Grotesk', 'DM Sans', sans-serif;
  --font-body:    'Inter', 'DM Sans', system-ui, sans-serif;
  --font-code:    'IBM Plex Mono', 'Fira Code', monospace;

  /* === TYPE SCALE === */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 14px;
  --text-md:   16px;
  --text-lg:   20px;
  --text-xl:   24px;
  --text-2xl:  32px;
  --text-3xl:  48px;

  /* === FONT WEIGHTS === */
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-bold:    700;

  /* === LINE HEIGHT === */
  --leading-tight:  1.2;
  --leading-snug:   1.35;
  --leading-normal: 1.5;

  /* === SPACING (8pt grid) === */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* === BORDER RADIUS === */
  --radius-sm:  4px;   /* inputs, badges */
  --radius-md:  6px;   /* cards, modals */
  --radius-lg:  8px;   /* panels */
  --radius-full: 999px; /* pills, avatars */

  /* === SEMANTIC COLORS === */
  --color-success:  #22c55e;
  --color-warning:  #f59e0b;
  --color-error:    #ef4444;
  --color-info:     #38bdf8;

  /* Muted variants for background fills */
  --color-success-bg: rgba(34, 197, 94, 0.1);
  --color-warning-bg: rgba(245, 158, 11, 0.1);
  --color-error-bg:   rgba(239, 68, 68, 0.1);
  --color-info-bg:    rgba(56, 189, 248, 0.1);

  /* === SHADOWS === */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.6);
  /* On dark surfaces — always near-black shadows, never colored */

  /* === Z-INDEX === */
  --z-base:     1;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-modal:    200;
  --z-toast:    300;
}
```

---

## Google Fonts Load

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
```

---

## Loxihart Aesthetic Rules

**Flat, not glossy.** Loxihart uses no glassmorphism. Cards are flat with a 1px border.
**Accent is a signal.** Violet appears on active states, badges, focus rings, and key metrics. Never decorative.
**Dense but breathable.** Use 8pt grid. Don't add whitespace for aesthetics — use it for hierarchy.
**Navigation is flat.** Command palette is primary. Max 4 icon tabs. No nested menus.

---

## Base Component Styles

### Card
```css
.card {
  background: var(--surface-raised);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
```

### Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge--accent  { background: var(--accent-dim);      color: var(--accent); }
.badge--success { background: var(--color-success-bg); color: var(--color-success); }
.badge--error   { background: var(--color-error-bg);   color: var(--color-error); }
.badge--warning { background: var(--color-warning-bg); color: var(--color-warning); }
```

### Button
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: background 150ms ease, opacity 150ms ease;
  border: 1px solid transparent;
}

.btn--primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.btn--primary:hover { opacity: 0.9; }

.btn--secondary {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-primary);
}
.btn--secondary:hover { background: var(--surface-raised); }

.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: transparent;
}
.btn--ghost:hover { color: var(--text-primary); background: var(--surface-raised); }

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### Input
```css
.input {
  width: 100%;
  background: var(--surface-base);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input::placeholder { color: var(--text-tertiary); }
.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.input:invalid { border-color: var(--color-error); }
```

---

## Cross-Profile Isolation

**Never use in Loxihart outputs:**
- FlashFusion glow: `#A855F7` at FlashFusion saturation
- Glassmorphism (backdrop-filter, frosted glass effects)
- Poppins font
- `#0F0618` background
- Gradient overlays for decorative purposes
