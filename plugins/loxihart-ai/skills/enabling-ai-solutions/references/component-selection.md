# Component Selection Guide (2026)

Reference for LLM tier, framework, data layer, and infra selection. Read this in Step 3 of the golden path. Choose one option per category; document your reasoning in the output.

---

## LLM Layer

### Hosted API (default for most builds)

| Model | Tier | Input/M | Output/M | Context | Best For |
|-------|------|---------|----------|---------|----------|
| Claude Opus 4.6 | Frontier | $5 | $25 | 1M | Complex agents, code review, long-doc analysis |
| Claude Sonnet 4.6 | Mid | $3 | $15 | 200K (1M beta) | RAG, generation, most production workloads |
| Claude Haiku 4.5 | Budget | $0.25 | $1.25 | 200K | Classification, routing, simple extraction |
| GPT-5.4 | Mid-Frontier | $2.50 | $10 | 400K | Agentic tool use, structured outputs |
| GPT-5.4 nano/mini | Budget | $0.08–0.15 | $0.30–0.60 | 128K | High-volume routing, simple tasks |
| Gemini 2.5 Pro | Mid | $1.25 | $5 | 2M | Max context, multimodal, cost-sensitive |
| Gemini 2.0 Flash | Budget | $0.10 | $0.40 | 1M | Fast, cheap, good enough for most routing |
| DeepSeek V3.2 | Budget API | $0.14 | $0.28 | 128K | Cost-sensitive builds, non-regulated data |

### Self-Hosted (air-gapped, data sovereignty, or high-volume)

| Model | Size | Serving | Best For |
|-------|------|---------|----------|
| Llama 4 Maverick | Large | vLLM or SGLang | High-volume, good quality open-weights |
| Llama 4 Scout | Mid | vLLM | Faster inference, lower hardware cost |
| DeepSeek V3.2 | Large | vLLM | Best open-weights value, near-frontier quality |
| Qwen2.5-Coder 32B | Mid | Ollama | Code-specific tasks, local dev |

**Selection criteria:**
- p95 latency < 500ms → budget tier or routing architecture
- HIPAA / regulated PHI in prompts → Azure OpenAI (BAA available), self-hosted, or Anthropic (BAA available)
- EU data residency → Mistral Small/Large via Azure EU regions, or self-hosted
- High volume + uniform tasks → self-hosted open-weights pays off above ~$3K/month API spend
- Agentic tool use → Claude Sonnet 4.6 or GPT-5.4 (most reliable tool call behavior)

### Routing Architecture (standard for production)

```
Request → Complexity Classifier (Haiku 4.5 / GPT-5.4 nano)
  ├─ Simple  → Haiku 4.5 / GPT-5.4 nano / Gemini Flash
  ├─ Medium  → Sonnet 4.6 / GPT-5.4
  └─ Complex → Opus 4.6 / GPT-5.4 (frontier)
```

Cost savings: 60–80% vs. routing everything to frontier. Add at complexity >= 1,000 req/day.

---

## Application Framework

### Orchestration

| Option | Use When |
|--------|----------|
| LangChain | Rapid RAG prototypes, Python stack, rich ecosystem |
| LlamaIndex | Document-heavy retrieval, enterprise knowledge bases |
| Custom (raw API) | Maximum control, performance-critical, simple flows |
| n8n / Make | No-code automation pipelines, trigger-based workflows |

### Backend

| Option | Use When |
|--------|----------|
| FastAPI | Async Python, high-performance, LLM-heavy workloads |
| Node.js + Hono/Fastify | JS stack, edge-friendly, Cloudflare Workers |
| Cloudflare Workers | Edge deployment, Nuxt/Next SSR, sub-50ms global latency |

### Frontend

| Option | Use When |
|--------|----------|
| Next.js (React 19) | Full-stack, SSR, Vercel deploy |
| Nuxt 3 | Vue ecosystem, Cloudflare Pages |
| React 19 + Vite | SPA, CDN deploy, no SSR needed |
| Embedded widget | Drop into client's existing site |

