# Reference: Mobile / Remote

<overview>
Covers MDM enrollment, remote desktop issues, hotspot connectivity, mobile email configuration, and work-from-home setup problems. Mobile and remote issues are increasing as hybrid work becomes standard. The key challenge: you often cannot remotely access the device experiencing the issue (if the user's remote access is what is broken).
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| VPN not connected / misconfigured | HIGH | L0-L1 |
| Remote desktop credentials cached incorrectly | HIGH | L0 |
| MDM enrollment failed | MEDIUM | L1 |
| Mobile email profile incorrect | MEDIUM | L0-L1 |
| Home network blocking required ports | MEDIUM | L0-L1 |
| Hotspot data limit reached | LOW | L0 |
| Company portal app outdated | MEDIUM | L0-L1 |
| Certificate expired (VPN, MDM) | LOW | L2 |
| Conditional access blocking remote device | LOW | L2 |
| Split tunnel VPN not routing correctly | LOW | L2 |

</root_causes>

<l0_steps>

## L0 Self-Service Steps

**1. Check internet connection.** Before troubleshooting remote access, confirm the user has working internet. Can they open a web browser and load google.com? If not, the issue is their local network, not the remote access.

**2. Restart VPN connection.** Disconnect VPN completely, wait 10 seconds, reconnect. If the VPN client shows an error, note the exact error message.

**3. Restart the computer.** This resets network adapters, clears cached credentials, and restarts VPN client services.

**4. Try a different network.** If on home Wi-Fi and VPN fails: try mobile hotspot. If VPN works on hotspot but not home Wi-Fi, the home router may be blocking VPN ports.

**5. Remote Desktop troubleshooting.** If Remote Desktop won't connect: verify you have the correct computer name or IP. Check that VPN is connected first (most RDP targets require VPN). Try: `mstsc /v:computername` from Run dialog.

**6. Mobile email setup.** For mobile email not syncing: Settings → Accounts → remove the work email account → re-add it. Use the autoconfigure option if available. Ensure the device has internet access.

</l0_steps>

<l1_steps>

## L1 Tech Steps

**7. VPN client diagnostics.** Check VPN client logs for error details. Common issues: expired certificate (error about certificate validation), server unreachable (DNS or firewall issue), authentication failure (password changed, MFA not completing).

**8. MDM enrollment / re-enrollment.** If device is not enrolled in MDM (Intune or equivalent):
- Company Portal app installed and up to date?
- User signed in with correct work account?
- Try: remove device enrollment → restart device → re-enroll through Company Portal
- Check MDM admin portal for enrollment errors specific to this device

**9. Remote desktop configuration.** Verify the target machine allows remote connections: System Properties → Remote → "Allow remote connections to this computer." Verify the user's account is in the Remote Desktop Users group. Check if Network Level Authentication (NLA) is causing issues — try disabling temporarily.

**10. Home network troubleshooting.** If VPN works on other networks but not user's home: guide user to check if router firewall is blocking VPN protocols (typically UDP 500, 4500 for IKEv2, or TCP 443 for SSL VPN). Many consumer routers have "VPN passthrough" settings that need to be enabled.

**11. Certificate-based issues.** If VPN or MDM errors reference certificates: check if the user's device certificate has expired (`certmgr.msc` → Personal → Certificates). If expired, the certificate may need to be renewed — check enrollment method.

**12. Conditional Access check.** If user is blocked from accessing resources remotely: check Azure AD Conditional Access policies → Sign-in logs for the user → look for "Blocked by Conditional Access" entries. Note the policy name and conditions for L2 review.

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- VPN infrastructure issue (server-side capacity, certificate authority, configuration)
- Conditional Access policy needs modification for remote access scenario
- MDM enrollment failing systematically for a device type or OS version
- Certificate authority or auto-enrollment issues
- Split tunnel VPN routing configuration change needed
- Remote access architecture change (new site, new VPN endpoint)

</l2_indicators>
