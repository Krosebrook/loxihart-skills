# Output Templates

Three templates for agent security deliverables. Use the right one for your audience and context.

| Template | Audience | Format | When to Use |
|----------|----------|--------|-------------|
| Audit Report | Yourself / internal | Structured log | After any cleanse or audit |
| Client Brief | Non-technical stakeholders | Plain language | After auditing a client's stack |
| Teaching One-Pager | Workshop attendees / async | Reference card | After a teaching session |

---

## Template 1: Audit Report

**For:** Your own records, internal documentation, quarterly cleanse output.

```
AGENT SECURITY AUDIT REPORT
============================
Date: [YYYY-MM-DD]
Auditor: [Name]
Environment: [Solo / Small Team / Enterprise]
Cleanse Type: [Quarterly / Monthly / Event-Driven / Incident Response]
Agents in Scope: [count]

AGENTS REVIEWED
---------------
1. [Agent Name] — [Purpose] — [Status: Active / Dormant / Decommissioned]
2. [Agent Name] — [Purpose] — [Status]
3. [Agent Name] — [Purpose] — [Status]

PERMISSION CHANGES
------------------
Revoked:
- [Agent Name] > [Tier: Access/Memory/Action/Sharing] > [Permission revoked]
  Reason: [why revoked]

Retained (with justification):
- [Agent Name] > [Tier] > [Permission retained]
  Reason: [why still needed and when to re-evaluate]

BLAST RADIUS LOG (Action-Tier Agents)
--------------------------------------
- [Agent Name]: Max damage if compromised = [description]
  Checkpoint in place: [YES / NO]
  If NO: remediation plan = [plan]

RISK FINDINGS
-------------
🔴 High Priority (immediate action required):
- [Finding] — Recommended action: [action] — Owner: [person] — By: [date]

🟡 Medium Priority (address within 30 days):
- [Finding] — Recommended action: [action] — Owner: [person] — By: [date]

🟢 Low Priority (address next quarter):
- [Finding] — Recommended action: [action]

DECOMMISSIONS
-------------
- [Agent Name] decommissioned [date]
  Reason: [dormant / task complete / replaced / security finding]
  Permissions revoked before deletion: [YES / NO]
  If NO: outstanding permissions = [list]

OUTSTANDING RISKS
-----------------
[Items that couldn't be remediated this cycle]
- [Risk]: [Why it couldn't be addressed] — Target date: [date]

SCORING SUMMARY
---------------
| Agent | Access | Memory | Action | Sharing | Overall |
|-------|--------|--------|--------|---------|---------|
| | 🟢/🟡/🔴 | 🟢/🟡/🔴 | 🟢/🟡/🔴 | 🟢/🟡/🔴 | |

NEXT CLEANSE DATE
-----------------
[Date — 90 days / 30 days / event-triggered]

SIGN-OFF
--------
Reviewed by: [Name] on [Date]
```

---

## Template 2: Client Brief

**For:** Non-technical stakeholders, clients, executive summaries.
Keep language plain. No jargon. Focus on business risk and business action.

```
AGENT SECURITY BRIEF
====================
Prepared for: [Client / Stakeholder Name]
Date: [YYYY-MM-DD]
Prepared by: [Your Name]
Scope: [Which agents or systems were reviewed]

ONE-LINE SUMMARY
----------------
[X] AI agents were reviewed on [date]. [X] issues were found.
[X] require action this week. [X] require action within 30 days.

WHAT WE REVIEWED
----------------
We checked four things for each AI agent running in your business:
1. What information can it access?
2. What does it remember between uses?
3. What actions can it take? (send, spend, delete, modify)
4. What outside services can it connect to?

KEY FINDINGS
------------
✅ Working well:
- [Positive finding in plain language]
- [Positive finding]

⚠️ Needs attention within 30 days:
- Issue: [Plain-language description — what's the risk in business terms]
  What it means: [e.g., "An unused agent still has access to your payment account"]
  What to do: [Simple action]
  Who handles it: [Person / team]

🔴 Action required this week:
- Issue: [Plain-language description]
  What it means: [Business risk, not technical explanation]
  What to do: [Specific action]
  Who handles it: [Person] — By: [Date]

WHAT THIS PROTECTS YOU FROM
---------------------------
By addressing these findings, you reduce the risk of:
- [Business-language risk 1, e.g., "An attacker sending phishing emails from your real email address"]
- [Business-language risk 2, e.g., "Unauthorized charges made by a compromised agent"]
- [Business-language risk 3]

NEXT STEPS
----------
1. [Specific action] — Owner: [Person] — By: [Date]
2. [Specific action] — Owner: [Person] — By: [Date]
3. [Specific action] — Owner: [Person] — By: [Date]

Next review: [Date]
Questions: [Contact info]
```

