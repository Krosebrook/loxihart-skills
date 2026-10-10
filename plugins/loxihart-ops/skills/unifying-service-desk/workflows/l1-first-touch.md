# Workflow: L1 First-Touch

<purpose>
L1 is the first tier with admin tools, remote access, and scripting capabilities. L1 resolves issues using known fixes, documented procedures, scripts, and KB articles. L1 does NOT perform root cause analysis or make infrastructure changes — that is L2+ territory.

The mindset at L1: execute known procedures thoroughly, document everything, and escalate cleanly when procedures are exhausted. A great L1 tech resolves 70-80% of tickets without escalation by being methodical, not by guessing.
</purpose>

<required_reading>
**Read before starting:**
1. The relevant category reference file (determined during triage)
2. `references/root-cause-patterns.md` — to recognize known patterns that have documented fixes
3. `workflows/escalation-gate.md` — know the handoff requirements before you start (so you document correctly from the beginning)
</required_reading>

<process>

## Step 1: Review Prior Work

If this ticket was escalated from L0, read the handoff notes first. Do NOT re-ask the user questions already answered. Do NOT re-try steps already attempted and documented.

If this is a fresh L1 engagement (tech picked up the ticket directly), confirm the triage classification:
- Category correct?
- Priority correct?
- User available for interaction?

## Step 2: Verify Environment

Before running any fix, confirm the technical environment. These are the questions L0 cannot answer but L1 needs:

- **Device:** Make, model, OS version, build number
- **Domain status:** Domain-joined? Azure AD joined? Local account?
- **Remote access:** Can you reach this device remotely? (VSA agent online, RDP available, etc.)
- **Recent changes:** Any updates, new software, hardware swaps, or reimaging in the past week?

Capture this in ticket notes immediately. It saves time later and is required for escalation.

## Step 3: Execute Category-Specific L1 Procedures

Pull the L1 steps from the category reference file. These include everything L0 cannot do:
- Running PowerShell scripts with admin rights (see `scripts/` for common ones)
- Remote tool sessions
- Service restarts via elevated access
- Driver reinstallation
- Group Policy refresh
- Account unlocks and permission changes
- Registry inspection (read-only at L1 — do not modify without L2 authorization)

Present steps one at a time. After each step, confirm the result:
- What changed? (error code, behavior shift, new error, resolution)
- Document the exact result in ticket notes

**Script execution protocol:**
1. Identify the relevant script from `scripts/` index
2. Verify the script does what you expect (read it first)
3. Run it on the affected endpoint
4. Capture the output (copy full transcript)
5. Document: script name, execution time, output, result

## Step 4: Known Error Check

After initial procedures, check `references/root-cause-patterns.md` for known patterns matching the symptoms. If the issue matches a known error:
- Apply the documented fix
- If the fix works, document it and close
- If the fix does not work, note that the known fix was attempted and failed — this is critical escalation information

## Step 5: Resolution Verification

If a step appears to fix the issue, do not close immediately. Verify:

1. **Symptom resolved:** The original complaint is no longer present
2. **Function restored:** The user can perform the task they were trying to do
3. **Stability check:** Ask the user to use the system normally for 5-10 minutes and confirm it holds
4. **Recurrence risk:** Does this fix address the root cause or just the symptom? If symptom-only, note it in the ticket — recurring issues trigger the L3 pattern review

## Step 6: L1 Exhausted — Escalation to L2

If all L1 procedures are completed without resolution:

Read `workflows/escalation-gate.md` and complete the full handoff package using `templates/escalation-handoff.md`.

L1 → L2 escalation signals (include the specific reason):
- "All standard procedures exhausted — error persists after service restart, driver reinstall, and cache clear"
- "Issue resolved temporarily but recurred within [timeframe] — indicates deeper root cause"
- "Error code [X] not found in KB or root-cause-patterns reference — requires log analysis"
- "Fix requires config change beyond L1 scope — [specific change] needed"
- "Vendor involvement needed — [hardware/software] appears defective under warranty"

</process>

<l1_boundaries>

## What L1 Can and Cannot Do

**L1 CAN:**
- Run documented PowerShell scripts
- Restart services (local and remote)
- Reinstall/update drivers
- Clear caches and temp files
- Reset user passwords and unlock accounts
- Add users to standard AD groups (per documented procedure)
- Execute KB articles and documented fixes
- Remote into endpoints with appropriate tools
- Collect logs and diagnostic output

**L1 CANNOT (escalate to L2 if needed):**
- Modify Group Policy objects
- Edit the registry (read-only inspection is OK)
- Change firewall rules or network configuration
- Modify Exchange/mail flow rules
- Make infrastructure changes (DNS, DHCP, AD schema)
- Approve or execute changes outside documented procedures
- Install non-standard software without approval
- Access other users' data or mailboxes without authorization

This boundary exists because L1 errors at the infrastructure level can cascade. L2 has the diagnostic depth and change management authority to make these changes safely.

</l1_boundaries>

<documentation_requirements>

## Ticket Notes (Required Throughout)

Use `templates/ticket-notes.md` format. At L1, ticket notes must include:
- Environment details (device, OS, domain, remote access status)
- Every step attempted with exact result
- All script names run with output summary
- Error codes and exact error messages (screenshots preferred)
- Timeline of actions (timestamps help L2 correlate with logs)
- User-reported observations between steps
- Resolution details OR escalation rationale

</documentation_requirements>

<success_criteria>
L1 workflow is complete when:
- [ ] Prior work reviewed (if escalated from L0)
- [ ] Environment verified and documented
- [ ] All L1 category-specific procedures attempted one at a time with results documented
- [ ] Known error patterns checked against root-cause-patterns reference
- [ ] Resolution verified (symptom resolved + function restored + stability confirmed) OR
- [ ] Escalation gate completed with full handoff package to L2
- [ ] Ticket notes complete with timeline, steps, results, and either resolution or escalation rationale
</success_criteria>
