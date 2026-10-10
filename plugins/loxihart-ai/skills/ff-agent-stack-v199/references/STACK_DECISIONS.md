# STACK_DECISIONS.md — Why This Stack, Not the Alternatives

## LangGraph over CrewAI as Primary Spine

**Decision:** LangGraph is the orchestration backbone. CrewAI is a secondary
layer for content-generation crews only.

**Why LangGraph for v1.9.9:**
v1.9.9 is a hardening release. The primary requirements are:
- Durable execution with checkpoints
- Resumable runs after failure
- Explicit state transitions that can be audited
- Graph-version lineage per run
- Bounded autonomy (max hops, retries, cost)

LangGraph is designed around explicit state, persistence via a checkpointer,
and deterministic graph traversal. These are structural properties, not
preferences. When a billing run fails mid-execution, you need to know
exactly which node ran, what state it produced, and how to resume without
re-running side effects. LangGraph is built for this.

**Why NOT CrewAI as primary:**
CrewAI's strength is role-based collaborative agent teams (Crews + Flows).
This is excellent for content generation where "debate improves quality."
It is the wrong model for a billing-safe, checkpoint-recoverable, audit-grade
platform spine. CrewAI can be used — and should be — for inner content crews.
It should not control idempotency, recovery, or tenant safety.

**Where CrewAI belongs in FlashFusion:**
- Brand kit generation crew
- Product listing optimization crew
- Research crew (v2.0, feature-flagged)
These all run as sub-tasks inside LangGraph nodes — not as the outer graph.

---

## AutoGen as Optional Premium Lane Only

**Decision:** AutoGen is not in the v1.9.9 mandatory path. It is
feature-flagged for premium reasoning lanes.

**Why NOT AutoGen as primary:**
AutoGen is a multi-agent conversation framework. Its strength is agents
talking to each other to improve quality. Its weakness is cost unpredictability
and debugging complexity in production. In a consumer/SMB product, users
feel latency. Multi-agent conversation loops add turns. Each turn adds latency
and cost. For v1.9.9 (stability release), this is the wrong trade-off.

**Where AutoGen belongs in FlashFusion:**
- Premium competitive analysis reports (feature-flagged, gated behind
  Team/Enterprise plan, with explicit per-run cost shown upfront)
- Code debugging assistant (v2.0)

---

## Make and n8n as Ops Automation Only

**Decision:** Make and n8n handle external ops workflows. Neither runs
core agent logic.

**What they handle:**
- Alert fan-out when runs fail
- Webhook distribution to CRM / HubSpot / Notion
- Email sequences triggered by publish events
- Airtable/spreadsheet sync for business ops
- Non-code team administration automations

**What they must NOT handle:**
- Core agent orchestration
- Billing enforcement
- Tenant data access
- Any path that touches Supabase RLS tables directly
- Any path that issues model API calls without the platform metering layer

**Why this boundary matters:**
Make/n8n expand your attack and integration surface. Every new scenario
connector is a new credential, a new auth scope, a new failure mode.
Keeping them in the "city utilities" lane (not the "central nervous system")
limits the blast radius of a misconfiguration.

---

## Supabase as Truth Layer, Not Orchestration Runtime

**Decision:** Supabase holds durable state. Application code runs the agent graph.

**What Supabase owns:**
- Auth (identity, JWTs)
- Postgres (structured tenant data, schema, RLS)
- Storage (artifacts, exports, generated files)
- pgvector (long-term semantic memory)
- Edge Functions (lightweight triggers, embedding pipelines, webhook handlers)
- Realtime (run progress streaming to frontend)

**What Supabase does NOT own:**
- LangGraph graph execution (runs in Node.js application process)
- Redis hot state (separate service — Upstash or Railway)
- Long-running agent worker jobs (separate worker process)
- The "thinking" — Supabase stores results, not logic

**Why not run orchestration inside Edge Functions:**
Edge Functions have execution time limits that conflict with long-running
agent graphs. They are excellent for triggers, transformations, and
embedding pipelines — not for multi-node, retry-capable, checkpoint-resumable
agent orchestration.

---

## Redis for Hot State

**Decision:** Redis handles ephemeral in-flight run state, locks, queues,
and rate limiting.

**Why not Postgres for hot state:**
Postgres is excellent for durable, queryable, RLS-protected data. It is not
optimized for high-frequency reads/writes of volatile in-progress state.
Run-level counters (tokens used, hop count, retry count), distributed locks,
and queue management belong in Redis.

**Boundary:**
- Redis: exists only for the duration of an active run (TTL-expired on completion)
- Postgres: receives the canonical record after run completion

**Risk to note:** Redis unavailability mid-run loses hot state. This is why
checkpoint snapshots are written to Postgres at key nodes — Redis is the
fast scratchpad, Postgres is the safe deposit box.

---

## pgvector over Pinecone/Weaviate for v1.9.9

**Decision:** pgvector inside Supabase handles vector memory for this release.

**Why:**
- Fewer services = fewer failure points
- RLS can be applied to vector search (tenant scoping)
- No separate auth/billing for a vector store service
- Sufficient for expected query volumes in v1.9.9

**When to reconsider:**
If semantic search latency exceeds acceptable thresholds under load, or if
the number of embeddings exceeds pgvector performance envelope, migrate to
a dedicated vector store in v2.x. Supabase documents migration patterns.

**Risk to note:** pgvector does not match Pinecone/Weaviate performance
at very large embedding counts. This is an acceptable v1.9.9 trade-off.
Monitor embedding count growth and re-evaluate at 1M+ records.
