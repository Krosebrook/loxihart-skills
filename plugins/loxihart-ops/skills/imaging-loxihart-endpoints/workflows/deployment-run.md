# Deployment Run — Gate by Gate

The repeatable unit of work. One run = one device = one run-state file.

Each gate below gives: **Entry** (what must already be true), **Do** (the actions), **Prove** (the exit criterion and how it is verified), **Evidence** (what gets attached to the ticket), **Fail** (where it goes if the exit criterion is not met).

Do not advance on a gate whose Prove step did not actually happen. "It looked fine" is not a Prove step.

---

## Gate 0 — Authorization & Prerequisites

**Entry:** A service ticket exists.

**Do:**
- Read the ticket for the remote-access request. Extract the authorized user's full name and `DOMAIN\username`.
- Confirm manager approval is recorded in the ticket, not verbal.
- Confirm the user's AD account is active and not expired.
- Physical: device powered off, on AC power (not battery), external keyboard/monitor if needed.
- Confirm TPM 2.0 is present on the model.
- Obtain an Intel-based USB-to-Ethernet adapter and a Cat5e/Cat6 cable.
- Pull the BIOS admin password and `[CLIENT]\Loxihart-Admin` from the credentials vault.
- Identify a free Departmental VLAN port in range 1–24.
- Have a camera ready and asset tag labels on hand.

**Prove:** Every item in the pre-imaging checklist is checked with a timestamp in the ticket.

**Evidence:** Screenshot of the ticket showing the named authorized user and the approval.

**Fail:** No named user or no approval → do not proceed to any later gate. Reply to the requester asking for authorization. This is not an escalation, it is an incomplete request.

> Hard stop 5 lives here. Everything downstream assumes Gate 0 produced a named, approved principal.

---

## Gate 1 — BIOS Configuration

**Entry:** Gate 0 PASS. Device powered off.

**Do:**
- Power on and press the vendor BIOS key repeatedly (see `references/bios-matrix.md`).
- Navigate to the storage controller setting.
- Change RAID / Intel RST / VMD → **AHCI** or **NVMe (non-RAID)**.
- On HP with Intel Optane: disable Optane Memory first.
- On Lenovo ThinkPad: disable the VMD Controller under Config → Storage.
- Verify TPM State = Enabled and TPM Activation = Activated. **Do not clear the TPM.**
- Leave Secure Boot enabled unless imaging fails on it; if temporarily disabled, record it now and set a reminder to re-enable at Gate 7.
- Save with F10 and exit.

**Prove:** The storage screen visibly reads AHCI or NVMe, and the TPM screen visibly reads Enabled/Activated, before you leave BIOS.

**Evidence:** Two photos — storage mode, TPM status. Plus a note of any warning dialog and how it was answered.

**Fail:** BIOS is password-locked and the vault password does not work → L2. Storage mode option absent → L2 for driver injection assessment.

> Hard stops 2 and 3 live here.

---

## Gate 2 — Network Preparation

**Entry:** Gate 1 PASS.

**Do:**
- Seat the Intel USB-to-Ethernet adapter fully.
- Connect the cable to a **Departmental VLAN port, 1–24**. Write the port number down now — it goes in the ticket and you will need it again at Gate 8.
- Confirm the link light is green.
- Boot into WinPE (Gate 3 initiates this; if you are verifying network first, use the WinPE command prompt).
- Run `scripts/winpe-preflight.cmd`, or manually:
  - `ipconfig /all` → expect an address in the imaging range
  - `ping <MDT server>` → expect a reply

**Prove:** WinPE holds a DHCP lease on the imaging range **and** the MDT server answers ICMP.

**Evidence:** Photo of the WinPE console showing the address and a successful ping. Port number recorded.

**Fail:** No address → `wpeutil InitializeNetwork`, then `ipconfig /renew`. Still nothing → swap adapter to a known-good Intel unit, then try a different port 1–24. Still nothing → L2, and if the server itself is unreachable from a known-good workstation, L3.

> Hard stop 4 lives here. A port in 25–48 at this gate invalidates the run.

---

## Gate 3 — PXE Boot & Task Sequence

