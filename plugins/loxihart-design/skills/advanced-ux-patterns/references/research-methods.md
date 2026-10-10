# User Research Methods Playbook

> **Tool note:** UsabilityHub rebranded to Maze — they're the same product. UserZoom merged with UserTesting and now operates as UserTesting. Verify pricing and availability before committing to any platform; UX research tooling shifts frequently.

## Method Selection Guide

| Question You're Answering | Method | Time | Participants |
|---|---|---|---|
| What are users trying to do? | Contextual inquiry | 1–2 weeks | 5–8 |
| Does this design work? | Usability testing | 3–5 days | 5–8 |
| What do users think on first glance? | 5-second test | 1 day | 20–50 |
| Is the navigation logical? | Card sorting (open) | 3–5 days | 20–30 |
| Can users find things? | Tree testing | 2–3 days | 50–100 |
| Which version performs better? | A/B test | 2–4 weeks | 500+ |
| What are users' overall feelings? | Survey/NPS | 1–2 weeks | 100+ |
| Why are users dropping off? | Analytics + session replay | Ongoing | N/A |
| What's the competitive landscape? | Heuristic evaluation | 2–3 days | 2–3 experts |

---

## Usability Testing

### When to Run
- Before launch (concept validation)
- After significant redesign
- When metrics show friction (high drop-off, support tickets)
- Sprint cadence: every 2–3 sprints minimum

### Session Structure (60 min)
```
0:00–0:05  Intro + consent + recording permission
0:05–0:10  Warm-up (their background, how they use similar products)
0:10–0:45  Task scenarios (4–6 tasks, think-aloud protocol)
0:45–0:55  Debrief questions (open-ended: what was confusing? what worked?)
0:55–1:00  Wrap up
```

### Task Scenarios — Writing Good Tasks
```
✅ GOOD (realistic, goal-oriented, no hints)
"You've just received an invoice from a client. Add it to your expenses 
for this month and mark it as reimbursable."

❌ BAD (describes the UI, not the user goal)
"Click the Add Expense button and fill out the form."

❌ BAD (leading question)
"Using the invoice upload feature, add an expense."
```

### Think-Aloud Protocol
```
Instructions to participant:
"As you work through these tasks, please say out loud whatever 
you're thinking, looking at, wondering, or confused by. 
There are no wrong answers — we're testing the design, not you."

Facilitator behavior:
- Don't help (say "What would you do if I wasn't here?")
- Don't answer questions (say "What do you think?")
- Do prompt silence ("What are you thinking right now?")
- Do note body language (leaning in, hesitation, frustration)
```

### Metrics to Track
- **Task completion rate:** % of users who completed task without help
- **Time on task:** seconds from start to completion
- **Error rate:** number of wrong clicks / dead ends
- **SUS score:** System Usability Scale (10 questions, 0–100)
- **SEQ score:** Single Ease Question (1–7, per task)

### Analysis
```
After sessions:
1. Affinity mapping: group observations by theme
2. Severity rating per issue: Critical (blocks) / Serious (major friction) / Minor
3. Fix prioritization: Critical first, then quick wins
4. Report: 1-page summary + prioritized issues list
```

---

## 5-Second Test

### When to Use
- Test first impressions of a new design
- Validate visual hierarchy (does the main CTA pop?)
- Check if value proposition is clear
- Compare alternatives quickly

### Setup
```
Tool options: Useberry, Maze, UsabilityHub
Participants: 20–50 (can recruit from crowd)
Duration: 5 seconds exposure + follow-up questions
```

### Question Bank
After the 5 seconds, ask:
- "What is this product/page for?"
- "What's the first thing you noticed?"
- "What do you think you'd do next on this page?"
- "Who do you think this is for?"
- "What, if anything, seemed unclear or confusing?"

### What You Learn
- Whether headline/value prop registers in 5 seconds
- Whether visual hierarchy matches intended priority
- Whether target audience recognizes themselves
- First CTA that catches attention

---

## Card Sorting

### Open Card Sort (Information Architecture Discovery)
**When:** You don't have an IA yet, or want to validate mental models
```
Process:
1. Create 30–60 cards (one concept/page per card)
2. Participants group cards however makes sense to them
3. Participants name their groups
4. Analyze: cluster diagram, similarity matrix
5. Output: proposed IA with confidence scores

Tools: OptimalSort, Maze, UserZoom
Participants: 20–30
```

### Closed Card Sort (IA Validation)
**When:** You have an existing or proposed IA to test
```
Process:
1. Same cards, but provide predefined categories
2. Participants assign cards to categories
3. Analyze: which cards are misplaced, which categories confuse
4. Iterate on IA based on placement patterns

Participants: 20–30
```

---

