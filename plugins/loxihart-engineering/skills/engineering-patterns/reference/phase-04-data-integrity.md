# Phase 04 — Data Integrity

## Scope
Transaction management, idempotency, schema validation, optimistic locking, and audit trails. Data corruption is the hardest class of bug to recover from.

---

## Checklist

### Transactions
- [ ] All multi-step writes in a single database transaction
- [ ] Transaction isolation level documented and appropriate for use case
- [ ] Deadlock detection and retry logic in place
- [ ] Long-running transactions avoided (< 5s rule of thumb)
- [ ] Transactions not held open during network calls

### Idempotency
- [ ] Idempotency key on all POST/PUT endpoints that trigger side effects
- [ ] Idempotency key stored and checked before processing (deduplication)
- [ ] Webhook endpoints idempotent (Stripe, GitHub, etc.)
- [ ] Job queue deduplication enabled (Bull, Inngest, etc.)

### Schema Validation
- [ ] All inputs validated at API boundary (Zod, Joi, or equivalent)
- [ ] Database schema has NOT NULL constraints, CHECK constraints, FK constraints
- [ ] Migrations reviewed for: backward compatibility, rollback safety, index creation without lock
- [ ] Soft deletes where hard deletes would cause FK violations
- [ ] Enum columns validated at application layer, not just DB

### Optimistic Locking
- [ ] `updated_at` or `version` column used for concurrency conflict detection
- [ ] Conflict response is 409 Conflict with clear message
- [ ] Client-side retry strategy for conflicts documented

### Audit Trail
- [ ] `created_at`, `updated_at` on every table (auto-set via trigger or ORM)
- [ ] `created_by`, `updated_by` tracked for user-owned records
- [ ] Sensitive field changes logged to immutable audit log
- [ ] Audit log protected from deletion (append-only, separate store)
- [ ] PII excluded from audit log or encrypted at field level

### Data Migration Safety
- [ ] Migrations are backward compatible (don't break old code)
- [ ] Column additions are nullable before data backfill
- [ ] Index creation uses `CREATE INDEX CONCURRENTLY` (Postgres)
- [ ] Large table migrations batched (not single UPDATE affecting millions of rows)
- [ ] Rollback plan documented for every migration

---

## Patterns

### Idempotency Key Check
```typescript
async function processPayment(idempotencyKey: string, payload: PaymentPayload) {
  const existing = await db.idempotencyKeys.findUnique({ where: { key: idempotencyKey } });
  if (existing) return existing.result; // replay cached response

  const result = await db.$transaction(async (tx) => {
    const payment = await tx.payments.create({ data: payload });
    await tx.idempotencyKeys.create({ data: { key: idempotencyKey, result: payment } });
    return payment;
  });
  return result;
}
```

---

## Common Gaps
- Webhook endpoints process the same event twice (no idempotency check)
- `ALTER TABLE ADD COLUMN NOT NULL` on large table → table lock
- Audit log stored in same DB → can be deleted with application data
- Optimistic locking checked at app layer but not enforced at DB layer
