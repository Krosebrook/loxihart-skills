# WSJF Sprint Backlog — FlashFusion Agent Stack v1.9.9

**WSJF = (Business Value + Time Criticality + Risk Reduction) ÷ Job Size**
Scale: 1, 2, 3, 5, 8, 13, 20 (Fibonacci)

Higher score = higher priority. Cut items from the bottom when time-boxed.
Update scores after Phase 0 — the gaps audit will surface new items.

Last updated: Sprint 1, pre-Phase 0

---

## Sorted Backlog (descending WSJF)

| # | Item | Phase | BV | TC | RR | Size | WSJF | Status |
|---|------|-------|----|----|----|------|------|--------|
| 1 | Run Phase 0 — full gaps + assumptions audit | 0 | 8 | 13 | 13 | 2 | **17.0** | ☐ |
| 2 | Lock WSJF defaults from Phase 0 output | 0 | 5 | 13 | 8 | 2 | **13.0** | ☐ |
| 3 | Supabase schema + all RLS policies (SQL migration) | 1 | 13 | 8 | 13 | 5 | **6.8** | ☐ |
| 4 | Billing plan gate matrix + enforcement points | 3 | 13 | 8 | 13 | 5 | **6.8** | ☐ |
| 5 | ARCHITECTURE.md — system boundaries + failure modes | 1 | 13 | 8 | 8 | 5 | **5.8** | ☐ |
| 6 | TypeScript interface file `src/types/v199.ts` | 4 | 8 | 3 | 5 | 3 | **5.3** | ☐ |
| 7 | SECURITY_MODEL.md — threat model + RLS + injection defense | 1 | 8 | 5 | 13 | 5 | **5.2** | ☐ |
| 8 | Smoke test suite — 8 scenarios with binary pass/fail | 4 | 13 | 5 | 8 | 5 | **5.2** | ☐ |
| 9 | ROLLBACK_RECOVERY.md — failure tree + compensating actions | 3 | 8 | 5 | 13 | 8 | **4.5** | ☐ |
| 10 | OBSERVABILITY_RUNBOOK.md — trace schema + replay + redaction | 3 | 8 | 5 | 8 | 5 | **4.2** | ☐ |
| 11 | TOOL_CONTRACTS.md — idempotency + permission scopes + audit | 2 | 8 | 3 | 8 | 5 | **3.8** | ☐ |
| 12 | AGENT_CATALOG.md — 7 agents, types, compensating actions | 2 | 13 | 5 | 8 | 8 | **3.25** | ☐ |
| 13 | GRAPH_SPEC.md — node map + state shape + checkpoint locations | 2 | 13 | 5 | 8 | 8 | **3.25** | ☐ |
| 14 | ROLLBACK smoke tests — mid-publish, mid-billing, mid-export | 3 | 8 | 5 | 8 | 8 | **2.6** | ☐ |  
| 15 | MEMORY_SPEC.md — layer map + TTL + redaction + scope | 2 | 8 | 3 | 5 | 5 | **3.2** | ☐ |
| 16 | API_CONTRACTS.md — REST + events + WebSocket + error catalog | 4 | 8 | 3 | 5 | 5 | **3.2** | ☐ |
| 17 | Acceptance criteria — boolean gate per shipping condition | 4 | 8 | 3 | 5 | 5 | **3.2** | ☐ |
| 18 | Monorepo folder tree with file-level annotations | 1 | 5 | 3 | 3 | 3 | **3.7** | ☐ |
| 19 | Open items closure + 2.0 migration notes | 4 | 5 | 3 | 5 | 5 | **2.6** | ☐ |
| 20 | CrewAI content lane design (brand kit, listing, research crews) | 2 | 5 | 2 | 3 | 5 | **2.0** | ☐ |
| 21 | AutoGen premium reasoning lane config (optional, feature-flagged) | 2 | 3 | 1 | 3 | 5 | **1.4** | ☐ |
| 22 | Make / n8n ops automation layer (alerts, webhook fan-out) | 3 | 3 | 1 | 2 | 5 | **1.2** | ☐ |
| 23 | Agent Studio operator UI (read-only trace viewer) | 3 | 5 | 2 | 3 | 13 | **0.77** | ☐ |

---

## Scoring Rationale

### Items 1–2 (Phase 0)
Phase 0 has the highest WSJF of anything in this backlog.
Running a gaps audit before generating architecture eliminates the risk of
building on wrong assumptions for compliance scope, cost ceiling, and
framework version compatibility. Skipping it costs more time than running it.
TC=13 because it must happen before anything else — delay is multiplicative.

### Items 3–4 (Schema + Billing, tied 6.8)
Supabase schema with RLS and the billing plan gate matrix are tied because
they both gate everything downstream. You cannot write a safe agent system
without knowing the tenant boundary shape. You cannot ship to customers
without knowing the billing enforcement points. Both are load-bearing.

### Items 5–8 (Foundation docs + Types + Security + Smoke tests, 5.2–5.8)
These are the structural integrity items. They are not glamorous but every
item below them in the list depends on them being correct. TypeScript types
score higher than expected because they are the contract shared between
phases — wrong types cascade.

### Items 9–10 (Recovery + Observability, 4.2–4.5)
Rollback recovery scores higher than observability because a production
failure without a recovery procedure is worse than a production failure
without a dashboard. You can debug blind; you cannot undo a double-publish
without a compensating action registry.

### Items 12–13 (Agent Catalog + Graph Spec, tied 3.25)
These are large (Size=8) which correctly penalizes them relative to the
foundation work. They should not be started until Phase 1 is COMPLETE
because the schema and auth model shape what the agents can do.

### Items 20–23 (CrewAI, AutoGen, Make, Agent Studio, 0.77–2.0)
These are last because they are either optional, feature-flagged, or
exceed the v1.9.9 scope boundary. The Agent Studio UI has the lowest
WSJF despite high conceptual value because it is large (Size=13) and
should be scoped to a read-only trace viewer only in this release.

---

## How to Update This Table

After Phase 0, add newly discovered items here:

| # | Item | Phase | BV | TC | RR | Size | WSJF | Status |
|---|------|-------|----|----|----|------|------|--------|
| NEW | _[item from gaps audit]_ | _N_ | — | — | — | — | — | ☐ |

Re-sort the full table by WSJF after adding new items.
Mark completed items with ✅ and the phase they were completed in.

---

## Scope Boundary Enforcement

These items are **explicitly out of scope for v1.9.9**:

| Item | Reason | Target |
|------|---------|--------|
| Agent Studio full UI build | Too large; scoped to read-only trace viewer | v2.0 |
| Research / UI Critic agents | Second-wave; feature-flagged | v2.0 |
| Multi-region data residency | Requires Phase 0 compliance decision | v2.x |
| Real-time collaboration features | Not in golden path | v2.0 |
| Public plugin marketplace | Depends on stable API contracts first | v2.1 |

If scope creep appears during a phase, flag it with `⚠ SCOPE_CREEP` and
park it in this table rather than implementing it.

---

**CLAIMS:** WSJF scores are estimates — not measurements. Adjust after Phase 0 surfaces real constraints.
**COUNTEREXAMPLE:** If the business goal shifts to marketing-driven (visible new features over stability), items 20–22 move up and some hardening items move down.
**CONTRADICTIONS:** ! Agent Studio (item 23) is listed as a deliverable in Phase 3 but scoped as read-only trace viewer only — this must be explicitly locked in Phase 0 or scope will drift toward a full UI build.
