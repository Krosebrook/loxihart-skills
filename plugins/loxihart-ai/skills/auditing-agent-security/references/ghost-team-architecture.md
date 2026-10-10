# Secure Ghost Team Architecture

> A ghost team running on bad architecture isn't a business asset. It's a 24/7 liability with root access.

---

## What a Ghost Team Actually Is

A "ghost team" is a serverless org chart: autonomous agents spin up for a defined job, execute it, and shut down. Each agent is a discrete function with a specific scope, not a general-purpose AI with broad access.

The failure mode most teams hit: they deploy one powerful agent with wide permissions instead of multiple narrow agents with minimal permissions. That's not a ghost team — that's a single point of failure with god-mode access.

**The rule:** One agent, one job, one permission scope.

---

## The Principle of Agent Separation

Model your ghost team the same way you model microservices: each agent should be independently deployable, independently auditable, and independently decommissionable.

**The three-tier agent separation model:**

```
Tier 1: Observe-Only Agents
  - Read-only permissions
  - No write, no send, no execute
  - Examples: research agents, monitoring agents, data aggregators
  - Risk: LOW — can be poisoned via context, but can't act on it

Tier 2: Assisted Agents
  - Limited write permissions
  - Human-in-the-loop gate on all outputs before they leave the system
  - Examples: draft-generation agents, content agents, summarizers
  - Risk: MEDIUM — can produce harmful content, but human reviews before action

Tier 3: Autonomous Agents
  - Full action permissions (send, modify, execute)
  - Reserved for high-trust, well-audited workflows only
  - Require: narrow scope, explicit permission ceiling, audit logging, automated anomaly detection
  - Examples: auto-responder agents, code deployment agents, payment processing agents
  - Risk: HIGH — these are your primary attack surface
```

**Key design principle:** Tier 3 agents should be rare. Most of your ghost team should be Tier 1 and Tier 2. Automate the execution layer only after the observe-and-draft layer is trusted and stable.

---

## Secure Ghost Team Design Patterns

### Pattern 1: The Read-Write Split

Never give a single agent both read and write access on the same high-value resource.

**Bad:**
```
EmailAgent
  - Reads inbox
  - Drafts replies
  - Sends replies
```

**Good:**
```
EmailReaderAgent (Tier 1)
  - Reads inbox
  - Passes structured summary to orchestrator

EmailDrafterAgent (Tier 2)
  - Receives structured summary
  - Drafts reply
  - Outputs draft to human review queue

[Human approves]

EmailSenderAgent (Tier 3)
  - Receives approved draft
  - Sends reply
  - Logs action
```

The attack vector in the bad pattern: a poisoned email tricks the EmailAgent into sending malicious content at scale. In the good pattern: the poisoned content can only affect the draft, which a human reviews before any send occurs.

---

### Pattern 2: The Human Gate

Every Tier 3 action that crosses a trust boundary (sends to external recipients, modifies production data, executes code, processes payments) requires a human confirmation checkpoint.

**Implementation options (in order of security):**
1. Explicit approval UI: human sees the proposed action and clicks approve/reject
2. Async approval queue: action queued, human reviews within defined SLA, auto-expires if not approved
3. Notification-only: human receives alert after action, can reverse within a window
4. Anomaly-only gate: action proceeds unless it triggers a risk threshold

Use option 1 or 2 for any action with financial, legal, or reputational consequences. Options 3 and 4 are for lower-stakes, high-volume workflows where full approval isn't operationally viable.

---

### Pattern 3: The Scope Ceiling

Every agent should have an explicit ceiling on what it can do — defined in the infrastructure, not just in the prompt.

**What "ceiling" means in practice:**
- Email agent: can only send from a designated mailbox, not from the primary business account
- Payment agent: hard spend cap enforced at the Stripe/payment processor level, not just in the system prompt
- Code agent: can only deploy to staging, not production, unless manually escalated
- Database agent: has a dedicated read-replica connection, not a connection to the primary write database

**Why this matters:** Prompt-level restrictions can be overridden by injection. Infrastructure-level restrictions cannot. Build your ceilings in the infrastructure.

---

### Pattern 4: The Audit Trail

Every Tier 3 action should be logged with enough context to reconstruct exactly what happened.

**Minimum audit log entry:**
```json
{
  "timestamp": "ISO8601",
  "agent_id": "unique agent identifier",
  "action_type": "SEND | MODIFY | DELETE | EXECUTE | SPEND",
  "action_scope": "what resource was affected",
  "context_summary": "what triggered this action (truncated, no PII)",
  "permission_used": "which permission tier was invoked",
  "human_approval": "approved | auto | N/A",
  "outcome": "success | failure | partial",
  "anomaly_flag": "true | false"
}
```

Store logs in a write-once, read-many store. Agents should never have permission to modify or delete their own audit logs.

---

### Pattern 5: The Degrade-Gracefully Contract

Every agent should have a defined failure mode that doesn't make the situation worse.

**Failure mode design:**
- On ambiguous input: ask for clarification, don't guess and act
- On permission denied: log and alert, don't retry with escalated permissions
- On unexpected output from a sub-agent: quarantine and alert, don't pass downstream
- On context window anomaly: halt and log, don't continue with potentially poisoned reasoning

The default failure behavior for any Tier 3 agent: do nothing and alert a human. "Stop and ask" is always safer than "guess and act."

---

## Ghost Team Org Chart Template

For a one-person ambient business, this is a reasonable starting architecture:

```
ORCHESTRATOR (Tier 2, human-reviewed outputs)
├── Research Agent (Tier 1: web search, doc reading, data aggregation)
├── Content Agent (Tier 2: drafts posts, newsletters, responses)
├── Support Agent (Tier 2: drafts ticket responses, human approves before send)
├── Analytics Agent (Tier 1: reads PostHog/analytics, generates reports)
└── Operations Agent (Tier 3, tightly scoped)
    ├── Can: send approved content, update CRM records, trigger webhooks
    ├── Cannot: delete records, access financials, deploy code
    └── Hard ceiling: no spend permissions, no production database access
```

Add a Tier 3 deployment/payment agent only when:
1. The workflow is well-understood and stable
2. You have infrastructure-level ceilings in place
3. You have an audit trail and anomaly detection running
4. You've run it in Tier 2 (human-reviewed) mode for at least 30 days without incident

---

## CLAIMS
- [GENERATED] The read-write split pattern eliminates the most common injection-to-action exploit path in autonomous email and content workflows.
- [GENERATED] Prompt-level permission restrictions are insufficient for Tier 3 agents — infrastructure-level ceilings are required.

## COUNTEREXAMPLE
- The human gate pattern reduces the "ambient business" value proposition significantly for high-volume workflows — 100 daily support ticket responses can't realistically go through human review. The pattern applies most cleanly to low-volume, high-stakes actions, not high-volume, low-stakes ones.
