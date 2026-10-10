# Phase 3 — Operations

**Prerequisite: Phase 2 must return PHASE_2_STATUS: COMPLETE**

Paste the full BATON blocks from Phases 1 AND 2 here before running:

```
[PASTE PHASE 1 BATON BLOCK HERE]
[PASTE PHASE 2 BATON BLOCK HERE]
```

If Phase 2 is INCOMPLETE, do not run this phase.

---

```
SCOPE_MODE: FULL
ADVERSARIAL_CRITIC: REQUIRED
SELF_CHECK: ON
PHASE: 3 — Operations only. No new agents or orchestration logic.
```

---

## ROLE

You are a staff-level platform operations engineer with expertise in
distributed system observability, billing safety, and incident recovery.
You build systems that survive reality. You mark `[UNVERIFIED]` and
`[SHALLOW]` rather than hallucinate depth. Nothing in this phase is
nice-to-have. All of it is load-bearing.

---

## MISSION

Build the operations layer of FlashFusion v1.9.9. This phase defines how
the system is monitored, how money is protected, and how it recovers when
things break. Reference Phase 1 schema tables, Phase 2 agent names, and
Phase 2 checkpoint node IDs explicitly.

---

## LOCKED CONTEXT

Use all LOCKED_* values from Phases 0, 1, and 2 BAATONs.

**Scope lock — Agent Studio:**
Agent Studio is scoped to a **read-only trace viewer** in v1.9.9.
It is NOT a full operator control surface. It shows run traces,
node execution timelines, cost per node, and run status.
It does NOT include: manual agent controls, live graph editing,
prompt injection, or user account management.
Do not expand this scope. If you identify items that would belong
in a full operator surface, defer them to v2.0 and flag them.

---

## DELIVERABLES

---

### D8 — BILLING_GUARDRAILS.md

**Plan gate matrix**

Table format — every row is a feature, every column is a plan tier.
Minimum tiers: Free, Pro, Team, Enterprise.
Minimum features to include: chat, generation, external publish, premium
model routing, background export, research agent (feature-flagged),
concurrent runs, memory storage.

| Feature | Free | Pro | Team | Enterprise |
|---------|------|-----|------|------------|
| ... | ... | ... | ... | ... |

Cells must be one of: ✅ included / ❌ blocked / [N] capped at N / [custom]

**Enforcement point table**

Table format — where in the graph is each gate checked?
Reference Phase 2 node IDs.

| Gate | Node ID | Trigger condition | Block behavior | Soft warning threshold |
|------|---------|-----------------|---------------|----------------------|

**Hard caps table**

One row per plan tier, per cap type.

| Plan | Per-run USD | Per-day USD | Per-month USD | Max concurrent runs | Max tokens per run |
|------|-------------|-------------|---------------|---------------------|-------------------|

All values numeric. No "reasonable limits."

**Soft threshold table**

At what percentage of a hard cap does a warning fire?
What is the warning mechanism? (in-app notification, email, webhook?)

| Cap type | Warning at % | Warning mechanism | Who receives it |
|---------|-------------|------------------|----------------|

**Preflight cost estimate**

How does it work:
- Which routes trigger a preflight estimate?
- What inputs are used to estimate? (prompt length, model, expected output
  tokens, tool count?)
- What happens if estimated cost exceeds plan cap? (block before start /
  warn and allow / block if >N% over cap?)
- How accurate must the estimate be? (±20%? ±50%?)

**Metering schema**

```typescript
interface UsageLedgerEntry {
  // fully typed — reference Phase 1 usage_ledgers table
  // must include: runId, tenantId, userId, planTier, route,
  // modelUsed, inputTokens, outputTokens, costUsd, toolCallCount,
  // blocked, blockedReason?, warningFired, createdAt
}
```

**Token budget injection**

How does the per-run budget enter the LangGraph graph?
- As a field in GraphState? (reference Phase 2 GraphState interface)
- At which node is budget enforcement checked?
- What happens at mid-run budget exhaustion: halt + return partial, or
  complete current node then halt?

