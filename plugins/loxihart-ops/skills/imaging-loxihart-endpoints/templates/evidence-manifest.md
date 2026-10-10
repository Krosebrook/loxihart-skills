# Evidence Manifest

The audit artifact. One row per required piece of evidence, filled as the run proceeds.

Evidence captured retroactively is not evidence. A BIOS photo taken after Windows is installed shows a BIOS you already changed twice.

---

## Manifest

| Gate | Artifact | Filename convention | Captured | Notes |
|---|---|---|---|---|
| 0 | Ticket showing named authorized user + approval | `<TICKET>-g0-authorization.png` | ☐ | |
| 1 | BIOS storage mode screen (AHCI/NVMe visible) | `<TICKET>-g1-storage.jpg` | ☐ | |
| 1 | BIOS TPM screen (Enabled/Activated visible) | `<TICKET>-g1-tpm.jpg` | ☐ | |
| 2 | WinPE console: address + successful MDT ping | `<TICKET>-g2-network.jpg` | ☐ | Port number in ticket |
| 3 | Task sequence selection screen | `<TICKET>-g3-tasksequence.jpg` | ☐ | |
| 4 | Task sequence completion screen | `<TICKET>-g4-complete.jpg` | ☐ | |
| 5 | `systeminfo` domain output + System About | `<TICKET>-g5-identity.png` | ☐ | |
| 6 | Remote Desktop Users group membership | `<TICKET>-g6-rdpgroup.png` | ☐ | Omit if Gate 6 BLOCKED |
| 6 | RDP firewall rules enabled | `<TICKET>-g6-firewall.png` | ☐ | Omit if Gate 6 BLOCKED |
| 6 | `Test-NetConnection` port 3389 from remote host | `<TICKET>-g6-rdptest.png` | ☐ | Omit if Gate 6 BLOCKED |
| 7 | `manage-bde -status` output | `<TICKET>-g7-bitlocker.png` | ☐ | |
| 7 | AD computer object → BitLocker Recovery tab | `<TICKET>-g7-escrow.png` | ☐ | **Not waivable** |
| 8 | Post-migration `ipconfig` + connectivity tests | `<TICKET>-g8-vlan.png` | ☐ | Both port numbers in ticket |
| 9 | Asset tag applied to chassis | `<TICKET>-g9-assettag.jpg` | ☐ | |
| 9 | Validator JSON output | `<TICKET>-validation.json` | ☐ | |

---

## Physical inspection

Recorded once at Gate 0 or Gate 9, before handoff:

- ☐ Chassis intact, no cracks or damage
- ☐ All ports functional (USB, HDMI, audio)
- ☐ Display free of dead pixels
- ☐ Power adapter included and working
- ☐ Keyboard and trackpad functional
- ☐ Serial number photographed
- ☐ Asset tag applied

A cosmetic defect found now is a warranty claim. Found by the user in week one, it is a redeployment.

## CMDB fields

- ☐ Asset tag
- ☐ Serial number
- ☐ Model
- ☐ Hostname
- ☐ Assigned user
- ☐ Location
- ☐ Status: Active — In Use

---

## Rules

**Filenames carry the ticket.** Screenshots named `Screenshot 2026-07-24 141203.png` become unattributable the moment they leave the technician's desktop.

**A photo must show the thing being claimed.** A BIOS photo where the storage mode line is out of frame proves nothing. Frame the setting, not the screen.

**Gate 7 escrow evidence is not waivable.** Every other row can be marked missing with an explanation. The AD BitLocker Recovery screenshot cannot — its absence is the exact condition that produces unrecoverable data loss, which is the whole reason the gate exists.

**Missing evidence is declared, not omitted.** If a row is unfilled, write why in Notes. A blank row reads as forgotten; "device shipped pre-tagged by vendor, tag photo from receiving attached to parent ticket" reads as handled.
