# Reference: Security Incidents

<overview>
Covers phishing reports, suspected compromised accounts, malware alerts, unauthorized access, and data breach indicators. Security incidents ALWAYS bypass L0/L1 standard workflows — they go directly to L2 minimum with incident response procedures.

THIS CATEGORY OVERRIDES NORMAL TRIAGE. If at any point during any other category's troubleshooting you identify security indicators, stop the current workflow and switch to this reference.
</overview>

<incident_classification>

## Security Incident Types

| Type | Severity | Immediate Action |
|------|----------|-----------------|
| Phishing email reported (no interaction) | LOW | Log, block sender, educate user |
| Phishing link clicked (no credentials entered) | MEDIUM | Scan endpoint, clear browser data, monitor |
| Credentials entered on phishing site | HIGH | Immediate password reset, MFA reset, session revocation, check for unauthorized access |
| Malware detected by AV | HIGH | Isolate endpoint, full scan, check lateral movement |
| Unknown process / cryptominer suspected | HIGH | Isolate endpoint, forensic analysis |
| Unauthorized access to data or system | CRITICAL | Isolate, preserve evidence, notify management |
| Data exfiltration suspected | CRITICAL | Isolate, preserve evidence, legal/compliance notification |
| Ransomware | CRITICAL | Isolate immediately (disconnect network), do NOT restart, contact incident commander |

</incident_classification>

<immediate_response>

## First 15 Minutes (Any Tier)

Regardless of who receives the report, these actions happen immediately:

1. **Do not panic the user.** Calmly collect information. Do not blame them for clicking a link.
2. **Determine what happened.** What did they click? What did they enter? When? What device?
3. **Assess the severity** using the table above.
4. **For HIGH/CRITICAL:** Isolate the endpoint from the network (disable Wi-Fi, unplug Ethernet) BEFORE any other troubleshooting. Leaving a compromised machine on the network allows lateral movement.
5. **Preserve evidence.** Do NOT clear caches, delete emails, or restart the machine. These actions destroy forensic evidence. Document what you see, take screenshots, note timestamps.
6. **Escalate to L2 immediately** with the incident details.

</immediate_response>

<l2_response>

## L2 Incident Response Procedures

**Account Compromise (credentials entered on phishing site):**
1. Reset password immediately (do not wait for user to do it)
2. Revoke all active sessions (Azure AD: Revoke Sessions)
3. Reset MFA registration
4. Check sign-in logs for unauthorized access (Azure AD → Sign-ins → filter by user)
5. Check mailbox rules for forwarding rules added by attacker (common tactic)
6. Check for OAuth app consents granted during the compromise
7. If unauthorized access found → escalate to CRITICAL

**Malware on Endpoint:**
1. Isolate endpoint from network
2. Run full AV scan with latest definitions
3. If malware found: identify the malware type, check if it beacons to a C2 server, check if other endpoints show similar indicators
4. If advanced malware (rootkit, fileless) → engage L3 or incident response vendor
5. After cleanup: reimage the endpoint (do not trust cleanup alone for sophisticated threats)

**Phishing Email (no interaction):**
1. Collect the email headers and body (have user forward as attachment, not inline)
2. Block the sender/domain in email security gateway
3. Check if other users received the same email (search message trace)
4. If widespread: send organization-wide alert
5. Log the incident for phishing trend analysis

</l2_response>

<l3_indicators>

## When to Escalate to L3

- Sophisticated malware requiring forensic analysis
- Evidence of lateral movement (multiple compromised systems)
- Data exfiltration confirmed or suspected
- Ransomware — incident commander engagement needed
- Vendor incident response team needed
- Compliance/legal notification required (data breach threshold met)

</l3_indicators>

<user_communication>

## Talking to Users About Security Incidents

- Never blame the user for clicking a link or entering credentials — phishing attacks are designed to fool people
- Explain what is happening in clear terms: "We're securing your account as a precaution"
- Set expectations: "You'll need to set a new password and re-register your authenticator app"
- If the device is isolated: "Your laptop needs to be disconnected from the network while we check it. You can use [alternative device/OWA] in the meantime."
- Follow up after the incident is resolved — users who reported phishing should be thanked, not punished

</user_communication>
