# Usability Testing Planning

## Test Plan Components (Required)

1. **Research questions** — what decisions will this inform?
2. **Participant criteria** — who to recruit, how many (5 for moderated; 20+ for unmoderated quantitative)
3. **Tasks** — scenario-based, realistic, no feature names in wording
4. **Metrics** — task success rate, time on task, error rate, satisfaction (SUS or SEQ)
5. **Protocol** — intro script, think-aloud instructions, task delivery, debrief questions
6. **Recording and consent** — tools, recording consent, participant anonymization
7. **Analysis plan** — how results will be coded and reported
8. **Report format** — who receives findings, in what format, with what SLA

## Task Writing Rules

- **Scenario framing** — "You've just received an invoice from a vendor and need to record the expense..." not "Go to the invoices section"
- **No feature names** — not "use the invoice tool", say "record this expense"
- **Realistic trigger** — give participants a plausible reason they'd do this task
- **Define success before running** — not after. Write the success criterion in the test plan.

### Task Writing Pattern

```
Context: [realistic situation that would lead to this task]
Goal: [what they need to accomplish, in user language, no feature names]
Success: [observable state that indicates task completion — define this before the session]
```

## Moderator Protocol Structure

1. **Intro (5 min)** — rapport, explain think-aloud, confirm recording consent
2. **Warm-up question (2 min)** — "How often do you [relevant activity]?" — builds comfort
3. **Tasks (bulk of session)** — deliver one at a time, no hints, record all verbal + behavioral observations
4. **Debrief (5–10 min)** — open questions, anything surprising, overall impressions
5. **SUS or SEQ** — administer before debrief closes

## Observation Sheet

Build a grid: rows = tasks, columns = participants. For each cell record:
- Success (✓ direct / ~ indirect / ✗ fail)
- Time on task
- Errors made
- Verbal quotes worth flagging
- Severity (0–4) if a problem was observed

## Analysis

- Group observations by task first, then by theme
- Code severity on Nielsen 0–4 scale
- Prioritize by: severity × frequency
- Top 3 critical issues get specific remediation recommendations
- Report format: executive summary → method → findings by severity → recommendations

## Participant Count Guidance

- **Moderated qualitative:** 5 per distinct user group — reveals ~85% of problems (assumes L=31%; see CLAIMS in SKILL.md)
- **Unmoderated quantitative:** 20+ for statistically meaningful completion rates
- **Comparative (A vs B):** 8–10 per group to detect large differences
