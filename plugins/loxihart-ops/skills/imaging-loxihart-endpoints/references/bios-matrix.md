# BIOS Matrix

Everything needed at Gate 1, per vendor. Source: *Computer Imaging & Deployment Reference Guide v3.1* §3.

## Entry keys

| Manufacturer | BIOS setup | Boot menu |
|---|---|---|
| Dell | F2 | F12 |
| HP | F10 | F9 or Esc |
| Lenovo ThinkPad | F1, or Enter then F1 | F12 |
| Lenovo IdeaPad | F2, or the Novo button | F12 |
| Microsoft Surface | Volume Up + Power | Volume Down + Power |

Press the key immediately and repeatedly from power-on. Waiting for a prompt is how you miss the window and boot into Windows.

If prompted for a password, it is the BIOS admin password in the credentials vault — not the domain admin password.

## Storage controller mode

WinPE in this MDT environment can only see the drive in AHCI or NVMe mode. RAID, Intel RST, and VMD hide the volume and produce the "Disk(0) not found" / `0x80004005` failure.

| Correct | Incorrect |
|---|---|
| AHCI | RAID On |
| NVMe | Intel RST / Intel RST Premium |
| NVMe (Non-RAID) | VMD Enabled / Intel VMD |
| VMD Disabled | Optane Memory Enabled |

### Dell
System Configuration (or Storage) → SATA/NVMe Operation → set AHCI or NVMe. A data-loss warning is expected on a fresh-image target; confirm it.

### HP
System Configuration or Storage Options → SATA Device Mode or NVMe Controller Mode → RAID to AHCI. On models with Intel Optane, disable Optane Memory *before* changing the controller mode, or the setting will not stick.

### Lenovo
Config → Storage → Controller Mode. ThinkPads with VMD need the VMD Controller explicitly disabled in the same menu. The setting must read AHCI, not RST and not RAID.

## TPM

Required for BitLocker at Gate 7.

- TPM State: **Enabled**
- TPM Activation: **Activated**
- Specification version: **2.0**

Clearing the TPM permanently erases BitLocker recovery keys sealed to it. On a device with existing encryption that is unrecoverable data loss. Only under explicit L3/L4 direction, and only after escrow is confirmed elsewhere.

## Secure Boot

Leave enabled for production. If and only if imaging fails with a Secure Boot error:

1. Disable it for the imaging pass.
2. Re-enable immediately after Windows installation completes.
3. Record both the disable and the re-enable in the ticket, with timestamps.

A device that ships with Secure Boot still off because someone forgot step 2 is an audit finding, and it will be found by the next posture scan rather than by you.

## Saving and evidencing

Press F10 (or the indicated Save & Exit key), confirm, let it restart.

Photograph before leaving BIOS:
- the storage controller screen showing AHCI or NVMe
- the TPM screen showing Enabled / Activated

Photos are the only durable evidence of a pre-OS setting. Once Windows is on the disk, nobody can retroactively prove what the BIOS said, and the validator can only infer it from bus type afterward.

## Known ambiguity

Some NVMe controllers report `Unspecified` rather than `NVMe` for `Get-PhysicalDisk` BusType after imaging. That produces a WARN, not a FAIL, in the post-image validator — the BIOS photo is what settles it. Do not treat a WARN here as a reason to re-enter BIOS on a working build.
