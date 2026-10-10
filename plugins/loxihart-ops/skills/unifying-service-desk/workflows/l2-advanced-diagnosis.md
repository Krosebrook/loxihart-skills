# Workflow: L2 Advanced Diagnosis

<purpose>
L2 is the diagnostic tier. L2 does not execute pre-written scripts — L2 investigates WHY something failed, identifies the root cause, and implements fixes that require elevated access, configuration changes, or deep system knowledge. L2 also handles all security incidents.

The mindset at L2: you are a detective, not a script runner. L1 already ran the scripts. Your job is to find the root cause, implement a durable fix, and determine whether this is a one-off or a systemic pattern requiring L3 attention.
</purpose>

<required_reading>
**Read before starting:**
1. The relevant category reference file
2. `references/root-cause-patterns.md` — check if this matches a known pattern
3. The escalation handoff package from L1 (or L0 if direct escalation)
4. `workflows/escalation-gate.md` — know handoff requirements for L3 if needed
</required_reading>

<process>

## Step 1: Review the Escalation Package

Read the full handoff from the previous tier. Verify:
- All previous-tier steps were actually completed (not just listed)
- Error codes and observations are documented
- Environmental context is captured

If the handoff is incomplete, send it back to the previous tier with specific items to complete. Do not redo L1 work at L2.

## Step 2: Reproduce and Characterize

Before investigating, confirm you can reproduce the issue:
- Can you trigger the failure on demand?
- Is it intermittent? If so, what are the conditions? (time of day, specific action, specific network, specific user)
- Does it affect other users/devices? (Test with a different user on the same device, same user on a different device)

This step narrows the problem space: user-specific, device-specific, app-specific, or infrastructure-wide.

## Step 3: Log Analysis

Collect and analyze relevant logs. The specific logs depend on the category:

**Windows System:**
- Event Viewer → System, Application, Security logs
- Filter by Error and Warning levels
- Focus on the time window around the failure

**Network:**
- Firewall logs for blocked connections
- DNS query logs
- VPN server connection logs
- DHCP lease logs

**Application:**
- Application-specific log files (Teams: %appdata%\Microsoft\Teams\logs, Outlook: etl traces)
- Crash dumps (if available)

**Identity / Access:**
- Azure AD sign-in logs (Conditional Access evaluation, MFA details)
- AD security event logs on domain controllers (event IDs 4625, 4740, 4771)

**Security Incidents:**
- Endpoint protection logs
- Email security gateway logs
- Azure AD audit logs
- Network traffic logs for IOCs (indicators of compromise)

Look for patterns: timestamps, error codes, source components, correlated events across logs.

## Step 4: Root Cause Identification

Based on log analysis and reproduction testing, identify the root cause. Categories:

**Configuration drift:** A setting changed (intentionally or not) that broke functionality. Fix: correct the setting, document what it should be, add monitoring.

**Software defect:** The application or OS has a bug. Fix: apply patch, implement workaround, or escalate to vendor (L3).

**Resource exhaustion:** Disk, memory, licenses, DHCP scope, certificate — something ran out. Fix: reclaim or expand, add monitoring to prevent recurrence.

**Dependency failure:** A service this system depends on failed. Fix: fix the dependency, add resilience (failover, redundancy), or escalate if the dependency is outside your control.

**Security incident:** Unauthorized access, malware, or policy violation. Fix: follow IR procedures in `references/security-incidents.md`.

**Unknown / complex:** Cannot identify root cause with available tools and access. Escalate to L3 with everything collected.

## Step 5: Implement the Fix

L2 has authority to:
- Modify Group Policy objects (with change documentation)
- Edit registry settings (with backup and documentation)
- Change firewall rules (with approval if production-impacting)
- Modify Exchange/mail flow rules
- Update DNS records
- Reconfigure services and their dependencies
- Roll back Windows Updates on individual devices
- Modify Conditional Access policies (with security team coordination)
- Perform account forensics and remediation

L2 does NOT:
- Make infrastructure architectural changes (L3)
- Modify core network infrastructure (L3)
- Engage vendors directly for product defects (L3)
- Approve fleet-wide rollbacks or changes (L3-L4)
- Make changes to production systems without documentation

## Step 6: Verify and Document

After implementing the fix:
1. Verify the issue is resolved (reproduce test — it should now pass)
2. Verify no side effects introduced (check dependent systems)
3. Document the root cause, the fix, and the verification in ticket notes
4. Complete the RCA report using `templates/rca-report.md` (required for P1-P2 incidents)

## Step 7: Pattern Assessment

Before closing, ask: is this a one-off or a pattern?

Indicators of a pattern:
- Same issue has appeared before (check ticket history)
- Root cause is a design weakness, not a random failure
- Fix is a workaround, not a permanent resolution
- Multiple systems are vulnerable to the same failure

If this is a pattern → escalate to L3 with pattern documentation. Reference `references/root-cause-patterns.md` to see if it matches an existing known pattern. If it is a new pattern, create a `templates/known-error-entry.md` to add to the patterns reference.

</process>

<success_criteria>
L2 workflow is complete when:
- [ ] Escalation package reviewed and validated
- [ ] Issue reproduced and characterized (scope, conditions, frequency)
- [ ] Relevant logs collected and analyzed
- [ ] Root cause identified (or documented as unknown with evidence collected)
- [ ] Fix implemented with documentation
- [ ] Resolution verified (original issue resolved, no side effects)
- [ ] RCA report completed (required for P1-P2)
- [ ] Pattern assessment completed (one-off vs. systemic)
- [ ] Ticket closed with full documentation OR escalated to L3 with handoff package
</success_criteria>
