# Reference: Loxihart Escalation Routing

Full tier boundary logic. Summary in SKILL.md.

## L1 — First Touch

**Can:** Password resets ([COMPLIANCE FRAMEWORK] flag), approved installs, basic connectivity, printer, KB execution, Kixie reinstall/cache, Outlook profile rebuild, KRC remote sessions, PowerShell scripts from `unifying-service-desk/scripts/`.

**Cannot (escalate):** GPO/registry/AD changes, firewall/network config, Exchange/mail flow rules, local admin creation, non-standard software, other users' data, Bitdefender exceptions.

## L2 — Advanced Diagnosis

**Handles:** App error codes, advanced network, endpoint policy (GPO, registry), Kaseya automation, Bitdefender exceptions ([COMPLIANCE FRAMEWORK]), HubSpot-Kixie integration, credential/access [COMPLIANCE FRAMEWORK] actions.

**→ L3 signals:** AD infrastructure needed, server-side root cause, security incident, systemic pattern.

## L3 — Engineering / Infrastructure

**Handles:** MDT imaging, AD infrastructure, server-side RCA, security IR, fleet Kaseya deployment, local admin creation ([COMPLIANCE FRAMEWORK]), Loxihart-ADMIN disambiguation, incident response.

**→ L4 signals:** Vendor defect, hardware warranty, third-party API issue.

## L4 — Vendor Escalation

| Vendor | Channel |
|---|---|
| Dell | Dell ProSupport |
| Microsoft | M365 Admin Center |
| Bitdefender | GravityZone support |
| Kixie | Kixie support portal |

## Overrides

1. Security incident → L3 immediately.
2. [COMPLIANCE FRAMEWORK] trigger → L2+ review BEFORE action.
3. P1 → `unifying-service-desk` escalation-gate.
4. Loxihart-ADMIN ambiguity → L3 confirmation.
