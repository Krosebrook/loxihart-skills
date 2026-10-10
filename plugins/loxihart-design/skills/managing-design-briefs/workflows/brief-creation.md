# Brief Creation Workflow

End-to-end: intake → template → gates → adversarial critic → approve.

---

## Step 1 — Profile Confirmation

Ask explicitly if not already stated:
- `Loxihart` → enterprise tool, internal dashboard, MSP context, FreshService, any Loxihart tooling
- `FlashFusion` → product marketing, creator tools, app.flashfusion.co, client-facing

If ambiguous: ask one clarifying question. Do not guess.

Load the confirmed profile token file before proceeding to Step 2.

---

## Step 2 — Intake (5 Questions)

Extract from conversation context first — ask only for what's missing.

**1. Component type and exact context**
Not "a dashboard" — "a ticket status panel for a managed services help desk
showing open / in-progress / resolved counts with drill-down per client."
Specificity locks the layout. "Clean and modern" is not an answer.

**2. One differentiation decision**
What single choice separates this from the category default?
If the user can't answer, propose one and confirm:
- "Monospaced counts to signal precision"
- "Edge-lit card border on hover that reveals depth"
- "Asymmetric grid breaking left column wide"
- "Bottom-anchored timestamp instead of top-right"
- "Command palette as primary nav instead of sidebar"

**3. State inventory**
Minimum: empty, loading, error, success.
Ask about: hover, focus, disabled, partial data, first-time user, skeleton vs spinner.

**4. Navigation model**
Named pattern required + one-sentence justification:
- Command palette (primary for Loxihart, power-user context)
- Floating pill with blur (FlashFusion default)
- Flat tab bar (max 4 tabs)
- Sidebar (requires written justification — adds chrome, must earn it)
- Bottom nav (mobile-primary only)
- Breadcrumb (document/drill-down context)

**5. Delivery target**
- HTML artifact (single file, Claude chat)
- React artifact (JSX + hooks)
- File for downstream use (.html, .jsx, .tsx)
- Generator prompt only (for v0/Stitch)

---

## Step 3 — Fill the Template

Open `templates/brief-template.md`.
Fill every field. Leave nothing blank or marked "TBD."

---

## Step 4 — Anti-Slop Gates

Open `workflows/anti-slop-gates.md`.
Run all 7 gates against the completed brief.
All must pass before proceeding. Fix failures before Step 5.

---

## Step 5 — Adversarial Critic (STANDARD / FULL scope)

Open `workflows/adversarial-critic.md`.
Run the critic pass. Resolve all HIGH severity findings.
Document MEDIUM findings as known risks.

---

## Step 6 — Approval Block

Output this before any generation begins:

```
Brief approved.
Profile: [Loxihart | FlashFusion]
Component: [exact description]
Differentiator: [one sentence]
Nav model: [named pattern — justification]
Gates: ✓ 1  ✓ 2  ✓ 3  ✓ 4  ✓ 5  ✓ 6  ✓ 7
Critic: [LITE: skipped | STANDARD/FULL: passed / N findings resolved]
Ready to generate.
```

---

## Fast-Path (user says "just build it")

- Extract profile, component context, delivery format from conversation
- Name a differentiation decision yourself — state it as "Assuming: [X]"
- Default states: empty + loading + error + success
- Run gates 1–7 even on fast-path — compress, don't skip
- Output the approval block with all assumptions documented
