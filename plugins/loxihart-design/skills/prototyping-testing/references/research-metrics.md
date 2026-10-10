# Research Metrics Frameworks

Design quality is measurable. Use these frameworks to define what you're measuring before collecting data.

---

## HEART Framework (Google)

Five dimensions. For each: define Goal (what you want to achieve), Signal (user behavior that indicates it), and Metric (how you measure the signal).

| Dimension | Measures | Example signal | Example metric |
|---|---|---|---|
| **Happiness** | Satisfaction, perceived quality | Users rate the experience positively | CSAT score, NPS, SUS score |
| **Engagement** | Depth and frequency of use | Users return and go deeper | Sessions per user per week, features used per session |
| **Adoption** | New users / feature uptake | Users try a new feature | % users who used feature within 7 days of release |
| **Retention** | Users coming back | Users return after initial session | 30-day retention rate, churn rate |
| **Task Success** | Completion, efficiency, errors | Users complete their goal | Task completion rate, time on task, error rate |

**Common mistake:** defining signals and metrics without goals first. Start with Goal → Signal → Metric, in that order. Metrics without goals are vanity metrics.

---

## SUS — System Usability Scale

10-question alternating-polarity Likert scale. Score 0–100. Administered after a session or prototype test.

**Sauro-Lewis curved grading scale** (based on 241+ industrial usability studies; 68 = 50th percentile):

| Score | Grade | Interpretation |
|---|---|---|
| ≥80.3 | A | Excellent — users find it easy, likely to recommend |
| 72.6–80.2 | B | Above average |
| 65.0–72.5 | C | Average (industry center: 68) |
| 51.7–64.9 | D | Below average — structural usability issues present |
| ≤51.6 | F | Poor — significant problems, likely task abandonment |

**Interpretation notes:**
- 68 is the average (C, 50th percentile) — not a passing grade, a median
- "Above average" requires scoring above ~72.6, not just above 68
- 80+ is the common industry goal (A range)
- SUS scores are not percentages — a 70 is not the 70th percentile

**Source:** Sauro & Lewis (2016), *Quantifying the User Experience*, 2nd ed. Grading scale first published Sauro (2011), measuringu.com/sus

### After a Low Score

- Score 51–67 (D): run moderated usability test with 5 participants to identify what's dragging the score — administer SEQ per task to isolate problem areas
- Score <51 (F): structural problems likely — heuristic evaluation first to identify systemic issues before investing in a full test

---

## SEQ — Single Ease Question

1-item 7-point scale administered immediately after each task, before debrief.

**Question:** "Overall, how difficult or easy was this task to complete?"

**Scale:** 1 = Very Difficult → 7 = Very Easy

**Benchmarks** (Sauro, MeasuringU — 400+ tasks, ~10,000 users):
- Average across tasks: **~5.5** (range 5.3–5.6)
- Scores **below 5**: warrant follow-up — ask "Why?" to diagnose friction
- Scores **≤4**: significant task difficulty requiring investigation
- Scores **≤3**: catastrophically difficult task (far below average)

**Why use SEQ over SUS per task:** SUS measures overall system perception; SEQ measures perceived difficulty of a specific task immediately after completing it. More granular, more actionable, administered per task rather than once at end.

**Pairing:** SUS gives overall system score; SEQ identifies which specific tasks are dragging it down.

---

## Choosing the Right Metric

| Goal | Metric |
|---|---|
| Overall system perception | SUS |
| Per-task difficulty | SEQ |
| Emotional response / brand alignment | Microsoft Reaction Cards |
| User satisfaction | CSAT (1–5 rating) or NPS (0–10, "recommend?") |
| Task success rate | Binary: completed / did not complete |
| Efficiency | Time on task (mean + standard deviation) |
| Error rate | Count of errors per task, or % of participants who made at least one error |
