# SLA Priority Matrix

<purpose>
This reference defines priority levels P1-P5, their criteria, response/resolution targets, and routing implications. Read this during triage to classify incoming issues. Priority determines starting tier, SLA clock, and escalation urgency.
</purpose>

<priority_definitions>

## P1 — Critical / Business-Stopping

**Criteria:** Multiple users unable to work. Core business function down. No workaround available.

**Examples:**
- Office-wide internet/VPN outage
- Email system down for entire org
- Production application inaccessible for all users
- Active security breach or data exfiltration in progress
- Phone system down (if business-critical)

**Response target:** 15 minutes
**Resolution target:** 4 hours
**Starting tier:** L2 minimum (bypass L0/L1)
**Escalation cadence:** Status update every 30 minutes until resolved
**Communication:** Notify management immediately. If unresolved at 2 hours, auto-escalate to L3.

---

## P2 — High / Single User Blocked

**Criteria:** Single user completely unable to work. No workaround. Or: small group (2-5 users) significantly impacted with limited workaround.

**Examples:**
- User cannot log in to any system (AD/MFA lockout with no self-service path)
- Laptop will not boot / blue screen loop
- User lost access to critical data or application with no alternative
- New hire start date is today and provisioning is incomplete

**Response target:** 30 minutes
**Resolution target:** 8 hours (business hours)
**Starting tier:** L1 (fast-track to L2 if unresolved after 30 minutes of active troubleshooting)
**Escalation cadence:** Status update every hour
**Communication:** User informed of timeline. If L0 self-service attempted first, fast-track through L1.

---

## P3 — Medium / Degraded but Functional

**Criteria:** User can work but with reduced functionality, intermittent issues, or using a workaround. Not blocking core job function.

**Examples:**
- Slow machine but applications still functional
- Intermittent Wi-Fi drops (reconnects on its own)
- One application crashing occasionally (others work fine)
- Headset not auto-switching but manual selection works
- Outlook slow to sync but email accessible via web

**Response target:** 2 hours (business hours)
**Resolution target:** 24 hours (business hours)
**Starting tier:** L0 (end user) or L1 (tech)
**Escalation cadence:** Daily update if open > 24 hours
**Communication:** Standard ticket acknowledgment.

---

## P4 — Low / Minor Inconvenience

**Criteria:** Minor issue with easy workaround. Does not impact productivity meaningfully.

**Examples:**
- Headset preference not saved between sessions
- Display arrangement resets after undocking
- Font rendering slightly off in one application
- Non-critical app takes 10 extra seconds to load
- Cosmetic UI glitch in internal tool

**Response target:** 4 hours (business hours)
**Resolution target:** 3 business days
**Starting tier:** L0 self-service
**Escalation cadence:** Weekly review of open P4 tickets
**Communication:** Ticket created, user informed of timeline.

---

## P5 — Informational / Enhancement Request

**Criteria:** Not a problem. Request for new equipment, feature, or change. No current functionality is broken.

**Examples:**
- "Can I get a second monitor?"
- "I'd like a different keyboard"
- Request for software installation
- Request for access to a new system
- "Can we change the default browser company-wide?"

**Response target:** 1 business day
**Resolution target:** Per request type (procurement, change management, etc.)
**Starting tier:** L0 (self-service request portal) or ticket-only
**Escalation cadence:** Follows change management or procurement process
**Communication:** Request acknowledged, routed to appropriate queue.

</priority_definitions>

<classification_shortcuts>

## Quick Classification Guide

When in doubt, use these questions in order:

1. **How many people are affected?**
   - Multiple / org-wide → P1 candidate
   - Single user → P2-P5

2. **Can they do their core job?**
   - Completely blocked → P2
   - Degraded but working → P3
   - Minor annoyance → P4

3. **Is there a workaround?**
   - No workaround + blocked → P2
   - No workaround + not blocked → P3
   - Workaround exists and is acceptable → P3-P4

4. **Is it a request, not a problem?**
   - Yes → P5

5. **Is it security-related?**
   - Active breach → P1 (regardless of user count)
   - Phishing report → P2-P3 (depending on whether credentials were entered)
   - Suspicious but unconfirmed → P3

</classification_shortcuts>

<priority_override_rules>

## Override Rules

These situations override normal classification:

- **Executive impact:** If a C-suite member is affected, treat as one priority level higher than normal classification (P3 → P2). This is pragmatic, not political — executive downtime has outsized business impact.
- **Customer-facing impact:** If the issue affects a customer-facing system (even if only one internal user manages it), treat as one level higher.
- **Recurring issue:** If the same issue has been reported 3+ times in the past 30 days, escalate to L3 regardless of current priority — it is now a systemic pattern, not an incident.
- **SLA breach imminent:** If resolution target is about to be missed, auto-escalate to next tier with urgency flag.

</priority_override_rules>
