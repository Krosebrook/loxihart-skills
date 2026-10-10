# Workflow: Escalation Gate

<purpose>
This workflow is shared across all tier boundaries. Before any handoff from one tier to the next, this checklist must be completed. It exists because incomplete escalations waste time — the receiving tier re-does work, asks the same questions, and the user waits longer.

Every tier workflow references this file at its escalation point. Read and follow it before handing off.
</purpose>

<escalation_criteria>

## When to Escalate

Escalation is appropriate when ALL of the following are true:
1. All procedures for the current tier have been attempted (not just some)
2. The issue is not resolved or the resolution requires access/authority the current tier lacks
3. You can articulate WHY the next tier is needed (not just "it didn't work")

Escalation is NOT appropriate when:
- You skipped steps because they seemed unlikely to help (try them anyway — unlikely fixes are still fixes)
- You ran out of patience (that is not a tier problem, that is a time management problem)
- You want someone else to handle it (ownership stays with the original tier until formal handoff)

## Escalation Triggers by Tier Boundary

**L0 → L1:**
- All self-service steps for the category completed with no resolution
- Issue requires admin rights, remote tools, or elevated access
- User explicitly requests IT support after completing self-service

**L1 → L2:**
- All L1 standard procedures and scripts attempted with no resolution
- Issue requires log analysis, config changes, or policy modification
- Error codes or behaviors not covered in known fix documentation
- Issue recurred after L1 fix (indicates deeper root cause)
- SLA response time exceeded for the priority level

**L2 → L3:**
- Root cause identified but fix requires vendor involvement or infrastructure changes
- Issue affects multiple systems or requires fleet-wide remediation
- Code-level fix, firmware update, or architectural change needed
- Vendor escalation case required (hardware warranty, software defect)

**L3 → L4:**
- Issue is systemic — same root cause producing multiple incidents across time
- Architectural review needed to prevent recurrence
- Current infrastructure design cannot support the required fix
- Post-incident review reveals a class of vulnerability, not a single instance

</escalation_criteria>

<handoff_checklist>

## Required Handoff Package

Before escalating, complete and attach the following. Use `templates/escalation-handoff.md` as the format.

**1. Exhaustion Proof**
List every step attempted at the current tier, with results:
- Step name / procedure name
- Exact result (error code, behavior observed, screenshot if applicable)
- Timestamp of attempt

"Tried restarting" is insufficient. "Restarted Windows Audio and AudioEndpointBuilder services via services.msc at 14:32 — services restarted successfully but headset still not detected in Sound Settings > Output" is correct.

**2. Symptom Summary**
- Original user complaint (verbatim or close paraphrase)
- Category classification and priority level
- When the issue started
- Who is affected (single user, team, department, org-wide)
- Is there a workaround currently in use?

**3. Environmental Context**
- Device make/model and OS version
- Relevant software versions (if software issue)
- Network location (office, VPN, home) if relevant
- Any recent changes (updates, new software, hardware swap, imaging)

**4. Artifacts**
Attach everything collected during troubleshooting:
- Script output (PowerShell transcripts, diagnostic results)
- Screenshots of error messages or unexpected behavior
- Event Viewer logs (if pulled)
- Network diagnostic results (if relevant)
- Any configuration files or registry exports examined

**5. Routing Signal**
One sentence explaining why this needs the next tier. Be specific:
- BAD: "L1 steps didn't work, escalating to L2"
- GOOD: "Audio service restart resolved temporarily but issue recurred within 2 hours — likely driver-level corruption requiring L2 investigation of device driver stack"

</handoff_checklist>

<receiving_tier_protocol>

## When You Receive an Escalation

Before starting work on an escalated ticket:

1. **Read the handoff package completely.** Do not re-ask the user questions that were already answered.
2. **Verify exhaustion.** Confirm the previous tier actually completed their steps. If key steps are missing, send back with a specific note on what to try first — do not redo L1 work at L2 rates.
3. **Acknowledge receipt.** Update the ticket to show the new tier has accepted the escalation with a timestamp.
4. **Set expectations.** If the user is involved, let them know the new tier is engaged and what the next step looks like.

</receiving_tier_protocol>

<de_escalation>

## De-Escalation

Not every escalated issue stays escalated. If during investigation you determine the issue can be resolved at a lower tier (e.g., L2 finds it was actually a default device setting), route it back down with:
- The specific fix to apply
- Clear instructions the lower tier can follow
- Updated ticket notes explaining the finding

De-escalation is not failure. It is efficient routing.

</de_escalation>

<success_criteria>
An escalation is properly executed when:
- [ ] All current-tier procedures documented as attempted with results
- [ ] Escalation handoff template completed in full
- [ ] Artifacts attached (scripts output, screenshots, logs)
- [ ] One-sentence routing signal explains why the next tier is needed
- [ ] Receiving tier has enough context to start work without re-interviewing the user
- [ ] Ticket updated with escalation timestamp and new tier assignment
</success_criteria>
