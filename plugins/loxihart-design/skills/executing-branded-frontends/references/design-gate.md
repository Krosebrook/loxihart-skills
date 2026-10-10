# Design Gate

**Run this before writing any code. All 5 questions must be answered.**

This is the mandatory intake that prevents generic output. Vague brief = generic code.
Push for specific answers. "I don't know" is acceptable — "modern and clean" is not.

---

## Gate Questions

Ask these in order. Extract answers from conversation context if already provided.

**1. Profile**
Which brand profile does this belong to?
- `Loxihart` → enterprise tooling, internal tools, admin dashboards
- `FlashFusion` → product marketing, creator tools, public-facing
- `Custom` → define tokens inline (ask for: background, accent, font, border radius)

**2. Component type and exact context**
What is this, precisely? Not "a dashboard" — "a ticket status panel for a managed services help desk
that shows open / in-progress / resolved counts with drill-down." Specificity locks the layout.

**3. One differentiation decision**
What single design choice separates this from the category default?
If the user can't answer, suggest one based on context and confirm.
Examples: "bottom-aligned timestamp instead of top", "edge-lit card border on hover",
"monospaced counts to signal precision", "asymmetric grid breaking left column wide".

**4. State inventory**
Which states must be implemented?
Minimum required: empty, loading, error, success.
Ask about: hover, focus, disabled, partial data, first-time user.

**5. Delivery format**
- HTML artifact (single file, renders in Claude chat)
- React artifact (JSX, hooks allowed, Tailwind or CSS-in-JS)
- File for download (specify: .html, .jsx, .tsx, .vue)

---

## Gate Pass Criteria

All five must be true before generating:

- [ ] Profile confirmed (Loxihart, FlashFusion, or custom tokens defined)
- [ ] Component described with enough specificity to constrain layout
- [ ] One named differentiation decision exists
- [ ] State inventory confirmed
- [ ] Delivery format confirmed

If any box is unchecked — ask. Do not guess and generate.

---

## Fast-Path Override

If the user says "just build it" or provides a detailed spec:
- Extract answers from context for questions 1, 2, 5
- Pick a differentiation decision and name it explicitly: "Assuming: [X]"
- Default state inventory: empty + loading + error + success
- Document all assumptions at the top of the output as a comment block

Fast-path does not skip the gate — it compresses it.
