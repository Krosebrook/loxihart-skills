# GAPS_AUDIT.md — Phase 0 Output Template

**Instructions:** This is the output template for Phase 0.
When Phase 0 runs, its output should follow this structure exactly.
Copy this file to `docs/v199/GAPS_AUDIT.md` and fill it in.

---

# GAPS_AUDIT.md — FlashFusion v1.9.9 Pre-flight
**Generated:** [date]
**Phase:** 0
**Status:** [READY_TO_BUILD / BLOCKED]

---

## 1. Unstated Constraints

| Constraint | Risk if undefined | Recommended default | Status |
|-----------|------------------|--------------------|----|
| Compliance scope | Wrong data handling | none for v1.9.9 | [LOCKED / NEEDS_DECISION] |
| Geographic data residency | Data sovereignty violation | US-only for v1.9.9 | [LOCKED / NEEDS_DECISION] |
| Peak concurrency target | Under/over-provisioned infra | 500 concurrent users | [LOCKED / NEEDS_DECISION] |
| Per-run cost ceiling USD | Silent cost overruns | $0.50 per run | [LOCKED / NEEDS_DECISION] |
| Monthly org cost ceiling USD | Billing surprises | $500/month | [LOCKED / NEEDS_DECISION] |
| Golden path p50 latency | Wrong SLA commitments | 3000ms | [LOCKED / NEEDS_DECISION] |
| Golden path p99 latency | Wrong SLA commitments | 10000ms | [LOCKED / NEEDS_DECISION] |
| SLA uptime requirement | Wrong infra choices | none for v1.9.9 | [LOCKED / NEEDS_DECISION] |
| Disaster recovery RTO/RPO | Missing recovery infra | RTO 4hr / RPO 1hr | [LOCKED / NEEDS_DECISION] |
| Supabase project state | Wrong migration approach | greenfield | [LOCKED / NEEDS_DECISION] |
| Redis provider | Missing infra dependency | Upstash (serverless) | [LOCKED / NEEDS_DECISION] |

---

## 2. Framework Verification Status

| Claim | Status | Source or action needed |
|-------|--------|------------------------|
| LangGraph checkpointer is production-stable | [VERIFIED / UNVERIFIED] | |
| LangGraph supports Postgres backend | [VERIFIED / UNVERIFIED] | |
| Supabase pgvector supports similarity search without extra setup | [VERIFIED / UNVERIFIED] | |
| MCP server contract is stable / GA | [VERIFIED / UNVERIFIED] | |
| CrewAI Flows are GA | [VERIFIED / UNVERIFIED] | |
| AutoGen v0.4+ composable runtime is current | [VERIFIED / UNVERIFIED] | |
| Supabase Edge Function time limit | [VERIFIED / UNVERIFIED] | |
| Redis via Upstash: connection string format | [VERIFIED / UNVERIFIED] | |

---

## 3. Security Implementation Gaps

| Gap | Risk | Proposed resolution | Status |
|-----|------|--------------------|----|
| RLS tenant scoping column not defined | Schema inconsistency | Use `tenant_id UUID NOT NULL` on all tenant tables | [LOCKED / NEEDS_DECISION] |
| Redaction field list not defined | Sensitive data in logs | Phase 1 produces field list in SECURITY_MODEL.md | [DEFERRED_TO_PHASE_1] |
| Idempotency key ownership not defined | Duplicate side effects | Server-side: `runId + toolName + sequenceNumber` hashed | [LOCKED / NEEDS_DECISION] |
| Tool allowlist storage not defined | Unauthorized tool access | Stored in DB feature_flags table, versioned | [LOCKED / NEEDS_DECISION] |
| Service-role key enforcement method | Key exposed in bundle | Env var + CI grep check | [LOCKED / NEEDS_DECISION] |
| Audit log immutability method | Records tampered | RLS: INSERT only, no UPDATE/DELETE for service_role | [LOCKED / NEEDS_DECISION] |

---

## 4. Cost Model Gaps

| Gap | What breaks without it | Proposed default | Status |
|-----|----------------------|------------------|----|
| Per-run hard cap USD | Silent overruns | $0.50 — halt at cap, return partial with error | [LOCKED / NEEDS_DECISION] |
| Monthly org cap USD | Billing blowout | $500 — alert at 80%, block at 100% | [LOCKED / NEEDS_DECISION] |
| Cost estimation timing | Surprise bills | Preflight estimate before premium routes | [LOCKED / NEEDS_DECISION] |
| Token budget injection method | No budget in graph | Via GraphState.tokenBudget field | [LOCKED / NEEDS_DECISION] |
| Model cost rate source | Wrong cost calculations | Internal config file, updated on model price changes | [LOCKED / NEEDS_DECISION] |

---

## 5. Scope Boundary Risks

| Item | Narrow (v1.9.9) | Broad (v2.0) | Recommended lock |
|------|----------------|-------------|-----------------|
| Agent Studio | Read-only trace viewer | Full operator control surface | LOCK: read-only viewer |
| Multi-model routing | 1 live + 2 stubbed connectors | 3 fully live connectors | LOCK: 1 live (Claude), 2 stubbed |
| Vector memory | pgvector inside Supabase | Separate Pinecone/Weaviate | LOCK: pgvector |
| Worker pool | Dedicated Node.js worker service | Serverless / Edge Functions | LOCK: dedicated worker |
| MCP tools in scope | 3 tools: internal, ecommerce, file_gen | Full registry | LOCK: 3 tools for v1.9.9 |
| CrewAI crews | listing_crew only | listing + research + brand | LOCK: listing_crew only |

---

## 6. Recommended Defaults (LOCKED)

Paste this block into the Phase 1 prompt as LOCKED_DEFAULTS:

```
LOCKED_DEFAULTS:
  compliance_scope: none for v1.9.9
  data_residency: US-only
  concurrency_target: 500 concurrent users
  per_run_cost_ceiling_usd: 0.50
  monthly_cost_ceiling_usd: 500
  golden_path_p50_ms: 3000
  golden_path_p99_ms: 10000
  sla_uptime: none for v1.9.9
  rto_rpo: RTO 4hr / RPO 1hr
  supabase_state: greenfield
  redis_provider: Upstash
  vector_store: pgvector inside Supabase
  worker_pool: dedicated Node.js worker service
  agent_studio_scope: read-only trace viewer only
  mcp_tools_in_scope: 3 (internal, ecommerce, file_gen)
  crewai_crews_in_scope: listing_crew only
  model_routing_live: Claude (Anthropic) — GPT and Gemini stubbed
  idempotency_key_format: SHA-256(runId + toolName + sequenceNumber)
  audit_log_immutability: INSERT-only via RLS (no UPDATE/DELETE)
  redaction_field_list: deferred to Phase 1 SECURITY_MODEL.md
```

---

## 7. Confidence Gate

[READY_TO_BUILD / BLOCKED]

If BLOCKED: [list exactly which items require human decision]

---

## BATON

```
PHASE_0_STATUS: [READY_TO_BUILD / BLOCKED]
LOCKED_DEFAULTS: [paste section 6 block above]
OPEN_QUESTIONS: [list any items needing human decision]
BLOCKED_ON: [if BLOCKED — exact decision needed]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80%]
```

---

CLAIMS: [fill after Phase 0 runs]
COUNTEREXAMPLE: [fill after Phase 0 runs]
CONTRADICTIONS: [fill after Phase 0 runs]
