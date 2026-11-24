# executing-branded-frontends skill — v2.1.0

Production-grade frontend code generation for Claude artifacts and plugins.
Design gate before code. Token-locked profiles. Zero slop tolerance.

---

## What this skill does

Takes a confirmed design brief and locked brand tokens → ships working, distinctive
frontend code as Claude artifacts (HTML or React JSX).

This is the **code execution layer** in a three-skill design pipeline:

```
elite-ui-design       → full product design spec (phases 0–9)
managing-design-briefs → brief generation + token system + anti-slop gates
executing-branded-frontends ← YOU ARE HERE → brief → code → audit → deliver
```

---

## Package structure

```
executing-branded-frontends/
├── SKILL.md                           ← main skill — start here
├── README.md                          ← this file
│
├── references/
│   ├── design-gate.md                 ← 5-question mandatory intake
│   ├── animation-system.md            ← easing, duration, patterns
│   ├── typography-system.md           ← fonts, scale, loading
│   └── accessibility.md              ← WCAG 2.2 AA, ARIA, keyboard
│
├── templates/
│   ├── html-artifact.html             ← base HTML Claude artifact
│   └── react-component.jsx           ← base React JSX Claude artifact
│
├── designs/
│   ├── Loxihart-tokens.md                  ← Loxihart brand CSS variables + components
│   └── FlashFusion-tokens.md          ← FlashFusion brand CSS variables + components
│
├── workflows/
│   ├── new-artifact.md               ← step-by-step: gate → tokens → code → audit
│   └── anti-slop-audit.md            ← 4-gate quality check before delivery
│
└── examples/
    ├── Loxihart-dashboard.html            ← ticket status panel (HTML artifact)
    └── FlashFusion-card.jsx          ← feature cards (React artifact)
```

---

## Profiles

| Profile | File | Aesthetic |
|---|---|---|
| Loxihart | `designs/Loxihart-tokens.md` | Void surface, electric violet accent, Space Grotesk, dense enterprise |
| FlashFusion | `designs/FlashFusion-tokens.md` | Void-dark, blur(12px) cards, Instrument Serif + Geist + Geist Mono |

Profiles are mutually exclusive. Never mix tokens between profiles in a single output.

---

## Quickstart

**New artifact from scratch:**
1. Read `SKILL.md` for the decision tree
2. Read `references/design-gate.md` — run the intake
3. Read the correct profile token file
4. Use the appropriate template
5. Read `workflows/anti-slop-audit.md` before delivering

**Component build with existing brief:**
1. Confirm brief has a differentiation decision and state inventory
2. Load profile tokens
3. Follow `workflows/new-artifact.md`
4. Run anti-slop audit

---

## Non-negotiables

- Design gate runs before any code generation — no exceptions
- All CSS values reference CSS variables — no hardcoded hex in component styles
- All states implemented: loading, empty, error, success
- Accessibility requirements from `references/accessibility.md` are not optional
- `prefers-reduced-motion` block present in every animated output
- Anti-slop audit runs before every delivery

---

## Integration with other skills

| Situation | Use |
|---|---|
| Need a design system before building | `elite-ui-design` first |
| Need a formal design brief | `managing-design-briefs` first |
| Updating locked tokens | `managing-design-briefs` update-tokens workflow |
| Output audit (v0/AI Studio) | `managing-design-briefs` audit-output workflow |
| Component library architecture | `applying-web-design-standards` |
| Advanced component patterns | `ui-component-library` |

---

## Version history

| Version | Changes |
|---|---|
| 2.0.0 | Full package: references, templates, designs, workflows, examples, README. Mandatory design gate. Token-locked profiles. Anti-slop 4-gate audit. |
| 1.0.0 | Bare SKILL.md only. No structure. |
