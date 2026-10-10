# Anti-Slop Gates — Full Runbook

Run this against every brief before any generation.
All 7 gates must pass. A gate either passes or fails — no partial credit.
Fix failures before proceeding.

---

## Gate 1 — Language Audit

> "Does the brief contain category-default filler language?"

**Scan for and reject any of these phrases:**
- "clean and modern"
- "professional and polished"
- "sleek design"
- "intuitive interface"
- "user-friendly"
- "minimal and elegant"
- Any color described by name ("violet", "blue", "dark") without a hex or HSL value

**PASS:** Brief contains zero of these phrases. All colors specified as hex or HSL.
**FAIL:** Any match found. Delete the phrase. Replace with a specific, justified decision.

---

## Gate 2 — Accent Precision

> "Is the accent color defined precisely enough to be reproduced without interpretation?"

**PASS:** Accent is specified as hex (`#8B5CF6`) or HSL (`hsl(262, 83%, 68%)`).
**FAIL:** Accent described as "purple", "violet", "electric", or any name without a value.

**Fix:** Open the active profile token file. Pull the exact hex. Replace the name.

---

## Gate 3 — Differentiator

> "Is there one named decision that separates this from the category default?"

**PASS:** Brief contains a single, specific sentence naming a visual or interaction choice that a generic tool would not make. It references a specific element and explains the intent.

**FAIL examples:**
- "We want it to look different from other dashboards" — too vague
- "Nice hover effects" — no specificity
- No differentiator sentence at all

**PASS examples:**
- "Monospaced counter font for all metric values — signals precision and machine-readability"
- "Left column is intentionally 2x wider than right to break symmetry and lead the eye"
- "Bottom-anchored timestamps instead of top-right — status is read before time"

---

## Gate 4 — Navigation Model

> "Is the navigation pattern named, justified, and appropriate for the profile?"

**PASS criteria — all three:**
1. Navigation pattern is named (not "a nav bar" — "floating pill with blur" or "command palette")
2. One-sentence justification present
3. Pattern is consistent with the active profile

**Profile nav constraints:**
- Loxihart: command palette or flat icon tabs (max 4). No sidebar without justification. No pill nav.
- FlashFusion: floating pill with blur. No sidebar. No flat tab bar on desktop.

**FAIL:** Pattern unnamed, unjustified, or profile-mismatched.

---

## Gate 5 — Sidebar Justification

> "If a sidebar exists, has it earned its place?"

**If no sidebar in the brief:** Gate auto-passes.

**If sidebar present:**
**PASS:** Brief contains a written sentence explaining why a sidebar is necessary. The reason must be functional ("12+ navigation items that can't be condensed"), not aesthetic ("it looks good").

**FAIL:** Sidebar listed without justification, or justified only aesthetically.

**Sidebar cost:** Sidebars consume 20–25% of viewport width, create a permanent hierarchy claim, and are the default AI-generated layout. They require justification to use, not to skip.

---

## Gate 6 — State Completeness

> "Are all interactive states defined — nothing blank, nothing deferred?"

**Minimum required states for any interactive component:**

| State | Must include |
|---|---|
| Empty | Meaningful zero-data view + an action. Never a blank div. |
| Loading | Skeleton shimmer matching real content geometry. Not spinner-only. |
| Error | Descriptive message + recovery action. Styled distinctly from normal. |
| Success | Confirmation that something happened. Not a silent state. |
| Hover | Visible change on every interactive element. |
| Focus | `:focus-visible` ring styled — not removed. |
| Disabled | Present on any conditional-action element. |

**PASS:** All applicable states listed in the brief with a description of their behavior.
**FAIL:** Any state left blank, noted as "TBD," or absent without a reason.

---

## Gate 7 — Generator Prompt Specificity

> "Could this brief's generator prompt pass to v0/Stitch without producing a generic result?"

**The test:** Read the generator prompt field (from `templates/generator-prompt-template.md`).
Ask: "Could this have been typed by someone who just wants 'a dashboard'?"

**FAIL signals:**
- "A dark dashboard with some cards" — no specificity
- Could apply to 50 different projects unchanged
- Missing: surface token, accent value, font names, nav model, differentiator

**PASS:** The prompt is specific enough that the output would be recognizably this project and not a generic category default. It references at minimum: surface, accent, typography, nav model, one differentiator.

---

## Gate Summary Output

After running all 7, produce this block:

```
Anti-slop audit complete.
Profile: [Loxihart | FlashFusion]
Gate 1 — Language:       [✓ PASS | ✗ FAIL — reason]
Gate 2 — Accent:         [✓ PASS | ✗ FAIL — reason]
Gate 3 — Differentiator: [✓ PASS | ✗ FAIL — reason]
Gate 4 — Navigation:     [✓ PASS | ✗ FAIL — reason]
Gate 5 — Sidebar:        [✓ PASS | N/A — no sidebar | ✗ FAIL — reason]
Gate 6 — States:         [✓ PASS | ✗ FAIL — missing: X, Y]
Gate 7 — Generator:      [✓ PASS | ✗ FAIL — reason]

Overall: [ALL PASS → proceed | FAILURES → fix before proceeding]
```

Do not summarize failures as "minor issues." Fix them or flag them explicitly.
