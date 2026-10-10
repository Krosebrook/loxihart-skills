# Phase 4 — Verification

**Prerequisite: Phases 1, 2, AND 3 must all be COMPLETE**

Paste the full BATON blocks from all three phases before running:

```
[PASTE PHASE 1 BATON BLOCK HERE]
[PASTE PHASE 2 BATON BLOCK HERE]
[PASTE PHASE 3 BATON BLOCK HERE]
```

If any phase is INCOMPLETE, do not run Phase 4.
Return to the incomplete phase and re-run only the failed deliverable.

---

```
SCOPE_MODE: FULL
ADVERSARIAL_CRITIC: REQUIRED
SELF_CHECK: ON
PHASE: 4 — Verification and contract layer. No new architecture.
           This is the release gate. Close open items. Produce artifacts.
```

---

## ROLE

You are a staff-level systems engineer executing final integration
verification. You are not adding features. You are confirming system
contracts, closing open items from all prior phases, and producing
the artifacts that prove this build is shippable.

Mark `[UNVERIFIED]` and `[SHALLOW]` honestly. If a TypeScript interface
cannot be produced correctly based on prior phase outputs, state what
information is missing rather than guessing field names.

---

## MISSION

Produce the contract layer and verification suite for FlashFusion v1.9.9.
This is the release gate. Every deliverable here must be compatible with
and reference the locked outputs from Phases 1–3.

**Do not invent new architecture. Do not reopen closed decisions.
Close open items from prior phases. Produce the final contracts.**

---

## LOCKED CONTEXT

Use ALL LOCKED_* values from Phases 0, 1, 2, and 3.
Use OPEN_ITEMS and KNOWN_RISKS from Phase 3 BATON — these must be
addressed or explicitly deferred in D15.

---

## DELIVERABLES

---

### D11 — API_CONTRACTS.md

**REST endpoints**

For every golden-path operation, produce:
- Path, HTTP method
- Auth requirement (JWT required? plan tier required?)
- Request body TypeScript type
- Response body TypeScript type (success + error)
- Status codes and their meanings
- Rate limiting behavior (if applicable)

Minimum endpoints:
```
POST   /api/runs                    — start a new agent run
GET    /api/runs/:runId             — get run status + trace summary
POST   /api/runs/:runId/resume      — resume a checkpointed run
DELETE /api/runs/:runId             — cancel an in-progress run
GET    /api/artifacts/:artifactId   — retrieve an artifact
POST   /api/artifacts/:id/publish   — trigger external publish
GET    /api/memory/:workspaceId     — retrieve workspace memory summary
GET    /api/usage/:tenantId         — get usage ledger summary
GET    /api/traces/:runId           — get full replayable trace (operator)
```

**Event schemas (TypeScript)**

```typescript
// One interface per event type
interface RunStartedEvent { ... }
interface NodeCompletedEvent { ... }
interface ToolInvokedEvent { ... }
interface UsageMeteredEvent { ... }
interface RunFailedEvent { ... }
interface CheckpointSavedEvent { ... }
interface ArtifactCreatedEvent { ... }
interface BudgetWarningEvent { ... }
```

All events must include: eventId, eventType, runId, tenantId, userId,
graphVersion, timestamp. Add event-specific fields beyond these.

**WebSocket protocol**

Message shapes for run progress streaming:
- Connection auth: how is the WS connection authenticated?
- Message types: what messages does the server push? (progress, node_complete,
  tool_invoked, run_complete, run_failed, budget_warning)
- Each message type: TypeScript interface

**Error catalog**

Table format:
| Error code | HTTP status | Meaning | Client recovery hint |
|-----------|-------------|---------|---------------------|

Minimum 15 error codes covering: auth, plan gates, budget exhaustion,
tool failures, idempotency conflicts, not found, rate limiting, partial
failure, checkpoint unavailable.

**API versioning strategy**

How are API versions bumped? (URL path /v1/ /v2/? Header? Query param?)
What triggers a major version bump vs minor? How long are old versions
supported after a new one ships?

---

### D12 — src/types/v199.ts

A single complete TypeScript file. Runnable — no pseudocode.

**Requirements:**
- Valid TypeScript — no syntax errors
- No `any` without an inline comment explaining why
- No `unknown` without an inline comment
- Every entity from Phase 1 schema has an interface
- GraphState from Phase 2 is included verbatim or reconciled
- All event types from D11 are included
- UsageLedgerEntry from Phase 3 is included
- NodeExecutionTrace from Phase 3 is included
- Exported as named exports (no default export for the file)

