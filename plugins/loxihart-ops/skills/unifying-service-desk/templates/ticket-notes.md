# Template: Ticket Notes

<purpose>
Use this template for every support interaction. Copy the structure below and fill in as you work — not after. Real-time documentation ensures nothing is lost and any tech can pick up the ticket cold.
</purpose>

<template>

## Ticket: [TICKET-ID]
**Created:** [Date/Time]
**Category:** [Audio / Network / Hardware / Imaging / Software / Access / Email / Performance / Security / Onboarding / Print / Mobile]
**Priority:** [P1 / P2 / P3 / P4 / P5]
**Reported by:** [User name / email]
**Assigned to:** [Tech name] — Tier: [L0 / L1 / L2 / L3 / L4]

---

### User-Reported Symptom
> [Verbatim or close paraphrase of what the user said. Include their exact words for error messages.]

### Environment
- **Device:** [Make/model, asset tag if known]
- **OS:** [Windows version and build, e.g., Windows 11 23H2 Build 22631]
- **Domain:** [Domain-joined / Azure AD / Local]
- **Location:** [Office / VPN / Home / Other]
- **Recent changes:** [Updates, new software, hardware swap, reimaging — or "none reported"]

### Impact Assessment
- **Users affected:** [1 / team / department / org-wide]
- **Blocked or degraded:** [Fully blocked — no workaround / Degraded — workaround in use: describe]
- **Business impact:** [Brief statement of what the user cannot do]

---

### Troubleshooting Log

| # | Time | Step / Action | Result | Tier |
|---|------|---------------|--------|------|
| 1 | [HH:MM] | [What was done] | [What happened — include error codes] | [L0/L1/L2/L3] |
| 2 | [HH:MM] | [What was done] | [What happened] | [L0/L1/L2/L3] |
| 3 | [HH:MM] | [What was done] | [What happened] | [L0/L1/L2/L3] |

*Add rows as needed. Every action gets a row — even actions that had no effect.*

### Scripts Executed

| Script | Execution Time | Output Summary | Result |
|--------|---------------|----------------|--------|
| [script-name.ps1] | [HH:MM] | [Key output lines or "completed successfully"] | [Resolved / No change / New error] |

*Only if scripts were run. Include full output as an attachment if possible.*

### Artifacts Attached
- [ ] Screenshots of error messages
- [ ] Script output / PowerShell transcript
- [ ] Event Viewer logs (if pulled)
- [ ] Network diagnostic results (if relevant)
- [ ] Other: [describe]

---

### Resolution
**Status:** [Resolved / Escalated to L[#] / Pending user response / Pending vendor]
**Resolution summary:** [One paragraph: what was the issue, what fixed it, any follow-up needed]
**Root cause:** [Known / Suspected: describe / Unknown — escalated for RCA]
**Recurrence risk:** [Low / Medium / High — explain if Medium or High]
**Time to resolution:** [Total time from ticket creation to resolution]

---

### Escalation (if applicable)
**Escalated to:** [Tier and person/team]
**Escalation reason:** [One sentence — see escalation gate requirements]
**Handoff package:** [Reference to escalation-handoff document or inline]

</template>

<usage_notes>

- Fill in the header section during triage — it takes 30 seconds and sets the context for everything after
- Add troubleshooting log rows IN REAL TIME as you work, not from memory after the fact
- Error codes must be exact — "an error appeared" is useless; "Error 0x80070005 (Access Denied)" is actionable
- If the user describes something you cannot reproduce, quote their description exactly
- The resolution section is required even for escalated tickets — document what was tried and why it was escalated
- For P1/P2 incidents, include timestamps on every action for post-incident timeline reconstruction

</usage_notes>
