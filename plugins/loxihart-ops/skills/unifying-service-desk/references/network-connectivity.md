# Reference: Network / Connectivity

<overview>
Covers VPN failures, Wi-Fi drops, DNS resolution issues, slow internet, proxy errors, network drive mapping failures, and general connectivity loss. Network issues are high-impact because they block nearly everything — email, apps, file access, web browsing.
</overview>

<root_causes>

| Cause | Likelihood | Tier to Fix |
|-------|-----------|-------------|
| DNS cache stale or corrupted | HIGH | L0 (flush) or L1 (script) |
| VPN client misconfigured or outdated | HIGH | L1 |
| Wi-Fi adapter power management | MEDIUM | L1 |
| DHCP lease expired / IP conflict | MEDIUM | L1 (release/renew) |
| Proxy settings incorrect | MEDIUM | L1-L2 |
| Network driver issue | MEDIUM | L1 |
| ISP or upstream outage | LOW | L2-L3 (vendor coordination) |
| DNS server misconfiguration | LOW | L2-L3 |
| Firewall rule blocking traffic | LOW | L2 |
| Certificate issue (VPN, proxy) | LOW | L2 |

</root_causes>

<l0_steps>

## L0 Self-Service Steps

**1. Check other devices**
- Can your phone connect to the same Wi-Fi? Can a coworker next to you get online?
- If others are also down → likely P1/P2 infrastructure issue, escalate immediately

**2. Toggle Wi-Fi off and on**
- Click the Wi-Fi icon in taskbar → click the Wi-Fi button to turn off → wait 10 seconds → turn back on
- Reconnect to the correct network

**3. Restart the computer**
- This resets the network stack, clears DNS cache, renews DHCP lease

**4. Forget and rejoin Wi-Fi network**
- Settings → Network & Internet → Wi-Fi → Manage known networks
- Click the network → "Forget"
- Reconnect and enter password if prompted

**5. Check VPN connection (if applicable)**
- Disconnect VPN, wait 10 seconds, reconnect
- If VPN client shows an error, note the exact error message

**6. Try a different connection method**
- If on Wi-Fi, try Ethernet (if available)
- If on VPN, try disconnecting VPN and accessing resources directly (if on office network)

</l0_steps>

<l1_steps>

## L1 Tech Steps

**7. Run network diagnostic script**
Execute `scripts/network-diag.ps1`:
- ipconfig /all — capture IP, subnet, gateway, DNS
- nslookup [internal domain] — test internal DNS resolution
- nslookup google.com — test external DNS resolution
- ping [gateway IP] — test local network
- ping 8.8.8.8 — test internet (bypasses DNS)
- tracert [target] — identify where packets stop
- ipconfig /flushdns — clear DNS cache
- ipconfig /release then /renew — refresh DHCP lease

**8. Check for IP conflict**
- If ipconfig shows 169.254.x.x → DHCP failed (APIPA address)
- Release and renew. If still APIPA, check DHCP server availability (may need L2)

**9. Reset network adapter**
- Device Manager → Network adapters → right-click adapter → Disable → wait 10s → Enable
- Or: `netsh winsock reset` then `netsh int ip reset` in elevated PowerShell → restart

**10. VPN client troubleshooting**
- Check VPN client version — is it current?
- Check VPN profile/server address — correct?
- Try alternate VPN server if available
- Check if split tunnel vs. full tunnel matters for the resource being accessed
- Review VPN client logs for error codes

**11. Check proxy settings**
- Settings → Network & Internet → Proxy
- Verify proxy settings match organizational standard
- If "Automatically detect settings" is on and shouldn't be (or vice versa), correct it
- Check for proxy auto-config (PAC) file URL if applicable

**12. DNS-specific troubleshooting**
- nslookup [target] [specific DNS server] — test against each configured DNS server
- If internal DNS fails but external works → internal DNS server issue (escalate to L2)
- If all DNS fails but ping by IP works → DNS configuration problem

</l1_steps>

<l2_indicators>

## When to Escalate to L2

- DHCP server not responding (affects multiple users or sites)
- Internal DNS resolution failing across multiple endpoints
- VPN infrastructure issue (server-side, certificate expired, capacity)
- Firewall rule change needed
- Proxy configuration pushed via Group Policy needs modification
- Network driver issue affecting a fleet of identical hardware
- ISP outage confirmed — vendor coordination needed

</l2_indicators>
