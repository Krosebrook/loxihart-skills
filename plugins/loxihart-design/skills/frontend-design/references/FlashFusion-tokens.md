# FlashFusion Design Tokens

Font choices, scale, pairing rules, and loading patterns for frontend-design outputs.
Sourced from managing-design-briefs v3.0.0 — do not modify without updating both.

---

## CSS Variables — Full Token Set

```css
:root {
  /* === SURFACES === */
  --surface-base:    #0F0618;   /* page background — deep void purple */
  --surface-raised:  #1A0B2E;   /* cards, panels */
  --surface-overlay: #251443;   /* modals, elevated layers */

  /* === BORDERS === */
  --border-primary:   rgba(168, 85, 247, 0.2);  /* default card/panel borders */
  --border-active:    rgba(168, 85, 247, 0.4);  /* focused, hovered, selected */

  /* === ACCENT — GLOW TRIAD === */
  --accent-primary:   #A855F7;  /* purple — primary actions, highlights */
  --accent-secondary: #F472B6;  /* pink — secondary, decorative */
  --accent-cyan:      #22D3EE;  /* cyan — data, confirmation, contrast accent */

  /* Gradient — use on hero text, key CTAs, progress fills */
  --gradient-accent: linear-gradient(90deg, #A855F7 0%, #F472B6 55%, #22D3EE 100%);

  /* Glow effects — use sparingly for active/hover depth */
  --glow-primary:  0 0 20px rgba(168, 85, 247, 0.4);
  --glow-secondary: 0 0 20px rgba(244, 114, 182, 0.3);
  --glow-subtle:   0 0 12px rgba(168, 85, 247, 0.2);

  /* === TEXT === */
  --text-primary:   #F8FAFC;   /* headings, primary content */
  --text-secondary: #CBD5E1;   /* secondary labels, metadata */
  --text-tertiary:  #64748B;   /* disabled, placeholder */

  /* === TYPOGRAPHY === */
  --font-heading: 'Instrument Serif', Georgia, serif;
  --font-body:    'Geist', system-ui, sans-serif;
  --font-code:    'Geist Mono', 'Courier New', monospace;

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
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-semibold: 600;
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
  --radius-sm:  8px;    /* inputs, small elements */
  --radius-md:  12px;   /* cards, panels */
  --radius-lg:  16px;   /* glassmorphic cards */
  --radius-xl:  24px;   /* hero sections, large containers */
  --radius-full: 999px; /* pills, avatars */

  /* === GLASS EFFECT (signature) === */
  --glass-bg:     rgba(15, 6, 24, 0.6);
  --glass-blur:   backdrop-filter: blur(12px);
  --glass-border: 1px solid rgba(168, 85, 247, 0.2);
  /* Usage: background: var(--glass-bg); backdrop-filter: blur(12px);
     border: var(--glass-border); border-radius: var(--radius-lg); */

  /* === SEMANTIC COLORS === */
  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-error:   #f87171;
  --color-info:    #22D3EE;  /* same as accent-cyan — intentional */

  --color-success-bg: rgba(74, 222, 128, 0.1);
  --color-warning-bg: rgba(251, 191, 36, 0.1);
  --color-error-bg:   rgba(248, 113, 113, 0.1);
  --color-info-bg:    rgba(34, 211, 238, 0.1);

  /* === SHADOWS === */
  --shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.7);
  --shadow-glow: var(--glow-primary);  /* for highlighted cards */

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
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
```

---

## FlashFusion Aesthetic Rules

**Glass is the signature.** Cards use backdrop-filter blur + semi-transparent background.
Every card has a subtle purple border — not solid, rgba only.
**Glow is earned.** Apply `--glow-primary` on active states and hero elements only.
Max 1–2 glowing elements per screen. Overuse kills the effect.
**Gradient accent = hero moments.** Use `--gradient-accent` on:
- Hero text / display headlines
- Primary CTA buttons
- Progress bars / completion indicators
Never on body text, secondary labels, or background fills.
**Navigation:** Bottom nav for mobile. Top nav for desktop. Never a sidebar.

---

## Base Component Styles

### Glass Card
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.glass-card:hover {
  border-color: rgba(168, 85, 247, 0.4);
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
  border-radius: var(--radius-md);
  background: var(--gradient-accent);
  color: #fff;
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  border: none;
  cursor: pointer;
  position: relative;
  transition: opacity 150ms ease, box-shadow 200ms ease;
}
.btn-primary:hover {
  opacity: 0.92;
  box-shadow: var(--glow-primary);
}
```

### Secondary Button (Glass)
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
}
.btn-secondary:hover {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.5);
}
```

### Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}
.badge--purple  { background: rgba(168, 85, 247, 0.15); color: var(--accent-primary); border: 1px solid rgba(168, 85, 247, 0.3); }
.badge--pink    { background: rgba(244, 114, 182, 0.15); color: var(--accent-secondary); border: 1px solid rgba(244, 114, 182, 0.3); }
.badge--cyan    { background: rgba(34, 211, 238, 0.15); color: var(--accent-cyan); border: 1px solid rgba(34, 211, 238, 0.3); }
.badge--success { background: var(--color-success-bg); color: var(--color-success); }
.badge--error   { background: var(--color-error-bg);   color: var(--color-error); }
```

### Input
```css
.input {
  width: 100%;
  background: rgba(15, 6, 24, 0.8);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input::placeholder { color: var(--text-tertiary); }
.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
}
```

---

## Cross-Profile Isolation

**Never use in FlashFusion outputs:**
- Loxihart void surface: `#0a0a0f`
- Space Grotesk font
- Flat card style (no blur, no gradient border)
- Solid-fill accent usage above 10% of surface
- Loxihart's `hsl(262, 83%, 68%)` variant — FlashFusion uses `#A855F7`
