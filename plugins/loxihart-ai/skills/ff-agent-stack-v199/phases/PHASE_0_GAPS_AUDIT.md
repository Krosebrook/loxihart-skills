# Phase 0 — Gaps + Assumptions Audit

**Run this first. Always. Do not skip.**

Paste this entire file as your message. Do not add context before running it.
If you have LOCKED_DEFAULTS from a previous run, paste them above the ROLE block.

---

```
SCOPE_MODE: LITE
ADVERSARIAL_CRITIC: ON (one ! flag line per finding)
PHASE: 0 — Pre-flight audit only. Build nothing.
```

---

## ROLE

You are a senior staff engineer running a mandatory pre-flight audit before a
major multi-phase build. Your only job in this phase is to find every place
where a silent assumption, missing constraint, or ambiguous requirement would
cause Phase 1–3 to produce wrong, insecure, or expensive output.

Do not propose solutions yet. Do not draft code or schemas. Surface gaps only.

Mark every claim with one of: [VERIFIED] / [UNVERIFIED] / [ASSUMED]

---

## CONTEXT — FlashFusion Agent Stack v1.9.9

Stack: Next.js + Node.js/TypeScript + LangGraph (primary) + CrewAI (content
lanes) + AutoGen (premium reasoning, optional) + Supabase (Auth, Postgres, RLS,
Storage, pgvector) + Redis (hot state, queues, locks) + MCP tool adapters +
Multi-model routing (OpenAI / Anthropic / Gemini) + Worker pool + Make/n8n
(external ops only).

Seven mandatory agents: Router, Planner, Tool Executor, Memory, Validator,
Publisher, Recovery.

Release intent: Final hardening build before v2.0. Stability, tenant isolation,
idempotent side effects, checkpoint recovery, replayable observability, and plan
enforcement take priority over all new features.

---

## AUDIT TASKS

### 1. Unstated Constraints

For each item below, state:
- what it is
- why it matters if undefined
- recommended safe default (or flag as NEEDS_HUMAN_DECISION)

Required items to audit:
- Compliance scope: SOC2, HIPAA, PCI-DSS, GDPR, or none?
- Geographic data residency: any restrictions on where data is stored?
- Peak concurrency target: 100 users? 10K? 100K? (shapes RLS + Redis strategy)
- Acceptable per-run cost ceiling in USD (not tokens — dollars)
- Monthly org-level cost ceiling in USD
- Target latency for golden path: p50 and p99
- SLA uptime requirement (99.9%? 99.99%? none for v1.9.9?)
- Disaster recovery RTO / RPO
- Existing Supabase project state: greenfield or migration from existing schema?
- Existing Redis instance: new provisioning or existing?

### 2. Framework Verification Status

For each claim, check whether it is current best practice or may be
version-dependent, deprecated, or incorrect:

- LangGraph's checkpointer API: is it production-stable in the current
  LangGraph release? What version is assumed? [VERIFY]
- Supabase pgvector: does it support the memory pattern described (embedding
  storage + similarity search) out of the box, or does it require manual
  extension setup? [VERIFY]
- MCP (Model Context Protocol): is the server contract stable / GA, or still
  draft spec? [VERIFY]
- CrewAI Flows: are they GA or experimental in the current CrewAI release?
  What version is assumed? [VERIFY]
- AutoGen: is the composable agent runtime (v0.4+) the correct version
  target, or is the older v0.2 pattern still dominant in production? [VERIFY]
- Supabase Edge Functions: what is the current invocation time limit?
  Is this suitable for orchestration trigger jobs? [VERIFY]
- Redis: is there a Supabase-native Redis option, or does this require a
  separate provider (Upstash, Railway, self-hosted)? [VERIFY]

Mark each: [VERIFIED — source: X] / [UNVERIFIED — needs check] / [ASSUMED — state assumption]

### 3. Security Implementation Gaps

For each gap, state:
- the gap
- risk if unresolved
- proposed resolution or flag as NEEDS_DECISION

Required gaps to audit:
- RLS tenant scoping pattern: the spec says "all tables RLS-protected" but
  does not define the exact tenant scoping column name or policy template
- Redaction before logs: the spec says "redact sensitive fields" but does not
  define which fields, what redaction format (hash? mask? omit?), or where
  the redaction logic lives
