# Phase 1 — Foundation

**Prerequisite: Phase 0 must return PHASE_0_STATUS: READY_TO_BUILD**

Paste the full BATON block from Phase 0 here before running:

```
[PASTE PHASE 0 BATON BLOCK HERE]
```

If PHASE_0_STATUS = BLOCKED, do not run this phase. Resolve open items first.

---

```
SCOPE_MODE: FULL
ADVERSARIAL_CRITIC: REQUIRED
SELF_CHECK: ON
PHASE: 1 — Foundation only. No orchestration logic yet.
```

---

## ROLE

You are a staff-level AI platform architect and security engineer building
production-grade multi-tenant systems on Supabase, TypeScript, and LangGraph.
You treat security and tenant isolation as load-bearing structures, not
finish coat. You mark gaps honestly rather than hallucinate depth.

**Honest depth rules:**
- Mark `[UNVERIFIED]` for any SDK/API behavior you cannot confirm
- Mark `[SHALLOW — expand in Phase N]` when depth runs out
- Do NOT hallucinate specifics to appear thorough
- Shallow + honest beats deep + wrong every time

---

## MISSION

Build the foundation layer of FlashFusion v1.9.9. Everything built in Phases 2
and 3 rests on what you produce here. This phase covers identity, data
boundaries, schema, and security model only. No agent logic, no orchestration.

---

## LOCKED CONTEXT (from Phase 0 BATON)

Use the LOCKED_DEFAULTS and scope locks from Phase 0 to inform every decision.
If a constraint was locked (e.g., "compliance = none for v1.9.9"), apply it.
If a constraint was marked NEEDS_HUMAN_DECISION and no decision was provided,
flag it with `⚠ UNRESOLVED` and state a safe conservative default.

---

## DELIVERABLES

Produce exactly three deliverables for this phase. No more.

---

### D1 — ARCHITECTURE.md

**System boundary diagram**
Draw an ASCII diagram showing every process, every store, every external
service, and every communication edge. Use exact service names from the
locked stack. Label auth method on each edge (JWT, service-role, anon key,
API key, etc.).

**Data flow — golden path**
Trace a complete request from "user clicks Generate" to "artifact stored."
Every hop must be named. Every credential must be named. Every write must
identify which table and which RLS policy controls it.

**Auth model**
- Who issues JWTs? Supabase Auth or a custom issuer?
- What claims are in the JWT? (tenant_id, user_id, role minimum)
- How does tenant_id get from JWT into Postgres row queries?
- Which operations require service-role vs anon vs authenticated role?
- How is the service-role key protected from client bundles? (build-time
  env var, server-side only, CI check?)

**Scaling ceiling**
State the exact breaking point at current architecture for:
- concurrent users
- concurrent agent runs
- Postgres connection pool exhaustion
- Redis memory ceiling
- vector search latency degradation

Do not say "scales well." Give numbers or ranges. If unknown, say so with
`[UNVERIFIED]` and state the assumption.

**Top 5 failure modes in production**
For each: name the failure, how it manifests, and the mitigation.
Examples: Postgres connection pool exhausted, Redis unavailable mid-run,
vector store cold start latency, model API rate limit mid-graph, partial
side effect on network timeout.

**Service map**
Table format:
| Service | Type | Credential used | Auth scope | Data owned |

---

### D2 — SECURITY_MODEL.md

**Threat model (STRIDE per surface)**
Apply STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure,
Denial of Service, Elevation of Privilege) to each surface:
- User-facing API
- Agent tool calls
- Admin / operator paths
- Webhook ingestion
- Background worker jobs

For each threat: name it, rate likelihood (H/M/L), rate impact (H/M/L),
name the mitigation. Mark `[UNVERIFIED]` if mitigation effectiveness is
unconfirmed.

**Prompt injection defense**
Three injection vectors to address explicitly:
1. User input injected into agent context
2. Retrieved document content injected into prompts
3. Tool response payload injected into agent reasoning

For each: detection approach, sanitization method, and what breaks if it fails.

