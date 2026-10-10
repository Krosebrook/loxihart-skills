# Reference: Onboarding / Offboarding

<overview>
Covers new hire provisioning, equipment setup, account creation, license assignment, offboarding deactivation, and asset recovery. These are procedural workflows with checklists — not troubleshooting in the traditional sense. The risk here is incompleteness: a missed step in offboarding leaves a security gap, a missed step in onboarding leaves the new hire unable to work on day one.
</overview>

<onboarding_checklist>

## New Hire Onboarding — L1 Minimum

This is a checklist, not a troubleshooting flow. Work through it sequentially. Confirm each item before moving to the next.

**Pre-Start (1-3 days before start date):**
- [ ] AD account created with correct OU, groups, and attributes
- [ ] M365 license assigned (E3/E5 per role)
- [ ] Email address created and verified
- [ ] MFA registration email sent to personal email (for day-one setup)
- [ ] LOB application access provisioned (per role-based access matrix)
- [ ] Hardware ordered/assigned (laptop, dock, monitor, peripherals)
- [ ] Hardware imaged and configured (MDT or Intune enrollment)
- [ ] VPN profile configured (if remote worker)
- [ ] Welcome packet prepared (login instructions, IT contact info, self-service portal link)

**Day One:**
- [ ] User can log in to domain/Azure AD
- [ ] Email functional (send and receive test)
- [ ] MFA registered and working
- [ ] VPN connected (if applicable)
- [ ] All required applications installed and accessible
- [ ] Printer added (if in office)
- [ ] Hardware functioning (dock, monitors, peripherals verified)
- [ ] User briefed on IT support channels (help desk portal, email, phone)

**Day One Troubleshooting:** If any item fails during day-one setup, treat as P2 (user fully blocked, no workaround) and fix immediately. A new hire who cannot work on their first day reflects on the entire organization.

</onboarding_checklist>

<offboarding_checklist>

## Employee Offboarding — L1 Minimum

**CRITICAL: Offboarding is a security operation.** Every incomplete offboarding is a potential unauthorized access vector. Complete all steps even if HR says "they left on good terms."

**Immediate (day of departure):**
- [ ] AD account disabled (do NOT delete — disable)
- [ ] Password reset to a random value
- [ ] MFA methods removed
- [ ] Active sessions revoked (Azure AD → Revoke Sessions)
- [ ] Email forwarding set up (to manager or designated recipient) with expiration date
- [ ] Shared mailbox access removed
- [ ] VPN access revoked
- [ ] Remote access tools deauthorized (remove from MDM, revoke VPN certificates)

**Within 24 Hours:**
- [ ] Group memberships reviewed and removed from sensitive groups
- [ ] LOB application access revoked (per application admin portals)
- [ ] M365 license reclaimed (after mailbox retention period set)
- [ ] Distribution lists updated (remove user)
- [ ] Delegates/shared access cleaned up (calendars, mailboxes, SharePoint)

**Within 7 Days:**
- [ ] Hardware recovered (laptop, dock, monitors, peripherals, badges)
- [ ] Asset inventory updated
- [ ] Mailbox converted to shared mailbox (if retention needed) or exported
- [ ] License fully deallocated after mailbox transition

**Within 30 Days:**
- [ ] AD account moved to Disabled OU
- [ ] Final license audit to confirm no orphaned access
- [ ] Hardware wiped and returned to inventory

</offboarding_checklist>

<l2_indicators>

## When to Escalate to L2

- Provisioning requires access to systems L1 cannot administer (custom RBAC, conditional access policies)
- Bulk onboarding (multiple hires) requiring scripted provisioning
- Offboarding of an admin account (additional security review required)
- Former employee access found active after offboarding was supposedly complete
- License pool exhausted — procurement or license optimization needed
- Role-based access matrix needs updating for a new role

</l2_indicators>
