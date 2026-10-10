# Reference: [CLIENT] Client Profile

Primary managed client. Read before triaging any [CLIENT] ticket.

## Endpoint Environment

- **OS:** Windows 10/11 only — zero Mac endpoints
- **Domain:** `[HOSTNAME]`
- **Imaging:** MDT via `[HOSTNAME]`. Deployment doc: `[CLIENT]-New_Computer_Deployment_v2_0.docx`
- **End-user setup:** `[CLIENT]_Standard_EndUser_Setup_Guide_v2_0.docx`
- **RMM:** Kaseya VSA on all managed endpoints
- **Endpoint security:** Bitdefender GravityZone
- **VPN:** Cisco AnyConnect (remote), OpenVPN fallback
- **MFA:** Duo Mobile
- **Password manager:** Bitwarden (business org)

## Productivity Stack

- **Email/Calendar:** Microsoft 365 (Exchange Online, Outlook desktop + OWA)
- **Collaboration:** Microsoft Teams (desktop app)
- **CRM:** HubSpot
- **Telephony:** Kixie PowerCall — Chrome extension ONLY, no desk phones
- **Browser:** Chrome primary (Kixie dependency)

## [CLIENT]-Specific Gotchas

1. **No desk phones.** Kixie outage = zero voice. Treat as P2.
2. **Chrome dependency.** Chrome crashes break telephony. Check Chrome + Kixie before network.
3. **Ticket routing confusion.** `[EMAIL]` → CS/[CLIENT] queue, not Loxihart Tech.
4. **HubSpot-Kixie integration.** Call logging: Kixie → HubSpot. Logging failure may be integration, not Kixie.
5. **Windows Spotlight override.** KB5046633/KB5048652 changed default desktop to Spotlight. Loxihart has a PowerShell fix (`Disable-Spotlight`) for KRC sessions.

## Top Issues

| Category | Typical Ticket | Tier | KB |
|---|---|---|---|
| Kixie not connecting | "Calls won't go through" | L1 | — |
| Kixie voicemail | "Set up voicemail" | L1 | KB-[CLIENT]-KIXIE-VM-001 |
| Headset auto-switch | "Wrong audio device" | L1 | KB-AUD-001 + EU checklist |
| BitLocker recovery | "Recovery key on boot" | L2 | KB-IT-0032 ([COMPLIANCE FRAMEWORK]) |
| New hire setup | "New employee Monday" | L1 | [CLIENT] setup guide |
| New computer deployment | "New laptop arrived" | L1 | [CLIENT] deployment guide |
| HubSpot-Kixie logging | "Calls not in HubSpot" | L2 | — |
| VPN connectivity | "Can't connect from home" | L1→L2 | — |
