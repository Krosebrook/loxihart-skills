# Workflow: L3 Engineering Escalation

<purpose>
L3 handles issues that require vendor coordination, infrastructure changes, fleet-wide remediation, or code-level fixes. L3 owns the problem until the root cause is permanently eliminated — not just patched for one user. L3 also owns the relationship with external vendors for escalated technical issues.

The mindset at L3: you are an engineer solving a systems problem, not a support tech fixing a ticket. The deliverable is a permanent fix, a vendor case resolution, or an architecture recommendation for L4.
</purpose>

<required_reading>
**Read before starting:**
1. The relevant category reference file
2. `references/root-cause-patterns.md` — is this a known pattern?
3. The full escalation chain (L1 → L2 → L3 handoff packages)
4. `workflows/escalation-gate.md` — for potential L4 escalation
</required_reading>

<process>

## Step 1: Scope Assessment

Determine the scope of the problem:
- **Single-device fix with vendor dependency:** Hardware warranty, firmware defect, vendor bug
- **Fleet-wide remediation:** Driver issue, update rollback, configuration push affecting many devices
- **Infrastructure change:** DNS, DHCP, VPN, certificate authority, print server, MDM
- **Vendor product defect:** Software bug requiring vendor patch or workaround
- **Systemic pattern:** Recurring issue that L2 keeps fixing but it keeps coming back

This determines your approach: vendor engagement, infrastructure change management, or pattern elimination.

## Step 2: Vendor Engagement (if applicable)

If vendor involvement is needed:
1. Gather all diagnostic data (L2's RCA report, logs, reproduction steps)
2. Open a case with the vendor's technical support
3. Provide the case number in the ticket for tracking
4. Track vendor SLA and escalate within the vendor's support structure if needed
5. Test and validate any patches, firmware updates, or configuration changes the vendor provides before deploying to production

Do not blindly apply vendor suggestions to production. Test in a lab or on a canary device first.

## Step 3: Infrastructure Changes

If the fix requires infrastructure modification:
1. Document the proposed change (what, why, impact, rollback plan)
2. Get approval per change management process
3. Schedule the change (maintenance window if production-impacting)
4. Implement with monitoring
5. Verify resolution across all affected systems
6. Document the change for future reference

Infrastructure changes at L3 include:
- DNS zone or record modifications
- DHCP scope changes
- Certificate renewal or CA configuration
- VPN infrastructure changes
- Print server configuration
- MDM policy changes
- Fleet-wide driver or firmware deployment
- Group Policy changes affecting many OUs

## Step 4: Fleet-Wide Remediation

If the issue affects multiple devices:
1. Identify all affected devices (query AD, MDM, SCCM, or asset management)
2. Develop the remediation script or package
3. Test on a canary group (3-5 devices) first
4. Monitor canary group for 24-48 hours
5. Deploy to the full fleet in waves (not all at once)
6. Monitor each wave before proceeding to the next
7. Have a rollback ready for each wave

## Step 5: Pattern Elimination

If this is a recurring pattern that L2 keeps encountering:
1. Review all related tickets (same root cause, different symptoms)
2. Identify the systemic weakness (design flaw, missing monitoring, process gap)
3. Propose a permanent fix (may be technical, procedural, or both)
4. If the permanent fix requires architectural changes → escalate to L4
5. If the permanent fix is within L3 scope, implement it and add the pattern to `references/root-cause-patterns.md`

## Step 6: Documentation and Knowledge Transfer

After resolution:
1. Complete RCA report (`templates/rca-report.md`) — required for all L3 resolutions
2. Update `references/root-cause-patterns.md` if a new pattern was identified
3. Create or update KB articles if the resolution creates new documentation
4. Brief L1/L2 on the fix so they can recognize and handle it if it recurs in a different form

</process>

<l4_indicators>

## When to Escalate to L4

- The permanent fix requires architectural redesign (not just configuration)
- The current infrastructure cannot support the required fix
- A recurring pattern cannot be eliminated without changing the system design
- Post-incident review reveals a class of vulnerability affecting multiple systems
- Business decision needed (cost vs. risk tradeoff for the fix)
- The fix has significant budget, timeline, or business process implications

</l4_indicators>

<success_criteria>
L3 workflow is complete when:
- [ ] Scope assessed (single device, fleet, infrastructure, vendor, pattern)
- [ ] Vendor engaged and case tracked (if applicable)
- [ ] Change documented and approved (if infrastructure change)
- [ ] Fix tested on canary group before fleet deployment (if fleet-wide)
- [ ] Resolution verified across all affected systems
- [ ] RCA report completed
- [ ] Root cause patterns reference updated (if new pattern)
- [ ] L1/L2 briefed on the resolution
- [ ] Ticket closed with full documentation OR escalated to L4 with architecture recommendation
</success_criteria>
