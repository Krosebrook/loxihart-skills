# REFERENCE-templates.md
# Loxihart AI Enablement PM — Full PRD Template & Patterns

## Full PRD Template
```markdown
# [Initiative Name] — AI Enablement PRD

**Status**: Draft | In Review | Approved
**Owner**: Kyle Rosebrook, Staff Engineer (AI SME)
**Date**: [YYYY-MM-DD]
**WSJF Score**: [score]
**Audience**: [[PERSON] / [PERSON] / [PERSON] / Engineering]

---

## Problem Statement
[1-2 sentences: what pain, how many affected, what evidence.
Example: "KB article creation takes 45 min/article, inconsistent quality.
Service desk creates ~8/month = ~6 hours of [PERSON]'s team time."]

## Proposed Solution
[What the AI capability does. How staff invoke it. What it replaces. Name the specific skill.]

## Stakeholder Impact Matrix
| Stakeholder | Current State | Future State | Metric |
|---|---|---|---|
| [PERSON] | [pain] | [outcome] | [ROI metric] |
| [PERSON] | [pain] | [outcome] | [efficiency metric] |
| [PERSON] | [pain] | [outcome] | [service metric] |
| Engineering | [pain] | [outcome] | [time saved] |

## Success Metrics
| Metric | Baseline | Target | Measurement | Review |
|---|---|---|---|---|
| [e.g., KB article time] | [e.g., 45 min] | [e.g., 8 min] | [e.g., time-tracked] | Monthly |

## Rollout Plan
| Phase | Timeline | Scope | Owner | Exit Criteria |
|---|---|---|---|---|
| Pilot | Week 1-2 | [N people] | Kyle | [N completes 1 task, feedback documented] |
| Soft launch | Week 3-4 | [broader] | Kyle + [stakeholder] | [adoption > X%] |
| Full deploy | Week 5+ | All eligible | Dept lead | [success metric hit] |

## Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low adoption (onboarding hard) | High | High | Kyle 1:1 aha moments for first 5 users |
| Output quality inconsistent | Medium | Medium | Acceptance criteria in skill; review before publish |

## Acceptance Criteria
- [ ] Stakeholder sign-off from [name] by [date]
- [ ] Pilot with [N] people; feedback documented
- [ ] Baseline metric captured before launch
- [ ] Skill deployed to shared repo and documented in Notion

## Out of Scope
[What this does NOT cover — prevent scope creep]
```

---

## WSJF Reference Examples
| Initiative | BV | TC | RR | Size | WSJF | Decision |
|---|---|---|---|---|---|---|
| #ai-wins Slack channel | 8 | 9 | 7 | 1 | 24.0 | Launch now |
| loxihart-ai-enablement-pm skill | 9 | 7 | 6 | 2 | 11.0 | This week |
| Token tracking (instrumented) | 7 | 6 | 8 | 5 | 4.2 | Phase 4 |
| Hiring criteria update | 8 | 5 | 7 | 3 | 6.7 | Q2 |

---

## Stakeholder Brief Examples

### [PERSON] Brief (ROI framing)
```markdown
# AI Enablement Program — Q1 Update
From: Kyle Rosebrook, AI SME | For: [PERSON]

What we're doing: Deploying a library of reusable AI skills that automate repetitive
work across engineering, service desk, and operations.

Why it matters: Competitors are shipping 2-3x faster with AI tooling. We risk falling
behind on talent retention and delivery velocity if we don't build this capability.
Current trajectory: ~8 engineers actively using AI tools. Target: 40+ by Q2.

What it costs: ~5 hrs/week Kyle's time for office hours and 1:1 enablement sessions.
No additional tooling budget required — Claude access already provisioned.

What success looks like: 40% of engineers with ≥1 AI domain unlocked by Q2.
Estimated 200+ hours/month saved across the org.
```

### [PERSON] Brief (Ops framing)
```markdown
# KB Article Generator — Pilot Proposal
From: Kyle Rosebrook, AI SME | For: [PERSON]

What we're doing: Deploying the kb-article-generator skill to your team.
It produces formatted KB articles in 8 minutes vs. the current 45-minute manual process.

Why it matters to service desk: Your team creates ~8 KB articles/month.
That's ~6 hours/month that could be redirected to triage and resolution.
Article quality and consistency also improves — the skill enforces the Loxihart template.

What it costs: 15-minute demo + 1 pilot run for each team member.
No setup required — they access it through Claude.ai.

What we're asking for: 15 minutes at your next team standup to demo + your approval
to share the skill link with your team.

What success looks like: Article creation time < 10 min/article within 2 weeks of rollout.
```
