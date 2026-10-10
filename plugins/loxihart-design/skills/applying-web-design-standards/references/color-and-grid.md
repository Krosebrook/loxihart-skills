# Color Systems Reference

## Building a Palette with HSL

HSL (Hue, Saturation, Lightness) is more intuitive than RGB for building systematic palettes.

### Step 1: Choose Primary Hue (0–360)
Red: 0, Orange: 30, Yellow: 60, Green: 120, Cyan: 180, Blue: 240, Purple: 270, Pink: 330

**Quick generation:** Run `scripts/palette-generator.py 240 --name blue --format css` to generate a complete 9-step palette from any hue. Or use `assets/color-palettes.json` for pre-built palettes.

### Step 2: Generate 9-Step Tint/Shade Scale

```css
/* Example: Blue (240) */
--blue-50:  hsl(240, 100%, 97%);  /* Lightest — backgrounds, subtle fills */
--blue-100: hsl(240, 95%, 92%);
--blue-200: hsl(240, 90%, 85%);
--blue-300: hsl(240, 85%, 75%);
--blue-400: hsl(240, 80%, 65%);
--blue-500: hsl(240, 75%, 55%);   /* Base — primary actions */
--blue-600: hsl(240, 70%, 45%);   /* Hover state */
--blue-700: hsl(240, 65%, 35%);
--blue-800: hsl(240, 60%, 25%);
--blue-900: hsl(240, 55%, 15%);   /* Darkest — text, emphasis */
```

Pattern: as lightness decreases, reduce saturation slightly to avoid oversaturation in dark shades.

### Step 3: Create Semantic Tokens

```css
:root {
  /* Surfaces */
  --color-background:    white;
  --color-surface:       hsl(240, 20%, 98%);
  --color-surface-hover: hsl(240, 20%, 95%);

  /* Text (3 levels of hierarchy) */
  --color-text-primary:   hsl(240, 10%, 10%);
  --color-text-secondary: hsl(240, 5%, 40%);
  --color-text-tertiary:  hsl(240, 5%, 60%);

  /* Actions */
  --color-primary:        var(--blue-500);
  --color-primary-hover:  var(--blue-600);
  --color-primary-active: var(--blue-700);

  /* Feedback */
  --color-success: hsl(142, 71%, 45%);
  --color-warning: hsl(38, 92%, 50%);
  --color-error:   hsl(0, 72%, 51%);
  --color-info:    hsl(199, 89%, 48%);
}
```

---

## Color Harmony Techniques

### Monochromatic (single hue, varying lightness)
Use for: calm, cohesive, minimal designs.
Example: blue-50 through blue-900.

### Analogous (adjacent hues, 30 degrees apart)
Use for: natural, harmonious, warm/cool schemes.
Example: Blue (240) + Cyan (210) + Purple (270).

### Complementary (opposite hues, 180 degrees apart)
Use for: high contrast, energetic, attention-grabbing.
Example: Blue (240) + Orange (60).

### Triadic (3 hues, 120 degrees apart)
Use for: vibrant, balanced, playful.
Example: Red (0) + Yellow (120) + Blue (240).

### Split-Complementary (base + 2 adjacent to complement)
Use for: contrast without tension.
Example: Blue (240) + Yellow-Orange (30) + Red-Orange (350).

---

## Dark Mode Strategy

### Approach: Swap Semantic Tokens

Components use semantic tokens. Dark mode swaps the token values, not the component styles.

```css
[data-theme="dark"] {
  --color-background:    hsl(240, 10%, 8%);   /* Not pure black — causes eye strain */
  --color-surface:       hsl(240, 10%, 12%);
  --color-text-primary:  hsl(240, 10%, 92%);  /* Not pure white — too harsh */
  --color-text-secondary: hsl(240, 5%, 60%);
  --color-primary:       hsl(240, 75%, 65%);  /* Lighter for contrast on dark bg */
}
```

**Dark mode rules:**
- Never use pure black (#000) or pure white (#fff) — causes eye strain
- Lighten primary colors slightly for contrast on dark backgrounds
- Reduce shadow intensity (shadows are less visible on dark surfaces)
- Test contrast ratios again — some combinations that pass on light fail on dark

---

## Accessibility (WCAG 2.2)

**Quick check:** Run `scripts/contrast-checker.py "#3b82f6" "#ffffff"` to validate any color pair.

| Element | Minimum Contrast |
|---------|-----------------|
| Normal text (under 18px) | 4.5:1 |
| Large text (18px+ or 14px+ bold) | 3:1 |
| UI components and icons | 3:1 |

Information must never be conveyed by color alone — always pair with icons, text labels, or patterns.

---

## OKLCH — Preferred for Gradients and New Token Authoring

HSL is intuitive for palette construction but perceptually non-uniform: equal lightness steps across hues look different to the human eye. OKLCH fixes this.

**When to use OKLCH over HSL:**
- Generating gradients between two saturated colors — OKLCH interpolation avoids muddy midpoints
- Authoring new primitive tokens where perceptual consistency across a scale matters
- Programmatic contrast checking (OKLCH L value is a reliable proxy for perceived brightness)

**When to keep HSL or hex:**
- Locked brand profiles (FlashFusion v3, Loxihart) — profiles are the execution SOT, do not migrate them
- Existing palettes already in HSL — migration cost outweighs benefit for stable systems

**Format:** `oklch(L% C H)` — L = lightness 0–100, C = chroma 0–0.4+, H = hue 0–360

**Browser support:** Chrome 111+, Firefox 113+, Safari 15.4+. Always include hex fallback:
```css
color: #3b82f6;
color: oklch(60% 0.19 261);
```

**Side-by-side — why OKLCH gradients are smoother:**
```css
/* OKLCH: perceptually smooth purple → pink */
background: linear-gradient(135deg, oklch(62.7% 0.23 304), oklch(65.6% 0.21 354));

/* HSL equivalent: muddy brownish midpoint */
background: linear-gradient(135deg, hsl(275, 90%, 63%), hsl(330, 80%, 60%));
```

**Generate an OKLCH palette step:**
```bash
# Convert hex to OKLCH using scripts/contrast-checker.py or an online converter:
# https://oklch.com — paste hex, get oklch() output
```

**Rule of thumb for new token files:**
- Primaries and accents → OKLCH
- Surfaces and neutrals → OKLCH
- Gradients → OKLCH interpolation
- Semantic/component aliases → reference primitive tokens (format agnostic)