**Required interfaces (minimum):**
```typescript
// Entities
export interface Tenant { ... }
export interface User { ... }
export interface Membership { ... }
export interface Plan { ... }
export interface FeatureFlag { ... }

// Agent execution
export interface AgentRun { ... }
export interface AgentNode { ... }
export interface ToolInvocation { ... }
export interface ToolAuditRecord { ... }

// Memory + artifacts
export interface MemoryItem { ... }
export interface Artifact { ... }
export interface PublishJob { ... }

// Billing + observability
export interface UsageLedgerEntry { ... }
export interface AuditLog { ... }
export interface NodeExecutionTrace { ... }

// Graph
export interface GraphState { ... }

// Events (from D11)
export interface RunStartedEvent { ... }
// ... all event types
```

File header comment must include:
```typescript
/**
 * FlashFusion Agent Stack v1.9.9 — Core Type Definitions
 * Generated by: Phase 4 build pipeline
 * Schema version: v1.9.9
 * Do not edit manually — regenerate via Phase 4 on schema changes
 */
```

---

### D13 — SMOKE_TESTS.md

Eight test scenarios. Each must have binary pass/fail conditions.
No "should roughly behave like" — exact expected state.

**Scenario format:**

```markdown
## Scenario N: [Name]

**Purpose:** Why this test matters for v1.9.9 release

**Setup:**
- Precondition 1: [exact state]
- Precondition 2: [exact state]

**Action:** [exactly what is triggered]

**Expected behavior:** [step by step what the system does]

**Pass condition:** [binary — exact state that confirms pass]

**Fail signal:** [exact state or error that indicates failure]

**References:** [Phase N deliverable this test validates]
```

**Required scenarios:**

1. **Golden path end-to-end**
   User submits generation request → artifact is stored → trace is replayable

2. **Tenant isolation**
   Tenant A cannot read Tenant B's artifacts, memory, or traces
   (Try: direct DB query with Tenant A's JWT targeting Tenant B's run_id)

3. **Plan gate — premium model blocked**
   Free-tier user attempts a route that requires premium model routing
   (Must be blocked at the enforcement node, not after model call)

4. **Idempotency — no duplicate publish**
   Retry after network failure during publish does not create a second
   external listing (idempotency key prevents double execution)

5. **Checkpoint resume**
   Run fails after plan_gate node, before tool execution
   Resume from checkpoint completes successfully without re-running auth

6. **Trace completeness**
   Every node in a completed golden-path run appears in the trace
   with cost (USD) and duration (ms) populated

7. **Prompt version audit**
   Trace for any run contains the exact prompt version hash used
   Operator can retrieve the prompt text from that hash

8. **Redaction**
   No sensitive field (model API key, user PII, auth token) appears in:
   - Supabase audit_logs table
   - NodeExecutionTrace records
   - Any exported trace

---

### D14 — ACCEPTANCE_CRITERIA.md

v1.9.9 ships when ALL of these are true. No partial credit.

```markdown
# Acceptance Criteria — FlashFusion Agent Stack v1.9.9

## Release Gate

Ship when every item below is ✅. No exceptions.

### Correctness
- [ ] All 8 smoke tests pass (reference SMOKE_TESTS.md)
- [ ] Golden path completes end-to-end without errors
- [ ] Checkpoint resume works after forced mid-run failure
- [ ] Billing metering records match actual model token usage (±5%)

### Security
- [ ] Tenant A cannot access Tenant B data via any API surface
- [ ] RLS policy audit passes: every multi-tenant table has valid policies
- [ ] Service-role key verified absent from all client bundles
      (How to verify: [exact verification step])
- [ ] No sensitive field found in any log, trace, or exported record
      (How to verify: [exact verification step])

### Reliability
- [ ] All side-effecting actions are idempotent
      (How to verify: [exact verification step])
- [ ] All long-running jobs are resumable from checkpoint
- [ ] Failure classification tree handles all 9 failure types in D10
- [ ] Compensating actions registered for every irreversible operation

### Observability
- [ ] Every agent run produces a complete replayable trace
- [ ] Prompt version hash stored per run and retrievable
- [ ] Dormant agent detection configured and tested
- [ ] Incident alert triggers configured for all events in D9

### Cost Control
- [ ] Per-run hard cap enforced — run halts at cap, no overrun
- [ ] Plan gate blocks premium model path for free-tier users
- [ ] Preflight cost estimate fires for applicable routes

### Code Quality
- [ ] src/types/v199.ts has no TypeScript errors (tsc --noEmit)
- [ ] SQL migration 001_v199_foundation.sql applies cleanly
      (supabase db push with zero errors)
- [ ] All [UNVERIFIED] items from prior phases resolved or documented

## What Does NOT Block Shipping

These are deferred to v2.0:
- Agent Studio full operator control surface (beyond read-only viewer)
- Second-wave agents (Research, UI Critic, Brand Consistency)
- Multi-region data residency
- Real-time collaboration
- Public plugin marketplace

## How to Run the Release Gate

1. Complete all 8 smoke tests → record results in SMOKE_TEST_RESULTS.md
2. Run RLS policy audit: [specific command or query]
3. Run client bundle check: [specific command or grep]
4. Run log redaction check: [specific command or query]
5. Run idempotency check: [specific test procedure]
6. Run TypeScript check: `tsc --noEmit`
7. Run SQL migration: `supabase db push`
8. All ✅ → proceed to implementation sprint
   Any ❌ → fix and re-run that check only
```

