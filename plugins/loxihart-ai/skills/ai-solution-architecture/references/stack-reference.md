# Stack Reference — AI Solution Architecture

Deep reference tables moved out of SKILL.md for progressive disclosure. Standalone; no cross-links to other reference files.

## Component Stack Options (was: Section 2 — Architecture Design)

### 2. Architecture Design

**Component Selection**

*LLM Layer*
```yaml
options:
  hosted_api:
    - OpenAI (GPT-4, GPT-3.5-turbo)
    - Anthropic (Claude 3.5 Sonnet, Claude 3 Opus)
    - Azure OpenAI (enterprise compliance)
  
  self_hosted:
    - Llama 3.1 (70B, 8B)
    - Mixtral 8x7B
    - Custom fine-tuned models
    
selection_criteria:
  - Latency requirements (p95 < 2s → hosted API)
  - Cost per request (high volume → self-hosted)
  - Data privacy (HIPAA → self-hosted or Azure OpenAI)
  - Customization needs (domain-specific → fine-tuned)
```

*Application Framework*
```yaml
options:
  orchestration:
    - LangChain (rapid prototyping, Python ecosystem)
    - LlamaIndex (RAG-focused, document retrieval)
    - Custom (maximum control, performance optimization)
  
  backend:
    - FastAPI (async, high-performance Python)
    - Node.js + Express (JavaScript stack)
    - Go (microservices, low latency)
    
  frontend:
    - Next.js (full-stack React, Vercel deploy)
    - React + Vite (SPA, CDN deploy)
    - Embedded widget (client's existing site)
```

*Data Layer*
```yaml
vector_database:
  - Pinecone (managed, scalable, expensive)
  - Weaviate (open-source, hybrid search)
  - pgvector (PostgreSQL extension, cost-effective)
  
relational_database:
  - PostgreSQL (ACID, RLS for multi-tenant)
  - MySQL (compatibility with legacy systems)
  - Supabase (managed Postgres, real-time)
  
caching:
  - Redis (session state, rate limiting)
  - Upstash (serverless Redis, pay-per-request)
```

*Infrastructure*
```yaml
deployment:
  serverless:
    - Vercel (Next.js, zero-config)
    - AWS Lambda (event-driven, auto-scale)
    - Google Cloud Run (containerized, HTTP)
  
  containerized:
    - AWS ECS/Fargate (managed containers)
    - Kubernetes (complex, maximum control)
    - Railway/Render (simplified container hosting)
    
observability:
  - OpenTelemetry (traces, metrics, logs)
  - PostHog (product analytics, session replay)
  - Sentry (error tracking, performance monitoring)
```

## Integration Pattern Options (was: Section 3 — Integration Mapping)

### 3. Integration Mapping

**Authentication & Authorization**
```yaml
patterns:
  sso_integration:
    - SAML 2.0 (enterprise SSO)
    - OAuth 2.0 (modern apps)
    - LDAP/Active Directory (on-prem)
  
  authorization:
    - RBAC (role-based: admin, user, viewer)
    - ABAC (attribute-based: department, clearance)
    - Row-Level Security (multi-tenant data isolation)
```

**API Integration Patterns**
```yaml
strategies:
  real_time:
    - Webhooks (event-driven, push notifications)
    - WebSockets (bidirectional, streaming responses)
    - Server-Sent Events (one-way streaming)
  
  batch:
    - Scheduled jobs (cron, daily sync)
    - Message queues (RabbitMQ, AWS SQS)
    - ETL pipelines (data warehouse integration)
```

## Deployment Sizing & Pricing Tiers (was: Section 4 — Quick Estimates)

**Quick Estimates**
```yaml
small_deployment:
  users: 100-500
  requests_per_day: 1,000-5,000
  infrastructure:
    - Vercel Hobby ($0) or Pro ($20/month)
    - Supabase Free tier
    - OpenAI API (~$50-200/month)
  monthly_cost: $70-220

medium_deployment:
  users: 500-5,000
  requests_per_day: 5,000-50,000
  infrastructure:
    - Vercel Pro ($20/month)
    - Supabase Pro ($25/month)
    - Pinecone Starter ($70/month)
    - OpenAI API (~$500-2,000/month)
  monthly_cost: $615-2,115

large_deployment:
  users: 5,000-50,000
  requests_per_day: 50,000-500,000
  infrastructure:
    - AWS ECS (2-4 containers, ~$300/month)
    - RDS PostgreSQL (db.r6g.xlarge, ~$350/month)
    - Pinecone Standard ($500/month)
    - Self-hosted Llama 3.1 70B (g5.12xlarge, ~$3,000/month)
  monthly_cost: $4,150-5,000+
```
