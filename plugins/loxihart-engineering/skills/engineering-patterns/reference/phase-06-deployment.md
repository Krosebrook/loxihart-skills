# Phase 06 — Deployment

## Scope
Blue-green deployments, canary releases, feature flags, rollback procedures, and release management.

---

## Checklist

### Release Strategy
- [ ] Release strategy documented: blue-green / canary / rolling / feature flag
- [ ] Zero-downtime deployment verified (graceful shutdown + health checks)
- [ ] Deployment frequency target set (daily? weekly? on-demand?)
- [ ] Deployment runbook exists and is up to date

### Blue-Green / Canary
- [ ] Two environments (blue/green) or traffic-split (canary) configured
- [ ] Automated smoke tests run against new environment before traffic switch
- [ ] Traffic shift is gradual (1% → 10% → 50% → 100%) with monitoring gate
- [ ] Automatic rollback trigger defined (error rate threshold)

### Feature Flags
- [ ] Feature flag system integrated (LaunchDarkly, PostHog, GrowthBook, Unleash)
- [ ] All new features shipped behind a flag
- [ ] Flags have an owner and a sunset date
- [ ] Kill switch flags for risky database migrations or external integrations
- [ ] Flag state observable in dashboards

### Rollback
- [ ] Rollback procedure documented and tested (not just described)
- [ ] Database migrations backward-compatible (rollback doesn't break old code)
- [ ] Previous container/artifact version available for immediate revert
- [ ] Rollback decision criteria defined (who decides? at what threshold?)
- [ ] Rollback time target: < 5 minutes

### Environment Parity
- [ ] Staging ≈ production (same infra size tier, same config shape)
- [ ] Production secrets not used in staging
- [ ] Load testing done in staging with production-shaped load
- [ ] Staging database seeded with anonymized production-like data

### Post-Deploy Verification
- [ ] Automated smoke tests run post-deploy (happy path, auth, key user flows)
- [ ] On-call engineer notified of deploy start and end
- [ ] Error rate monitored for 30 min post-deploy before declaring success
- [ ] Deployment annotated in metrics/APM (so you can correlate with anomalies)

---

## Stack Defaults (Kyle's)
- **Hosting:** Vercel (Next.js) / Cloudflare Workers (edge) / Railway (backends)
- **Feature Flags:** PostHog
- **Rollback:** Vercel instant rollback / docker image tags

---

## Common Gaps
- Rollback procedure described but never rehearsed → fails under pressure
- Feature flags never cleaned up → flag debt accumulates
- Staging has different data shape → bugs only surface in production
- No post-deploy monitoring window → silent regressions go undetected
