# Reference: [COMPLIANCE FRAMEWORK] Compliance Flags

Flag BEFORE executing — not after.

## Trigger Table

| Trigger | Flag | Min Tier |
|---|---|---|
| Password reset / credential change | ⚑ [COMPLIANCE FRAMEWORK]: Credential action — L2 review before execution | L2 |
| MFA enrollment / bypass | ⚑ [COMPLIANCE FRAMEWORK]: MFA touchpoint — confirm identity out-of-band | L2 |
| AD group membership change | ⚑ [COMPLIANCE FRAMEWORK]: Access control change — document requester + approver | L2 |
| BitLocker suspension | ⚑ [COMPLIANCE FRAMEWORK]: Endpoint security posture — document reason + duration | L2 |
| Bitdefender policy exception | ⚑ [COMPLIANCE FRAMEWORK]: Security tool modification | L2 |
| Remote session on endpoint | ⚑ [COMPLIANCE FRAMEWORK]: Log session start/end in ticket | L1 |
| New local admin account | ⚑ [COMPLIANCE FRAMEWORK]: Elevated access — L3 required | L3 |

## Application

1. Match action to trigger table.
2. Insert flag in ticket BEFORE action.
3. If min tier > current tier: escalate.
4. Flag must be written, not verbal.

## Common Violations

- L1 resets password without L2 review
- BitLocker suspended then documented (must be before)
- Remote session timestamps approximate ("around 2pm")
