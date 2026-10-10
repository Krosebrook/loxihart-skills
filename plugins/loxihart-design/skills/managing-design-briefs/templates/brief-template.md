# Design Brief Template

Copy this template for every new brief.
Fill every field. "TBD" is not acceptable — if you don't know, note why and flag it.

---

```markdown
# [Project Name] — Design Brief
**Version:** 1.0
**Profile:** Loxihart | FlashFusion  ← delete the one that doesn't apply
**Date:** [YYYY-MM-DD]

---

## Component Identity

**What this is (exact):**
[Not "a dashboard" — "a real-time ticket status panel for Loxihart's MSP help desk showing open /
in-progress / resolved counts with drill-down by client and escalation path."]

**Where it lives:**
[Standalone artifact | Page section | Full page | Part of a larger system]

**Primary user action:**
[One action. If there are multiple, the most important one. Others go in future scope.]

---

## Visual Direction

**Accent:**
[Exact hex or HSL — never a color name]
- Loxihart: `hsl(262, 83%, 68%)`
- FlashFusion: `#8B5CF6` base / `#A855F7` highlight

**Typography:**
- Heading: [font name + weight]
- Body: [font name + weight]
- Mono: [font name + weight]
- Font load URL: [paste from profile token file]

**Surface:**
[Primary background hex — pull from profile token file]

**Cards:**
- Loxihart: Flat, `bg #111118`, 1px border `#2a2a38`, no blur
- FlashFusion: Semi-transparent + `backdrop-filter: blur(12px)`, rgba border

---

## Differentiator

[One sentence. A specific, observable visual or interaction decision that a generic generator
would not produce. Must be implementable as a concrete CSS rule, layout constraint, or behavior.]

Example: "Monospaced font for all metric values signals precision; bottom-anchored timestamps
break the expected top-right placement."

---

## Navigation Model

**Pattern:** [Name the pattern]
**Justification:** [One sentence explaining why this pattern and not the default]

Options: command palette / floating pill with blur / flat icon tabs (max 4) /
         sidebar (requires justification) / bottom nav (mobile-primary only) /
         breadcrumb (document/drill-down)

---

## Layout

**Container:** [e.g., 1280px centered / full-width / 960px / fluid]
**Grid:** [e.g., 12-column / 8-column / custom]
**Breakpoints:** [if responsive: sm/md/lg behavior described]
**Intentional asymmetry:** [describe the grid-breaking element, if any]

---

## State Inventory

List every state and what it shows. Nothing left blank.

| State | Description | Visual treatment |
|---|---|---|
| Empty | [what to show when no data exists] | [icon + message + action] |
| Loading | [skeleton shimmer — describe shape] | [match real content geometry] |
| Error | [message + recovery action] | [error color + icon + button] |
| Success | [confirmation behavior] | [how long it shows / what replaces it] |
| Hover | [which elements respond] | [exact visual change] |
| Focus | [focus ring behavior] | [color + style] |
| Disabled | [which elements can be disabled] | [opacity / style] |
| [Add more as needed] | | |

---

## Anti-Patterns Banned for This Build

List 3+ things explicitly not allowed. Be specific.

1. [e.g., No sidebar — use command palette instead]
2. [e.g., No rounded card grid as primary layout — use asymmetric column split]
3. [e.g., No generic blue CTA button — use profile accent with exact hex]
4. [add more]

---

## Generator Prompt

[The distilled prompt for v0/Stitch — fill using `templates/generator-prompt-template.md`]

---

## Known Risks

[Document any MEDIUM findings from the adversarial critic here]
[If LITE scope: "Adversarial critic skipped — single component"]

---

## Future Scope

[Anything that was explicitly cut from this brief to keep it focused]
```
