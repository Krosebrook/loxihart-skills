# Reference: Print / Scan

<overview>
Covers printers not found, print queue stuck, scan-to-email broken, network printer issues, and driver problems. Print issues are uniquely frustrating because they often appear intermittent and have multiple failure points (driver, spooler, network, printer hardware). The golden rule: always restart the Print Spooler service before deeper investigation.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Print Spooler stuck | HIGH | L0-L1 |
| Printer not added / wrong printer selected | HIGH | L0 |
| Print queue jammed | HIGH | L0-L1 |
| Network printer offline | MEDIUM | L1 |
| Driver mismatch or corruption | MEDIUM | L1 |
| Scan-to-email credentials expired | MEDIUM | L1-L2 |
| Printer hardware failure (paper jam, toner, hardware error) | MEDIUM | L0-L1 |
| Print server issue | LOW | L2 |
| Group Policy printer mapping failure | LOW | L2 |

</root_causes>

<l0_steps>

## L0 Self-Service Steps

**1. Check the basics.** Is the printer powered on? Does it show "Ready" on its display? Any paper jams, flashing lights, or error messages on the printer itself?

**2. Check you are printing to the correct printer.** In the application: File → Print → verify the correct printer name is selected. If the printer is not listed, proceed to step 4.

**3. Clear the print queue.** Settings → Bluetooth & Devices → Printers & scanners → select the printer → Open print queue → cancel all pending documents → try printing again.

**4. Add the printer.** Settings → Bluetooth & Devices → Printers & scanners → Add device. Wait for it to discover network printers. If the printer appears, add it and test. If not, you may need the printer's IP address or network path (ask IT or check the printer's info page).

**5. Restart Print Spooler service.** Press Windows + R → type `services.msc` → Enter → find "Print Spooler" → right-click → Restart. Try printing again.

**6. Try printing from a different application.** If printing fails from Word but works from Notepad, the issue is application-specific, not printer-related.

</l0_steps>

<l1_steps>

## L1 Tech Steps

**7. Run print spooler fix script.** Execute `scripts/print-spooler-fix.ps1` — stops spooler, clears queue files from `C:\Windows\System32\spool\PRINTERS`, restarts spooler.

**8. Reinstall printer driver.** Settings → Printers & scanners → remove the printer → restart → re-add with correct driver. For network printers, use the driver from the manufacturer's site, not Windows auto-detection.

**9. Check network printer connectivity.** Ping the printer's IP address. If no response: check printer is on the network (Ethernet cable, Wi-Fi connected). If printer responds to ping but won't print: the printer's print service may be hung — restart the printer itself (power cycle).

**10. Scan-to-email troubleshooting.** If scan-to-email stopped working: check SMTP credentials on the printer (often stored in printer's web admin interface). If using a service account, verify the password hasn't expired and the account isn't locked. Check if SMTP relay settings changed (SPF records, connector restrictions).

**11. Clear and rebuild print connections.** In elevated PowerShell:
```powershell
Get-Printer | Where-Object { $_.Type -eq "Connection" } | Remove-Printer
```
Then re-add required printers via UNC path or IP.

**12. Check Event Viewer for print errors.** Event Viewer → Applications and Services Logs → Microsoft → Windows → PrintService → Operational. Look for errors during failed print attempts.

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Print server requires restart or configuration change
- Group Policy printer mapping not deploying correctly
- Scan-to-email requires SMTP relay or connector configuration change
- Printer firmware update needed (fleet management)
- Network printer needs to be added to print server for deployment
- Driver compatibility issue affecting multiple users

</l2_indicators>
