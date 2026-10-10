# FlashFusion Design Tokens — v3 (May 2026)

Void-dark, layered depth, semi-transparent blur cards, editorial display type.
Source of truth for managing-design-briefs v5.0.0.

**Note:** The `executing-branded-frontends` sibling skill contains v2 tokens
(`#0F0618`, `#1A0B2E`, `#F472B6`, `90deg` gradient). Do not reference it for FlashFusion.
This file is the v3 SOT.

---

## CSS Variables — Full Token Set

```css
:root {
  /* === SURFACES === */
  --surface-void:    #000000;   /* page body — true void */
  --surface-base:    #0B0B14;   /* surface-1 — cards, panels base */
  --surface-raised:  #13131F;   /* surface-2 — elevated layers */

  /* === BORDERS === */
  --border-default:  rgba(139, 92, 246, 0.12);  /* default card/panel border */
  --border-hover:    rgba(139, 92, 246, 0.35);  /* hover, focus, selected */
  --border-active:   rgba(139, 92, 246, 0.60);  /* active, highlight */

  /* === ACCENT — TRIAD === */
  --violet-base:      #8B5CF6;
  --violet-highlight: #A855F7;
  --magenta:          #EC4899;
  --cyan-base:        #06B6D4;
  --cyan-highlight:   #22D3EE;

  /* Gradient — hero text, primary CTAs, progress fills ONLY */
  --gradient-accent: linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #22D3EE 100%);

  /* === GLASS CARD (signature) === */
  --glass-bg:        rgba(11, 11, 20, 0.60);
  /* Usage: background: var(--glass-bg); backdrop-filter: blur(12px);
     border: 1px solid var(--border-default); border-radius: var(--radius-lg); */

  /* === TEXT === */
  --text-primary:   #FFFFFF;
  --text-secondary: #C7C7D1;
  --text-tertiary:  #8A8A96;
  --text-muted:     #5A5A64;

  /* === TYPOGRAPHY === */
  --font-display: 'Instrument Serif', Georgia, serif;  /* headings */
  --font-body:    'Geist', system-ui, sans-serif;
  --font-mono:    'Geist Mono', 'Courier New', monospace;

  /* === TYPE SCALE === */
  --text-xs:   12px;
  --text-sm:   14px;
  --text-base: 16px;
  --text-md:   20px;
  --text-lg:   24px;
  --text-xl:   32px;
  --text-2xl:  48px;
  --text-3xl:  64px;

  /* === FONT WEIGHTS === */
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

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
  --radius-sm:   8px;    /* inputs, small elements */
  --radius-md:   12px;   /* cards */
  --radius-lg:   16px;   /* glass cards, panels */
  --radius-xl:   24px;   /* hero sections */
  --radius-pill: 100px;  /* buttons, nav pills */
  --radius-full: 999px;  /* avatars, badges */

  /* === SEMANTIC COLORS === */
  --color-success:    #4ade80;
  --color-warning:    #fbbf24;
  --color-error:      #f87171;
  --color-info:       #22D3EE;  /* intentional: same as cyan-highlight */

  --color-success-bg: rgba(74, 222, 128, 0.10);
  --color-warning-bg: rgba(251, 191, 36, 0.10);
  --color-error-bg:   rgba(248, 113, 113, 0.10);
  --color-info-bg:    rgba(34, 211, 238, 0.10);

  /* === SHADOWS === */
  --shadow-sm:   0 1px 4px rgba(0, 0, 0, 0.50);
  --shadow-md:   0 4px 16px rgba(0, 0, 0, 0.60);
  --shadow-lg:   0 8px 32px rgba(0, 0, 0, 0.70);
  --glow-violet: 0 0 20px rgba(168, 85, 247, 0.40);
  --glow-subtle: 0 0 12px rgba(168, 85, 247, 0.20);

  /* === Z-INDEX === */
  --z-base:     1;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-modal:    200;
  --z-toast:    300;
}
```

---

## Font Load

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Layout Rules

- Container: 1280px, left-aligned hero
- Buttons: `border-radius: 100px` (pill), Geist Mono, uppercase
- Nav: always-visible floating pill with `backdrop-filter: blur(12px)` — NOT scroll-triggered
- Cards: ALWAYS glass — `rgba bg + blur(12px)`. Never flat black.
- Gradient: `135deg` direction only. Use on hero text, primary CTAs, progress bars. Never on body text.
- Glow: earned. Max 1–2 glowing elements per screen.

---

## Base Component Styles

### Glass Card
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.glass-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--glow-subtle);
}
```

### Gradient Text
```css
.gradient-text {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Primary Button
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  background: var(--gradient-accent);
  color: #fff;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: opacity 150ms ease, box-shadow 200ms ease;
}
.btn-primary:hover {
  opacity: 0.90;
  box-shadow: var(--glow-violet);
}
```

### Ghost Button
```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-pill);
  background: rgba(139, 92, 246, 0.10);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
}
.btn-ghost:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: var(--border-hover);
}
```

### Input
```css
.input {
  width: 100%;
  background: rgba(11, 11, 20, 0.80);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input::placeholder { color: var(--text-muted); }
.input:focus {
  outline: none;
  border-color: var(--violet-base);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}
.input:invalid { border-color: var(--color-error); }
```

---

## Cross-Profile Isolation

**NEVER in FlashFusion outputs:**
- `#0a0a0f` surface (Loxihart base)
- `Space Grotesk` font (Loxihart heading)
- `IBM Plex Mono` font (Loxihart mono)
- `hsl(262, 83%, 68%)` accent variant (Loxihart violet)
- Flat card style: solid bg, no blur, no rgba border
- Sidebar navigation

**NEVER from v2 (deprecated):**
- `#0F0618` or `#1A0B2E` surfaces
- `#F472B6` magenta (replaced by `#EC4899`)
- `90deg` gradient (replaced by `135deg`)
- `Instrument Sans` (replaced by `Geist`)
- `JetBrains Mono` (replaced by `Geist Mono`)
- `Poppins` as heading (replaced by `Instrument Serif`)
- Nav glass triggered only on scroll
