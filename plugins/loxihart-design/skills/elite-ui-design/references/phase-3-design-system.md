## Phase 3 — Design System

Define concrete values, not category names. Read `assets/starter-tokens.json`
for a complete starter template you can customize to the project context.

Use the mood decisions from Phase 1 (Visual Direction) to constrain every
value chosen here. Read `references/cinematic-design.md` Section 2 (Color as
Narrative) and the Mood → Token Translation Table before selecting colors.

### Color — define as HSL

```
--color-brand-primary:    hsl(_, _%, _%)
--color-surface-base:     hsl(_, _%, _%)
--color-surface-raised:   hsl(_, _%, _%)
--color-text-primary:     hsl(_, _%, _%)
--color-text-secondary:   hsl(_, _%, _%)
--color-text-disabled:    hsl(_, _%, _%)
--color-border-default:   hsl(_, _%, _%)
--color-feedback-success: hsl(_, _%, _%)
--color-feedback-error:   hsl(_, _%, _%)
```

Apply the **60/30/10 color ratio** (from cinematic-design reference):
- 60% dominant (surface colors — the environment)
- 30% secondary (navigation, cards, supporting structure)
- 10% accent (brand primary, CTAs, active states)

Audit every screen against this ratio. Accent overuse is the #1 color failure
in AI-generated UI.

Rules:
- Dark mode: hue-matched darks only. `#000000` is forbidden.
  Never invert light values — redesign for dark context.
- Contrast minimum: 4.5:1 body text, 3:1 large text/UI components.
- Flag failures. Do not ship them.
- Shadows use hue-matched colors. `rgba(0,0,0,X)` on colored surfaces is a
  visual system failure.
- Light source direction (from Phase 1) determines shadow angle across all
  elevation levels. Consistency is non-negotiable.

For deep palette generation, chain to `applying-web-design-standards` palette-generator
and contrast-checker scripts if available.

### Typography

```
Primary typeface: [name + 1-line justification]
Fallback: system-ui, -apple-system, sans-serif

--text-sm:      0.875rem / 1.25rem line-height
--text-base:    1rem     / 1.5rem
--text-lg:      1.125rem / 1.75rem
--text-xl:      1.25rem  / 1.75rem
--text-2xl:     1.5rem   / 2rem
--text-3xl:     1.875rem / 2.25rem
--text-display: 3rem+
```

Weights: body 400, medium 500, strong 600, display 700.
Max 2 weights per component. Never 900 unless the typeface was built for it.

The typeface is the voice of the interface. Choose based on the material metaphor
and temperature from Phase 1 — geometric for precision, humanist for warmth,
grotesque for neutrality, serif for editorial authority.

### Spacing — 8-point grid

All spacing in multiples of 4px:
`4 | 8 | 12 | 16 | 20 | 24 | 32 | 48 | 64`

Density (from Phase 1) adjusts the base:
- Sparse: favor 24/32/48 between groups
- Balanced: favor 16/24/32
- Dense: favor 8/12/16

### Shape

```
--radius-sm: 4px    --radius-lg: 12px
--radius-md: 8px    --radius-full: 9999px
```

Material metaphor drives radius: metal/concrete → sm or none; paper/fabric → md–lg;
glass → lg; void → none.

### Elevation — depth = shadow + surface shift

- L0: base surface (no shadow)
- L1: raised (subtle shadow, +2% lightness)
- L2: overlay (card, panel)
- L3: floating (dropdown, tooltip + backdrop)
- L4: modal (full scrim + isolated surface)

Shadow angle, spread, and diffusion are determined by the lighting direction
defined in Phase 1. Do not use generic centered shadows if a directional light
source was chosen.

### Internationalization (if applicable)

If Phase 0 indicated international users or RTL support:
- All layout must work in both LTR and RTL (use logical properties:
  `margin-inline-start` not `margin-left`)
- Text containers must accommodate 30–40% expansion (German, Finnish)
- Icons with directional meaning (arrows, progress) must flip for RTL
- Date, number, and currency formats must be locale-aware
- Never hardcode text in components — all strings externalized

---
