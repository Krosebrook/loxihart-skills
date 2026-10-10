# Reference: Hardware / Peripherals

<overview>
Covers docking stations, external monitors, USB devices, keyboards, mice, chargers, and port failures. Hardware issues are often misdiagnosed as software issues — a bad dock can present as network loss, display failure, and USB dropout simultaneously.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Loose cable / connection | HIGH | L0 |
| Dock firmware outdated | MEDIUM | L1-L2 |
| Display settings incorrect | HIGH | L0 |
| USB port power management | MEDIUM | L1 |
| Driver mismatch (dock/display) | MEDIUM | L1 |
| Defective cable | MEDIUM | L0-L1 (swap test) |
| Hardware failure (dock, peripheral) | LOW | L1 (confirm) → procurement/warranty |
| BIOS settings (USB, Thunderbolt) | LOW | L2 |
| Firmware incompatibility after update | LOW | L2-L3 |

</root_causes>

<l0_steps>

## L0 Self-Service Steps

**1. Check all cables.** Unplug every cable from the dock/device. Wait 10 seconds. Replug firmly. Order: power first, then display cables, then USB/Ethernet.

**2. Try direct connection.** If using a dock — bypass it. Plug the monitor, keyboard, mouse directly into the laptop. If the issue disappears, the dock is the problem.

**3. Try a different port.** Move the USB device to a different port. If the laptop has USB-A and USB-C, try both types.

**4. Restart with peripherals connected.** Restart the computer with all peripherals plugged in. Some drivers only initialize properly at boot.

**5. Check display settings.** Right-click desktop → Display settings → verify external monitor is detected. Click "Detect" if not. Try Windows + P to toggle display modes (Duplicate, Extend, Second screen only).

**6. Try a different cable.** If available, swap the display cable (HDMI, DisplayPort, USB-C). Bad cables are common and often intermittent.

</l0_steps>

<l1_steps>

## L1 Tech Steps

**7. Check Device Manager for unknown devices.** Yellow triangle icons indicate driver issues. Right-click → Update driver, or uninstall and restart.

**8. USB power management.** Device Manager → USB Root Hubs → Properties → Power Management → uncheck "Allow the computer to turn off this device."

**9. Dock firmware update.** Check manufacturer site for dock firmware tool (Dell, Lenovo, HP each have their own). Run firmware update and restart.

**10. Display driver update.** Device Manager → Display adapters → Update driver. For dual-display issues, update both the integrated GPU and discrete GPU drivers.

**11. Test with known-good hardware.** Swap the dock, cable, or peripheral with a known-working unit. If the issue follows the device, it is defective. If it stays with the port/laptop, the issue is on the endpoint.

**12. Check BIOS Thunderbolt/USB-C settings.** Some BIOS configurations limit Thunderbolt functionality or USB-C power delivery. Restart → enter BIOS → check Thunderbolt security level, USB-C charging settings.

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Dock firmware update fails or dock is on latest firmware but still malfunctioning
- BIOS change needed for a fleet of devices (standardization)
- Display driver issue affecting multiple users with same GPU model
- Hardware confirmed defective → L2/procurement for warranty RMA
- Thunderbolt security policy change needed (Group Policy level)

</l2_indicators>
