# Staff Engineer Audit Template

## Purpose
Full-system audit across all 11 engineering pattern phases. Use before production launch, after major architecture changes, or quarterly for high-stakes systems.

---

## Audit Header

```
System / Feature: ___________________________
Auditor: ____________________________________
Date: _______________________________________
Lane: [ ] LOXIHART  [ ] PERSONAL  [ ] FREELANCE
Audit Type: [ ] Pre-launch  [ ] Quarterly  [ ] Post-incident  [ ] Architecture change
```

---

## Phase Scorecard

Score each phase 0–5. Target: phases 1–6 ≥ 4 before production. Phases 7–11 ≥ 3.

| Phase | Name | Score (0–5) | Blockers | Notes |
|-------|------|-------------|----------|-------|
| 01 | Foundation & Hygiene | | | |
| 02 | Resilience & Error Handling | | | |
| 03 | Performance | | | |
| 04 | Data Integrity | | | |
| 05 | Observability | | | |
| 06 | Deployment | | | |
| 07 | Scalability | | | |
| 08 | Edge Cases | | | |
| 09 | Security Deep Dive | | | |
| 10 | Compliance, DR & FinOps | | | |
| 11 | AI Systems & HITL | | | |

**Weighted Average:** _____ / 5.0

---

## Scoring Rubric

| Score | Meaning |
|-------|---------|
| 0 | Not considered — completely absent |
| 1 | Acknowledged but not implemented |
| 2 | Partially implemented — critical gaps remain |
| 3 | Mostly complete — minor gaps acceptable for staging |
| 4 | Production-ready — all critical checklist items pass |
| 5 | Exemplary — goes beyond checklist, actively monitored |

---

## Production Readiness Gate

**Mandatory: All must pass before production launch.**

- [ ] Phase 01 score ≥ 4 (Foundation is non-negotiable)
- [ ] Phase 02 score ≥ 4 (Unhandled errors in prod = on-call at 3am)
- [ ] Phase 03 score ≥ 3 (P95 latency measured and within budget)
- [ ] Phase 04 score ≥ 4 (Data corruption is the hardest bug to recover from)
- [ ] Phase 05 score ≥ 4 (You cannot fix what you cannot see)
- [ ] Phase 06 score ≥ 4 (Rollback plan exists and has been tested)
- [ ] Phase 09 score ≥ 4 (Security gaps are production blockers, not backlog items)
- [ ] No CRITICAL security findings unmitigated
- [ ] No P0 failure modes without documented mitigation
- [ ] On-call runbook exists and is current

**If any gate fails: do not launch. Create tickets, set deadline, re-audit.**

---

## Findings Log

### Critical (Must fix before launch)
| # | Phase | Finding | Owner | Due |
|---|-------|---------|-------|-----|
| | | | | |

### High (Fix within sprint 0 post-launch)
| # | Phase | Finding | Owner | Due |
|---|-------|---------|-------|-----|
| | | | | |

### Medium (Fix within 30 days)
| # | Phase | Finding | Owner | Due |
|---|-------|---------|-------|-----|
| | | | | |

### Low / Observational (Backlog)
| # | Phase | Finding | Owner | Due |
|---|-------|---------|-------|-----|
| | | | | |

---

## Architecture Review

### System Boundaries
- External dependencies (APIs, queues, databases, CDNs): _______________
- Data flows across trust boundaries: _______________
- Authentication / authorization model: _______________

### Failure Mode Analysis (top 5 risks)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

### Single Points of Failure
- [ ] None identified
- [ ] Documented and accepted with reasoning: _______________

---

## Stack Alignment (Kyle's defaults)

| Component | Expected | Actual | Delta |
|-----------|----------|--------|-------|
| Language | TypeScript strict | | |
| Frontend | Next.js | | |
| Backend | Next.js API / Hono | | |
| Database | Supabase (Postgres) | | |
| Auth | Supabase Auth | | |
| Queue | Inngest / BullMQ | | |
| Hosting | Vercel + Cloudflare Workers | | |
| Observability | Sentry + PostHog | | |
| Payments | Stripe | | |
| Email | Resend | | |
| Feature Flags | PostHog | | |

---

## Decision Priority Check

Review each significant architectural decision against the priority order:

**Maintainability > Correctness > Security > Observability > Scalability > Performance > Cleverness**

- Is any decision optimizing for performance at the expense of maintainability? ___
- Is any decision "clever" in a way that will confuse the next engineer? ___
- Is observability bolted on or built in? ___

---

## Sign-off

```
Audit complete: [ ] YES  [ ] NO — pending items listed above

Auditor signature: ___________________________
Engineering owner: ___________________________
Launch approved: [ ] YES  [ ] NO

If NO — re-audit scheduled for: _______________
```
