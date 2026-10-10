# Workflow: Full Workshop (All Three Exercises)

<required_reading>
Read `references/exercises.md` — all sections before proceeding.
</required_reading>

<process>
## Sequence Overview

```
Exercise 1: Reverse Menu Mapping
  → Output: AI Project Backlog (stack-ranked)
      ↓
Exercise 2: AI Friction Audit (applied to top items from Backlog)
  → Output: Friction Heatmap (RED clusters ranked by ROI)
      ↓
Exercise 3: Guardrail & Trade-Off Matrix (applied to HIGH/MEDIUM clusters)
  → Output: HITL Architecture Safeguards + Risk-Mitigated Roadmap
```

Total time: ~45 minutes per exercise. Full workshop: 2–3 hours with breaks.

## Step 1: Open with Exercise 1

Follow `workflows/reverse-menu-mapping.md` in full.

Before moving on: confirm the AI Project Backlog is stack-ranked. Carry the **top 3–5 items** into Exercise 2.

## Step 2: Apply Exercise 2 to the Backlog Items

Follow `workflows/friction-audit.md`.

Scope the Friction Audit to workflows that support the top items from the Backlog — not every workflow in the org. Stay targeted.

Before moving on: confirm the Friction Heatmap is complete with annualized time estimates. Carry **HIGH and MEDIUM clusters** into Exercise 3.

## Step 3: Apply Exercise 3 to the High-ROI Items

Follow `workflows/guardrail-matrix.md`.

Each item from the Heatmap (HIGH/MEDIUM) gets a complete trade-off balance sheet. Do not skip items to save time — a missing balance sheet means an ungoverned deployment.

## Step 4: Deliver the Combined Output

Compile the three artifacts into a single workshop output package:

1. **AI Project Backlog** (from Exercise 1) — what to build and why
2. **Friction Heatmap** (from Exercise 2) — where the time is being lost
3. **HITL Architecture Safeguards** (from Exercise 3) — how to deploy safely

Together these answer: What? Where? How safely?

## Step 5: Identify the Next Action

The workshop output is not a roadmap until someone owns a next action. Before closing:

- Which item from the Backlog is sprint-ready now?
- Who is the named owner?
- What is the first concrete step (not "explore," not "investigate" — a specific action with a date)?
</process>

<success_criteria>
Full workshop is complete when:
- [ ] All three exercises completed with their respective artifacts
- [ ] Outputs chained correctly: Backlog → Heatmap → Safeguards
- [ ] At least one initiative is sprint-ready with a named owner and first action
- [ ] Combined output package delivered
</success_criteria>
