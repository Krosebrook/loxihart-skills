# Workflow: Guardrail & Trade-Off Matrix

<required_reading>
Read `references/exercises.md` — Section 3 (Guardrail & Trade-Off Matrix) before proceeding.
</required_reading>

<process>
## Step 1: Take Inputs from Exercises 1 and 2

If chaining: take the top items from the AI Project Backlog (Exercise 1) and HIGH/MEDIUM clusters from the Friction Heatmap (Exercise 2).

If running standalone: ask the participant to name their proposed AI initiatives.

## Step 2: Complete a Trade-Off Balance Sheet Per Initiative

For each initiative, fill all four columns. Do not advance until every cell has content.

| AI GAIN | WHAT WE GIVE UP | MITIGATION LAYER | HITL CHECKPOINT |
|---|---|---|---|
| (speed, scale, cost, coverage) | (deterministic certainty, privacy, auditability, cost) | (validation layer, rollback, access control, deterministic check) | (trigger condition + **named person**) |

**Facilitator prompts per row:**
- "What breaks — and what does it cost — if the AI gets this wrong?" → quantify blast radius
- "How would you know it got it wrong?" → defines monitoring requirement
- "Who is on the hook when it fails? Name a person, not a team." → forces named owner

## Step 3: Classify Each Initiative

Force a risk classification before moving on:

- **Probabilistic only** — AI decides, no human gate → requires escalation approval before deployment
- **Probabilistic + deterministic** — AI output validated by rule-based check (regex, keyword, schema)
- **HITL on exception** — AI handles standard cases; human reviews edge cases
- **HITL on all outputs** — AI drafts; human approves every output

Anything classified "Probabilistic only" requires a separate escalation sign-off.

## Step 4: Build the Safeguards Doc

Compile all completed balance sheets into a single HITL Architecture Safeguards document:
- Which systems are probabilistic vs deterministic
- Where humans stay in the loop
- Named owners for each checkpoint
- Trigger conditions (not "when something looks wrong" — specific, observable signals)

## Step 5: Deliver the Artifact

Output: Risk-Mitigated AI Roadmap — all initiatives classified, trade-offs documented, HITL checkpoints named. This is the governance sign-off document.
</process>

<success_criteria>
Exercise 3 is complete when:
- [ ] Every initiative has a completed trade-off balance sheet (all 4 columns filled)
- [ ] Every HITL checkpoint has a named human owner — not "the team" or "human review"
- [ ] Every initiative has a risk classification
- [ ] "Probabilistic only" items are flagged for escalation
- [ ] Artifact delivered: HITL Architecture Safeguards / Risk-Mitigated AI Roadmap
</success_criteria>
