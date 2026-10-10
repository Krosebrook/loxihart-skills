# Phase 2 — Orchestration

**Prerequisite: Phase 1 must return PHASE_1_STATUS: COMPLETE**

Paste the full BATON block from Phase 1 here before running:

```
[PASTE PHASE 1 BATON BLOCK HERE]
```

If PHASE_1_STATUS = INCOMPLETE, do not run this phase.
Identify which Phase 1 deliverable failed and re-run Phase 1 for that
deliverable only before proceeding.

---

```
SCOPE_MODE: FULL
ADVERSARIAL_CRITIC: REQUIRED
SELF_CHECK: ON
PHASE: 2 — Orchestration only. No billing, no ops runbooks yet.
```

---

## ROLE

You are a staff-level AI orchestration engineer. You build stateful, observable,
cost-bounded agent systems. You think in graphs, not chains. You design for the
2 AM failure, not the demo. You mark `[UNVERIFIED]` and `[SHALLOW]` rather than
hallucinate depth.

---

## MISSION

Build the orchestration layer of FlashFusion v1.9.9. This phase defines how
the system thinks, moves, and remembers. Everything must be compatible with
the schema (LOCKED_SCHEMA) and auth model (LOCKED_AUTH_MODEL) from Phase 1.

Four deliverables. Produce them in order. Reference Phase 1 locked outputs
explicitly by name (table names, auth pattern, RLS pattern).

---

## LOCKED CONTEXT

Use LOCKED_SCHEMA and LOCKED_AUTH_MODEL from Phase 1 BATON.
Use LOCKED_DEFAULTS from Phase 0 BATON.
Use scope locks from Phase 0 (especially CrewAI crews in scope,
vector memory provider, worker pool approach).

---

## DELIVERABLES

---

### D4 — AGENT_CATALOG.md

For each of the seven mandatory agents, produce a complete entry.
Format each entry identically.

**Required agents:** Router, Planner, Tool Executor, Memory, Validator,
Publisher, Recovery

**Entry format for each agent:**

```markdown
## [Agent Name]

**Role:** One sentence. What it does and why it exists.

**Input shape:**
\`\`\`typescript
interface [AgentName]Input {
  // fully typed — no `any`
}
\`\`\`

**Output shape:**
\`\`\`typescript
interface [AgentName]Output {
  // fully typed — no `any`
}
\`\`\`

**Tools it may call:** [list — must reference TOOL_CONTRACTS.md entries]

**Max token budget:** [number]
**Max execution time:** [milliseconds]
**Max retries:** [number]

**Failure behavior:** What this agent does when it fails. Does it throw?
Return a partial result? Trigger the Recovery agent? Log and skip?

**Compensating action:** What reverses this agent's side effects if the
run fails after this agent completes. Be specific: which table rows are
updated, which external calls are reversed, which locks are released.

**Example invocations:**
1. Golden path — normal successful execution
2. Edge case — unusual but valid input
3. Failure case — what bad input or downstream error looks like

**Interaction rules:** Which agents can call this one? Which agents does
this one call? Are there circular call patterns that must be prevented?
```

---

### D5 — GRAPH_SPEC.md

**Full node map — golden path (ASCII diagram)**

Draw the complete LangGraph node graph for the golden path:
user request → auth + plan check → router → planner → tool prep →
execution fan-out → validation → memory write → billing finalize →
publisher (if authorized) → response assembly.

Label every node with: node ID, agent type, checkpoint (Y/N), max retries.

```
Example format:
[auth_check] → [plan_gate] → [router]
                                 ├─ [chat_path]
                                 ├─ [generate_path]
                                 └─ [publish_path]
```

**Recovery subgraph (ASCII diagram)**

Separate graph showing the failure classification and recovery flow:
failure detected → classify → branch by type → retry/rollback/compensate.

**Graph state TypeScript interface**

```typescript
interface GraphState {
  // fully typed — no `any`
  // must include: runId, tenantId, userId, route, planVersion,
  // graphVersion, promptVersions, tokenBudget, tokensUsed,
  // currentNode, retryCount, checkpoints, memoryWrites,
  // toolInvocations, artifacts, status, error?
}
```

**Checkpoint locations**

Table format:
| Node ID | Checkpoint type | State saved | Resume behavior |
|---------|----------------|-------------|-----------------|

Minimum required checkpoints: before tool execution, before external
publish, before billing finalization, after plan is confirmed.

**Retry policy per node**

Table format:
| Node ID | Max retries | Backoff strategy | Retry conditions | Non-retryable errors |
|---------|-------------|-----------------|-----------------|---------------------|

**Bounded autonomy table**

Table format — one row per route:
| Route | Max hops | Max cost (USD) | Max duration (ms) | Max tool calls | Max retries total |
|-------|----------|---------------|------------------|---------------|------------------|

All values must be numeric. No "reasonable limit" or "as needed."

**Graph versioning rules**

- Where is graph version stored? (reference Phase 1 schema table)
- What changes require a version bump vs a patch?
- How are two graph versions run concurrently during a deploy?
- How is graph version included in the run trace?

---

### D6 — MEMORY_SPEC.md

**Layer map**

Table format:
| Layer | Store | What lives here | Why this store | TTL default |
|-------|-------|----------------|---------------|-------------|

Minimum layers: ephemeral run state (Redis), session memory (Postgres),
long-term semantic memory (pgvector), policy memory (Postgres, read-only).

Reference Phase 1 schema tables by name.

**Write policy**

What triggers a memory write? List explicit conditions:
- What qualifies as "worth remembering"?
- What is the minimum confidence threshold for writing long-term memory?
- Who decides — the Memory Agent or the Validator Agent?
- Is every write synchronous with the run, or can it be async?

