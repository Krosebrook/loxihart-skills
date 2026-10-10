# Eval: imaging-loxihart-endpoints

Written before the SKILL.md description was finalized, per the eval-driven authorship rule. Re-run these whenever the description changes.

## Should trigger

1. "New Latitude just showed up for the [CLIENT] user, walk me through imaging it."
2. "PXE keeps timing out on this laptop, I'm on port 14 with a USB adapter."
3. "WinPE says disk 0 not found — what do I check?"
4. "Enable RDP for [CLIENT]\jdoe on LOX-NB-CLT-045 and write the ticket note."
5. "Can I close this deployment ticket? BitLocker is on."
6. "What's the naming convention for a new tablet build?"
7. "Move the device to the internet VLAN and verify it."
8. "Validate this build before I hand it to the user."

## Should NOT trigger

1. "Image this server for the new file share." — server imaging, separate SOP.
2. "Set up the new hire's iPhone." — MDM, separate SOP.
3. "Spin up a VM for testing." — virtualization, separate SOP.
4. "Write a KB article about BitLocker suspension." — that is `generating-kb-articles` plus `operating-loxihart-service-desk`.
5. "The user's RDP session keeps dropping." — a support incident on an already-deployed device, not a deployment.

## Boundary cases

| Prompt | Expected | Why |
|---|---|---|
| "BitLocker recovery key prompt on boot" | Do **not** trigger | Existing-device incident. Routes to `operating-loxihart-service-desk` KB-IT-0032. |
| "BitLocker key isn't in AD for the machine I just built" | **Trigger** | Gate 7 exit criterion during an active build. |
| "Rename this computer" | Ambiguous — clarify | Rename during a build is Gate 5; rename of a live device is a change request. |
| "Escalate this imaging failure to L3" | **Trigger** | `templates/escalation-note.md`. |

## Observed behavior

Record results here when the skill is installed and exercised:

| # | Prompt | Triggered | Correct | Notes |
|---|---|---|---|---|
| P1 | New Latitude / imaging | | | |
| P2 | PXE timeout | | | |
| P3 | Disk 0 not found | | | |
| P4 | Enable RDP + note | | | |
| P5 | Close deployment ticket | | | |
| P6 | Naming convention | | | |
| P7 | VLAN migration | | | |
| P8 | Validate build | | | |
| N1 | Server imaging | | | |
| N2 | iPhone setup | | | |
| N3 | VM provisioning | | | |
| N4 | KB article | | | |
| N5 | RDP session dropping | | | |

## Overlap note

This skill and `operating-loxihart-service-desk` both cover Loxihart/[CLIENT] endpoints and both mention BitLocker, RDP, and escalation tiers. The split:

- **This skill** owns the build. It fires when a device is being imaged, configured, validated, or closed out as a deployment.
- **`operating-loxihart-service-desk`** owns the ticket lifecycle and incidents on devices already in service.

If both fire on the same prompt, the deciding question is whether the device is being *built* or *supported*. A prompt about a device that already has a user is a support prompt.
