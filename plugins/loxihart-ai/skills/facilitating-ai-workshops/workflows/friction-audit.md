# Workflow: AI Friction Audit

<required_reading>
Read `references/exercises.md` — Section 2 (AI Friction Audit) before proceeding.
</required_reading>

<process>
## Step 1: Pick the Workflow

Choose one core recurring workflow — daily or weekly frequency preferred. Monthly is acceptable. One-off processes are not useful here.

Ask the participant: "What's a workflow you do on a fixed schedule that takes significant time?"

## Step 2: Map Every Step

No skipping. No grouping steps owned by the same person. Each discrete action is its own row.

If the participant says "I do the reporting," break it apart:
- Pull data from system A
- Pull data from system B
- Cross-reference in spreadsheet
- Write the summary email
- Send to distribution list

These are five steps, not one.

## Step 3: Flag Each Step — No Neutrals

🟢 **Green Light** — high human value: judgment, creativity, relationship, context that can't be systematized
🔴 **Red Light** — cognitive boilerplate: data retrieval, format conversion, copy/paste, manual aggregation, templated writing

The test for edge cases: "Would a skilled human doing this produce a meaningfully better outcome than a well-prompted AI?" Yes = Green. No or unsure = Red.

## Step 4: Measure the Red Lights

For every Red Light step, record:
- Time per cycle (minutes)
- Cycles per year

Calculate: annualized time cost = (minutes/cycle) × (cycles/year) / 60 → hours/year

## Step 5: Build the Friction Heatmap

Cluster Red Lights by category. Rank clusters by: (annualized hours) × (automation feasibility).

| ROI Tier | Cluster | Est. Hours/Year | Feasibility |
|---|---|---|---|
| HIGH | | | |
| MEDIUM | | | |
| LOW | | | |

## Step 6: Deliver the Artifact

Output: Friction Heatmap — ranked Red Light clusters with time-cost estimates and ROI tier. If chaining to Exercise 3, pass HIGH and MEDIUM clusters forward.
</process>

<success_criteria>
Exercise 2 is complete when:
- [ ] Workflow selected with known frequency
- [ ] Every step mapped (no grouping)
- [ ] Every step flagged Green or Red — no neutrals
- [ ] Every Red Light has a time estimate and annualized cost
- [ ] Heatmap clusters ranked by ROI tier
- [ ] Artifact delivered: Friction Heatmap
</success_criteria>
