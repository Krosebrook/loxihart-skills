# Reference: Imaging / Deployment

<overview>
Covers MDT imaging failures, driver injection problems, boot loops post-image, BIOS configuration issues, and deployment automation breakdowns. This category is L1 minimum — end users do not self-service imaging issues. Most imaging problems are systematic (affect every device of a model) rather than one-off.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Missing or wrong driver in image | HIGH | L1-L2 |
| BIOS settings mismatch (UEFI/Legacy, Secure Boot) | HIGH | L1 |
| Task sequence error | MEDIUM | L2 |
| PXE boot failure | MEDIUM | L1-L2 |
| Disk partitioning issue | MEDIUM | L2 |
| WDS/MDT server issue | LOW | L2-L3 |
| Network boot infrastructure failure | LOW | L3 |
| Image corruption | LOW | L2 (rebuild image) |

</root_causes>

<l1_steps>

## L1 Tech Steps

**1. Verify BIOS settings.** Before imaging: confirm UEFI mode (not Legacy), Secure Boot state matches image requirements, TPM enabled if required, boot order includes PXE/USB as needed.

**2. PXE boot troubleshooting.** If device won't PXE boot: confirm Ethernet cable connected directly (not through dock), check BIOS for PXE/network boot enabled, try a different Ethernet port or USB Ethernet adapter.

**3. Check MDT monitoring.** If imaging started but failed: check MDT monitoring console for the device, note the step where the task sequence failed, capture the error code and SMSTS.log path.

**4. Driver injection check.** If device boots after imaging but hardware doesn't work: compare device model to the driver pack in MDT. Ensure the correct driver folder exists and is mapped to the hardware model in the selection profile.

**5. Boot loop after imaging.** If device repeatedly restarts: boot into recovery environment, check if Windows installed successfully (look for Windows\System32), check boot configuration (bcdedit from recovery command prompt), attempt startup repair.

**6. USB boot as fallback.** If PXE fails: create bootable USB with MDT media, boot from USB, run task sequence from USB-initiated deployment.

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Task sequence fails at a specific step consistently across multiple devices of same model
- Driver pack needs to be created or updated for a new hardware model
- MDT/WDS server requires configuration change
- Image itself is corrupted and needs rebuilding
- Disk partitioning requires non-standard layout
- BIOS settings need to be standardized across a fleet (scripted BIOS configuration)
- Deployment infrastructure (PXE, DHCP options, WDS) needs modification

</l2_indicators>

<l3_indicators>

## When to Escalate to L3

- Deployment infrastructure redesign needed (new site, new image architecture)
- Vendor-specific firmware blocking deployment (requires vendor coordination)
- Fleet-wide driver compatibility issue with new hardware model
- MDT/SCCM/Intune migration or architectural change

</l3_indicators>