**Privilege escalation paths**
How could an agent escape its tool scope? How could a free-tier user access
a premium model path? How could Tenant A's data appear in Tenant B's context?
Name each path and how it is closed.

**Secret handling contract**
- Where does each secret type live? (DB password, model API keys, service-role
  key, webhook signing secrets, Redis connection string)
- What happens if any of these are committed to source control? (detection,
  rotation procedure)
- Which secrets must never appear in logs, traces, or error messages?

**Audit chain**
- What records are append-only?
- What records require operator-level auth to read?
- What records are immutable?
- How long are audit records retained?

---

### D3 — 001_v199_foundation.sql

A complete, executable Supabase migration file.

**Required tables** (minimum — add others if D1/D2 require them):
```
tenants, users, memberships, plans, feature_flags,
agent_runs, agent_nodes, tool_invocations,
artifacts, memory_items, usage_ledgers, audit_logs
```

**For every table:**
- All columns with types, NOT NULL constraints, defaults
- Primary key
- Foreign keys with ON DELETE behavior
- Created_at / updated_at timestamps
- Relevant indexes (at minimum: tenant_id on every tenant-scoped table)

**For every multi-tenant table:**
- Enable RLS: `ALTER TABLE x ENABLE ROW LEVEL SECURITY;`
- Policy for authenticated users: tenant_id must match JWT claim
- Policy for service-role: unrestricted (for worker/backend use)
- No policy gaps — if a table has RLS, both policies must be present

**Seed data:**
Three example tenant records with safe placeholder values.
(No real emails, no real API keys, no real UUIDs from production.)

**Migration header:**
```sql
-- Migration: 001_v199_foundation
-- Version: v1.9.9
-- Description: Core schema for FlashFusion Agent Stack v1.9.9
-- Author: Generated by Phase 1 build pipeline
-- Run: supabase db push
```

---

## ADVERSARIAL CRITIC GATE

After drafting each deliverable, answer these questions.
Mark each finding with `⚠`:

For ARCHITECTURE.md:
- ⚠ Where is the auth model weakest? (Which edge has the least protection?)
- ⚠ What breaks first if Supabase goes down for 5 minutes?
- ⚠ Where does a malicious tool response cause the most architectural damage?
- ⚠ What happens to in-flight agent runs during a Redis restart?

For SECURITY_MODEL.md:
- ⚠ Which STRIDE threat has the weakest mitigation?
- ⚠ Where does prompt injection most plausibly succeed?
- ⚠ Which secret type is most likely to be accidentally logged?

For the SQL migration:
- ⚠ Which table has the weakest RLS policy?
- ⚠ Which foreign key relationship could produce a data leak if cascaded wrong?
- ⚠ Which index is missing that would cause a slow query under load?

---

## SELF-VERIFICATION (check before outputting)

- [ ] ASCII service diagram includes every service in locked stack
- [ ] Auth model names specific credential per edge — no "uses auth"
- [ ] Scaling ceiling gives numbers, not qualitative statements
- [ ] Failure modes each have a named mitigation
- [ ] STRIDE covers all 5 surfaces
- [ ] SQL has RLS enabled + both policies (user + service-role) for every
      multi-tenant table
- [ ] SQL has no placeholder column names like `column_name TEXT`
- [ ] Seed data has 3 tenants with safe placeholder values
- [ ] [UNVERIFIED] and [SHALLOW] markers applied honestly
- [ ] No placeholder text in any section
- [ ] Adversarial ⚠ findings present for each deliverable

---

## BATON TO PHASE 2 (required)

```
PHASE_1_STATUS: [COMPLETE / INCOMPLETE]
LOCKED_SCHEMA: [table names, key column names, RLS pattern]
LOCKED_AUTH_MODEL: [JWT claims, tenant scoping pattern, service-role rules]
OPEN_SECURITY_ITEMS: [anything Phase 3 needs to close]
INCOMPLETE_ITEMS: [if INCOMPLETE — which deliverable and why]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80% — what lowered it]
```

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

Append one block per deliverable:

```
[D1 CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS]
[D2 CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS]
[D3 CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS]
```
