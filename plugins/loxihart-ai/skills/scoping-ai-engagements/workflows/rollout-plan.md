# Rollout Plan

Pattern for phasing a scored initiative into gated phases. Loaded when the task
is phasing a capability rollout or domain unlock. Every gated phase needs a
written kill criterion.

## Required fields (per initiative)

- **Initiative name** — outcome-oriented, one line.
- **WSJF score** — from `wsjf-scoring.md`, four inputs shown.
- **Measurable outcome** — one metric, baseline → target, measurement window.
- **Phases** — the table below, each row complete.

## Phase table

| Phase | Goal (what it proves) | Entry gate | Kill criterion | Duration |
|---|---|---|---|---|
| 0: Instrument | Baseline measured, access wired | Sponsor + data access confirmed | No baseline obtainable in 1 wk → pause | 1 week |
| 1: Pilot | Works on a narrow slice | Phase 0 baseline documented | Misses outcome target by >X% → stop | `[FILL: pilot length]` |
| 2: Tune | Quality stable on the slice | Pilot hit threshold | Can't reach threshold in tuning window → re-scope | `[FILL]` |
| 3: Scale | Full rollout, monitored | Phase 2 stable | Cost or error exceeds ceiling → roll back | Ongoing |

## Gate logic

- Advance only when the **entry gate** of the next phase is met.
- Each phase proves one thing; if it can't, the **kill criterion** fires — stop, re-scope, or end. A phase without a written kill criterion is incomplete.
- Tie the Pilot kill criterion to the measurable outcome from discovery (e.g., "Tier-1 auto-triage accuracy < 80% at end of pilot → stop").

## Domain-unlock variant

For capability/domain rollouts (unlocking an AI capability to successive user
groups), treat each unlocked group as a phase: entry gate = prior group's
adoption/quality threshold met; kill criterion = adoption or satisfaction below
floor. `[FILL: client adoption thresholds per group]`
