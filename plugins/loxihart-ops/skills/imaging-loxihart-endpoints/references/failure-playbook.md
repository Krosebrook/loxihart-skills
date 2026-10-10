# Failure Playbook

Symptom → cause → fix → escalation. Source: *Computer Imaging & Deployment Reference Guide v3.1* §5.4, §6.4, §11.

Work the fixes in the order given. They are ordered cheapest-and-most-likely first, not most-thorough first.

---

## Disk not found / `0x80004005` at partition step

**Gate:** 3–4 · **Tier:** L1, then L2 if BIOS is already correct

Storage controller is in RAID, Intel RST, or VMD mode, so WinPE cannot see the volume.

1. Reboot into BIOS.
2. Set storage mode to AHCI or NVMe. On Lenovo, disable the VMD controller explicitly. On HP with Optane, disable Optane first.
3. Save, restart, retry PXE.

If BIOS already reads AHCI/NVMe and the disk is still invisible, this is a missing storage driver in the boot image → **L2** for driver injection. Include the exact model and storage controller name.

---

## PXE boot timeout / no boot file

**Gate:** 3 · **Tier:** L1 → L2 → L3

Usually a missing WinPE NIC driver. Sometimes DHCP, the port, or the PXE service.

1. Confirm the **IPv4** boot entry was selected, not IPv6. The PXE server is IPv4-only, and the IPv6 entry fails silently in exactly this way.
2. Reseat the adapter, confirm the green link light.
3. If the adapter is Realtek, swap to Intel. Do not troubleshoot further on a Realtek adapter.
4. Try a different Departmental port, 1–24.
5. Verify the deployment server answers from a known-good workstation.

Server unreachable from a known-good workstation → **L3**. Everything else exhausted → **L2**.

---

## LiteTouch wizard never appears

**Gate:** 3 · **Tier:** L1 → L3

WinPE loaded but cannot reach the deployment share.

1. At the WinPE command prompt, launch it directly:
   ```
   X:\Deploy\Scripts\LiteTouch.vbs
   ```
2. If that errors, the problem is network, not the wizard:
   ```
   ipconfig /all
   ping [HOSTNAME]
   ```
3. No address → `wpeutil InitializeNetwork` then `ipconfig /renew`.

Network is confirmed good and the share still will not mount → **L3**.

---

## Task sequence fails mid-process

**Gate:** 4 · **Tier:** L2 → L3

One retry is reasonable. A second failure means you need the packet, not another hour.

Capture before escalating:
- Photo of the exact error text
- The phase it died in (partition / apply / drivers / OOBE / apps / finalize)
- Model and serial
- Confirmed BIOS storage mode
- Task sequence name selected

Escalate to **L2**; L2 routes to **L3** for task sequence or WinPE packaging issues.

---

## Domain join — "Domain could not be found"

**Gate:** 5 · **Tier:** L1 → L2

DNS resolution or network isolation.

```powershell
ping [HOSTNAME]
ipconfig /all
```

If DNS is not pointing at the domain servers:

```powershell
Set-DnsClientServerAddress -InterfaceAlias 'Ethernet' -ServerAddresses '[SUBNET]','[SUBNET]'
```

Verify the interface alias first with `Get-NetAdapter` — on a USB adapter it is rarely literally `Ethernet`, and setting DNS on the wrong interface produces a confusing non-fix.

Still failing → **L2**.

---

## Domain join — "Access denied" / "Incorrect password"

**Gate:** 5 · **Tier:** L1 → L2

1. Username must be fully qualified: `[CLIENT]\Loxihart-Admin`, not `Loxihart-Admin`.
2. Confirm the password from the vault and that the account is not locked.
3. Confirm the account holds "Add workstations to domain".

Correct format and unlocked account still denied → **L2**. Repeated failures can lock the account, which turns one stuck build into several.

---

## Domain join — time synchronization error

**Gate:** 5 · **Tier:** L1

Kerberos rejects a clock more than five minutes off the DC.

```powershell
w32tm /resync /force
```

If that fails:

```cmd
net time \\[HOSTNAME] /set /yes
```

Then retry the join. A freshly imaged machine with a dead CMOS battery will do this repeatedly — if it recurs on the same serial, that is a hardware note for the CMDB, not a rerun.

---

## RDP user will not resolve at Check Names

**Gate:** 6 · **Tier:** L1 → requester

The account does not exist, is disabled, or the domain prefix is wrong.

1. Confirm the exact `[CLIENT]\username` against the ticket.
2. Confirm the account is active in AD.

Do not substitute a similar-looking account, and do not add a group "so it works for now." Return to the requester for a corrected authorization. Gate 6 stays `BLOCKED` and RDP stays off; the rest of the build can still complete.

---

## BitLocker will not enable

**Gate:** 7 · **Tier:** L1 → L3

TPM not ready, Group Policy conflict, or hardware fault.

1. `tpm.msc` → confirm ready for use, spec 2.0.
2. `manage-bde -status` → read the actual failure text.
3. `gpupdate /force`, then `gpresult /r` to confirm the encryption policy applied.

Any remaining failure → **L3**. Do not clear the TPM to "reset" it.

---

## BitLocker is on but no key appears in AD

**Gate:** 7 · **Tier:** L3, before closure

The endpoint has a protector; the directory does not have the key. That is a single point of permanent data loss.

1. Confirm the computer object is in the OU where the escrow policy applies.
2. Confirm the encryption GPO applied (`gpresult /r`).
3. Escalate to **L3** to force a backup of the key protector.

This blocks closure. Hard stop 6.

---

## Device is already encrypted when you arrive

**Gate:** 0–1 · **Tier:** L2

Suspend protection through the supported path. Do not clear the TPM, and do not change storage controller mode until the data question is settled — both destroy access to the existing volume.

If the user needs data off the device, that is a separate line on the ticket and it happens **before** any BIOS change.

---

## Escalation packet

Every escalation, regardless of tier, includes:

- Device serial and model
- Exact error text, screenshot preferred over transcription
- Steps already attempted, in order
- BIOS settings verified
- Network test results
- Timestamp the issue first appeared
- Run-state file, or the gate you stopped at

An escalation without this is a round trip. The packet is the difference between a fix today and a fix Thursday.
