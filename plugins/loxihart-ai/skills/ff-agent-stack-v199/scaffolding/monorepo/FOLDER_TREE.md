# FOLDER_TREE.md — FlashFusion v1.9.9 Monorepo Structure

This is the target folder structure for the v1.9.9 implementation.
It is a scaffold — not all files exist yet. Phase prompts generate the
content; this tree defines where each output belongs.

Files marked `[GENERATED]` are produced by phase prompts.
Files marked `[STUB]` exist in this sprint kit as stubs to be replaced.
Files marked `[IMPLEMENT]` must be written during implementation sprint.

---

```
flashfusion/
│
├── apps/
│   ├── web/                           # Next.js App Router frontend
│   │   ├── app/
│   │   │   ├── (auth)/                # Auth routes (login, signup)
│   │   │   ├── dashboard/             # User dashboard
│   │   │   ├── artifacts/             # Artifact viewer
│   │   │   ├── runs/                  # Run history + status
│   │   │   └── studio/                # Agent Studio (read-only trace viewer)
│   │   ├── components/
│   │   │   ├── ui/                    # Shared UI primitives
│   │   │   ├── runs/                  # Run status components
│   │   │   ├── traces/                # Trace viewer components
│   │   │   └── artifacts/             # Artifact display components
│   │   ├── lib/
│   │   │   ├── supabase/              # Supabase client (browser-safe)
│   │   │   └── api/                   # API client utilities
│   │   └── package.json
│   │
│   ├── api/                           # Node.js/TypeScript API server
│   │   ├── src/
│   │   │   ├── routes/                # REST endpoint handlers
│   │   │   │   ├── runs.ts            # POST/GET /api/runs [IMPLEMENT]
│   │   │   │   ├── artifacts.ts       # GET/POST /api/artifacts [IMPLEMENT]
│   │   │   │   ├── memory.ts          # GET /api/memory [IMPLEMENT]
│   │   │   │   ├── usage.ts           # GET /api/usage [IMPLEMENT]
│   │   │   │   └── traces.ts          # GET /api/traces (operator) [IMPLEMENT]
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts            # JWT validation + tenant extraction
│   │   │   │   ├── planGate.ts        # Plan tier enforcement
│   │   │   │   └── rateLimit.ts       # Per-tenant rate limiting
│   │   │   ├── orchestrator/
│   │   │   │   ├── graphRunner.ts     # LangGraph execution entry point
│   │   │   │   ├── graphs/
│   │   │   │   │   ├── goldenPath.ts  # Golden path graph [IMPLEMENT]
│   │   │   │   │   └── recovery.ts    # Recovery subgraph [IMPLEMENT]
│   │   │   │   └── checkpointer.ts    # Checkpoint adapter (Postgres/Redis)
│   │   │   └── server.ts              # Express/Fastify server entry
│   │   └── package.json
│   │
│   └── worker/                        # Background job worker
│       ├── src/
│       │   ├── jobs/
│       │   │   ├── generation.ts      # Long-running generation jobs
│       │   │   ├── export.ts          # Export / file generation jobs
│       │   │   ├── publish.ts         # External publish jobs
│       │   │   └── embeddings.ts      # Async embedding pipeline
│       │   ├── queue/
│       │   │   ├── consumer.ts        # Redis queue consumer
│       │   │   └── producer.ts        # Job enqueue utilities
│       │   └── worker.ts              # Worker entry point
│       └── package.json
│
├── packages/
│   ├── agents/                        # Agent role implementations
│   │   ├── src/
│   │   │   ├── router/
│   │   │   │   └── router.agent.ts    # Router Agent [IMPLEMENT]
│   │   │   ├── planner/
│   │   │   │   └── planner.agent.ts   # Planner Agent [IMPLEMENT]
│   │   │   ├── tool-executor/
│   │   │   │   └── tool-executor.agent.ts [IMPLEMENT]
│   │   │   ├── memory/
│   │   │   │   └── memory.agent.ts    # Memory Agent [IMPLEMENT]
│   │   │   ├── validator/
│   │   │   │   └── validator.agent.ts # Validator Agent [IMPLEMENT]
│   │   │   ├── publisher/
│   │   │   │   └── publisher.agent.ts # Publisher Agent [IMPLEMENT]
│   │   │   └── recovery/
│   │   │       └── recovery.agent.ts  # Recovery Agent [IMPLEMENT]
│   │   └── package.json
│   │
│   ├── tools/                         # MCP tool adapters + internal tools
│   │   ├── src/
│   │   │   ├── mcp/                   # MCP server adapters [IMPLEMENT]
│   │   │   ├── internal/              # Internal FlashFusion tool calls
│   │   │   ├── external/              # External platform API connectors
│   │   │   ├── file-gen/              # File/export generation tools
│   │   │   └── registry.ts            # Tool allowlist + registration
│   │   └── package.json
│   │
│   ├── memory/                        # Memory layer abstraction
│   │   ├── src/
│   │   │   ├── layers/
│   │   │   │   ├── redis.memory.ts    # Ephemeral run state
│   │   │   │   ├── postgres.memory.ts # Session + policy memory
│   │   │   │   └── vector.memory.ts   # Long-term semantic memory
│   │   │   ├── redaction.ts           # Field-level redaction utilities
│   │   │   └── memory.service.ts      # Unified memory interface
│   │   └── package.json
│   │
│   ├── models/                        # LLM provider abstraction
│   │   ├── src/
│   │   │   ├── providers/
│   │   │   │   ├── anthropic.ts       # Claude adapter
│   │   │   │   ├── openai.ts          # GPT adapter
│   │   │   │   └── google.ts          # Gemini adapter
│   │   │   ├── router.ts              # Multi-model routing logic
│   │   │   └── costCalculator.ts      # Per-model token cost calculator
│   │   └── package.json
│   │
│   ├── observability/                 # Tracing, metrics, logging
│   │   ├── src/
│   │   │   ├── trace.ts               # NodeExecutionTrace writer
│   │   │   ├── replay.ts              # Run replay utilities
│   │   │   ├── dormant.ts             # Dormant agent detection
│   │   │   └── alerts.ts              # Incident alert triggers
│   │   └── package.json
│   │
│   ├── authz/                         # Auth + tenant scoping utilities
│   │   ├── src/
│   │   │   ├── jwt.ts                 # JWT validation + claim extraction
│   │   │   ├── tenant.ts              # Tenant context injection
│   │   │   └── planGate.ts            # Plan gate enforcement utilities
│   │   └── package.json
│   │
│   ├── billing/                       # Token metering + usage enforcement
│   │   ├── src/
│   │   │   ├── metering.ts            # Usage ledger writes
│   │   │   ├── caps.ts                # Hard cap + soft warning enforcement
│   │   │   ├── preflight.ts           # Pre-run cost estimation
│   │   │   └── planLimits.ts          # Plan tier limit config
│   │   └── package.json
│   │
│   ├── schemas/                       # Zod schemas + TypeScript types
│   │   ├── src/
│   │   │   ├── v199.ts                # Core types [STUB — Phase 4 generates]
│   │   │   ├── events.ts              # Event payload schemas
│   │   │   ├── api.ts                 # API request/response schemas
│   │   │   └── tools.ts               # Tool input/output schemas
│   │   └── package.json
│   │
│   └── ui/                            # Shared design system components
│       ├── src/
│       │   ├── components/            # Reusable UI components
│       │   └── index.ts
│       └── package.json
│
├── supabase/
│   ├── migrations/
│   │   └── 001_v199_foundation.sql    # [STUB — Phase 1 generates final]
│   ├── functions/
│   │   ├── embed-trigger/             # Embedding pipeline Edge Function
│   │   └── webhook-handler/           # Inbound webhook Edge Function
│   └── seed.sql                       # Development seed data
│
├── infra/
│   ├── terraform/                     # IaC for cloud resources
│   ├── docker/
│   │   ├── api.Dockerfile
│   │   └── worker.Dockerfile
│   └── vercel/
│       └── vercel.json                # Vercel deployment config
│
├── docs/
│   └── v199/
│       ├── ARCHITECTURE.md            # [GENERATED — Phase 1]
│       ├── SECURITY_MODEL.md          # [GENERATED — Phase 1]
│       ├── AGENT_CATALOG.md           # [GENERATED — Phase 2]
│       ├── GRAPH_SPEC.md              # [GENERATED — Phase 2]
│       ├── MEMORY_SPEC.md             # [GENERATED — Phase 2]
│       ├── TOOL_CONTRACTS.md          # [GENERATED — Phase 2]
│       ├── BILLING_GUARDRAILS.md      # [GENERATED — Phase 3]
│       ├── OBSERVABILITY_RUNBOOK.md   # [GENERATED — Phase 3]
│       ├── ROLLBACK_RECOVERY.md       # [GENERATED — Phase 3]
│       ├── API_CONTRACTS.md           # [GENERATED — Phase 4]
│       ├── SMOKE_TESTS.md             # [GENERATED — Phase 4]
│       ├── ACCEPTANCE_CRITERIA.md     # [GENERATED — Phase 4]
│       ├── OPEN_ITEMS_AND_2.0.md      # [GENERATED — Phase 4]
│       ├── GAPS_AUDIT.md              # [GENERATED — Phase 0]
│       └── BATONS.md                  # Running baton block log
│
├── tests/
│   ├── smoke/                         # 8 smoke test implementations
│   ├── integration/                   # Integration tests
│   ├── security/                      # RLS + tenant isolation tests
│   └── load/                          # Load tests
│
├── package.json                       # Monorepo root (pnpm workspaces)
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── turbo.json                         # Turborepo build config
```

---

## Key File Locations Quick Reference

| What | Where |
|------|-------|
| Core TypeScript types | `packages/schemas/src/v199.ts` |
| SQL migration | `supabase/migrations/001_v199_foundation.sql` |
| Agent implementations | `packages/agents/src/[agent-name]/` |
| Graph execution | `apps/api/src/orchestrator/graphs/` |
| Tool adapters | `packages/tools/src/` |
| Memory layers | `packages/memory/src/layers/` |
| Model router | `packages/models/src/router.ts` |
| Trace writer | `packages/observability/src/trace.ts` |
| Billing metering | `packages/billing/src/metering.ts` |
| Phase-generated docs | `docs/v199/` |
| Smoke tests | `tests/smoke/` |
