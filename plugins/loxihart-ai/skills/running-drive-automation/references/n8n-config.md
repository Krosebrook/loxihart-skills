# Chain 1 — n8n Configuration & Triggers

**Current status: n8n MCP = CONNECTION_ISSUE.** Chain 1's automatic MCP
trigger and MCP-based execution monitoring are unavailable. Everything below
reflects operating in that state.

## Instance

- n8n Cloud: `https://krosebrook.app.n8n.cloud`
- Workflow: **"Drive Router Chain 1"** — classifies + routes incoming Drive files

## Trigger paths (in preference order)

1. **Direct webhook (still operational):**
   ```bash
   curl -X POST "$CHAIN1_WEBHOOK_URL" -H "Content-Type: application/json" -d '{}'
   ```
   `CHAIN1_WEBHOOK_URL` comes from the environment — never hardcode or print
   the full URL into logs or chat.
2. **Manual UI trigger:** n8n Cloud → Workflows → "Drive Router Chain 1" →
   Execute workflow (top-right lightning bolt). Monitor in the Executions tab.

## Verifying a run (MCP monitoring unavailable)

```sql
SELECT * FROM file_audit ORDER BY created_at DESC LIMIT 20;
```
New rows timestamped after your trigger = the run executed. No new rows →
check the Executions tab for the error before re-triggering.

## MCP recovery check

Periodically test whether the MCP is back: attempt one listing call; on
success, update this skill's DEGRADED MODE table and frontmatter status.
Until then the FAIL_IF block in SKILL.md governs — no MCP calls to Chain 1,
no simulated results.
