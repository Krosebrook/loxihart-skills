# Permission Stack Audit

The four-tier model for mapping and scoring agent permissions. Run this for every active agent in scope.

---

## The Four Tiers

```
RISK LEVEL: Low ──────────────────────────────────────────────► Critical
│
├─ TIER 1: ACCESS (Low–Medium Risk)
│   What the agent can read
│
├─ TIER 2: MEMORY (Medium Risk)
│   What the agent retains between sessions
│
├─ TIER 3: ACTION (High–Critical Risk) ← Most attacks target here
│   What the agent can write, send, modify, delete, or spend
│
└─ TIER 4: SHARING (High Risk)
    What external agents or services it can communicate with
```

---

## Tier 1: ACCESS — What Can It Read?

**Audit questions:**
- What files, folders, or databases can this agent read?
- Can it access emails, calendars, or communications it doesn't need for its task?
- Does it have access to credentials, API keys, or configuration files?
- Is read access scoped to task-specific resources or broad (e.g., "all files")?
- Can it read data belonging to multiple users or tenants?

**Red flags:**
- Read access to credential stores or .env files
- Access to production databases when only dev/staging is needed
- Calendar or email read access for agents that don't do scheduling or communication tasks
- "All files" or "all folders" scope when task requires only 1–2 specific sources
- Multi-tenant read access without isolation

**Scoring:**
- 🟢 Green: Access scoped exactly to the resources needed for the task
- 🟡 Yellow: Access slightly broader than needed but no sensitive resources exposed
- 🔴 Red: Access to credentials, PII, financial data, or communications beyond task scope

---

## Tier 2: MEMORY — What Does It Retain?

**Audit questions:**
- Does this agent persist memory between sessions?
- What data is stored in agent memory? (Conversations, decisions, user data?)
- Is memory isolated per user and session, or shared across contexts?
- Does memory get shared with third-party LLM providers or API calls?
- When is memory cleared? Is there a TTL (time-to-live)?
- Can a user or admin audit and clear agent memory on demand?

**Red flags:**
- PII stored in agent memory with no TTL
- Memory shared across multiple users (multi-tenant contamination risk)
- Sensitive business data transmitted to third-party LLMs via memory injection
- No mechanism to inspect or clear agent memory
- Memory persisting after a one-time task is complete

**Scoring:**
- 🟢 Green: Memory scoped to session, TTL defined, no PII retained, auditable on demand
- 🟡 Yellow: Memory persists but isolated per user and auditable
- 🔴 Red: Memory contains PII, shared across users, or transmitted to unvetted third parties

---

## Tier 3: ACTION — What Can It Do?

**This is the critical tier. Most injection and escalation attacks target Action permissions.**

**Audit questions:**
- Can this agent send emails or messages on your behalf?
- Can it modify, delete, or create files in production systems?
- Does it have write access to databases?
- Can it make purchases, initiate transfers, or interact with financial systems?
- Can it modify code in active or production repositories?
- Are irreversible actions (delete, send, spend) gated behind a human checkpoint?
- Is there rate limiting on any send or spend actions?
- What is the maximum blast radius if this agent is compromised?

**Red flags — any of these requires immediate remediation:**
- Financial account access (spend, transfer, pay) with no human checkpoint
- Production database write access without confirmation workflow
- Email send access with no rate limiting or approval gate
- Code modification access to production repositories
- Delete permissions on any data store without reversibility or backup
- Any combination of financial + broad write + no human checkpoint

**Scoring:**
- 🟢 Green: Read-mostly; write scoped to sandboxed or staging environments; human checkpoint for all irreversible actions
- 🟡 Yellow: Write access to production but scoped to specific resources; no financial access; rate limits in place
- 🔴 Red: Financial access OR broad write access OR delete without checkpoint — any one of these alone is Red

---

## Tier 4: SHARING — Who Can It Talk To?

**Audit questions:**
- What third-party services can this agent connect to via MCP or API?
- Can it hire or delegate to other agents?
- What data does it share with external services?
- Are outbound connections logged and monitored?
- Have all connected MCP services been vetted for security and data handling?
- Is agent-to-agent delegation verified (signed outputs, schema validation)?

**Red flags:**
- MCP bridges to unvetted third-party services
- Agent-to-agent delegation without verification checkpoints
- Outbound data sharing with no logging
- Connected services requesting more permissions than their documentation states
- Unreviewed integrations added during a sprint without going through security checklist

**Scoring:**
- 🟢 Green: Only vetted, open-source or vendor-certified integrations; all outbound logged; delegation chain verified with schema validation
- 🟡 Yellow: Some unvetted integrations but read-only; outbound logged
- 🔴 Red: Unvetted MCP services with write access; delegation to unverified agents; no outbound logging

---

## Scoring Matrix

Use this table to capture the audit result for each agent:

| Agent Name | Purpose | Access | Memory | Action | Sharing | Overall | Priority |
|------------|---------|--------|--------|--------|---------|---------|----------|
| [Agent 1]  |         | 🟢/🟡/🔴 | 🟢/🟡/🔴 | 🟢/🟡/🔴 | 🟢/🟡/🔴 | | |
| [Agent 2]  |         | | | | | | |
| [Agent 3]  |         | | | | | | |

**Priority determination:**
- Any 🔴 in **Action** tier = **High Priority** — immediate remediation required
- Any 🔴 in **Sharing** tier = **High Priority** — disconnect and re-vet
- Any 🔴 in **Access** or **Memory** = **Medium Priority** — address within 30 days
- Multiple 🟡 across any tier = **Medium Priority** — consolidate and scope down
- All 🟢 = **Compliant** — schedule re-audit next quarter

---

## Common Patterns to Watch For

**The Over-Provisioned One-Timer:** Agent deployed for a specific campaign or project with broad permissions. Campaign ended. Permissions never revoked. Now it's a dormant attack surface.

**The "Just In Case" Reader:** Agent given access to the full inbox "just in case it needs to reference old emails." Task only requires reading the last 7 days. Over-scoped by design.

**The Trust Inheritance Problem:** Agent B was hired by Agent A and therefore inherits A's trust level. B has no independent vetting. If B is compromised, A's outputs are now tainted.

**The MCP Drift:** A connector installed for a one-time integration is still active six months later, now connected to a service that has changed its data handling policies.
