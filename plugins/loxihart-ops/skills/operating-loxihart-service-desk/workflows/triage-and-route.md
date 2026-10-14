# Workflow: Triage and Route (Loxihart/[CLIENT])

Loxihart-specific triage layer on `unifying-service-desk`.

## Required Reading
1. `references/environment-constants.md` or `references/client-profile.md`
2. `references/kb-article-registry.md`
3. `references/soc2-compliance-flags.md`

## Process

### Step 1 — Classify
Map to `unifying-service-desk` 12 categories. [CLIENT]? Apply [CLIENT] constraints.

### Step 2 — Determine Tier
`references/escalation-routing.md`. Apply overrides: security → L3, [COMPLIANCE FRAMEWORK] → L2+, P1 → escalation-gate.

### Step 3 — Check KB
`references/kb-article-registry.md`. Article exists? Note code. Not? Prepare GAP flag.

### Step 4 — Draft Note
- Client-visible → `templates/public-note.md`
- Escalating → `templates/escalation-note.md`
- Closing → `templates/resolution-summary.md`

### Step 5 — Verify
SKILL.md self-verification checklist + `patterns/good-examples.md`.

## Completion Gate
- [ ] Category identified
- [ ] Tier determined
- [ ] KB checked — referenced or GAP flagged
- [ ] [COMPLIANCE FRAMEWORK] flags applied if triggered
- [ ] Correct template used
- [ ] FreshService-compatible output
