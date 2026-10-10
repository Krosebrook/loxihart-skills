# Reference: Software / Applications

<overview>
Covers application crashes, Teams/Zoom issues, browser problems, Office suite failures, LOB (line-of-business) app errors, and general software malfunction. Software issues are the broadest category — the key diagnostic skill is isolating whether the problem is app-specific, user-profile-specific, or system-wide.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Corrupted app cache | HIGH | L0-L1 |
| Outdated application | HIGH | L0-L1 |
| User profile corruption | MEDIUM | L1 |
| Conflicting software | MEDIUM | L1-L2 |
| Insufficient disk space | MEDIUM | L0-L1 |
| Missing dependencies (.NET, Visual C++ runtime) | MEDIUM | L1 |
| Windows Update broke compatibility | LOW | L2 |
| Group Policy restricting application | LOW | L2 |
| Application bug (vendor defect) | LOW | L3 (vendor) |

</root_causes>

<l0_steps>

## L0 Self-Service Steps

**1. Close and reopen the application.** Fully close (check system tray). Reopen and test.

**2. Restart the computer.** Clears temp files, resets services, releases locked files.

**3. Check for updates.** In the application: Help → Check for updates (or equivalent). Install if available.

**4. Clear application cache.**
- Teams: Close Teams → File Explorer → paste `%appdata%\Microsoft\Teams` → delete all contents → reopen Teams
- Browser (Chrome): Settings → Privacy → Clear browsing data → Cached images/files
- Browser (Edge): Settings → Privacy → Clear browsing data
- Outlook: see email-calendar reference for Outlook-specific steps

**5. Check disk space.** Settings → System → Storage. If drive is >90% full, application performance degrades. Delete files or empty recycle bin.

**6. Try a different browser (if web-based issue).** If Chrome crashes on a site, try Edge. If the issue is browser-specific, the problem is likely cache or extension related.

</l0_steps>

<l1_steps>

## L1 Tech Steps

**7. Run user profile repair script.** Execute `scripts/user-profile-repair.ps1` — clears Teams cache, browser cache, Outlook profile rebuild preparation, and temp files.

**8. Check Event Viewer for application errors.** Event Viewer → Windows Logs → Application. Filter by Error level in the last 24 hours. Look for the failing application name, note the faulting module and exception code.

**9. Repair/reinstall the application.**
- For Office: Settings → Apps → Microsoft Office → Modify → Online Repair
- For other apps: uninstall completely, restart, reinstall from approved source
- For Store apps: Settings → Apps → [app] → Advanced options → Repair, then Reset if Repair fails

**10. Check dependencies.**
- .NET Framework: run `dotnet --list-runtimes` in PowerShell
- Visual C++ Redistributables: check Programs and Features for installed versions
- Install missing runtimes if the application requires them

**11. Test with a different user profile.** Have the user log in with a test account (or create a temporary local admin). If the app works under a different profile, the issue is profile-specific. Rebuild the user's profile or roaming profile.

**12. Check for conflicting software.** Clean boot: `msconfig` → Services → Hide all Microsoft services → Disable all → Startup tab → Disable all → Restart. If issue disappears, re-enable services in groups to isolate the conflict.

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Application fails across multiple user profiles (not profile-specific)
- Windows Update identified as the cause (requires rollback analysis)
- Group Policy restricting the application
- Application requires a config change in a centrally managed system
- Vendor defect suspected (consistent crash with specific input/workflow) → coordinate vendor support
- Missing dependency cannot be installed due to policy restrictions

</l2_indicators>