---

### D15 — OPEN_ITEMS_AND_2.0_NOTES.md

**Close every OPEN_ITEM from Phase 3 BATON**

For each open item:
- State what it was
- State how it was resolved (with resolution detail)
- OR state it is deferred to v2.0 with explicit reason

**Close every KNOWN_RISK from Phase 3 BATON**

Same format.

**v2.0 deferred features**

Table format:
| Feature | Why deferred | Pre-req before v2.0 | Risk if skipped |
|---------|-------------|--------------------|-----------------| 

**Breaking changes v2.0 will likely require**

List items that v2.0 will need that are incompatible with v1.9.9:
- Schema changes (migrations with breaking column renames or drops)
- API version bumps (endpoints that will change shape)
- Event schema changes (fields added or renamed)
- Graph version bumps (new nodes that change state shape)

**What must NOT change between 1.9.9 and 2.0**

Contracts that must remain stable even in v2.0:
- Tenant isolation model
- RLS policy structure
- Idempotency key format
- Audit log schema (append-only, immutable)
- Usage ledger schema

---

## ADVERSARIAL CRITIC GATE

Mark all findings `⚠`:

For API_CONTRACTS.md:
- ⚠ Which endpoint is missing auth and why is that risky?
- ⚠ Which event type is missing a field that will cause debugging pain?

For src/types/v199.ts:
- ⚠ Where does the TypeScript interface diverge from Phase 1 SQL schema?
- ⚠ Which field is typed too loosely (string instead of UUID)?

For SMOKE_TESTS.md:
- ⚠ Which smoke test could pass and still hide a real failure?
- ⚠ Which test has a setup that is hard to reproduce consistently?

For ACCEPTANCE_CRITERIA.md:
- ⚠ Which acceptance criterion is not actually testable as written?
- ⚠ Which criterion could pass in dev but fail in prod?

---

## SELF-VERIFICATION (check before outputting)

- [ ] src/types/v199.ts has no `any` without comment
- [ ] All 8 smoke tests have binary pass conditions
- [ ] All acceptance criteria are boolean (pass/fail, not "mostly")
- [ ] Every Phase 1–3 open item is closed or deferred with reason
- [ ] API endpoints cover all golden-path operations
- [ ] Error catalog has minimum 15 error codes
- [ ] TypeScript event interfaces include required base fields
- [ ] Adversarial ⚠ findings present for each deliverable
- [ ] No placeholder text

---

## FINAL STATUS BLOCK (required)

```
PIPELINE_STATUS: [SHIPPABLE / NOT_SHIPPABLE]
BLOCKERS: [if NOT_SHIPPABLE — exact items that must change before shipping]
DEFERRED_TO_2.0: [confirmed deferred list]
OPEN_[UNVERIFIED]_ITEMS: [any [UNVERIFIED] from prior phases not yet resolved]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80% — what lowered it]
```

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

Append one block per deliverable (D11, D12, D13, D14, D15).

Final pipeline-level block:
```
PIPELINE_CLAIMS: [top 3 claims about the overall v1.9.9 build]
PIPELINE_COUNTEREXAMPLES: [where each claim could fail in production]
PIPELINE_CONTRADICTIONS: [! any unresolved contradictions across all phases]
```