**Entry:** Gate 2 PASS.

**Do:**
- Power on, press the vendor boot-menu key immediately.
- Select the **IPv4** network entry — `USB NIC (IPv4)` or `UEFI Network (IPv4)`. Never the IPv6 entry; the PXE server is IPv4-only.
- Wait for the LiteTouch wizard.
- Select the approved task sequence:
  - `Windows 11 x64 - 23H2` — standard, use this unless told otherwise
  - `Windows 10 x64 - 22H2` — legacy hardware or Win10-only software, and only when the ticket says so

**Prove:** The wizard shows the intended task sequence name before you confirm.

**Evidence:** Photo of the task sequence selection screen.

**Fail:** No boot file / PXE timeout → `references/failure-playbook.md`. Wizard never appears but WinPE loaded → launch `X:\Deploy\Scripts\LiteTouch.vbs` manually, then re-verify network.

> Hard stop 1 lives here. If a Wipe/Erase/KillDisk sequence is visible in the list, do not select it, and report its presence to L4 — an operator-selectable destructive sequence is itself a finding.

---

## Gate 4 — Image Apply

**Entry:** Gate 3 PASS.

**Do:** Let it run. Expected 30–75 minutes total depending on hardware and network:

| Phase | Typical |
|---|---|
| Disk partition | 1–2 min |
| Image apply | 10–20 min |
| Driver injection | 2–5 min |
| First boot / OOBE | 5–10 min |
| Application install | 10–30 min |
| Finalize | 2–5 min |

Do not power-cycle a device that appears stalled without first checking against these ranges.

**Prove:** The sequence reaches its completion screen with no error dialog.

**Evidence:** Photo of the completion screen.

**Fail:** Mid-sequence failure → capture the exact error text, the phase it died in, model, serial, and confirmed BIOS storage mode. One retry is reasonable. Second failure → L2/L3 with that packet. Do not retry a third time; you are burning an hour per attempt and the packet is what actually gets it fixed.

---

## Gate 5 — Identity

**Entry:** Gate 4 PASS. Device booted to Windows.

**Do:**
- Log in with the local admin account from the vault. First login can take 2–5 minutes.
- If the display is rotated: `Ctrl + Alt + Up Arrow`.
- Rename per convention: `LOX-NB-CLT-NNN` (notebook), `LOX-DT-CLT-NNN` (desktop), `LOX-TB-CLT-NNN` (tablet).
  - GUI: `sysdm.cpl` → Change
  - PowerShell: `Rename-Computer -NewName 'LOX-NB-CLT-045' -Force`
- Join the domain `[CLIENT]`:
  - GUI: `sysdm.cpl` → Computer Name → Change → Domain → `[CLIENT]` → credentials `[CLIENT]\Loxihart-Admin`
  - PowerShell: `Add-Computer -DomainName '[CLIENT]' -Credential (Get-Credential) -Restart`
- Restart.

**Prove:** After restart, `systeminfo | findstr /B /C:"Domain"` returns the domain, and the hostname matches the convention regex.

**Evidence:** Console output of the domain check; screenshot of System → About showing the new name.

**Fail:** "Domain could not be found" → DNS. "Access denied" → credential format or permissions. Clock skew > 5 min → time sync. All three are in `references/failure-playbook.md`. Unresolved → L2.

---

## Gate 6 — Remote Access

**Entry:** Gate 5 PASS. A named, approved principal exists from Gate 0.

**Do:**
- `sysdm.cpl` → Remote tab → Allow remote connections.
- Select Users → Add → enter the exact `[CLIENT]\username` from the ticket → Check Names → OK.
- Or via PowerShell:
  - `Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name 'fDenyTSConnections' -Value 0`
  - `Add-LocalGroupMember -Group 'Remote Desktop Users' -Member '[CLIENT]\username'`
  - `Enable-NetFirewallRule -DisplayGroup 'Remote Desktop'`

**Prove:** Three things, all of them:
1. `Get-LocalGroupMember -Group 'Remote Desktop Users'` lists the authorized principal — and lists nothing you cannot account for.
2. `Get-NetFirewallRule -DisplayGroup 'Remote Desktop'` shows all rules enabled.
3. From another workstation: `Test-NetConnection -ComputerName <hostname> -Port 3389` returns `TcpTestSucceeded : True`.

