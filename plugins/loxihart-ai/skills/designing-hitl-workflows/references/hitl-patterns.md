# HITL Implementation Patterns

Platform-specific implementation patterns split out of SKILL.md under the
500-line rule. Decide checkpoint placement, interface, and timeout behavior
in SKILL.md (Sections 1–3) first, then wire them up with the pattern below
that matches your platform.

---

## n8n Implementation

### The Wait node pattern

n8n's `Wait` node pauses workflow execution until a webhook is called or a
resume condition is met.

**Setup:**
1. Add a `Wait` node after the action-preparation step
2. Configure Resume: On Webhook Call
3. Copy the Resume URL from the Wait node
4. In your notification (Slack/email): include two links
   - `Approve`: GET `{resume_url}?approved=true`
   - `Reject`:  GET `{resume_url}?approved=false`
5. After the Wait node, add an IF node:
   - True branch (approved): execute the action
   - False branch (rejected): send "action cancelled" notification,
     log to Supabase, end

**Timeout configuration:**
- In the Wait node: set "Resume after" as a fallback timer
- Wire the timeout path to a "paused — needs review" notification

### State persistence during wait

The workflow execution is suspended in n8n's database during the wait. This
is safe across worker restarts. Set execution data retention in
Settings → Executions to at least 30 days for HITL workflows (not the
default 24 hours), or long-running approvals will expire.

---

## Claude API Implementation

### Tool-based HITL

Design a `request_approval` tool that the agent calls when it reaches a
checkpoint. The tool call halts execution and surfaces the request to the
human operator.

```python
tools = [
    {
        "name": "request_approval",
        "description": "Request human approval before taking a consequential action. Call this when about to perform any irreversible or high-impact action.",
        "input_schema": {
            "type": "object",
            "properties": {
                "action_description": {"type": "string"},
                "target": {"type": "string"},
                "reasoning": {"type": "string"},
                "reversible": {"type": "boolean"}
            },
            "required": ["action_description", "target", "reasoning"]
        }
    }
]
```

When the agent calls `request_approval`:
1. Stop the agent loop
2. Present the approval request to the human (UI, Slack, email)
3. On approval: inject `{"approved": true}` as the tool result, resume the
   agent loop
4. On rejection: inject `{"approved": false, "reason": "..."}`, let the
   agent handle gracefully

### Instruction in the system prompt

```
When you are about to take a consequential action — sending external
communications, modifying records, publishing content, or deleting
data — you MUST call request_approval first. Never proceed with a
consequential action without an explicit approved: true response.
If the approval is rejected, acknowledge the rejection and stop.
```

### Stop-sequence variant

For loops that aren't tool-driven, set a stop sequence (e.g., a sentinel
like `<AWAIT_APPROVAL>`) the model emits when it reaches a checkpoint.
Detect the stop reason, surface the pending action to the human, and only
continue the completion after an approval is recorded. Tool-based HITL is
preferred when available because it carries structured action metadata;
the stop sequence is the fallback for plain text-completion loops.

---

## Base44 Approval Queue

The FlashFusion Agent Control Center has an approval queue panel built into
the dashboard artifact. For new approval workflows:

1. Write new pending items to the `approval_queue` Supabase table:
   ```sql
   INSERT INTO approval_queue (
     workflow_id, action_type, action_target,
     reasoning, created_at, status
   ) VALUES (...)
   ```
2. The dashboard polls this table and renders each item as an approval card
   with Approve / Reject buttons
3. Button clicks update `status` in Supabase and call the n8n resume webhook
   (n8n section) or the Claude API tool-result endpoint (Claude API section)
4. Completed approvals stay in the table with `status: approved` or
   `status: rejected` for audit trail

---

## Cross-platform notes

- Whichever platform you use, the **default on timeout is pause** — wire the
  fallback/timeout path to a "paused, needs review" state, never to
  auto-approve.
- Persist pending state durably (n8n DB, Supabase row) so a worker restart
  or process crash does not lose or silently auto-resolve an approval.
- Keep one pending action per approval message/card; never batch unrelated
  approvals behind a single button.