**Retention classes**

Table format:
| Class | Examples | Default TTL | Override rules | Delete trigger |
|-------|----------|-------------|---------------|----------------|

Minimum classes: ephemeral, session, long-term, policy (immutable).

**Redaction rules**

List every field that must be stripped before persistence:
- Field name
- Why it must be redacted
- Redaction method (omit entirely / hash / mask last N chars / replace
  with placeholder)

Minimum fields to address: raw model API keys, raw tool response payloads
containing user PII, raw prompt text containing injected content,
authentication tokens.

**Tenant scope enforcement**

How is it technically enforced that Memory Agent for Tenant A cannot
read or write Tenant B's memory? Reference Phase 1 RLS policy pattern.
What prevents a bug in the Memory Agent from bypassing RLS?

**Embedding pipeline**

Step-by-step: content → chunk → embed → store.
- Where does chunking happen? (agent code, Edge Function, worker?)
- Which embedding model? Is it abstracted or hardcoded?
- How are stale embeddings detected and refreshed?
- What is the embedding batch size limit?

**3 example memory records per layer**

Use safe placeholder values. Show real TypeScript type alignment with
Phase 1 schema tables.

---

### D7 — TOOL_CONTRACTS.md

For each tool category, produce a complete contract.

**Required categories:** internal FlashFusion services, MCP tools,
external platform APIs, file generation/export tools, billing/metering.

**Contract format for each category:**

```markdown
## [Category Name]

**Example tools in this category:** [list 2-3 concrete examples]

**Input schema:**
\`\`\`typescript
interface [Category]ToolInput {
  tenantId: string
  userId: string
  runId: string
  idempotencyKey: string
  toolName: string
  schemaVersion: string
  // category-specific fields
}
\`\`\`

**Output schema:**
\`\`\`typescript
interface [Category]ToolOutput {
  status: 'success' | 'failed' | 'partial'
  durationMs: number
  // category-specific fields
}
\`\`\`

**Permission scope:**
- Which agent roles may call tools in this category?
- Which plan tiers unlock this category?
- What is the max calls per run for this category?

**Idempotency contract:**
- Who generates the idempotency key? (client / server / specific agent)
- What is the key format? (UUID v4 / hash of inputs / run_id + tool + sequence)
- How is a duplicate detected? (Redis check / DB unique constraint)
- What happens on duplicate: return cached result / reject with error?

**Timeout:** default and maximum in milliseconds

**Retry policy:**
- Max retries
- Backoff: fixed / exponential / jitter
- Retryable error types
- Non-retryable error types (side effects already occurred)

**Audit record shape:**
\`\`\`typescript
interface ToolAuditRecord {
  // must include: runId, tenantId, userId, toolName, inputHash,
  // outputHash, status, durationMs, retryCount, idempotencyKey,
  // timestamp, redactedInput, redactedOutput
}
\`\`\`

**Failure modes:**
| Error type | Cause | Detection | Response | Compensating action |
|-----------|-------|-----------|----------|-------------------|

**Example invocation (safe placeholder values):**
[one complete example showing input → output → audit record]
```

---

## ADVERSARIAL CRITIC GATE

After drafting each deliverable, answer these questions. Mark findings `⚠`:

For AGENT_CATALOG.md:
- ⚠ Which agent has no compensating action and what is the blast radius?
- ⚠ Which agent could be tricked via a crafted tool response?
- ⚠ Where could two agents call each other in a loop?

For GRAPH_SPEC.md:
- ⚠ Which node has no retry cap and could loop indefinitely?
- ⚠ Where does cost spiral if the Validator keeps rejecting?
- ⚠ What happens if a checkpoint write fails mid-execution?

For MEMORY_SPEC.md:
- ⚠ Where does the Memory Agent most plausibly write to the wrong tenant?
- ⚠ Which redaction rule is most likely to miss a sensitive field?
- ⚠ What happens to stale embeddings that reference deleted artifacts?

For TOOL_CONTRACTS.md:
- ⚠ Which tool has no idempotency contract and what is the worst-case
  duplicate execution scenario?
- ⚠ Which tool permission scope is broadest and why is that risky?

---

## SELF-VERIFICATION (check before outputting)

- [ ] All 7 agents have a compensating action defined
- [ ] GraphState is a valid TypeScript interface with no `any`
- [ ] Checkpoint locations table references specific node IDs
- [ ] Bounded autonomy table has all-numeric values
- [ ] Memory layer table references Phase 1 schema tables by name
- [ ] Redaction rules are field-level, not category-level
- [ ] Tool contracts each have idempotency key ownership named
- [ ] Adversarial ⚠ findings present for each deliverable
- [ ] [UNVERIFIED] and [SHALLOW] markers applied honestly
- [ ] No placeholder text in any section

---

## BATON TO PHASE 3 (required)

```
PHASE_2_STATUS: [COMPLETE / INCOMPLETE]
LOCKED_AGENTS: [agent names + primary roles + key output types]
LOCKED_TOOL_SHAPES: [tool contract interfaces Phase 3 must reference]
LOCKED_GRAPH_STATE: [GraphState interface summary]
LOCKED_CHECKPOINT_NODES: [node IDs where checkpoints occur]
OPEN_ORCHESTRATION_ITEMS: [anything Phase 3 needs to close]
INCOMPLETE_ITEMS: [if INCOMPLETE — which deliverable and why]
CONFIDENCE: [0-100%]
CONFIDENCE_NOTES: [if below 80% — what lowered it]
```

---

## CLAIMS / COUNTEREXAMPLE / CONTRADICTIONS

Append one block per deliverable (D4, D5, D6, D7).
