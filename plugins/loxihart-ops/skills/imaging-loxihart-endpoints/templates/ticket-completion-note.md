# Ticket Completion Note

Posted at Gate 9. Every bracketed field must be replaced — a note shipped with `[XXXXXXX]` still in it is not documentation.

`Invoke-DeploymentValidation.ps1` emits this block pre-filled from the live machine. Prefer the generated version; use this template by hand only when the validator could not run.

---

```
============================================
IMAGING COMPLETION SUMMARY
============================================
Ticket:        [SD-XXXXXX]
Device Name:   [LOX-NB-CLT-XXX]
Serial Number: [XXXXXXX]
Model:         [Dell Latitude 5540]
SOP Version:   3.1
Technician:    [username]
Completed:     [YYYY-MM-DD HH:MM CT]

TASKS COMPLETED:
  [X] BIOS Configuration - [AHCI|NVMe] Mode
  [X] PXE Imaging - [Windows 11 x64 - 23H2]
  [X] Device Renamed
  [X] Domain Join - [CLIENT] Domain
  [X] Remote Access Enabled
  [X] BitLocker Enabled - Key Escrowed to AD
  [X] Software Baseline Installed
  [X] VLAN Migrated
  [X] Asset Tag Applied / CMDB Updated

REMOTE ACCESS:
  Authorized User: [Full Name]
  Domain Account:  [CLIENT]\[username]
  Authorization:   [ticket reference or approval location]

NETWORK:
  Imaging VLAN Port:    [12]
  Production VLAN Port: [27]
  IP Address:           [[SUBNET]]

EVIDENCE ATTACHED:
  - BIOS storage mode photo
  - BIOS TPM status photo
  - Task sequence completion
  - Domain join confirmation
  - RDP group membership
  - BitLocker status output
  - AD BitLocker Recovery tab
  - Asset tag photo
  - Validator JSON output

VALIDATION:       [Complete | Complete with exceptions]
EXCEPTIONS:       [none | gate N WAIVED by <L4 name> — <reason>]
READY FOR CLOSURE: [Yes | No]
============================================
```

---

## Rules

**Do not post this note before the validator exits 0**, or before an L4 has waived whatever it flagged. The note asserts things; the validator is what makes those assertions true.

**If Gate 6 was BLOCKED** because the ticket had no authorized user, change the RDP lines to:

```
REMOTE ACCESS:
  NOT ENABLED - no authorized user in service request.
  RDP remains disabled. Requires corrected authorization to proceed.
```

Do not omit the section. A missing section reads like an oversight; an explicit "not enabled and why" reads like a decision, and it protects the technician who left it off.

**If Secure Boot was temporarily disabled at Gate 1**, add:

```
DEVIATIONS:
  Secure Boot disabled [HH:MM] for imaging, re-enabled [HH:MM]. Verified post-image.
```

**Do not claim escrow you did not see.** "Key Escrowed to AD" means someone looked at the BitLocker Recovery tab on the computer object. If the validator returned `MANUAL` and nobody checked, that line is false and it is the single most consequential false line in the note.

## User notification

Separate message, sent after the note is posted:

> Imaging is complete for [Device Name]. Remote access is enabled for your account. Connect with Remote Desktop using your domain credentials ([CLIENT]\[username]). Contact the Service Desk if you run into anything.

Send only if Gate 6 passed. Telling a user remote access is ready when it is blocked generates a second ticket and a worse first impression than saying nothing.
