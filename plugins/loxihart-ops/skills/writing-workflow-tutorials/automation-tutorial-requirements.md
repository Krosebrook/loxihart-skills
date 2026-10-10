# Automation Tutorial Requirements

Required elements for all platform-specific automation tutorials. Applies on top of the base Tutorial Structure Template.

---

## n8n

### Required inclusions

| Element | Why required |
|---|---|
| Importable workflow JSON | Reader can reproduce without rebuilding node-by-node |
| n8n version used | UI and node names change between versions; reader needs to know if their version matches |
| Credential setup per node | n8n credential config is the #1 reader blocker; do not assume |
| Specific test input | Readers need a known-good input to verify execution |
| Expected test output | Reader must know what correct output looks like |
| ≥1 error + fix pair | "If you see X error, the fix is Y" — for the most common setup failure |

### JSON inclusion format

Wrap in a fenced code block with `json` tag. Add a note:
```
// Import this in n8n: top-left menu → Import Workflow → paste this JSON
```

---

## Zapier

### Required inclusions

| Element | Why required |
|---|---|
| Trigger + action clearly labeled | Zapier structure; reader must know which is which |
| App connection steps | OAuth flow differs per app; don't assume accounts are connected |
| "Test trigger" instruction | Zapier's UI requires explicit trigger test before Zap can be published |
| Monthly task count estimate | Readers need to know if they'll hit Zapier free tier limits |

---

## Make (formerly Integromat)

### Required inclusions

| Element | Why required |
|---|---|
| Scenario blueprint or labeled screenshot | Make's scenario builder is visual; readers need a reference layout |
| Module configuration per step | Each module has settings that aren't obvious from the name |
| Scheduling note | Readers must know: does this run instantly or on a schedule? |
| Monthly operations estimate | Make pricing is per-operation; readers need to know their tier impact |

---

## All Automation Tutorials

Regardless of platform:
- Label the tutorial's complexity level per the complexity-matrix.md rules
- Note if a paid tier is required — and which tier, and what it costs at time of writing
- Include the "TEST IT" block with a specific trigger input and expected output
