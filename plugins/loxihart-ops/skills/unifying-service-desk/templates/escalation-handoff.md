# Template: Escalation Handoff

<purpose>
Complete this template when handing a ticket from one tier to the next. The receiving tier should be able to start work immediately without re-interviewing the user or re-running previous steps. If the receiving tier has to ask "what did you already try?" — this handoff failed.
</purpose>

<template>

## Escalation Handoff — Ticket [TICKET-ID]

**From:** [Your name] — [Current Tier]
**To:** [Next Tier / Team]
**Date/Time:** [Timestamp]
**Priority:** [P1-P5]
**SLA Status:** [Within target / At risk / Breached]

---

### Issue Summary
**Category:** [One of the 12 categories]
**User:** [Name, email, department]
**Device:** [Make/model, OS version, asset tag]
**Original complaint:** [Verbatim user description]
**When started:** [Date/time or "user reports it has been happening for X days"]
**Who affected:** [Single user / multiple — specify]
**Workaround in place:** [Yes — describe / No]

---

### What Was Attempted (Current Tier)

List every step in order, with results. The receiving tier uses this to avoid duplication.

1. **[Step name]** — [Exact result. Include error codes, behavior changes, or "no change".]
2. **[Step name]** — [Exact result.]
3. **[Step name]** — [Exact result.]
4. **[Step name]** — [Exact result.]

*Scripts executed:*
- [script-name.ps1] → [Output summary. Attach full output.]

*Known error patterns checked:*
- [Pattern name from root-cause-patterns.md] → [Match / No match / Partial match — explain]

---

### Why This Needs the Next Tier

[One to three sentences. Be specific about what capability is required that the current tier lacks.]

Examples of good routing signals:
- "All L1 service restarts and driver procedures completed. Error 0x80070005 persists on AudioEndpointBuilder — suggests a permission issue at the system level requiring Group Policy or registry investigation."
- "Issue recurred 3 times in 7 days after identical L1 fix. Meets recurring pattern threshold — needs L3 systemic review."
- "Hardware diagnostic indicates potential docking station firmware issue. Vendor RMA or firmware update required — outside L1 scope."

---

### Artifacts Attached

- [ ] Complete ticket notes (templates/ticket-notes.md format)
- [ ] Script output / PowerShell transcripts
- [ ] Screenshots of error messages
- [ ] Event Viewer exports (.evtx or screenshot)
- [ ] Network diagnostic output
- [ ] Device/driver information export
- [ ] Other: [describe]

---

### Recommended Next Steps (Optional)

If the current tier has a theory about what L2+ should investigate, include it here. This is a suggestion, not a directive — the receiving tier will validate independently.

[Your theory or recommended investigation path, if any. "I suspect X because Y" is helpful. Leave blank if no theory.]

---

### User Communication Status

- [ ] User informed of escalation
- [ ] User given expected response time for next tier
- [ ] User provided with ticket reference number
- [ ] User has a workaround to use while waiting (describe if yes)

</template>

<quality_check>

Before submitting this handoff, verify:
- Every step attempted is listed with its exact result (not "tried various things")
- Error codes are exact, not paraphrased
- The routing signal answers "why does this need the next tier?" specifically
- At least one artifact is attached (there is always something to attach)
- User communication status is complete

</quality_check>
