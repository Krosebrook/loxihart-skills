# Phase 05 — Observability

## Scope
Structured logging, distributed tracing, metrics, alerting, and SLO tracking. You cannot fix what you cannot see.

---

## Checklist

### Structured Logging
- [ ] JSON log format (not free-text) — parseable by log aggregator
- [ ] Log levels: ERROR, WARN, INFO, DEBUG — not all at INFO
- [ ] Correlation ID propagated across all services (X-Request-ID header)
- [ ] PII excluded from logs (no passwords, tokens, credit card numbers)
- [ ] Log sampling for high-volume DEBUG logs (not 100% capture)
- [ ] Log retention policy set (7 days hot, 90 days cold)

### Distributed Tracing
- [ ] Trace context propagated via W3C Trace Context header
- [ ] Spans created for: DB queries, outbound HTTP, queue publishes, cache operations
- [ ] Span attributes: `db.statement` (sanitized), `http.url`, `http.status_code`
- [ ] Sampling rate configured (100% in staging, 10-20% in production)
- [ ] Traces linked to logs via `trace_id`

### Metrics
- [ ] RED metrics per service: Rate, Errors, Duration
- [ ] USE metrics per resource: Utilization, Saturation, Errors
- [ ] Business metrics: active users, jobs processed, revenue events
- [ ] Queue depth and consumer lag tracked
- [ ] DB connection pool utilization tracked

### Alerting
- [ ] Alerts on SLO burn rate (not raw metrics)
- [ ] Error rate alert: > 1% sustained for 5 min → PagerDuty
- [ ] P99 latency alert: > 2x baseline for 10 min
- [ ] Queue lag alert: > X messages for > Y minutes
- [ ] Alert runbook linked in alert description
- [ ] Dead man's switch for critical scheduled jobs

### Health Endpoints
- [ ] `/health/live` — is the process alive? (200 = yes)
- [ ] `/health/ready` — is the service ready to receive traffic? (checks DB, cache)
- [ ] `/health/startup` — has startup completed? (for K8s/container orchestration)
- [ ] Health endpoints excluded from access logs (reduce noise)

### SLOs
- [ ] SLI defined per user-facing endpoint (availability, latency)
- [ ] SLO target set (e.g., 99.9% availability, P95 < 500ms)
- [ ] Error budget calculated and tracked
- [ ] SLO dashboard visible to team

---

## Stack Defaults (Kyle's)
- **Logs:** Structured JSON → PostHog (events) + Sentry (errors)
- **Traces:** OpenTelemetry SDK → hosted OTLP collector
- **Metrics:** Prometheus/Grafana or Vercel Analytics
- **Alerting:** Sentry alerts + PagerDuty for P0/P1

---

## Common Gaps
- Correlation ID generated per service instead of propagated → can't trace cross-service
- Alert fires on raw error count → alert fatigue (SLO burn rate is better)
- No runbook linked to alert → on-call engineer can't respond quickly
- Health endpoint hits database → health check causes cascading failure
