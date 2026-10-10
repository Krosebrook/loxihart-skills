# AGENT_ROLES.md — Agent Boundaries and Interaction Rules

## The Seven Mandatory Agents

### Router Agent
**Does:** Reads the incoming request, validates auth + tenant context,
checks plan entitlements, classifies the request type, selects the graph
route, enforces feature flags.

**Does NOT:** Execute tools. Plan work. Store memory. Call models for
reasoning. It routes — that is all.

**Calls:** Plan gate check (utility), then hands off to Planner.
**Called by:** Entry node of every graph route.

**Critical rule:** Router must complete in bounded time. No LLM calls
for classification — use rule-based routing or a cheap classifier model
with a hard token budget.

---

### Planner Agent
**Does:** Receives the classified request + user goal. Produces a
bounded execution plan: explicit steps, dependencies, tools needed,
success criteria, token budget allocation, estimated cost.

**Does NOT:** Execute any tools. Publish anything. Write to memory.

**Calls:** No external tools. May call a reasoning model.
**Called by:** Router Agent (after classification).

**Critical rule:** The plan must include a token budget and a max step
count. An unbounded plan is a cost liability.

---

### Tool Executor Agent
**Does:** Executes tool calls according to the plan. Enforces permission
scopes, idempotency keys, timeouts, and retry policies. Logs every
invocation to the audit table.

**Does NOT:** Decide which tools to call (that is the Planner's job).
Interpret tool results for reasoning. Write to memory.

**Calls:** Internal FlashFusion services, MCP tools, external APIs,
file generation tools, billing metering.
**Called by:** Execution nodes in the graph (driven by Planner output).

**Critical rule:** Every tool call requires an idempotency key before
execution. No exceptions. The Tool Executor generates idempotency keys
server-side from: runId + toolName + sequenceNumber.

---

### Memory Agent
**Does:** Decides what to remember, what to summarize, when to expire,
and what must never be retained. Writes to the appropriate memory layer
(Redis / Postgres / pgvector) with correct tenant scoping and TTL tags.

**Does NOT:** Make tool calls. Execute model reasoning for generation.
Write to layers outside its scope.

**Calls:** Memory storage services (Redis, Supabase).
**Called by:** Post-execution nodes in the graph, after Validator approves.

**Critical rule:** Memory writes happen AFTER validation. Unvalidated
output must not be stored as long-term memory. Every write includes:
tenantId, workspaceId, retentionClass, TTL, and a redaction check.

---

### Validator Agent
**Does:** Checks outputs against: schema (correct structure), policy
(allowed content per plan), completeness (required fields present),
formatting (meets spec), and brand constraints (if applicable).

**Does NOT:** Regenerate content. Call external APIs. Write to memory.
Approve billing.

**Calls:** Schema validation utilities (local), possibly a classifier
model for policy checks.
**Called by:** Post-generation nodes, before Memory Agent and before
billing finalization.

**Critical rule:** Validator has a max retry loop cap. If validation
fails N times, it returns a partial failure — it does not loop forever
trying to fix the output. N must be defined per route in the bounded
autonomy table.

---

### Publisher Agent
**Does:** Handles exports, posts to external platforms (Etsy, Shopify,
Printify, etc.), triggers post-publish actions (webhooks, CRM updates).
Uses idempotency keys for every publish action.

**Does NOT:** Generate content. Make billing decisions. Write to memory
directly (hands off to Memory Agent for artifact reference storage).

**Calls:** External platform APIs, webhook services, internal artifact
storage.
**Called by:** Publish nodes in the graph, only after Validator and
billing finalization complete.

**Critical rule:** Every external publish action is guarded by:
(1) idempotency key checked before execution,
(2) plan gate confirming publish is authorized,
(3) checkpoint written before execution starts.
A publish that starts but does not complete must trigger the Recovery
Agent, not a silent retry.

---

### Recovery Agent
**Does:** Classifies failures, determines retryability, loads checkpoints,
executes compensating actions for irreversible side effects, logs
recovery actions to audit trail, attempts resume or initiates clean rollback.

**Does NOT:** Generate content. Make new tool calls outside the recovery
scope. Decide billing outcomes.

**Calls:** Checkpoint storage (Redis / Postgres), compensating action
utilities, audit log service.
**Called by:** Error nodes in the graph. Also triggered by the dormant
agent detection system for stuck runs.

**Critical rule:** Recovery Agent must handle the case where it fails
mid-recovery. Recovery actions must themselves be idempotent. If a
compensating action cannot be executed, the operator must be alerted
immediately — not silently swallowed.

---

## Interaction Rules

**Permitted call directions:**
```
Router → Planner
Planner → [no agents, only utilities]
Tool Executor → [external tools only, not other agents]
Validator → [utilities only]
Memory → [storage services only]
Publisher → [external platforms only]
Recovery → [checkpoint + audit services only]
```

**Prohibited patterns:**
- No agent may call another agent directly mid-graph (use graph edges)
- Validator must not call Publisher (separate nodes, separate edges)
- Memory Agent must not call Tool Executor
- Publisher must not call Memory Agent (Publisher triggers Memory via graph)
- No agent may bypass the plan gate check

**Why these rules matter:**
Direct agent-to-agent calls outside the graph create hidden execution
paths that bypass telemetry, budget enforcement, and recovery logic.
Every agent transition must go through a graph edge so it is logged,
checkpointed if required, and bounded by the autonomy rules.
