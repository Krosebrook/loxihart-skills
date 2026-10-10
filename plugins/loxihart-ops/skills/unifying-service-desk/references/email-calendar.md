# Reference: Email / Calendar

<overview>
Covers Outlook crashes, email sync failures, shared mailbox access, calendar permission issues, Exchange-related problems, and mail flow errors. Email issues are high-impact because email is a core communication channel. Most Outlook issues are profile or cache related — L0/L1 resolve 80%+ by clearing the local profile.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| Outlook profile corrupted | HIGH | L1 |
| OST file oversized or corrupted | HIGH | L1 |
| Cached Exchange mode sync issue | MEDIUM | L0-L1 |
| Shared mailbox permission not granted | MEDIUM | L1 |
| Calendar delegate permissions incorrect | MEDIUM | L1 |
| Autodiscover misconfiguration | LOW | L2 |
| Exchange server issue | LOW | L2-L3 |
| Mail flow rule blocking delivery | LOW | L2 |
| Mailbox quota exceeded | MEDIUM | L0-L1 |
| Add-in conflict | MEDIUM | L1 |

</root_causes>

<l0_steps>

## L0 Self-Service Steps

**1. Check Outlook Web App (OWA).** Go to https://outlook.office365.com. If email works in OWA but not desktop Outlook, the issue is local to the Outlook client.

**2. Restart Outlook.** Close fully (File → Exit, not just X). Reopen.

**3. Check internet connection.** Outlook shows "Disconnected" or "Trying to connect" in the status bar. Verify internet is working (try a website). If on VPN, verify VPN is connected.

**4. Check mailbox size.** File → Account Settings → Account Settings → double-click account → see mailbox size. If near or at quota, delete old emails or empty Deleted Items/Junk.

**5. Toggle Cached Exchange Mode.** File → Account Settings → Account Settings → double-click account → uncheck "Use Cached Exchange Mode" → OK → restart Outlook → re-enable it. This forces a fresh sync.

**6. Clear Outlook cache.** Close Outlook → File Explorer → `%localappdata%\Microsoft\Outlook\RoamCache` → delete contents → reopen Outlook.

</l0_steps>

<l1_steps>

## L1 Tech Steps

**7. Repair Outlook profile.** Control Panel → Mail → Show Profiles → select profile → Properties → Email Accounts → Repair. If repair fails, create a new profile and set as default.

**8. Rebuild OST file.** Close Outlook → navigate to `%localappdata%\Microsoft\Outlook` → rename the .ost file (add .old) → reopen Outlook. It will create a fresh OST and resync from the server. This can take time for large mailboxes.

**9. Run user profile repair script.** `scripts/user-profile-repair.ps1` includes Outlook profile rebuild steps.

**10. Run Outlook in safe mode.** `outlook.exe /safe` — if Outlook works in safe mode, the issue is an add-in. Disable add-ins one at a time (File → Options → Add-ins → Manage COM Add-ins) to isolate the conflict.

**11. Shared mailbox / calendar permissions.** In Exchange admin center or PowerShell:
- `Add-MailboxPermission -Identity "shared@domain.com" -User "user@domain.com" -AccessRights FullAccess`
- For calendar: `Add-MailboxFolderPermission -Identity "user@domain.com:\Calendar" -User "other@domain.com" -AccessRights Editor`
- Permissions can take 30-60 minutes to propagate.

**12. Check Autodiscover.** In Outlook: hold Ctrl → right-click Outlook icon in system tray → "Test Email AutoConfiguration" → test. If Autodiscover fails, the email profile cannot configure correctly. Document the error for L2.

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- Autodiscover failing (DNS or Exchange configuration issue)
- Exchange server connectivity issues affecting multiple users
- Mail flow rules need modification (delivery delays, bouncebacks, routing)
- Mailbox migration issues
- Calendar sync problems that persist after profile rebuild
- Delegate permissions not working despite correct configuration
- Public folder access issues

</l2_indicators>
