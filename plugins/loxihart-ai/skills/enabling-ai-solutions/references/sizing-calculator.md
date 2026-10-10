# Infrastructure Sizing Calculator (2026)

Read this in Step 4 of the golden path. Map daily request volume to a tier, then validate with the detailed methodology if needed.

---

## Quick Tier Decision

```
Daily Requests?
  ├─ <5K    → Small  → Vercel + Supabase Free + hosted LLM  → $50–300/month
  ├─ 5K–50K → Medium → Vercel Pro + Supabase Pro + pgvector  → $400–2K/month
  └─ >50K   → Large  → AWS ECS + RDS + Pinecone Standard     → $3K–8K/month
```

Add 30% buffer on provisioned (containerized) deployments only. Serverless scales automatically.

---

## Tier Specifications

### Small (< 5K req/day, 100–500 users)

```yaml
infrastructure:
  compute: Vercel Hobby ($0) or Pro ($20/month)
  database: Supabase Free (500MB) or Pro ($25)
  vector_db: pgvector on Supabase (included)
  cache: Upstash Redis free tier
  llm:
    primary: Claude Sonnet 4.6
    budget: ~$50–150/month (500 avg tokens in/out, 3K req/day)
  observability: PostHog free + Sentry free

monthly_total: $70–195 (excl. one-time setup)
```

### Medium (5K–50K req/day, 500–5K users)

```yaml
infrastructure:
  compute: Vercel Pro ($20) or Cloudflare Workers ($5+)
  database: Supabase Pro ($25, 8GB RAM, 100GB storage)
  vector_db: Pinecone Starter $70 or pgvector on Supabase Pro
  cache: Upstash Redis Pay-as-you-go (~$10–30)
  llm:
    primary: Claude Sonnet 4.6 + routing to Haiku 4.5
    budget: ~$200–1,200/month (routing cuts ~60% vs Sonnet-only)
  observability: PostHog ($0–50) + Sentry ($0–26)

monthly_total: $330–1,400
```

### Large (50K–500K req/day, 5K–50K users)

```yaml
infrastructure:
  compute: AWS ECS/Fargate (2–4 containers, ~$300–600/month)
  database: RDS PostgreSQL db.r6g.large (~$200), or Supabase Team ($599)
  vector_db: Pinecone Standard ($500) or Weaviate self-hosted ($300+ compute)
  cache: ElastiCache Redis (~$100–200)
  llm:
    primary: Routing architecture — Haiku/nano (60%) + Sonnet (30%) + Opus (10%)
    budget: ~$800–3,000/month (vs $5K+ all-Opus)
  observability: PostHog ($50–250) + Sentry ($26+) + Datadog ($15/host)

monthly_total: $2,000–5,500
note: Consider self-hosted Llama 4 Maverick above $3K/month LLM spend
```

---

## Detailed Methodology

### 1. Baseline Metrics

```yaml
required_inputs:
  - daily_active_users: DAU
  - sessions_per_user_per_day: typical 2–5
  - requests_per_session: typical 3–8
  - peak_hour_multiplier: 3–5x for B2B, 8–12x for B2C consumer
  - avg_prompt_tokens: measure from sample prompts
  - avg_completion_tokens: measure from sample responses
  - latency_sla_p95: client requirement (typical: 2s for chat, 5s for analysis)
```

### 2. Volume Calculations

```python
daily_requests = DAU × sessions_per_user × requests_per_session

average_qps = daily_requests / 86400
peak_qps = average_qps × peak_hour_multiplier

# Example:
# 1,000 DAU × 3 sessions × 5 req = 15,000 req/day
# 15,000 / 86400 = 0.17 avg QPS → 0.17 × 4 = 0.68 peak QPS
```

### 3. LLM Cost Estimation (April 2026 Pricing)

