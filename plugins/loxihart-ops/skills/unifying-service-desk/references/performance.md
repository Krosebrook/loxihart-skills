# Reference: Performance

<overview>
Covers slow machines, disk full, high CPU/RAM usage, slow startup, fan noise, and general system sluggishness. Performance issues are deceptive — users say "my computer is slow" but the root cause could be anything from a full disk to cryptominer malware. Systematic diagnosis is essential. Always check for security indicators before assuming benign causes.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Too many startup programs | HIGH | L0 |
| Disk space low (< 10% free) | HIGH | L0-L1 |
| Too many browser tabs/applications open | HIGH | L0 |
| Background Windows Update | MEDIUM | L0 (wait) |
| Fragmented or failing HDD (not SSD) | MEDIUM | L1 |
| Malware / cryptominer | LOW-MEDIUM | L2 (security track) |
| Insufficient RAM for workload | MEDIUM | L1 (confirm) → procurement |
| Outdated drivers causing CPU spikes | LOW | L1 |
| Indexing service thrashing | LOW | L1 |
| Failing hardware (RAM, SSD, thermal throttling) | LOW | L1-L2 |

</root_causes>

<security_check>

## IMPORTANT: Check for Malware First

Before assuming performance is benign, quickly check for security indicators:
- Is CPU consistently at 90%+ even with nothing visually running? (Cryptominer red flag)
- Are there unknown processes consuming high resources in Task Manager?
- Has the user clicked any suspicious links recently?
- Is the fan running at full speed constantly?

If any of these are true, shift to the security-incidents guide before continuing performance troubleshooting.

</security_check>

<l0_steps>

## L0 Self-Service Steps

**1. Restart the computer.** The single most effective performance fix. Clears accumulated memory leaks, temp files, stuck processes.

**2. Close unnecessary applications.** Press Ctrl+Alt+Delete → Task Manager → sort by CPU or Memory. Close applications you are not actively using. Pay attention to browser tabs — each tab consumes RAM.

**3. Disable startup programs.** Task Manager → Startup tab → disable anything not essential. High-impact items to disable: Spotify, Teams autostart (if not needed at login), OneDrive (if not used), Adobe updaters, manufacturer bloatware.

**4. Check disk space.** Settings → System → Storage. If below 10% free space:
- Empty Recycle Bin
- Run Storage Sense (Settings → System → Storage → "Configure Storage Sense or run it now")
- Delete files from Downloads folder

**5. Check for Windows Updates in progress.** Settings → Windows Update. If an update is downloading or installing, wait for it to complete — updates consume CPU, disk, and network during installation.

**6. Check for browser resource consumption.** If using Chrome: three-dot menu → More tools → Task manager. Kill tabs consuming excessive memory or CPU.

</l0_steps>

<l1_steps>

## L1 Tech Steps

**7. Run disk cleanup script.** Execute `scripts/disk-cleanup.ps1` — clears temp files, Windows Update cache, error reports, thumbnail cache. Can reclaim 1-10 GB.

**8. Analyze Task Manager in detail.** Resource Monitor (resmon.exe) gives more detail than Task Manager:
- CPU tab: identify processes consuming the most CPU time
- Disk tab: identify I/O-heavy processes (high Read/Write bytes)
- Memory tab: identify working set size per process
- Network tab: identify unexpected network activity (possible malware indicator)

**9. Check drive health.** Run `wmic diskdrive get status` — should return "OK". For more detail: `Get-PhysicalDisk | Select FriendlyName, MediaType, HealthStatus, OperationalStatus` in PowerShell. If health is "Warning" or "Unhealthy" → backup data and replace drive.

**10. Check RAM utilization.** If committed memory consistently exceeds physical RAM, the system is paging heavily. Check with: Task Manager → Performance → Memory. If "In Use" is >85% of "Total" with normal workload, the machine may need a RAM upgrade.

**11. Disable Windows Search indexing (if thrashing).** services.msc → "Windows Search" → Stop. If performance improves dramatically, the index may be corrupted. Rebuild: Control Panel → Indexing Options → Advanced → Rebuild. Re-enable the service after rebuild.

**12. Check for thermal throttling.** If laptop fan runs constantly at max: check vents for dust blockage, ensure laptop is on a hard surface (not a pillow/blanket), check CPU temperature (HWinfo64 or built-in diagnostics). Sustained temps >95°C = thermal throttling. Clean vents or replace thermal paste (L2 for hardware intervention).

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Malware suspected (unknown processes, sustained high CPU with nothing running)
- Hardware failure confirmed (failing drive, bad RAM — run manufacturer diagnostics)
- Performance issue affects multiple users with same hardware model (fleet-wide issue)
- Root cause requires Group Policy change (indexing policy, power plan, startup policy)
- RAM upgrade needed → procurement process
- Thermal issue requiring hardware service

</l2_indicators>
