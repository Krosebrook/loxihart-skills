# Generator Prompt Template

Distills a completed brief into a precise prompt for v0, Stitch, AI Studio, or any
code-generating tool. A good generator prompt is 5–8 lines. Not 1. Not 20.

---

## Required Fields

A generator prompt must include all 5 of these. Missing any one = gate 7 fails.

1. **Surface** — exact hex for background
2. **Accent** — exact hex or HSL for primary accent
3. **Typography** — heading font / body font (exact names)
4. **Navigation model** — named pattern
5. **Differentiator** — the one thing that makes it not generic

Optional but high-value:
- Card style (flat + border vs. glass + blur)
- Primary state to show (populated vs. loading vs. empty)
- Layout constraint (container width, column split)

---

## Template

Fill in brackets. Remove instructional comments from final prompt.

```
Build a [component type] for [exact context — who uses it, what it shows].

Visual profile:
- Background: [exact hex]
- Accent: [exact hex or HSL] — [Loxihart: max 10% surface | FlashFusion: violet/magenta/cyan triad]
- Heading: [font name] | Body: [font name] | Mono: [font name]
- Cards: [Loxihart: flat bg [hex], 1px border [hex], no blur | FlashFusion: rgba bg + blur(12px) + rgba border]

Navigation: [named pattern — e.g., "floating pill nav with blur" or "command palette primary"]

Differentiator: [exact decision from brief — one sentence]

States required: [list: empty / loading / error / success / hover / focus / disabled]

[Optional: Layout constraint — e.g., "1280px container, left column 2x wider than right"]
[Optional: Anti-patterns banned — e.g., "No sidebar. No symmetrical card grid."]
```

---

## Examples

### Loxihart — Ticket Status Panel

```
Build a ticket status panel for an MSP help desk dashboard showing
open / in-progress / resolved counts with per-client drill-down.

Visual profile:
- Background: #0a0a0f
- Accent: hsl(262, 83%, 68%) — max 10% surface area
- Heading: Space Grotesk 700 | Body: Inter 400/500 | Mono: IBM Plex Mono
- Cards: flat bg #111118, 1px border #2a2a38, no blur, no glassmorphism

Navigation: command palette as primary nav — this is a dense operational tool,
keyboard-first access is more efficient than persistent chrome.

Differentiator: Monospaced font for all count values — signals precision and
machine-readability; left column 2x wider than right to break symmetry.

States required: loading (skeleton matching 3-column grid), empty (no tickets yet),
error (API unavailable — message + retry), populated (full data), hover (row highlight).

No sidebar. No generic blue CTA buttons.
```

### FlashFusion — Agent Status Dashboard

```
Build an agent status dashboard for FlashFusion's AI platform showing
active agents, approval queue depth, and recent job history.

Visual profile:
- Background: #0B0B14 (surface-1) on #000000 void base
- Accent: #8B5CF6 base / #A855F7 highlight / #EC4899 secondary / #22D3EE data
- Gradient: 135deg, #A855F7 → #EC4899 → #22D3EE (hero text and primary CTA only)
- Heading: Instrument Serif 400 | Body: Geist | Mono: Geist Mono
- Cards: rgba(11, 11, 20, 0.6) background + backdrop-filter: blur(12px) +
         1px border rgba(139, 92, 246, 0.12), hover: rgba(139, 92, 246, 0.35)

Navigation: always-visible floating pill nav with blur — not scroll-triggered.
Buttons: pill shape (border-radius: 100px), Geist Mono, uppercase.
Layout: 1280px container, left-aligned hero.

Differentiator: Agent status shown as animated pulse dots rather than
badge text — active state communicates liveness, not just label.

States required: loading (skeleton shimmer), empty (no active agents — 
call-to-action to deploy first agent), error (connection lost), 
live (populated with real-time pulse), hover (card border brightens to 0.35 opacity).

No flat black cards. No sidebar. No scroll-triggered nav changes.
```

---

## Quality Check Before Submitting

Run this before handing to any generator:

- [ ] All 5 required fields present
- [ ] No color described by name — all values are hex or HSL
- [ ] Font names spelled correctly (Geist, not Gist; Instrument Serif, not Instrument Sans)
- [ ] Nav model is named, not described ("floating pill" not "a nav at the top")
- [ ] Differentiator is observable (a CSS rule, layout choice, or behavior — not "dynamic feel")
- [ ] Anti-patterns listed if there are known drift risks for this component type
