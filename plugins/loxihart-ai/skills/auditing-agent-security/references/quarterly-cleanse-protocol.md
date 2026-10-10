# Quarterly Agent Permission Cleanse

Run this every 90 days minimum.
High-velocity teams or rapid deployment environments: every 30 days.
After any new agent deployment: event-driven checklist (Phases 1–4 only, scoped to new agent).

Estimated time: 80 minutes for a small stack (under 10 agents). Scale up by ~10 minutes per additional 5 agents.

---

## Pre-Cleanse: Inventory (10 minutes)

Before auditing permissions, you need a complete picture of what's running.

**Step 1 — List every active agent:**

| Agent Name | Purpose | Deployed Date | Last Active | Owner |
|------------|---------|---------------|-------------|-------|
| | | | | |

**Step 2 — Identify dormant agents:**
Any agent not used in 30+ days is a candidate for immediate decommission.

> Dormant agents are the highest-risk category. They carry permissions nobody is actively monitoring and represent a static, unattended attack surface.

**Step 3 — Flag one-time agents:**
Any agent originally deployed for a time-bounded task (a specific campaign, project, or analysis) should be flagged for decommission regardless of recency.

---

## Phase 1: Access Tier Cleanse (15 minutes)

- [ ] Review each agent's read permissions against its current active task
- [ ] Revoke read access to any resource the agent no longer uses
- [ ] Check for credential, API key, or .env file exposure in any agent's accessible scope
- [ ] Verify no agent has read access to other agents' configuration files
- [ ] Confirm multi-tenant read access is properly isolated (no cross-user data bleed)

**Output:** List of revoked Access permissions with date and reason

---

## Phase 2: Memory Tier Cleanse (15 minutes)

- [ ] Audit what each agent retains in persistent memory
- [ ] Clear any memory containing PII beyond its stated retention period
- [ ] Verify memory is not shared across user sessions in multi-tenant environments
- [ ] Check whether any memory is being transmitted to third-party LLM APIs
- [ ] Confirm or set TTL for all agent memory stores
- [ ] Verify memory can be audited and cleared on demand

**Output:** Memory audit log — what was cleared, what was retained and why

---

## Phase 3: Action Tier Cleanse (25 minutes) ← Highest Priority

- [ ] List every agent with write, delete, send, or spend permissions
- [ ] For each: is this permission still required for the current task?
- [ ] Revoke financial access for agents no longer handling transactions
- [ ] Verify human-in-the-loop checkpoints are in place for all irreversible actions
- [ ] Confirm "modify production code" access is still justified — if not, revoke immediately
- [ ] Check rate limits on email/message-send agents — are they still appropriate?
- [ ] Run the Blast Radius Test for every agent in this tier: "If this agent is compromised today, what is the maximum damage it can cause?"
- [ ] Document the blast radius answer for every agent with Action permissions

**Output:** Action permission change log — what was revoked, what was retained, what checkpoints exist, blast radius per agent

---

## Phase 4: Sharing Tier Cleanse (20 minutes)

- [ ] List all active MCP bridges and third-party API integrations
- [ ] For each integration: verify the vendor/source is still trusted and has not changed data handling policies
- [ ] Disconnect any MCP bridge used for a one-time task that wasn't revoked at completion
- [ ] Review agent-to-agent delegation chains — are all agents in the chain still vetted?
- [ ] Verify outbound logging is active and being reviewed for all external connections
- [ ] Check for any new integrations added since last cleanse without going through the pre-flight security checklist
- [ ] Confirm schema validation is in place for all agent-to-agent outputs

**Output:** Integration audit log — what was disconnected, what was retained, new integrations reviewed

---

## Phase 5: Decommission Dormant Agents (10 minutes)

For each dormant agent (not used in 30+ days) or one-time agent:

- [ ] Confirm with owner before decommissioning (if team environment)
- [ ] Revoke all permissions first — then delete the agent config
- [ ] Archive the agent's permission history for audit trail
- [ ] Document: agent name, decommission date, reason, permissions that were active at time of decommission

> The order matters: revoke first, delete second. Deleting config without revoking permissions leaves orphaned access that may still be exploitable.

---

## Post-Cleanse: Audit Report

File the completed Audit Report (see output-templates.md) with:
- [ ] Date of cleanse
- [ ] Agents reviewed (count and names)
- [ ] Permissions revoked (tier breakdown)
- [ ] Dormant agents decommissioned
- [ ] Outstanding risks (items that couldn't be remediated this cycle)
- [ ] Next cleanse date

---

## Cleanse Frequency Guide

| Environment | Recommended Cadence |
|-------------|-------------------|
| Solo / ambient business (under 5 agents) | Quarterly |
| Small team (2–5 people, under 10 agents) | Monthly |
| Rapid deployment / frequent new agents | Event-driven after each deployment + quarterly full cleanse |
| Enterprise / multi-tenant | Monthly + after any security incident |
| High-risk verticals (financial, legal, healthcare) | Monthly mandatory; event-driven after any incident |

---

## Event-Driven Triggers

Run the cleanse (or the relevant phase) immediately after any of these:
- A new agent or MCP connector is deployed to production
- An agent is used for a task it wasn't originally scoped for
- A third-party service you connect to reports a data breach
- An agent produces unexpected output (potential injection signal)
- A team member with agent access leaves the organization
- You significantly expand an agent's task scope
