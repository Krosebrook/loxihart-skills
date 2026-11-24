# BATON_TEMPLATE.md — Baton Pass Format Reference

## What Is a Baton Block?

A baton block is the handoff record at the end of each phase. It serves as:
1. A completion signal — did this phase fully succeed?
2. A locked-context carrier — what does the next phase depend on?
3. A confidence gate — should the next phase run at all?
4. An open item tracker — what is unresolved and carried forward?

Every phase prompt requires a baton block at the end of its output.
The next phase prompt requires the prior phase's baton block at the top.

---

## Phase 0 Baton Format

```
PHASE_0_STATUS: [READY_TO_BUILD / BLOCKED]
LOCKED_DEFAULTS: 
  - compliance_scope: [e.g., "none for v1.9.9"]
  - concurrency_target: [e.g., "500 concurrent users"]
  - per_run_cost_ceiling_usd: [e.g., "0.50"]
  - monthly_cost_ceiling_usd: [e.g., "500"]
  - golden_path_p50_ms: [e.g., "3000"]
  - golden_path_p99_ms: [e.g., "10000"]
  - supabase_state: [e.g., "greenfield"]
  - vector_store: [e.g., "pgvector inside Supabase"]
  - worker_pool: [e.g., "dedicated Node.js worker service"]
  - agent_studio_scope: [e.g., "read-only trace viewer only"]
  - mcp_tools_in_scope: [e.g., "3 tools: internal, ecommerce, file_gen"]
  - crewai_crews_in_scope: [e.g., "listing_crew only for v1.9.9"]
  [add others from audit]
OPEN_QUESTIONS:
  - [item requiring human decision, if any]
BLOCKED_ON:
  - [if BLOCKED — exact decision needed]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80%]
```

---

## Phase 1 Baton Format

```
PHASE_1_STATUS: [COMPLETE / INCOMPLETE]
LOCKED_SCHEMA:
  tables: [tenants, users, memberships, plans, agent_runs, ...]
  tenant_column: [e.g., "tenant_id UUID NOT NULL"]
  rls_pattern: [e.g., "auth.jwt()->>'tenant_id' = tenant_id::text"]
  service_role_policy: [e.g., "FOR ALL TO service_role USING (true)"]
LOCKED_AUTH_MODEL:
  jwt_issuer: [e.g., "Supabase Auth"]
  jwt_claims: [e.g., "sub (user_id), tenant_id, role, plan_tier"]
  tenant_scoping: [e.g., "tenant_id in JWT claim, injected into RLS via auth.jwt()"]
  service_role_usage: [e.g., "server-side only, never client bundle"]
  anon_role_allowed: [e.g., "no — all routes require authenticated JWT"]
OPEN_SECURITY_ITEMS:
  - [any items Phase 3 needs to close]
INCOMPLETE_ITEMS:
  - [if INCOMPLETE — which deliverable and why]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80%]
```

---

## Phase 2 Baton Format

```
PHASE_2_STATUS: [COMPLETE / INCOMPLETE]
LOCKED_AGENTS:
  - router: input=[RouterInput], output=[RouterOutput], compensating_action=none
  - planner: input=[PlannerInput], output=[PlannerOutput], compensating_action=none
  - tool_executor: input=[ToolInput], output=[ToolOutput], compensating_action=[description]
  - memory: input=[MemoryInput], output=[MemoryOutput], compensating_action=[description]
  - validator: input=[ValidatorInput], output=[ValidatorOutput], compensating_action=none
  - publisher: input=[PublishInput], output=[PublishOutput], compensating_action=[description]
  - recovery: input=[RecoveryInput], output=[RecoveryOutput], compensating_action=self
LOCKED_TOOL_SHAPES:
  - internal_tool_input: [TypeScript interface summary]
  - mcp_tool_input: [TypeScript interface summary]
  - tool_audit_record: [TypeScript interface summary]
LOCKED_GRAPH_STATE:
  - interface: GraphState
  - key_fields: [runId, tenantId, userId, route, tokenBudget, tokensUsed, status, checkpoints, ...]
LOCKED_CHECKPOINT_NODES:
  - [node_id]: [description of what is checkpointed]
  - [node_id]: [description]
OPEN_ORCHESTRATION_ITEMS:
  - [any items Phase 3 needs to close]
INCOMPLETE_ITEMS:
  - [if INCOMPLETE — which deliverable and why]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80%]
```

---

## Phase 3 Baton Format

```
PHASE_3_STATUS: [COMPLETE / INCOMPLETE]
LOCKED_BILLING_SCHEMA:
  table: usage_ledgers
  key_fields: [runId, tenantId, userId, planTier, route, modelUsed, inputTokens, outputTokens, costUsd, blocked, ...]
LOCKED_TRACE_SCHEMA:
  key_fields: [runId, tenantId, nodeId, status, durationMs, costUsd, tokensBudget, tokensUsed, retryCount, promptVersionHash, ...]
LOCKED_COMPENSATING_ACTIONS:
  - tool_executor: [description of compensating action]
  - publisher: [description of compensating action]
  - memory: [description of compensating action]
  [others as applicable]
OPEN_ITEMS:
  - [any unresolved items carried to Phase 4]
KNOWN_RISKS:
  - [risk: description / mitigation status / owner]
INCOMPLETE_ITEMS:
  - [if INCOMPLETE — which deliverable and why]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80%]
```

---

## Phase 4 Final Status Block

```
PIPELINE_STATUS: [SHIPPABLE / NOT_SHIPPABLE]
BLOCKERS:
  - [if NOT_SHIPPABLE — exact items that must change before shipping]
DEFERRED_TO_2.0:
  - [confirmed deferred features]
OPEN_[UNVERIFIED]_ITEMS:
  - [any [UNVERIFIED] from prior phases not yet resolved]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80%]
```

---

## Rules for Baton Blocks

1. **Never skip.** If a phase prompt does not produce a baton block,
   re-prompt: "The BATON block was not included. Please produce it now
   following the format in BATON_TEMPLATE.md."

2. **Paste verbatim into next phase.** Copy the entire baton block —
   do not paraphrase or summarize. The next phase uses it for locked context.

3. **Confidence gate.** If CONFIDENCE < 80%, do not start the next phase.
   Read CONFIDENCE_NOTES and resolve the stated gaps first.

4. **Status gate.** If STATUS = INCOMPLETE, identify which deliverable
   failed and re-run that deliverable only. Do not re-run the whole phase.

5. **Open items accumulate.** Open items from Phase 0 carry to Phase 1,
   from Phase 1 to Phase 2, etc. Phase 4 closes all of them or explicitly
   defers them. Nothing falls through silently.
