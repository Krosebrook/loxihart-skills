# Anti-Slop Audit

Run this workflow after generating code, before delivery.
All 4 gates must pass. Do not suppress failures — fix them.

---

## Gate 1: Template Test

> "Could this output have been produced by any AI tool running on defaults?"

Run this check visually and in code:

- [ ] Font is not system-ui, Inter, Roboto, or Arial as sole typeface
- [ ] Background is not `#ffffff`, `#000000`, or a flat mid-gray
- [ ] No purple gradient on white/light background
- [ ] Layout is not a symmetrical card grid with equal columns
- [ ] Primary action is not a generic blue rounded button
- [ ] No "clean and modern" language in comments or copy
- [ ] Color choices are specified as hex/hsl — not named colors like "violet" or "blue"

**If any item fails:** Identify the specific element. Replace it with a choice
justified by the brief. Re-run this gate.

---

## Gate 2: Completeness Test

All states and interactions implemented:

- [ ] **Loading state** — skeleton shimmer, not a spinner alone
- [ ] **Empty state** — meaningful zero-data view with action, not a blank div
- [ ] **Error state** — descriptive message with recovery action
- [ ] **Success state** — confirmation that something happened
- [ ] **Hover state** — visible change on interactive elements
- [ ] **Focus state** — `:focus-visible` ring styled and visible
- [ ] **Disabled state** — present on any conditional-action element

All accessibility requirements met:
- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Color contrast ≥ 3:1 for large text and UI components
- [ ] Interactive elements keyboard-navigable
- [ ] ARIA roles on custom interactive elements
- [ ] `prefers-reduced-motion` block present
- [ ] No inline `onClick` on non-button/anchor elements

---

## Gate 3: Memorability Test

> "If someone used this for 5 minutes and described it from memory, what would they say?"

**FAIL:** "A clean app with a sidebar and some cards"
**PASS:** Response references a specific visual choice, interaction pattern, or moment

Answer this out loud before delivering:
*"The one thing someone will remember about this component is ___________."*

If the answer is blank, vague, or describes a category default → **identify and design the memorable element** before shipping.

One candidate per component minimum:
- Edge-lit border on hover that reveals depth
- Monospaced counter that implies precision
- Staggered entrance that implies data sequence
- Asymmetric layout that breaks the expected grid
- Color treatment that contradicts the expected palette

---

## Gate 4: Category Failure Analysis

Identify the 2 most common failure modes for this component type.
Document how this output avoids each one.

**Example — Dashboard card:**
| Common failure | How this avoids it |
|---|---|
| All metrics shown at equal visual weight | Differentiates primary KPI with 3xl text, others at sm |
| Click behavior undefined — card doesn't feel actionable | Hover lift + border brightening makes affordance explicit |

**Example — Form component:**
| Common failure | How this avoids it |
|---|---|
| Validation errors appear only on submit | Inline validation fires on blur, not submit |
| Error state looks identical to normal state | Error uses `--color-error` border + background tint + icon |

---

## Delivery Checklist

Before marking as done:

- [ ] All 4 gates passed
- [ ] Brief differentiation decision is visually present in the output
- [ ] No TODOs, no placeholder text, no empty handlers
- [ ] Fonts load from correct URL for the active profile
- [ ] All CSS values reference `--variables`, no hardcoded hex in component styles
- [ ] Production-ready: typed, validated, logged where appropriate

**If anything fails:** Fix it. Do not deliver with known failures and a note to "fix later."