---

## Template 3: Teaching One-Pager

**For:** Workshop attendees, async sharing, email follow-up after a teaching session.
Designed to be the thing someone keeps. One page. No dependencies.

```
AGENT SECURITY: WHAT EVERY FOUNDER NEEDS TO KNOW
=================================================
[Your Name] | [Date] | [Contact / Website]

THE SHIFT IN ONE SENTENCE
--------------------------
Phishing tricked humans into clicking links.
Agent injection tricks AI into executing commands — at machine speed, 24/7.

THE FOUR RISK TIERS (The Permission Stack)
-------------------------------------------
Every AI agent you deploy operates across four tiers of risk:

TIER       RISK LEVEL    WHAT IT CONTROLS
─────────────────────────────────────────────────────────
Access     Low–Medium    What the agent can read
Memory     Medium        What it remembers between sessions
Action     HIGH          What it can write, send, delete, spend
Sharing    High          What external services it connects to

Rule: If you haven't explicitly scoped each tier, assume it's too broad.

THE 6 THREATS (Quick Reference)
---------------------------------
1. Prompt Injection
   Attacker hides commands inside your agent's inputs.

2. Poisoned Context Window
   Agent reads malicious instructions embedded in web content or documents.

3. Malicious MCP Services
   Unvetted third-party connectors intercept your agent's data.

4. Agent-to-Agent Manipulation
   Compromised sub-agents corrupt the orchestrator that hired them.

5. Permission Escalation
   Agent does more than it was authorized to do using its valid permissions.

6. Compromised Training Data
   Vulnerability baked into the model before deployment. No runtime fix.

THE 3 DEFENSES (Minimum Viable Security)
-----------------------------------------
① SEPARATE READERS FROM DOERS
   Agents that read the web or external data ≠ agents that can
   send email, spend money, or modify files. Never combine these.

② QUARTERLY CLEANSE
   Every 90 days: decommission dormant agents, revoke unused permissions,
   disconnect MCP bridges that aren't actively needed.
   Rule: Dormant agents are the highest-risk category.

③ HUMAN CHECKPOINT FOR IRREVERSIBLE ACTIONS
   Before any agent deletes, sends externally, or spends:
   a human confirms. Non-negotiable. Build it in before you need it.

THE BLAST RADIUS TEST
-----------------------
Before deploying any agent, answer this:
"If this agent is compromised right now, what is the maximum damage it can cause?"

If you can't answer clearly → you're not ready to deploy.
If the answer is "it could drain my bank account" → redesign before shipping.

QUICK AUDIT CHECKLIST
-----------------------
□ Every agent's permissions reviewed in the last 90 days
□ No dormant agents (unused 30+ days) with live permissions
□ MCP bridges audited and disconnected if not actively needed
□ Human checkpoint in place for delete, send, spend actions
□ Blast radius documented for every Action-tier agent
□ Readers and doers separated architecturally

───────────────────────────────────────────────────────────────
This framework was developed from the Agent Security Audit skill.
For full threat taxonomy, audit templates, and teaching scenarios:
[Your reference link or contact]
```
