# Phase Plan

The rollout plan with gate thresholds and kill criteria. Loaded when the task is
about the engagement phases. Instantiate this table with the client's numbers.

## Phases

| Phase | Duration | Goal | Gate to advance |
|---|---|---|---|
| 0: Instrument | 1 week | Wire webhook, PII redaction, baseline | Benchmark Zero documented; redaction verified |
| 1: Draft mode | 30 days | Generate to Draft, humans review | Article pass rate ≥ 80% |
| 2: Tune | 2 weeks | Fix router/prompt/validator misses | Pass rate stable ≥ 90% for 5 consecutive days |
| 3: Scale | Ongoing | Full volume, monitor | Phase 2 gate passed |

## Gate logic

- **Pass rate** = articles a reviewer publishes (with light or no edit) ÷ articles generated, over the window.
- **Advance** only when the gate threshold is met. Do not skip gates.

## Kill / extend criteria

- **Kill:** pass rate < 60% at day 30. The pipeline is generating more review burden than value — stop, diagnose, or end the engagement.
- **Extend:** pass rate 60–79% at day 30 → grant a 2-week tuning sprint, then re-evaluate against the Phase 1 gate.
- **Pass:** ≥ 80% at day 30 → advance to Phase 2.

## Metrics to track each phase

- Generation rate (articles/week) and router accept ratio.
- Reviewer edit distance (how much humans change before publishing).
- Cost/month vs. Benchmark Zero status-quo cost.
- KB GAP queue size (validator rejects) — a rising GAP queue signals a prompt or schema problem.

`[FILL: client-specific gate thresholds if they differ from the 80/90% defaults; reviewer SLA for clearing the Draft queue]`