**Tamper-resistance**

How are usage_ledger records protected from modification?
- Append-only INSERT only (no UPDATE/DELETE)?
- Separate audit hash chain?
- Who can query the full ledger? (service-role only?)

**3 example usage_ledger records**

Use safe placeholder values. Show all fields from the metering schema.

---

### D9 — OBSERVABILITY_RUNBOOK.md

**Trace schema**

```typescript
interface NodeExecutionTrace {
  // every field logged per node execution
  // must include: runId, tenantId, userId, nodeId, nodeName,
  // agentType, status, startedAt, completedAt, durationMs,
  // inputHash, outputHash, costUsd, tokensBudget, tokensUsed,
  // retryCount, checkpointSaved, toolsCalled, modelUsed,
  // promptVersionHash, graphVersion, error?
}
```

**Cost per node**

How is per-node cost calculated and stored?
- Token cost formula: (inputTokens * inputRate) + (outputTokens * outputRate)
- Where are per-model token rates stored? (config file? env var? DB table?)
- How is tool execution cost tracked separately from model cost?
- Where is cost aggregated per run? (accumulated in GraphState? summed at end?)

**Run replay — exact operator steps**

Step-by-step procedure an operator follows to replay any historical run:
1. [specific step]
2. [specific step]
...

What data is needed? Where is it retrieved? What is reproduced?
What cannot be reproduced (side effects that already occurred)?

**Dormant agent detection**

How does the system detect a stuck or looping agent run?
- What metric signals a dormant run? (no node completion in N ms?)
- Who monitors this? (cron job? Redis TTL expiry? external health check?)
- What is the auto-response? (alert only / auto-cancel after N minutes?)
- Where is the dormant detection threshold configured?

**Incident response triggers**

Table format:
| Event | Threshold | Alert mechanism | Who receives | Auto-response |
|-------|-----------|----------------|-------------|---------------|

Minimum events: run failure rate >N%, cost spike >N×baseline, tenant
isolation violation (any occurrence), billing cap hit, Redis unavailable,
Supabase connection pool exhausted.

**Agent Studio trace viewer — scope and requirements**

This is scoped to a read-only trace viewer only. List the exact data
the viewer must display:
- Per-run: [fields]
- Per-node: [fields]
- Per-tool-call: [fields]

List the exact controls it must have:
- Filter by: [fields]
- Sort by: [fields]
- Export: [formats, if any]

List what it must NOT include (defer to v2.0):
- [item]

**Redaction checklist**

Field-level list. For every field that must be stripped before any log,
trace, or memory is persisted:

| Field | Table / log target | Redaction method | Verified by |
|-------|------------------|-----------------|-------------|

Minimum fields: raw model API responses containing tool call secrets,
user-provided PII in prompts, authentication tokens, internal system
paths, DB connection strings.

**Prompt version audit**

How can an operator confirm which prompt version ran for any given
historical trace?
- Where is the prompt version hash stored? (reference Phase 2 GraphState)
- How is the hash computed? (SHA-256 of prompt text? content hash?)
- How are prompt version hashes linked to traces?
- What is the rollback procedure if a bad prompt version is detected?

---

### D10 — ROLLBACK_RECOVERY.md

**Checkpoint strategy**

For each Phase 2 checkpoint node (reference LOCKED_CHECKPOINT_NODES):
- What state is snapshotted?
- Where is it stored? (Redis? Postgres? which table?)
- How long is the checkpoint retained?
- What is the resume trigger? (manual operator / automatic on retry?)

**Failure classification tree**

Draw a decision tree (ASCII) that classifies failures by type and routes
to the correct response.

Root: failure detected
Branches must include:
- model timeout / rate limit
- tool error (retryable)
- tool error (non-retryable — side effect already occurred)
- schema validation error
- permission / auth error
- budget exhaustion
- partial side effect (publish started but not completed)
- database error
- Redis unavailable

