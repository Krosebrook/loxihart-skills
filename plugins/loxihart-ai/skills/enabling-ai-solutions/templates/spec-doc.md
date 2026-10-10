# Template: Technical Specification Document

Use for: any build that needs a full spec — phased plan, cost model, architecture diagram, and success criteria in one place. Scales from a weekend project to a multi-month platform feature.
See `examples/solo-knowledge-base.md` for a completed output using this template.
Authoring notes in [brackets] — remove before shipping.

---

# AI Solution Architecture: [Project Name] — [Use Case]

**Date:** [YYYY-MM-DD]
**Version:** 1.0
**Author:** Kyle Rosebrook

---

## Problem Statement

[2–3 sentences. What manual process, friction point, or missing capability does this solve? Be specific — "I spend 20 minutes finding a note I know I saved" is better than "improve knowledge management."]

## Proposed Solution

[Technology stack summary in 1–2 sentences. Name the key components and the pattern (RAG / agent / workflow / etc.).]

**Monthly Infrastructure Cost:** $[low]–$[high]/month at [assumed scale]

---

## Architecture Overview

### Component Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| LLM (primary) | [e.g., Claude Sonnet 4.6] | [why: latency, cost, capability] |
| LLM (routing) | [e.g., Haiku 4.5 for classification] | [optional — add if routing] |
| Application layer | [FastAPI / Next.js 15 / Cloudflare Workers] | [why] |
| Orchestration | [LangChain / LlamaIndex / custom] | [why] |
| Vector database | [pgvector / Pinecone] | [why, or N/A] |
| Relational database | [Supabase / RDS PostgreSQL] | [why] |
| Authentication | [Clerk / Supabase Auth / Auth0] | [why] |
| Hosting | [Vercel / Cloudflare / AWS ECS] | [why] |
| Cache | [Upstash Redis / none] | [why] |
| Observability | [PostHog + Sentry] | minimum; add Datadog at enterprise scale |

### Architecture Diagram

[Insert completed Mermaid diagram from `templates/architecture-diagram.md`]

### Integration Points

| System | Method | Direction | Frequency |
|--------|--------|-----------|-----------|
| [System A] | [REST API / webhook / ETL] | [inbound / outbound / bidirectional] | [real-time / daily / on-event] |
| [System B] | | | |

---

## Infrastructure Sizing

**Expected Load:**

| Metric | Value | Basis |
|--------|-------|-------|
| Daily Active Users | [#] | [client estimate / industry avg] |
| Requests per Day | [#] | [DAU × sessions × req/session] |
| Peak QPS | [#] | [req/day ÷ 86,400 × peak multiplier] |
| Data Storage | [GB/TB] | [document count × avg size estimate] |

**Sizing Tier:** Small / Medium / Large
[Run `scripts/sizing_calc.py` for precise calculation]

**Infrastructure Cost Breakdown:**

| Component | Specification | Monthly Cost |
|-----------|---------------|--------------|
| Compute | [e.g., Vercel Pro] | $20 |
| Database | [e.g., Supabase Pro] | $25 |
| Vector DB | [e.g., pgvector included / Pinecone Starter] | $0–70 |
| LLM API | [model(s) + routing est.] | $[range] |
| Cache | [Upstash] | $[range] |
| Observability | [PostHog + Sentry] | $0–50 |
| CDN / Edge | [Cloudflare / Vercel] | $0–20 |
| **Total** | | **$[low]–$[high]/month** |

**AI FinOps Targets:**
- Cost per 1,000 requests: < $[N]
- Routing distribution: [N]% budget tier / [N]% mid / [N]% frontier
- Cache hit rate target: >[N]% (for RAG workloads)

---

## Security and Compliance

**Data Classification:** Public / Internal / Confidential / Restricted

**Applicable Frameworks:**
- [ ] GDPR — [brief scope note]
- [ ] HIPAA — [brief scope note]
- [ ] [COMPLIANCE FRAMEWORK] — [brief scope note]
- [ ] PCI-DSS — [brief scope note]
- [x] N/A — no regulated data in scope

**Security Controls:**

| Control | Implementation |
|---------|---------------|
| Authentication | [MFA, SSO provider, JWT expiry] |
| Authorization | [RBAC / RLS policies — describe roles] |
| Encryption at rest | AES-256 ([Supabase / RDS encryption]) |
| Encryption in transit | TLS 1.3 |
| Secrets management | Server-side only, env vars, never bundled in client |
| Audit logging | [what's logged, retention period] |
| Input sanitization | [prompt injection mitigation — system prompt isolation, content filtering] |

[For full compliance implementation: see `references/compliance-patterns.md`]

---

## Deployment Phases

### Phase 1: Foundation (Weeks 1–2)
- [ ] Infrastructure provisioned (DB, hosting, auth)
- [ ] CI/CD pipeline configured with automated testing
- [ ] Monitoring and alerting live (PostHog + Sentry)
- [ ] Secrets and environment configuration hardened
- [ ] Acceptance: health check endpoints green, auth flow working end-to-end

### Phase 2: Core AI Features (Weeks 3–4)
- [ ] LLM integration (prompts, streaming, error handling, retry logic)
- [ ] [Vector DB setup: embeddings pipeline, retrieval accuracy baseline] [remove if N/A]
- [ ] LLM routing if applicable (classifier + cost tracking in PostHog)
- [ ] Core API endpoints with input validation
- [ ] Acceptance: target use case working end-to-end in staging

### Phase 3: Integration (Weeks 5–6)
- [ ] Connect [System A] — [describe integration]
- [ ] Connect [System B] — [describe integration]
- [ ] Data pipeline / sync [describe]
- [ ] Acceptance: data flowing correctly from all integration points

### Phase 4: Testing and Launch (Weeks 7–8)
- [ ] Load testing: target [N] concurrent users, p95 < [N]s
- [ ] Security review: secrets audit, auth bypass testing, prompt injection testing
- [ ] Production deploy ([blue/green rollout / feature flags / full cutover])
- [ ] Cost monitoring: alerts configured at 80% of monthly budget
- [ ] Acceptance: all success criteria met (see below)

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LLM API rate limits at peak | Medium | High | Retry logic with exponential backoff; fallback to lower tier |
| Integration complexity exceeds estimate | Medium | Medium | Technical discovery call with client IT before Phase 3 |
| LLM cost overruns (usage spike) | Medium | Medium | PostHog alerts at 80% monthly budget; routing thresholds |
| Data migration delays | Medium | Medium | Parallel-track early; test with prod data sample in Phase 1 |
| Prompt injection / misuse | Low–Medium | High | Input sanitization, system prompt isolation, content filtering |
| Compliance gap discovered late | Low | High | Compliance review in Week 1, not Week 7 |

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| p95 latency | < [N]s | PostHog / Sentry performance |
| Uptime | 99.9% | UptimeRobot / Datadog synthetic |
| Error rate | < 0.5% | Sentry error rate |
| Cost per 1K requests | < $[N] | PostHog cost tracking |
| [Business metric] | [target] | [how measured] |

---

## Next Steps

1. **Confirm** architecture and sizing assumptions (run `scripts/sizing_calc.py` if needed)
2. **Provision** accounts, API keys, and env vars before starting Phase 1
3. **Build** — start Phase 1, don't plan past Phase 2 until Phase 1 ships

---

[Remove this line before archiving: built with `enabling-ai-solutions` skill v2.0.0]
