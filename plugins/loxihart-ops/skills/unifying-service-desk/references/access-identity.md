# Reference: Access / Identity

<overview>
Covers password resets, MFA lockouts, AD group membership, SSO failures, license assignment issues, and permission denied errors. Access issues are high-urgency for the user (they cannot work) but typically fast to resolve at L1 if the cause is straightforward. The challenge is distinguishing "I forgot my password" from "my account is compromised" — always verify identity before making changes.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Password expired or forgotten | HIGH | L0 (self-service) or L1 |
| MFA device lost/changed/broken | HIGH | L1 |
| Account locked (too many failed attempts) | HIGH | L1 |
| Missing AD group membership | MEDIUM | L1 |
| License not assigned (M365, app-specific) | MEDIUM | L1 |
| SSO token expired or cached credentials stale | MEDIUM | L0-L1 |
| Account disabled (offboarding error, policy) | LOW | L1-L2 |
| Conditional Access policy blocking | LOW | L2 |
| AD replication delay | LOW | L2 |
| Account compromise | LOW | L2 (security track) |

</root_causes>

<identity_verification>

## CRITICAL: Verify Identity Before Account Changes

Before resetting passwords, unlocking accounts, or modifying MFA:

1. Verify the requester IS the account holder (or their verified manager)
2. Use an out-of-band verification method — do not rely solely on the email/chat channel the request came through
3. If the account shows signs of compromise (password changed by someone else, unusual login locations, MFA reset requests the user didn't initiate), treat as a security incident → the security-incidents guide

</identity_verification>

<l0_steps>

## L0 Self-Service Steps

**1. Self-service password reset.** Direct user to the self-service password reset portal (if configured). Requires: previously registered MFA method or security questions.

**2. Clear cached credentials.** Windows + L to lock → unlock with current password. If that fails: restart the computer while connected to the network (domain controllers push updated credentials during boot).

**3. Sign out and back in.** For SSO issues: sign out of the application completely (not just close), clear browser cookies for the SSO domain, sign back in.

**4. Check MFA prompt.** If MFA prompt isn't arriving: check the correct phone/app is expected, check phone has signal/internet, try "I can't use my Microsoft Authenticator app right now" for alternate methods (SMS, call).

</l0_steps>

<l1_steps>

## L1 Tech Steps

**5. Unlock account.** In AD Users and Computers (or equivalent admin tool): find user → Properties → Account tab → uncheck "Account is locked out" → Apply. Confirm lockout source if repeated (check Security event logs on DCs for event ID 4740).

**6. Reset password.** After identity verification: reset in AD/Azure AD → require user to change at next login → communicate new temporary password via secure channel (not email).

**7. MFA reset.** In Azure AD (or MFA admin portal): remove existing MFA methods → have user re-register. Verify with manager if the user claims their MFA device was lost/stolen.

**8. Check group membership.** If "Access Denied" to a resource: verify the user is in the correct AD group for that resource. Compare against a working user's group membership. Add to group if missing (per documented procedure).

**9. License assignment.** In M365 admin center: check user's assigned licenses. If a required license is missing (E3, E5, specific app license), assign it. License changes can take 15-30 minutes to propagate.

**10. Check account status.** Verify account is enabled, not expired, not in a disabled OU. If account was disabled unexpectedly, check with HR/onboarding team before re-enabling — it may be an intentional offboarding action.

**11. Cached credential cleanup (endpoint).** Run `cmdkey /list` to show stored credentials. Delete stale entries with `cmdkey /delete:[target]`. Also check Credential Manager in Control Panel.

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Conditional Access policy blocking legitimate access (policy change needed)
- AD replication issue causing inconsistent access across sites
- SSO/federation configuration problem
- Account compromise confirmed or suspected → security incident track
- Bulk account issues (multiple users locked out simultaneously — possible attack)
- License allocation at capacity (no available licenses to assign)
- Account in a protected OU that L1 cannot modify

</l2_indicators>