For each leaf node: detection method, auto-response, operator action needed.

**Compensating action registry**

Table format — one row per irreversible action:

| Action | Agent | Compensating action | Who executes it | Trigger condition | Idempotent? |
|--------|-------|-------------------|----------------|------------------|-------------|

Reference Phase 2 LOCKED_AGENTS. Every agent that produces an external
side effect must have a row here.

**Resume protocol**

Step-by-step procedure for resuming a checkpointed run after failure:
1. [specific step]
2. [specific step]
...

What inputs are required? What validations occur before resume?
What happens to in-progress tool calls from the failed run?
How are duplicate side effects prevented on resume?

**Data loss prevention contract**

Three-column table:
| Data type | Can be lost? | Protection mechanism |
|-----------|-------------|---------------------|

Minimum data types: agent run record, artifact metadata, artifact storage,
billing/metering record, audit log, memory writes, tool invocation log,
checkpoint state.

**Rollback smoke tests**

Three scenarios with exact expected behavior:

1. Mid-publish failure
   - Setup: [exact precondition]
   - Failure: [what fails and when]
   - Expected: [exact behavior — what rolls back, what is preserved]
   - Pass condition: [binary — how to verify]

2. Mid-billing failure
   - Setup: [exact precondition]
   - Failure: [what fails and when]
   - Expected: [exact behavior]
   - Pass condition: [binary]

3. Mid-export failure
   - Setup: [exact precondition]
   - Failure: [what fails and when]
   - Expected: [exact behavior]
   - Pass condition: [binary]

---

## ADVERSARIAL CRITIC GATE

Mark all findings `⚠`:

For BILLING_GUARDRAILS.md:
- ⚠ Where does a bug cause double-billing on retry?
- ⚠ Which plan gate is most likely to be bypassed by a race condition?
- ⚠ What happens to metering if the usage_ledger write fails mid-run?

For OBSERVABILITY_RUNBOOK.md:
- ⚠ Which redaction rule is most likely to miss a sensitive field under load?
- ⚠ What breaks in run replay if a side effect was already executed?
- ⚠ Where does the trace schema diverge from Phase 1 schema tables?

For ROLLBACK_RECOVERY.md:
- ⚠ Which failure type has no compensating action?
- ⚠ What does a complete Redis outage do to in-flight checkpoints?
- ⚠ Which compensating action could itself fail, causing a worse state?

---

## SELF-VERIFICATION (check before outputting)

- [ ] Plan gate matrix has a cell for every feature × plan tier
- [ ] All hard caps are numeric — no "reasonable" or "configurable"
- [ ] Enforcement point table references Phase 2 node IDs
- [ ] Trace schema references Phase 1 schema tables
- [ ] Redaction checklist is field-level
- [ ] Failure classification tree covers all 9 required branches
- [ ] Compensating action registry references Phase 2 agent names
- [ ] All 3 rollback smoke tests have binary pass conditions
- [ ] Agent Studio scope is locked to read-only trace viewer
- [ ] Adversarial ⚠ findings present for each deliverable
- [ ] [UNVERIFIED] and [SHALLOW] markers applied honestly
- [ ] No placeholder text

---

## BATON TO PHASE 4 (required)

```
PHASE_3_STATUS: [COMPLETE / INCOMPLETE]
LOCKED_BILLING_SCHEMA: [UsageLedgerEntry interface summary]
LOCKED_TRACE_SCHEMA: [NodeExecutionTrace interface summary]
LOCKED_COMPENSATING_ACTIONS: [agent → compensating action pairs]
OPEN_ITEMS: [anything Phase 4 needs to close]
INCOMPLETE_ITEMS: [if INCOMPLETE — which deliverable and why]
KNOWN_RISKS: [risks discovered in this phase not yet mitigated]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80% — what lowered it]
```

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

Append one block per deliverable (D8, D9, D10).
