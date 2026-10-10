# Chain 2 — Agent Council Crews

Chain 2 runs 10 CrewAI crews defined in `agent_council.py`, performing deep
per-file evaluation and writing structured memos to the Supabase
`council_memos` table. Chain 2 has **no n8n dependency** — it runs locally
via Python 3.11+ and is unaffected by the n8n MCP CONNECTION_ISSUE.

## Enumerating the live roster (do this — don't trust docs over code)

```bash
grep -n "Crew(\|class .*Crew\|Agent(" agent_council.py | head -40
```

The roster and role prompts in the source are canonical. This reference
describes the architecture; the code defines the crews.

## Architecture

- **Fan-out:** each file in a batch is evaluated independently — this is what
  the asyncio throughput fix parallelizes (see `references/asyncio-fix.md`)
- **Per-file output:** one structured memo row per crew pass, written to
  `council_memos` (see `references/supabase-schema.md` for verification queries)
- **Council pattern:** crews evaluate from distinct perspectives
  (classification, routing fit, retention/archival, drift risk, etc. — exact
  roles per the source enumeration above), and the memo set is the audit
  artifact, not a single merged verdict

## Operating rules

- Never simulate a council run or fabricate memo content — if the run fails,
  report the Python traceback verbatim
- Smoke tests gate production batches; in degraded mode expect exactly one
  FAIL (`Chain 1 webhook reachable`) which does not block Chain 2
- Council memos are append-only history: re-evaluating a file adds rows,
  never rewrites them
