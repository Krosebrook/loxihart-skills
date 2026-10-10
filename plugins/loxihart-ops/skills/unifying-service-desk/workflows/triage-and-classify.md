# Workflow: Triage and Classify

<purpose>
This workflow runs at the start of every support interaction. It determines three things: who is asking, what the problem is, and how urgent it is. These three inputs produce a routing decision — which tier workflow to enter and which reference file to load.

Most interactions should complete triage in 2-3 exchanges. Do not over-interview. If the symptom is obvious ("my headset isn't working"), classify immediately and move to the appropriate workflow.
</purpose>

<required_reading>
**Read before triaging:**
1. `references/sla-priority-matrix.md` — needed to classify priority
</required_reading>

<process>

## Step 1: Role Detection

Determine who you are talking to. This affects language, assumed technical level, and available actions.

Ask: "Are you the person experiencing the issue, or are you IT support working a ticket?"

| Response | Role | Implications |
|----------|------|-------------|
| "I'm the one with the problem" / no IT context | End User | No admin access assumed. Plain language. L0 start. |
| "I'm working a ticket" / mentions ticket # / tech context | L1 Tech | Admin tools available. Technical language OK. L1 start. |
| "Investigating a pattern" / mentions multiple incidents | L2+ Engineer | Full technical depth. L2+ start. |

If ambiguous after one question, default to End User. It is better to start simple and escalate than to overwhelm a non-technical person.

## Step 2: Symptom Intake

Ask: "In one sentence, what's happening?"

Listen for category keywords. Map the symptom to exactly one primary category:

| Category | Trigger Keywords | Reference |
|----------|-----------------|-----------|
| Audio / Headset | sound, headset, mic, speaker, audio, Teams audio, no sound, muted | `references/audio-headset.md` |
| Network / Connectivity | VPN, Wi-Fi, internet, DNS, can't connect, slow connection, proxy, network drive | `references/network-connectivity.md` |
| Hardware / Peripherals | dock, monitor, display, USB, keyboard, mouse, charger, port, screen | `references/hardware-peripherals.md` |
| Imaging / Deployment | MDT, image, BIOS, boot loop, deployment, reimaging, driver during setup | `references/imaging-deployment.md` |
| Software / Application | crash, freeze, Teams, Zoom, browser, Office, app won't open, error message | `references/software-applications.md` |
| Access / Identity | password, locked out, MFA, can't log in, permissions, access denied, license | `references/access-identity.md` |
| Email / Calendar | Outlook, email, calendar, mailbox, sync, Exchange, shared mailbox | `references/email-calendar.md` |
| Performance | slow, performance, CPU, RAM, disk full, startup, fan loud, freezing | `references/performance.md` |
| Security Incident | phishing, suspicious email, virus, malware, hacked, compromise | `references/security-incidents.md` |
| Onboarding / Offboarding | new hire, new employee, leaving, offboarding, setup account, deactivate | `references/onboarding-offboarding.md` |
| Print / Scan | printer, print, scan, print queue, paper jam, scanner | `references/print-scan.md` |
| Mobile / Remote | mobile, phone, MDM, remote desktop, RDP, hotspot, work from home | `references/mobile-remote.md` |

If the symptom spans multiple categories (e.g., "Outlook is slow and keeps crashing"), pick the category that matches the **primary complaint** and note the secondary category for later.

If the symptom does not clearly match any category, ask one clarifying question: "Is this related to [best guess A] or [best guess B]?" Do not ask more than one clarifying question for category mapping.

## Step 3: Priority Classification

Based on the symptom and impact, classify P1-P5 using `references/sla-priority-matrix.md`.

Key questions to determine priority (ask only what is needed — most can be inferred):
- "Is anyone else affected, or just you?" (single user vs. multi-user = P3 vs. P1-P2)
- "Can you do any work at all, or are you completely blocked?" (degraded vs. blocked = P3 vs. P2)
- "When did this start?" (ongoing/recurring may indicate a pattern = possible L3+)

Do not ask all three if the answer is obvious. "I can't log in at all" is clearly P2 (single user, fully blocked) without asking if they can do any work.

## Step 4: Route

Combine role + category + priority to determine the starting workflow:

**Immediate overrides:**
- Security incident → `workflows/l2-advanced-diagnosis.md` (IR track, regardless of role)
- P1 (multiple users down) → `workflows/l2-advanced-diagnosis.md` (skip L0/L1)
- Known recurring pattern → `workflows/l3-engineering-escalation.md`

**Standard routing:**

| Role | Priority | Action |
|------|----------|--------|
| End User | P3-P5 | Read the category reference file, then enter `workflows/l0-self-service.md` |
| End User | P2 | Read the category reference file, then enter `workflows/l0-self-service.md` with 15-min fast-track |
| L1 Tech | Any | Read the category reference file, then enter `workflows/l1-first-touch.md` |
| L2+ Engineer | Any | Read the category reference file, then enter `workflows/l2-advanced-diagnosis.md` |

**Before entering the workflow:** State the classification back to the user:
> "OK — sounds like a [category] issue, priority [P#]. Let me walk you through [tier] troubleshooting."

This confirms alignment and lets the user correct you if you misclassified.

</process>

<success_criteria>
Triage is complete when:
- [ ] Role identified (end user / L1 tech / L2+ engineer)
- [ ] Issue mapped to exactly one primary category
- [ ] Priority classified P1-P5
- [ ] Starting workflow selected
- [ ] Classification stated back to user and confirmed
- [ ] Relevant category reference file has been read
</success_criteria>