## Tree Testing

### When to Use
- Validate navigation structure before building
- Diagnose findability problems in existing nav
- Test renamed labels

### Setup
```
Tool: Optimal Workshop Treejack, Maze
Participants: 50–100 (remote, unmoderated)
Duration: 20–30 min per session
```

### Writing Tasks
```
✅ GOOD (uses natural language, realistic scenario)
"You want to find out how to add a new team member to your account.
Where would you go?"

❌ BAD (uses site terminology)
"Find the Team Management settings."
```

### Metrics
- **Directness:** % who found correct answer without backtracking
- **Success rate:** % who found correct destination
- **Time:** seconds to find answer
- **First click:** % who clicked the correct top-level item first

---

## Surveys and NPS

### When to Use
- Large-scale quantitative feedback (100+ responses)
- Tracking satisfaction over time
- Prioritizing features (max-diff, conjoint)
- Exit surveys (why are they leaving?)

### NPS
```
"How likely are you to recommend [product] to a friend or colleague?"
0–10 scale.

- 9–10: Promoters
- 7–8: Passives
- 0–6: Detractors

NPS = % Promoters - % Detractors
Good: >50. Excellent: >70.

Always follow with open text:
"What's the main reason for your score?"
```

### Survey Design Rules
```
✅ DO:
- One question per page (conversational flow)
- Neutral wording ("How often do you..." not "How rarely...")
- Balanced scales (same number of positive/negative options)
- Open text after key closed questions
- Max 10 questions for unsolicited surveys

❌ AVOID:
- Double-barreled questions ("Is it easy to use AND helpful?")
- Leading questions ("How great is our customer service?")
- Rating scales without anchors (what does 3 mean?)
- Asking about intent when behavior data is available
```

---

## Heuristic Evaluation

### Nielsen's 10 Heuristics (Quick Reference)

| # | Heuristic | Check |
|---|---|---|
| 1 | Visibility of system status | Does the system communicate what's happening? |
| 2 | Match between system and real world | Is language familiar? Are metaphors apt? |
| 3 | User control and freedom | Easy to undo, redo, and exit? |
| 4 | Consistency and standards | Does it follow platform conventions? |
| 5 | Error prevention | Does design prevent errors before they occur? |
| 6 | Recognition over recall | Are options visible (not remembered)? |
| 7 | Flexibility and efficiency | Shortcuts for experts? |
| 8 | Aesthetic and minimalist design | Is irrelevant content removed? |
| 9 | Error recovery | Error messages specific + constructive? |
| 10 | Help and documentation | Is help contextual and searchable? |

### Severity Ratings
```
0 — Not a usability problem
1 — Cosmetic only (fix if time allows)
2 — Minor (low priority fix)
3 — Major (important fix, high priority)
4 — Catastrophic (must fix before launch)
```

### Process
```
1. Recruit 3–5 evaluators (more yields diminishing returns)
2. Each evaluates independently (avoid anchoring bias)
3. Aggregate findings, merge duplicates
4. Rate severity (team average)
5. Report: issue, heuristic violated, severity, screenshot, recommendation
```

---

## Analytics Integration

### Leading Indicators (Watch for Change)
- **Engagement rate:** % of sessions with meaningful interaction
- **Feature adoption:** % of users who used a feature in the last 30 days
- **Time to first key action:** onboarding funnel first-value milestone
- **Session depth:** pages/screens per session

### Lagging Indicators (Business Outcomes)
- **Retention:** % active at day 1, 7, 30
- **NPS / CSAT:** survey scores over time
- **Conversion rate:** trial → paid, visitor → signup
- **Churn rate:** cancellations per period

### Finding Friction Points
```
1. Funnel analysis: where do users drop off?
2. Rage clicks / dead clicks (no action on repeated click)
3. Form abandonment: which fields cause drop-off?
4. Error frequency: which error messages fire most?
5. Session replay: watch real sessions for the specific step
6. Support ticket tagging: what do users complain about?
```

---

## Research Operations

### Research Repository
```
Store all research artifacts:
- Session recordings (link, not file)
- Transcripts / notes
- Key findings per session
- Tagged by: date, method, product area, user segment
- Searchable so future teams can reuse findings
```

### Recruiting
```
Internal: product feedback list, support tickets, power users
External: Respondent, UserTesting, Prolific
Screener: 4–6 questions, disqualify competitors + employees
Incentive: $50–150/hr depending on segment (higher for enterprise buyers)
```

### Consent and Ethics
```
Always:
- Written consent for recordings
- Inform if session is for research only (no customer service)
- Store data securely, anonymize if sharing broadly
- Option to withdraw
Never:
- Record without consent
- Share identifying information without permission
- Use research data for sales
```