**Evidence:** Screenshot of group membership, firewall rule state, and the remote connectivity test.

**Fail:** Check Names does not resolve → the account does not exist or is disabled. Do not substitute a similar account. Return to the requester.

> Hard stop 5 is enforced here. If Gate 0 produced no named principal, this gate does not run at all — it is skipped and marked `BLOCKED`, and RDP stays off.

---

## Gate 7 — Security Baseline

**Entry:** Gate 5 PASS. (Gate 6 may be BLOCKED without stopping this gate.)

**Do:**
- Verify baseline software: BitDefender Endpoint (tray icon), Dell Command Update, OpenVPN Client, Microsoft 365 Apps. Redeploy anything missing via the normal channel.
- Run Dell Command Update → check for updates → install recommended and critical → restart if prompted.
- If Secure Boot was disabled at Gate 1, **re-enable it now** and record it.
- TPM: `tpm.msc` → ready for use, spec version 2.0.
- BitLocker: `manage-bde -status`. If not protected: `manage-bde -on C: -RecoveryPassword`.
- Verify escrow in **Active Directory Users and Computers** → the computer object → BitLocker Recovery tab → at least one key listed.

**Prove:** `Protection Status: Protection On`, a `RecoveryPassword` key protector exists on the volume, **and** a recovery key is visible against the computer object in AD.

**Evidence:** `manage-bde -status` output; screenshot of the AD BitLocker Recovery tab.

**Fail:** TPM not ready or GPO conflict → L3. Escrow absent while protection is on → L3 before closure, not after. An endpoint protector without AD escrow is a single point of permanent data loss.

> Hard stop 6 is enforced here.

---

## Gate 8 — VLAN Migration

**Entry:** Gate 7 PASS.

**Do:**
- Unplug from the Departmental port. Record it as "From Port NN".
- Plug into an Internet VLAN port, 25–48. Record it as "To Port NN".
- Verify:
  - `ipconfig` → address in the production range
  - `ping 8.8.8.8` → reply
  - `nslookup google.com` → resolves
  - `ping <domain controller FQDN>` → reply

**Prove:** Production-range address, external reachability, **and** internal reachability. Two out of three is a fail — losing internal reachability on the production VLAN is a routing problem that will surface as a user complaint next week.

**Evidence:** Console output of all four checks; both port numbers recorded.

**Fail:** No address on the new port → try another 25–48 port, then L2 for VLAN mapping. Internet but no DC → L2/L4, routing or ACL.

---

## Gate 9 — Validation & Closure

**Entry:** Gates 0–8 are PASS, BLOCKED-with-reason, or WAIVED-by-L4.

**Do:**
- Run the validator with the expected values:
  ```powershell
  .\Invoke-DeploymentValidation.ps1 `
      -ExpectedHostname 'LOX-NB-CLT-045' `
      -AuthorizedUser   '[CLIENT]\jdoe' `
      -Ticket           'SD-104882' `
      -OutputPath       'C:\Temp\SD-104882.json'
  ```
- Apply the physical asset tag.
- Update the CMDB: asset tag, serial, model, hostname, assigned user, location, status Active — In Use.
- Assemble the evidence manifest.
- Post the completion note from `templates/ticket-completion-note.md`.
- Notify the user.

**Prove:** Validator exits 0. Evidence manifest has a file for every gate that requires one. Completion note contains no bracketed placeholders.

**Evidence:** The validator's JSON output, attached.

**Fail:** Any FAIL from the validator → the ticket does not close. Fix or escalate, then re-run. A validator FAIL that gets waived needs an L4 name against it.

---

## Resuming a Run

Open the run-state file, find the first gate whose status is not `PASS` or `WAIVED`, and re-read that gate's Entry condition before doing anything. Entry conditions exist because a device left half-built overnight may have picked up a GPO, a reboot, or another technician's changes. Re-verify the previous gate's Prove step before continuing if the device sat for more than one shift.