- Idempotency key ownership: who generates idempotency keys — client or server?
  What is the key format and uniqueness guarantee?
- Tool allowlist storage: where is the source of truth for tool allowlists?
  How are they versioned? How are changes deployed without downtime?
- Service-role key enforcement: how is it technically enforced that the
  service-role key never reaches a client bundle? Build-time check? CI gate?
- Audit log immutability: how are audit records protected from deletion or
  modification? Append-only table? Separate service?

### 4. Cost Model Gaps

For each gap, state:
- the gap
- what breaks without it
- proposed default or NEEDS_DECISION

Required gaps to audit:
- Per-run hard cap in USD: what value? What happens when hit mid-execution?
  (silent fail? partial result? user notification? rollback?)
- Monthly org-level cap: what value? Same questions
- Cost estimation timing: preflight estimate before execution, or metered
  after? If preflight, how is it calculated for variable-length agent loops?
- Token budget injection: how does the per-run budget enter the LangGraph
  graph? As graph state? As a node input? As a global config?
- Model cost table: are per-token costs for OpenAI / Anthropic / Gemini
  hardcoded, pulled from API, or sourced from an internal config file?

### 5. Scope Boundary Risks

For each item, state:
- the ambiguous item
- narrow interpretation (v1.9.9 scope)
- broad interpretation (v2.0 scope)
- recommended lock

Required items to audit:
- "Agent Studio operator dashboard": read-only trace viewer vs full
  operator control surface?
- "Multi-model routing across Claude, GPT, Gemini": three live integrations
  or one live + two stubbed connectors?
- "Vector memory layer": pgvector inside Supabase or separate service
  (Pinecone, Weaviate)?
- "Worker pool for long-running tasks": dedicated service vs serverless
  functions vs Supabase Edge Functions?
- "MCP-compatible tool adapters": how many tools are in scope for v1.9.9?
  Three? Ten? A registry pattern?
- "CrewAI content lanes": how many crews in scope? Brand kit only?
  Listing + research too?

---

## OUTPUT FORMAT

Produce a single `GAPS_AUDIT.md` with these sections:

```markdown
# GAPS_AUDIT.md — FlashFusion v1.9.9 Pre-flight

## 1. Unstated Constraints
[For each: constraint / risk / recommended default or NEEDS_HUMAN_DECISION]

## 2. Framework Verification Status
[For each: claim / VERIFIED-UNVERIFIED-ASSUMED / source or "needs check"]

## 3. Security Implementation Gaps
[For each: gap / risk / proposed resolution or NEEDS_DECISION]

## 4. Cost Model Gaps
[For each: gap / what breaks / proposed default or NEEDS_DECISION]

## 5. Scope Boundary Risks
[For each: item / narrow / broad / recommended lock]

## 6. Recommended Defaults
[All safe defaults locked in — paste these into next phase as LOCKED_DEFAULTS]

## 7. Confidence Gate
State exactly one of:
  READY_TO_BUILD — all critical gaps resolved with defaults
  BLOCKED — list which gaps require human decision before Phase 1
```

---

## BATON BLOCK (required at end of output)

```
PHASE_0_STATUS: [READY_TO_BUILD / BLOCKED]
LOCKED_DEFAULTS: [every assumption now locked]
OPEN_QUESTIONS: [anything still needing human input]
BLOCKED_ON: [if BLOCKED — exact decision needed]
CONFIDENCE: [0-100%]
```

If CONFIDENCE < 80%, state explicitly what lowered it.

---

## SELF-VERIFICATION (check before outputting)

- [ ] Every constraint has a recommended default or NEEDS_HUMAN_DECISION flag
- [ ] Every framework claim is marked VERIFIED / UNVERIFIED / ASSUMED
- [ ] Every security gap has a proposed resolution
- [ ] Every scope item has a narrow + broad interpretation + recommended lock
- [ ] BATON block is present and complete
- [ ] No placeholder text remains
- [ ] No build artifacts or code produced — this phase is audit only

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

Append at the end of your output:

```
CLAIMS: [list factual assertions made in this audit]
COUNTEREXAMPLE: [where any claim could be wrong or context-dependent]
CONTRADICTIONS: [prefix with ! — any internal conflicts found in the spec]
```
