# Phase 02 — Resilience

## Scope
Error handling, retry logic, circuit breakers, graceful degradation, and timeout management. A system that fails ungracefully is not production-ready.

---

## Checklist

### Error Handling
- [ ] Structured error format: `{ code, message, cause, retryable, context }`
- [ ] All async functions have explicit error boundaries (no unhandled promise rejections)
- [ ] Errors logged at the right level: user errors → warn, system errors → error
- [ ] Error codes are enums — no stringly-typed error strings
- [ ] External API errors wrapped in domain errors (no raw HTTP status codes exposed)

### Retry Logic
- [ ] Exponential backoff with jitter on all transient failures
- [ ] Maximum retry count defined and bounded (no infinite loops)
- [ ] Non-retryable errors identified and not retried (400s, auth failures)
- [ ] Retry state observable (logged with attempt count)

### Circuit Breakers
- [ ] Circuit breaker on all external service calls (database, APIs, queues)
- [ ] States: Closed → Open → Half-Open with configurable thresholds
- [ ] Fallback behavior defined when circuit is open (cache, degraded response, queue)
- [ ] Circuit state exposed as health metric

### Timeouts
- [ ] Timeout set on every outbound HTTP call (never use default unlimited)
- [ ] Database query timeout configured at connection pool level
- [ ] Request-level timeout enforced at API gateway or middleware
- [ ] Timeout values documented and environment-configurable

### Graceful Degradation
- [ ] Core path vs. enhancement path identified
- [ ] Non-critical services fail silently (analytics, enrichment) — core path unaffected
- [ ] Graceful shutdown: drain in-flight requests before stopping (SIGTERM handler)
- [ ] Health endpoint returns degraded status (not 500) when non-critical dependency fails

---

## Patterns

### Exponential Backoff with Jitter
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 100
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts || !isRetryable(err)) throw err;
      const delay = baseDelayMs * 2 ** (attempt - 1) + Math.random() * 100;
      await sleep(delay);
    }
  }
  throw new Error('unreachable');
}
```

### Graceful Shutdown
```typescript
process.on('SIGTERM', async () => {
  server.close(() => {
    logger.info('HTTP server closed');
    db.end(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 30_000); // force exit after 30s
});
```

---

## Common Gaps
- Retry on 429 without respecting `Retry-After` header
- Circuit breaker never tested in failure mode
- Timeout on HTTP client but not on database queries
- Graceful shutdown missing → in-flight requests killed on deploy
