# New Artifact Workflow

End-to-end: design gate → tokens → code → audit → deliver.

---

## Step 1 — Design Gate

Read `references/design-gate.md`.

Run the 5-question intake. Fast-path if the user says "just build it."
Document confirmed answers as a comment block at the top of the output:

```
<!-- 
  Profile: Loxihart
  Component: Ticket status panel showing open/in-progress/resolved counts
  Differentiator: Monospaced counts to signal precision; left column intentionally wider
  States: loading (skeleton), empty (no tickets yet), error (API failure), idle (data)
  Format: HTML artifact
-->
```

Do not proceed to Step 2 without confirmed answers.

---

## Step 2 — Token Load

Based on confirmed profile:

**Loxihart** → Read `designs/Loxihart-tokens.md`
Copy the full `:root { }` CSS variable block into the artifact's `<style>` or `GlobalStyles` component.

**FlashFusion** → Read `designs/FlashFusion-tokens.md`
Copy the full `:root { }` CSS variable block.

**Custom** → Define tokens inline based on brief answers.
Minimum required: surface colors, accent, text colors, font stack, spacing scale.

---

## Step 3 — Select Base Template

**HTML artifact** → Open `templates/html-artifact.html`
Replace all `[PLACEHOLDER]` values. Fill in font URL from `references/typography-system.md`.

**React artifact** → Open `templates/react-component.jsx`
Rename the component. Replace all `[PLACEHOLDER]` values. Fill in font URL.

---

## Step 4 — Implement

Fill in the template:

1. **Font URL** — select correct load string from `references/typography-system.md`
2. **Token block** — paste from the profile file selected in Step 2
3. **Component styles** — write using `var(--token-name)` only, no hardcoded values
4. **Entrance animation** — if applicable, use patterns from `references/animation-system.md`
5. **States** — implement all states confirmed in gate: loading, empty, error, success
6. **Accessibility** — apply all requirements from `references/accessibility.md`
7. **Differentiation decision** — the named decision from gate question 3 must be visually present

---

## Step 5 — Anti-Slop Audit

Read `workflows/anti-slop-audit.md`.
Run all 4 gates. Fix every failure before proceeding.

Do not skip this step because "it looks fine." Run it explicitly.

---

## Step 6 — Deliver

Remove comment scaffolding from output (except the brief reference block at the top).
Confirm all of the following before delivering:

- [ ] Brief decision block present at top of file
- [ ] No [PLACEHOLDER] text remaining
- [ ] No TODO comments
- [ ] No hardcoded hex values in component styles (CSS vars only)
- [ ] Fonts load correctly for the profile
- [ ] All 4 anti-slop gates passed

---

## Common Pitfalls

**Forgetting the differentiation decision**
The brief gate requires naming one. If it doesn't appear in the rendered output, it was an empty promise. Find where it should live — a specific CSS rule, a layout choice, an interaction — and implement it.

**Empty state as an afterthought**
The empty state is designed as carefully as the populated state. It has a clear message, an available action, and uses the same visual language as the rest of the component.

**Skeleton that doesn't match the populated layout**
Skeleton placeholder shapes should reflect the actual content geometry. A full-width single-line skeleton for a 3-column metric grid looks wrong. Match the skeleton to the real layout.

**Tokens copied but not applied**
Pasting the `:root` block is step one. Verify every color value in component styles references a CSS variable — not a hardcoded hex that happens to match.
