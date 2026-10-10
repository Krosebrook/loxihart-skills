# Phase 08 — Edge Cases

## Scope
Concurrency, race conditions, boundary conditions, clock skew, large payload handling, and failure mode enumeration.

---

## Checklist

### Concurrency & Race Conditions
- [ ] All shared mutable state protected (locks, atomic operations, or eliminated)
- [ ] Database-level locking used where application-level lock is insufficient (SELECT FOR UPDATE)
- [ ] TOCTOU (time-of-check/time-of-use) vulnerabilities analyzed in critical paths
- [ ] Concurrent webhook delivery handled idempotently
- [ ] Rate limiting applied per-user, not per-IP (IP is spoofable)

### Boundary Conditions
- [ ] Empty input: empty string, empty array, zero, null — all handled explicitly
- [ ] Maximum input: max string length enforced, max array size bounded
- [ ] Integer overflow: large IDs, large counts use bigint where needed
- [ ] Off-by-one errors in pagination (cursor vs. offset edge cases)
- [ ] Timezone handling: all datetimes stored as UTC, converted at display layer

### Clock Skew
- [ ] JWT expiry validated with clock skew tolerance (±30s)
- [ ] Distributed cron jobs protected against dual-firing (idempotency key)
- [ ] `Date.now()` not used for ordering across services — use logical clocks or DB timestamps
- [ ] Retry logic does not use wall clock for backoff (use monotonic clock)

### Large Payload Handling
- [ ] Request body size limit configured (default Express limit is 100kb — often wrong)
- [ ] Streaming used for uploads > 10MB
- [ ] DB query result sets bounded (no `SELECT *` on large tables without LIMIT)
- [ ] Response pagination enforced — no endpoint returning unbounded results
- [ ] Memory limits set on lambda/function — large payload doesn't OOM

### Failure Mode Enumeration
- [ ] Failure Mode and Effects Analysis (FMEA) run on critical paths
- [ ] Each external dependency failure modeled: what breaks? what degrades?
- [ ] Partial failure handled: some records succeed, some fail — don't silently drop failures
- [ ] Disk full scenario handled (object storage vs. local disk)
- [ ] DNS failure handled (cached DNS, fallback endpoints)

### Input Edge Cases
- [ ] Unicode input: emoji, RTL text, null bytes, zero-width characters
- [ ] SQL special characters in search inputs (parameterized — not sanitized manually)
- [ ] Concurrent form submission (double-click submit) handled
- [ ] Negative numbers, NaN, Infinity in numeric fields rejected

---

## Common Gaps
- Pagination uses offset → page N is wrong when records are added/deleted between pages
- JWT validated but clock skew not tolerated → flaky auth failures
- Request body limit not set → 50MB JSON body crashes the process
- Concurrent double-click creates duplicate records
- Emoji in database fails on `utf8` column (needs `utf8mb4` / Postgres handles it natively)
