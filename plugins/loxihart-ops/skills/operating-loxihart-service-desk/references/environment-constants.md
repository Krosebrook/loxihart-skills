# Reference: Loxihart Environment Constants

Locked constraints for Loxihart Technology Services. Read before triage or note drafting.

## Loxihart Tool Stack

| Function | Tool | Notes |
|---|---|---|
| Ticketing / ITSM | FreshService | Dual time tracking: Project vs. Ticket entries |
| RMM | Kaseya VSA / VSA X | Browser-based. Also Kaseya Remote Control (KRC) for manual sessions |
| Endpoint security | Bitdefender GravityZone | Managed push via Kaseya |
| VPN | Cisco AnyConnect / OpenVPN | |
| MFA | Duo Mobile | |
| Password manager | Bitwarden | |
| Domain | `[HOSTNAME]` | |
| MDT imaging | `[HOSTNAME]` | |
| Softphone | Kixie PowerCall | Chrome extension only |
| CRM | HubSpot | |
| Automation | n8n | Zapier M365 has known OAuth failure |

## Known Infrastructure Issues

1. **Loxihart-ADMIN naming conflict.** Local staging account shares name with domain admin on `[HOSTNAME]`. L3 confirmation required.
2. **Zapier M365 draft creation silently fails.** OAuth mismatch. Inline copy-paste only.
3. **FreshService dual time tracking.** Project Time Entries vs. Ticket Time Entries — separate systems.
4. **KRC session context.** When remoting via Kaseya Remote Control, agent runs as logged-in admin user. HKCU is correct scope, not HKU offline hive loading.

## Managed Clients

| Client | Code | Environment Profile |
|---|---|---|
| [CLIENT] | [CLIENT] | Full profile: `references/client-profile.md` |
| RAIOAM | RAI | Partial — webcam setup doc in project, no full profile yet |
| Guardian | GRD | Not documented in this project |