---

## Data Layer

### Vector Database

| Option | Vectors | Managed | Monthly | Use When |
|--------|---------|---------|---------|----------|
| Pinecone Starter | <1M | Yes | $0–70 | Quick start, managed, <1M vectors |
| Pinecone Standard | 1–10M | Yes | $500 | Scale, SLA needed |
| pgvector (Supabase) | <5M | Yes | $25+ | Already on Postgres, cost-sensitive |
| Weaviate | Any | Self | Compute only | Hybrid search, open-source preference |

**Decision:** pgvector first unless >5M vectors or advanced hybrid search required.

### Relational Database

| Option | Use When |
|--------|----------|
| Supabase (Postgres) | Default — managed Postgres, RLS, real-time, auth baked in |
| PlanetScale / Neon | Serverless branching, high-concurrency reads |
| RDS PostgreSQL | AWS-native, enterprise, large scale, need full Postgres control |

### Cache

| Option | Use When |
|--------|----------|
| Upstash Redis | Serverless, pay-per-request, no always-on cost |
| Redis (managed) | High throughput, session state, rate limiting at scale |

---

## Infrastructure

### Compute

| Option | Use When |
|--------|----------|
| Vercel | Next.js/Nuxt default, zero-config, edge functions |
| Cloudflare Workers + Pages | Edge-first, global latency, Nuxt stack |
| AWS Lambda | Event-driven, AWS ecosystem, Python workloads |
| AWS ECS/Fargate | Containerized, persistent workloads, large scale |
| Railway / Render | Simplified containers, good DX, early-stage |

### Observability

| Option | Role |
|--------|------|
| PostHog | Product analytics, session replay, feature flags |
| Sentry | Error tracking, performance monitoring |
| Datadog | Full-stack APM, log aggregation, enterprise |
| OpenTelemetry | Traces/metrics/logs, vendor-agnostic, self-instrumented |

**Minimum for any client deployment:** PostHog + Sentry. Add Datadog at enterprise scale or if client requires it.

### AI FinOps (2026 Standard for Client Engagements)

Track cost-per-inference as a KPI alongside latency and error rate:

```yaml
metrics_to_report:
  - cost_per_1000_requests: target <$0.50 for mid-tier workloads
  - token_utilization: prompt compression ratio
  - cache_hit_rate: target >30% on RAG embeddings
  - routing_distribution: % of traffic hitting each model tier
```

Track these as ongoing operational KPIs — in PostHog or Datadog depending on scale.

---

## Authentication and Authorization

| Pattern | Use When |
|---------|----------|
| Clerk | B2C or B2B SaaS, fast integration, MFA, social login |
| Supabase Auth | Already on Supabase, simple auth needs |
| Auth0 | Enterprise SSO, SAML 2.0, complex RBAC required |
| Azure AD (Entra) | Microsoft shop, existing AD, LDAP |

**Row-Level Security (RLS):** Always enable on Supabase for multi-tenant data. Non-negotiable.

---

## Pattern Library by Use Case

| Use Case | LLM | Framework | Vector DB | Notes |
|----------|-----|-----------|-----------|-------|
| Helpdesk chatbot | Sonnet 4.6 | LangChain | pgvector | Route simple Qs to Haiku |
| Document Q&A | Sonnet 4.6 | LlamaIndex | Pinecone | Chunk strategy matters most |
| Code review agent | Opus 4.6 | Custom API | None | Tool use + Supabase for results |
| Research agent | Sonnet 4.6 | Custom API | None | Exa/Tavily for web, Supabase for storage |
| Workflow automation | Haiku 4.5 | n8n | None | LLM just for classification/formatting |
| Multi-agent system | Opus 4.6 | Custom / CrewAI | pgvector | See orchestrating-ai-agents skill |

---

*Last updated: May 2026. LLM pricing sourced from tldl.io/resources/llm-api-pricing-2026 (April 2026). Model benchmarks sourced from iternal.ai LLM selection guide.*
