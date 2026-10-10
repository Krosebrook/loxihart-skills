# WSJF Scoring

Weighted Shortest Job First — Cost of Delay over Job Size. Loaded when the task
is prioritizing an initiative list.

## Formula

```
WSJF = (Business Value + Time Criticality + Risk Reduction) / Job Size
```

Score each input on Fibonacci **1-2-3-5-8-13-20**.

| Input | Question | High score means |
|---|---|---|
| Business Value | What's the upside — revenue, hours, quality? | Large, direct value |
| Time Criticality | Does delay erode the value? (seasonal, contractual, competitive) | Window is closing |
| Risk Reduction | Does it de-risk compliance, key-person dependency, errors? | Removes real risk |
| Job Size | Effort to deliver — build + integrate + change management | (denominator: bigger = lower WSJF) |

## Procedure

1. Score all four inputs per initiative. Show the numbers — never just the quotient.
2. Compute WSJF. Sort descending.
3. **Archive any initiative scoring < 2.0** — it's not worth a slot in the roadmap now.
4. Carry the top items into the rollout plan.

## Worked example

| Initiative | BV | TC | RR | Job | WSJF |
|---|---|---|---|---|---|
| Tier-1 Ticket Auto-Triage | 8 | 5 | 5 | 5 | 3.6 |
| KB Auto-Generation | 5 | 3 | 3 | 3 | 3.7 |
| Exec Reporting Bot | 3 | 2 | 1 | 5 | 1.2 → archive |

## Notes

- Job Size is relative within this client's backlog, not absolute hours.
- Re-score when constraints change (e.g., a deadline appears → Time Criticality rises).
- `[FILL: client-weighted inputs if the sponsor values one dimension over others]`
