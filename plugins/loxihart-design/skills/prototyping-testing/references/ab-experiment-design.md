# A/B Experiment Design

A/B testing is a controlled experiment comparing two versions of exactly one variable.

## Pre-Experiment Checklist

- [ ] **Hypothesis written** — "We believe [change] will result in [metric change] because [rationale]"
- [ ] **Primary metric defined** — single metric that determines winner (conversion, click-through, task completion)
- [ ] **Guard rails defined** — metrics that must not degrade (error rate, NPS, page load time, revenue per user)
- [ ] **Sample size calculated** — use G*Power or Evan Miller's calculator before launching
- [ ] **Traffic allocation decided** — 50/50 is standard default
- [ ] **Run duration set** — minimum 2 full business cycles (Mon–Sun × 2) regardless of sample size
- [ ] **Segmentation plan documented** — any subgroups to analyze separately must be defined before launch
- [ ] **Novelty effect considered** — new UI elements get inflated engagement for ~1–2 weeks

## Sample Size Calculation

Inputs required:
- **Baseline conversion rate** — current rate before any change
- **Minimum detectable effect (MDE)** — smallest change worth detecting (absolute or relative)
- **Statistical power** — 80% standard; 90% for high-stakes decisions
- **Significance threshold** — α = 0.05 standard; α = 0.01 for consequential decisions

Tools: [Evan Miller](https://www.evanmiller.org/ab-testing/sample-size.html), G*Power (desktop), or statsig.com/calculator.

Always state assumptions explicitly when reporting results.

## Hypothesis Format

```
We believe [specific change to X]
will result in [direction + metric]
because [user behavior rationale].
```

Example: "We believe moving the sign-up CTA from the hero to a sticky bottom bar will increase mobile sign-up conversion rate because mobile users can reach the sticky bar without scrolling, reducing physical friction at the point of highest intent."

## Anti-Patterns

| Anti-pattern | Why it fails |
|---|---|
| Stopping when p<0.05 first appears (p-hacking) | Type I error rate inflates significantly with early stopping; a significance peak often regresses |
| Testing multiple changes simultaneously in A/B | Can't attribute effect to a specific change; use multivariate (MVT) instead |
| Ignoring guard rails showing degradation | Winning on primary metric while degrading NPS or error rate is not a win |
| Running on <5% of meaningful traffic | Under-powered; novelty effects dominate |
| Running on weekends only or weekdays only | Day-of-week behavior difference contaminates results; always cover full business cycles |

## Statistical vs. Practical Significance

- **Statistical significance** (p<0.05): probability that observed difference is not due to chance. Minimum threshold only.
- **Practical significance**: is the measured difference large enough to matter for the business? A 0.1% conversion lift on 1M daily users is practically significant. The same lift on 100 daily users is not.

Both must be present to ship.

## Workflow

1. Clarify: what is changing, what metric(s) will be measured, existing baseline
2. Write hypothesis in the correct format above
3. Define primary metric + guard rails
4. Calculate required sample size — record it, don't deviate
5. Define traffic allocation and minimum run duration
6. Specify segmentation plan
7. Document the anti-patterns most likely to apply to this specific test
8. Define go/no-go criteria before launch
