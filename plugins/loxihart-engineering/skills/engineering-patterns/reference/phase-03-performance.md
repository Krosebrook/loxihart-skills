# Phase 03 — Performance

## Scope
Caching strategies, query optimization, bundle size, profiling approach, and latency budgets. Performance is measured, not assumed.

---

## Checklist

### Latency Budget
- [ ] P50/P95/P99 targets defined per endpoint
- [ ] Slow query threshold defined (e.g., > 100ms logged as warning)
- [ ] End-to-end latency measured at API gateway, not just service
- [ ] Latency SLO tracked in dashboards

### Caching Strategy
- [ ] Cache layers identified: L1 (in-memory), L2 (Redis), L3 (CDN)
- [ ] Cache key strategy: deterministic, includes version/tenant
- [ ] TTL set on all cache entries — no eternal cache
- [ ] Cache invalidation strategy documented (TTL vs. event-based)
- [ ] Cache stampede prevention (probabilistic early expiration or lock)

### Database Performance
- [ ] EXPLAIN ANALYZE run on all queries returning > 1000 rows
- [ ] Indexes on all foreign keys and frequent filter columns
- [ ] N+1 queries eliminated (use dataloader or JOIN)
- [ ] Pagination on all list endpoints (no unbounded result sets)
- [ ] Read replicas used for analytics / reporting queries
- [ ] Connection pool sized correctly (not default 10)

### API Performance
- [ ] Response compression enabled (gzip/brotli)
- [ ] Unnecessary data stripped from responses (select only needed fields)
- [ ] Streaming for large responses (don't buffer 100MB in memory)
- [ ] HTTP/2 or HTTP/3 where applicable

### Frontend Performance (if applicable)
- [ ] Bundle analyzed (`next/bundle-analyzer` or `vite-bundle-visualizer`)
- [ ] Code splitting by route
- [ ] Images: WebP format, lazy loading, responsive srcset
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Critical CSS inlined, non-critical deferred

### Profiling
- [ ] Profiling tool identified (clinic.js, py-spy, async-profiler)
- [ ] Profiling runbook documented — how to profile in production safely
- [ ] Flamegraph baseline captured for hot paths

---

## Patterns

### Cache with Stampede Prevention
```typescript
async function getWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    // Early recompute: refresh if within 10% of TTL expiry
    const ttlRemaining = await redis.ttl(key);
    if (ttlRemaining < ttlSeconds * 0.1) {
      fetcher().then(v => redis.setex(key, ttlSeconds, JSON.stringify(v)));
    }
    return JSON.parse(cached);
  }
  const value = await fetcher();
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
  return value;
}
```

---

## Common Gaps
- Cache hit rate never measured → cache may be ineffective
- N+1 queries in ORM (Prisma includes vs. select pattern)
- Connection pool exhaustion under load (default pool too small)
- Bundle size regression not caught in CI
