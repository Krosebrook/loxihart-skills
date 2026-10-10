# CLAIMS_FOOTER.md — Copy-Paste Template

Use this block at the end of every phase deliverable.
Replace the placeholder text with real claims from the deliverable.

---

## Standard Format

```
CLAIMS:
  1. [Factual assertion made in this deliverable]
  2. [Factual assertion made in this deliverable]
  3. [Factual assertion made in this deliverable]

COUNTEREXAMPLE:
  1. [Where claim 1 could be wrong, incomplete, or context-dependent]
  2. [Where claim 2 could be wrong, incomplete, or context-dependent]
  3. [Where claim 3 could be wrong, incomplete, or context-dependent]

CONTRADICTIONS:
  ! [Internal conflict between this deliverable and another — or "none found"]
  ! [Internal conflict between this deliverable and a locked default]
```

---

## Example (completed)

```
CLAIMS:
  1. LangGraph's checkpointer supports Postgres-backed persistence.
  2. pgvector inside Supabase is sufficient for semantic memory at v1.9.9 scale.
  3. The RLS pattern using auth.jwt()->>'tenant_id' correctly isolates tenant data.

COUNTEREXAMPLE:
  1. [UNVERIFIED] — LangGraph checkpointer Postgres support should be confirmed
     against the current release notes. SQLite is documented; Postgres is common
     but may require the langgraph-checkpoint-postgres package.
  2. At high embedding volume (1M+), pgvector latency may degrade. This is an
     accepted v1.9.9 trade-off. Re-evaluate at scale milestone.
  3. If auth.jwt() returns null (unauthenticated request reaches a policy),
     the comparison fails silently rather than throwing. Confirm RLS behavior
     on null JWT with Supabase docs.

CONTRADICTIONS:
  ! None found in this deliverable.
```

---

## Pipeline-Level Footer (Phase 4 only)

```
PIPELINE_CLAIMS:
  1. [Top claim about the overall v1.9.9 build readiness]
  2. [Top claim about security posture]
  3. [Top claim about cost control]

PIPELINE_COUNTEREXAMPLES:
  1. [Where pipeline claim 1 could fail in production]
  2. [Where pipeline claim 2 could fail in production]
  3. [Where pipeline claim 3 could fail in production]

PIPELINE_CONTRADICTIONS:
  ! [Unresolved contradiction across phases — or "none"]
```
