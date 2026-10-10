# Template: Root Cause Analysis Report

<purpose>
Required for all P1-P2 incidents and all L3+ resolutions. This report documents what happened, why it happened, how it was fixed, and what will prevent it from happening again. The audience is both technical (so they understand the fix) and leadership (so they understand the impact and prevention plan).
</purpose>

<template>

## Root Cause Analysis — Ticket [TICKET-ID]

**Incident date:** [Date/Time range]
**Report date:** [Date this report was written]
**Author:** [Name, Tier]
**Priority:** [P1-P5]
**Category:** [Primary category]
**Status:** [Resolved / Monitoring / Pending permanent fix]

---

### Executive Summary
[2-3 sentences. What happened, who was affected, how long, and is it fixed. Write for someone who will not read the rest of the report.]

---

### Timeline

| Time | Event |
|------|-------|
| [HH:MM] | [First user report / detection] |
| [HH:MM] | [Triage completed, priority assigned] |
| [HH:MM] | [L1 engaged / first troubleshooting step] |
| [HH:MM] | [Escalation to L2 — reason] |
| [HH:MM] | [Root cause identified] |
| [HH:MM] | [Fix implemented] |
| [HH:MM] | [Resolution verified] |
| [HH:MM] | [Incident closed] |

**Total time to detect:** [Time from issue start to first report]
**Total time to resolve:** [Time from first report to verified resolution]
**Total downtime/impact:** [Duration users were affected]

---

### Impact Assessment

- **Users affected:** [Count and description — e.g., "15 users in Sales department"]
- **Systems affected:** [List of systems/services]
- **Business impact:** [What could not be done during the incident — e.g., "Sales team unable to access CRM for 2 hours during end-of-quarter push"]
- **Data impact:** [Any data loss, corruption, or exposure — or "No data impact"]

---

### Root Cause

**What happened:**
[Technical description of the failure. What specifically broke and how it manifested.]

**Why it happened:**
[The underlying cause. Not "the service crashed" but "the service crashed because the disk filled up because log rotation was not configured, because the deployment script omitted the log rotation configuration step."]

**Contributing factors:**
[Anything that made the impact worse or detection slower — e.g., "monitoring did not alert because the threshold was set too high", "the on-call tech was unavailable for 20 minutes"]

---

### Resolution

**Immediate fix (symptom relief):**
[What was done to get users working again — e.g., "restarted the service, cleared the disk"]

**Root cause fix:**
[What was done to address the underlying cause — e.g., "configured log rotation, updated deployment script to include log rotation step"]

**Verification:**
[How was the fix confirmed — e.g., "monitored for 48 hours, confirmed logs rotate correctly, disk usage stable at 45%"]

---

### Prevention Plan

| Action Item | Owner | Deadline | Status |
|------------|-------|----------|--------|
| [Specific preventive action] | [Name] | [Date] | [Open / In progress / Complete] |
| [Specific preventive action] | [Name] | [Date] | [Open / In progress / Complete] |
| [Specific preventive action] | [Name] | [Date] | [Open / In progress / Complete] |

Prevention actions should address:
1. How to prevent this specific failure from recurring
2. How to detect it faster if it does recur
3. How to reduce impact if detection fails

---

### Lessons Learned

**What went well:**
[Specific things that worked during the incident response]

**What could improve:**
[Specific things that slowed detection, diagnosis, or resolution]

**Process changes recommended:**
[Any changes to procedures, monitoring, or documentation]

</template>

<quality_check>

Before submitting:
- Root cause explains WHY, not just WHAT (dig past the surface)
- Prevention plan has specific owners and deadlines (not vague "we should monitor better")
- Timeline has timestamps, not just sequence
- Executive summary is readable by a non-technical person
- Every contributing factor has a corresponding prevention action

</quality_check>
