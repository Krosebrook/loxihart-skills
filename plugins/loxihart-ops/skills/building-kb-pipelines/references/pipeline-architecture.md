# Pipeline Architecture

Stage-by-stage design of the Zero-Admin KB Generation pipeline. Loaded when the
task is about how the pipeline works, the stages, or the router gate.

## Stage diagram

```
ITSM webhook (ticket.resolved)
      │
      ▼
[1] Router / quality gate ──► reject ──► (no article; log reason)
      │ pass
      ▼
[2] PII Redaction (Phase 0)
      │
      ▼
[3] LLM Generation (5-section article)
      │
      ▼
[4] Validator ──► incomplete ──► KB GAP queue
      │ valid
      ▼
[5] ITSM API POST (status: draft) ──► human review ──► publish
```

## Stage detail

| # | Stage | Responsibility | Failure path |
|---|---|---|---|
| 1 | Router | Decide if a resolved ticket is article-worthy | Reject → log reason, no article |
| 2 | PII Redaction | Strip sensitive fields before any model sees the text | Hard stop if redaction fails — never generate on raw PII |
| 3 | Generation | Produce a 5-section draft from ticket thread | Retry once, then route to GAP queue |
| 4 | Validator | Enforce the 5-section schema and quality rules | Incomplete → KB GAP queue |
| 5 | Publish | POST to ITSM KB as **Draft** | Surface API errors to ops; never silent-fail |

## Router include / exclude criteria

The router is the first quality gate. Default starting criteria — tune per client:

**Include when:**
- Ticket resolved with a real fix (not "user error / no action").
- Resolution is reproducible and generalizable (would help the next person).
- Ticket type is in the client's article-worthy list (from intake).

**Exclude when:**
- One-off / account-specific with no reusable resolution.
- Resolution is "duplicate", "no response", or "won't fix".
- Already covered by an existing fresh KB article (dedupe check).
- Contains unredactable sensitive content.

`[FILL: client-specific router scoring thresholds — e.g., minimum resolution-note length, confidence cutoff, allowed ticket categories]`

## Notes

- The router prevents KB sprawl; over-permissive routing floods the Draft queue and kills reviewer trust.
- Dedupe at the router (cheap) and again at the validator (catches near-duplicates).
- `[FILL: dedupe method — exact-match, embedding similarity threshold, or title heuristic]`