```python
# Claude Sonnet 4.6: $3/M input, $15/M output
# Routing to Haiku 4.5 for 60% of traffic: $0.25/M input, $1.25/M output

# Pure Sonnet scenario (15K req/day, 500 input / 300 output avg):
daily_input_cost  = (15_000 × 500 / 1_000_000) × 3.00   # $22.50/day
daily_output_cost = (15_000 × 300 / 1_000_000) × 15.00  # $67.50/day
monthly_llm = (22.50 + 67.50) × 30                       # $2,700/month

# With routing (60% Haiku, 40% Sonnet):
haiku_input  = (9_000 × 500 / 1_000_000) × 0.25          # $1.13/day
haiku_output = (9_000 × 300 / 1_000_000) × 1.25          # $3.38/day
sonnet_input = (6_000 × 500 / 1_000_000) × 3.00          # $9.00/day
sonnet_output= (6_000 × 300 / 1_000_000) × 15.00         # $27.00/day
monthly_llm_routed = (1.13+3.38+9.00+27.00) × 30         # $1,235/month (~54% savings)
```

### 4. Latency Budget

```yaml
# Target: p95 < 2s end-to-end
latency_breakdown:
  network_cdn:      80ms    # Client → Cloudflare/Vercel edge
  auth_check:       30ms    # JWT validation (cached)
  database_query:   100ms   # User context, conversation history
  vector_search:    200ms   # RAG retrieval (pre-computed embeddings)
  llm_inference:    900ms   # Sonnet 4.6 typical TTFT + generation
  response_format:  40ms    # JSON assembly, streaming setup

total_p95: ~1,350ms         # ✅ Under 2s with buffer

# If over budget:
optimizations:
  - Semantic caching (Redis): repeat queries return in <50ms
  - Streaming responses: perceived latency drops significantly
  - Pre-compute embeddings at ingest: eliminates on-demand embedding cost
  - Downgrade LLM tier: Haiku 4.5 p50 ~300ms vs Sonnet 4.6 p50 ~800ms
```

### 5. Auto-Scaling Triggers (Containerized Only)

```yaml
scale_up:
  - CPU > 70% for 2 minutes
  - Memory > 80% for 2 minutes
  - p95 latency > 2.5s for 5 minutes
  - Queue depth > 100 pending requests

scale_down:
  - CPU < 30% for 10 minutes
  - All metrics below threshold for 15 minutes
```

### 6. AI FinOps Metrics

Track these in PostHog or Datadog as operational KPIs:

```yaml
cost_efficiency:
  cost_per_1000_requests: target varies by tier (S: <$2, M: <$5, L: <$8)
  routing_distribution:   target 50–70% of traffic on budget tier
  cache_hit_rate:         target >30% for RAG workloads
  token_utilization:      avg prompt length (compress if >1K tokens)

quality_signals:
  user_satisfaction_proxy: thumbs-up/down, session length, return rate
  error_rate: target <0.5% (LLM API errors + application errors)
  fallback_rate: % of requests that fell back from routing to frontier
```

### 7. Capacity Planning Worksheet

| Metric | Value | Source |
|--------|-------|--------|
| Expected DAU | | Client estimate |
| Sessions per user/day | | Industry avg or client data |
| Requests per session | | Workflow analysis |
| Peak hour multiplier | | 3–5x B2B, 8–12x B2C |
| Avg prompt tokens | | Sample prompts |
| Avg completion tokens | | Sample responses |
| Latency SLA p95 | | Client requirement |
| Compliance requirements | | Client legal/IT |

**Calculated:**
- Daily requests: ___
- Peak QPS: ___
- Monthly LLM cost (routing): $___
- Recommended tier: S / M / L

---

**Notes:**
- Always set cost alerts at 80% of budget threshold
- Review actual usage at 30 days; resize or adjust routing thresholds
- Above ~$3K/month LLM spend, model self-hosting ROI analysis
- Serverless compute (Vercel/Cloudflare) does not need manual headroom — skip the 30% buffer

*Pricing sourced from tldl.io/resources/llm-api-pricing-2026, April 2026. Prices change frequently — verify before committing to a cost model.*
