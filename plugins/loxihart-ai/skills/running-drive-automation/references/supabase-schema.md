# Supabase Audit Schema — Verify-First Reference

Two tables back the drive automation audit trail:

| Table | Written by | Purpose |
|---|---|---|
| `file_audit` | Chain 1 (router) + drift checks | One row per routing/classification action |
| `council_memos` | Chain 2 (agent council) | One row per crew memo, per file evaluation |

Both are **append-only history** — corrections are new rows, never updates.

## Column truth comes from the database, not this file

Schemas drift; a doc that asserts columns goes stale silently. Enumerate live:

```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('file_audit', 'council_memos')
ORDER BY table_name, ordinal_position;
```

Known-sourced facts (from operating procedure): both tables carry a
`created_at` timestamp used for recency ordering. Everything else — verify
before writing queries that assume it.

## Standard checks

```sql
-- Did the last Chain 1 run land?
SELECT * FROM file_audit ORDER BY created_at DESC LIMIT 20;

-- Latest council output
SELECT * FROM council_memos ORDER BY created_at DESC LIMIT 10;

-- Volume by day (last week)
SELECT date_trunc('day', created_at) AS d, count(*)
FROM file_audit
WHERE created_at > now() - interval '7 days'
GROUP BY 1 ORDER BY 1 DESC;
```

## Rules

- Supabase MCP and direct SQL are both operational — either path is fine
- Never DELETE from audit tables; archival is a copy-out, not a purge
- Any schema change (new column, new table) gets reflected here **and** in
  the smoke tests in the same change
