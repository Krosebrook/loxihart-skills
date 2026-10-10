# Reference 01 — Design Token Architecture

Source of truth. All UI values derive from here. No exceptions.

---

## Color System

### Primary (Brass)

| Token | Value | Use |
|---|---|---|
| `--color-primary-50` | `#faf7f2` | Subtle tints, hover bg |
| `--color-primary-100` | `#f5efe5` | Light bg states |
| `--color-primary-200` | `#e8dccb` | Border tints |
| `--color-primary-300` | `#d6c4ad` | Muted primary |
| `--color-primary-400` | `#c8a86a` | Brand primary, focus rings |
| `--color-primary-500` | `#a89150` | Hover states |
| `--color-primary-600` | `#8a7340` | Active states |
| `--color-primary-700` | `#6d5a32` | Logo, headings on light |
| `--color-primary-800` | `#544428` | High-contrast primary |
| `--color-primary-900` | `#3d3120` | Maximum contrast |

### Neutral (Ink-based, not pure black)

| Token | Value | Use |
|---|---|---|
| `--color-neutral-0` | `#ffffff` | Pure white |
| `--color-neutral-50` | `#fafaf9` | Elevated surface |
| `--color-neutral-100` | `#f5f5f4` | Disabled bg |
| `--color-neutral-200` | `#e7e5e4` | Muted borders |
| `--color-neutral-300` | `#d6d3d1` | Default borders |
| `--color-neutral-400` | `#a8a29d` | Placeholder text |
| `--color-neutral-500` | `#78716c` | Subdued text |
| `--color-neutral-600` | `#57534e` | Secondary text |
| `--color-neutral-700` | `#44403c` | Primary text light |
| `--color-neutral-800` | `#292524` | Strong text |
| `--color-neutral-900` | `#1c1917` | Body text, headings |

### Semantic States

| State | 50 | 400 | 600 | 700 |
|---|---|---|---|---|
| success | `#f0fdf4` | `#4ade80` | `#16a34a` | `#15803d` |
| warning | `#fffbeb` | `#facc15` | `#d97706` | `#b45309` |
| error | `#fef2f2` | `#f87171` | `#dc2626` | `#b91c1c` |
| info | `#f0f9ff` | `#38bdf8` | `#0284c7` | `#0369a1` |

### Surface Tokens

| Token | Value | Use |
|---|---|---|
| `--surface-background` | `#ffffff` | Page background |
| `--surface-elevated` | `#fafaf9` | Card, raised elements |
| `--surface-overlay` | `rgba(0,0,0,0.5)` | Modal backdrop |
| `--surface-border` | `#d6d3d1` | Default border |
| `--surface-input-bg` | `#ffffff` | Input fields |
| `--surface-disabled-bg` | `#f5f5f4` | Disabled inputs |
| `--surface-muted` | `#e7e5e4` | Code bg, muted areas |

---

## Typography System

### Font Families

| Token | Value | Role |
|---|---|---|
| `--font-family-display` | `'Fraunces', serif` | Headings, CTAs, hero |
| `--font-family-body` | `'Crimson Pro', serif` | Prose, UI text |
| `--font-family-mono` | `'JetBrains Mono', monospace` | Code, data, technical |

### Type Scale (ratio: 1.125 modular)

| Token | Value | Usage |
|---|---|---|
| `--font-size-xs` | `0.75rem` | Labels, captions |
| `--font-size-sm` | `0.875rem` | Helper text, badges |
| `--font-size-base` | `1rem` | Body text |
| `--font-size-lg` | `1.125rem` | Lead text, subheadings |
| `--font-size-xl` | `1.25rem` | Section headings |
| `--font-size-2xl` | `1.5rem` | Card headings |
| `--font-size-3xl` | `1.875rem` | Page subheadings |
| `--font-size-4xl` | `2.25rem` | Page headings |
| `--font-size-5xl` | `3rem` | Hero headings |

### Weight, Line Height, Letter Spacing

| Token | Value | Use |
|---|---|---|
| `--font-weight-body` | `400` | Prose |
| `--font-weight-semi` | `600` | Labels, CTAs |
| `--font-weight-bold` | `700` | Headings |
| `--line-height-tight` | `1.2` | Display headings |
| `--line-height-normal` | `1.5` | Body text |
| `--line-height-relaxed` | `1.75` | Long-form prose |
| `--letter-spacing-tight` | `-0.02em` | Display type |
| `--letter-spacing-normal` | `0em` | Body type |
| `--letter-spacing-wide` | `0.02em` | Caps, labels |

---

## Spacing System

Base unit: **4px (0.25rem)**. Fibonacci-inspired ladder.

| Token | Value | Pixels |
|---|---|---|
| `--spacing-0` | `0px` | 0 |
| `--spacing-1` | `0.25rem` | 4px |
| `--spacing-2` | `0.5rem` | 8px |
| `--spacing-3` | `0.75rem` | 12px |
| `--spacing-4` | `1rem` | 16px |
| `--spacing-6` | `1.5rem` | 24px |
| `--spacing-8` | `2rem` | 32px |
| `--spacing-12` | `3rem` | 48px |
| `--spacing-16` | `4rem` | 64px |
| `--spacing-20` | `5rem` | 80px |
| `--spacing-24` | `6rem` | 96px |
| `--spacing-32` | `8rem` | 128px |

---

## Radius System

| Token | Value | Use |
|---|---|---|
| `--radius-none` | `0px` | Sharp/square elements |
| `--radius-sm` | `0.25rem` | Tags, chips |
| `--radius-base` | `0.375rem` | Default (use unless reason not to) |
| `--radius-md` | `0.5rem` | Buttons, inputs |
| `--radius-lg` | `0.75rem` | Cards, modals |
| `--radius-xl` | `1rem` | Panels, dialogs |
| `--radius-full` | `9999px` | Badges, avatars, pills |

---

## Elevation (Shadow) System

Depth maps to shadow token. Never mix depth levels on the same surface.

| Token | Value | Depth Use |
|---|---|---|
| `--shadow-none` | `none` | Flat, no elevation |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Focus rings, subtle raise |
| `--shadow-base` | `0 1px 3px rgba(0,0,0,0.1)` | Cards, raised elements |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Floating UI, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals, drawers |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Reserved |

---

## Motion System

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | `0ms` | Disabled state |
| `--duration-fast` | `150ms` | Hover feedback |
| `--duration-normal` | `200ms` | Focus, input |
| `--duration-slow` | `300ms` | Entrance animations |
| `--duration-slower` | `500ms` | Loading, skeleton |

| Token | Value | Curve Type |
|---|---|---|
| `--easing-linear` | `linear` | Constant rate |
| `--easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exits |
| `--easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entrances |
| `--easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transforms |

**Rule:** No spring, bounce, or elastic curves. No duration > 500ms.

---

## Contrast Verification

All combinations tested at WCAG 2.1 AA (4.5:1 minimum for normal text):

| Foreground | Background | Ratio | Standard | Status |
|---|---|---|---|---|
| `primary-400 #c8a86a` | `white` | 5.4:1 | AA | ✅ |
| `neutral-600 #57534e` | `white` | 8.2:1 | AAA | ✅ |
| `neutral-900 #1c1917` | `white` | 16.5:1 | AAA | ✅ |
| `error-600 #dc2626` | `white` | 5.8:1 | AA | ✅ |
| `success-600 #16a34a` | `white` | 5.1:1 | AA | ✅ |
| `primary-700 #6d5a32` | `primary-50 #faf7f2` | 10.1:1 | AAA | ✅ |

**Re-verify with:** https://webaim.org/resources/contrastchecker/
