# Governance

Ownership, escalation authority, and audit context. Source: *Computer Imaging & Deployment Reference Guide v3.1* §1, Appendix C, Appendix D.

## Document control

| Field | Value |
|---|---|
| Source title | Imaging and Remote Access Setup for Target Computers |
| Source version | 3.1 (Production Build-out) |
| Owner | Service Desk Team |
| Approver | Change Advisory Board (CAB) |
| Status | Active |
| Review frequency | Annual, or on significant network/configuration change |
| Last review | 2025-11-26 |
| Next review | 2026-11-26 |
| Classification | INTERNAL USE ONLY |

This skill is a derived operational artifact, not a replacement for the CAB-approved document. If the two disagree, the document wins and this skill needs an update. Changes to gate definitions or hard stops should follow the same CAB path as changes to the SOP itself.

## Source set

The upload contained three files:

| File | Words | Status |
|---|---|---|
| `Computer_Imaging_Deployment_Guide_v3.1_Part1.docx` | 3,649 | Authoritative, §1–§5 |
| `Computer_Imaging_Deployment_Guide_v3.1_Part2.docx` | 2,656 | Authoritative, §6–§11 + appendices |
| `Computer_Imaging_Deployment_Guide_COMPLETE_v3.1.docx` | 1,929 | Abridged variant — same version number, less content |

The `COMPLETE` file carries the same version string as the two-part set but omits material and ships a shorter RACI. Two documents claiming v3.1 with different content is a governance defect: whichever one a technician opens determines what they do. Recommend retiring the abridged copy or renaming it to something that cannot be mistaken for the full SOP.

## Roles

| Role | Responsibility in this runbook |
|---|---|
| L1 Technician | Executes gates 0–9. Verifies prerequisites, sets BIOS, selects PXE boot and task sequence, renames and joins, enables RDP for the authorized user, validates connectivity, captures evidence. |
| L2 Technician | BIOS lockout, driver injection, imaging validation, domain join failures, time sync, VLAN mapping errors, baseline software redeployment. |
| L3 Technician | PXE/WDS server issues, MDT task sequence failures, WinPE driver packaging, BitLocker recovery and escrow forcing, unusual hardware. |
| L4 Engineer | Infrastructure (DHCP, DNS, DC), remote-access policy compliance, escalations beyond L3, CAB change control, vendor coordination. Sole authority to waive a gate. |
| Service Desk Lead | Documentation quality, audit trail completeness, ticket closure, KB updates, SOP version control. |

## RACI

R = Responsible · A = Accountable · C = Consulted · I = Informed

| Task | L1 | L2 | L3 | L4 | Manager |
|---|---|---|---|---|---|
| Pre-imaging prerequisite check | **R** | **A** | C | C | I |
| BIOS configuration | **R** | C | C | I | I |
| PXE/MDT imaging execution | **R** | **A** | C | I | I |
| Domain join execution | **R** | C | I | **A** | I |
| RDP enablement | **R** | **A** | C | C | I |
| BitLocker activation | **R** | **A** | C | C | I |
| Imaging failure troubleshooting | C | **R** | **A** | I | I |
| SOP updates & governance | I | C | C | **A** | **R** |

Note the split on domain join: L1 is Responsible for doing it, L4 is Accountable for it being correct. That is why a domain-join deviation goes to L4 rather than being resolved locally.

## ITIL mapping

| Practice | Classification | Application |
|---|---|---|
| Incident Management | Runbook | Imaging failures, PXE issues, domain join errors |
| Service Request Management | Fulfillment procedure | Remote access provisioning and user authorization |
| Change Management | Standard change | New device deployment, reimaging existing devices |
| Knowledge Management | Knowledge article | The SOP and its appendices |

A new deployment is a **standard change** — pre-authorized, no per-instance CAB approval. A deviation from the runbook is not. If you are doing something the gates do not describe, it stops being a standard change and needs L4.

## Why the SOP exists

Stated objectives, useful when someone asks why the gates are not optional:

- Meet First Call Resolution targets through repeatable procedure
- Reduce Mean Time to Restore Service
- Uphold ISO 20000 and internal IT governance
- Eliminate improvisation that produces inconsistent configurations and security gaps
- Enable knowledge reuse across tiers
- Produce an audit-ready artifact

The last one is the load-bearing objective for this skill. Evidence capture is not busywork — it is the deliverable that makes the other five verifiable.

## Waivers

A gate may be recorded `WAIVED` only with:

1. The name of the L4 engineer who authorized it
2. A written reason in the run-state file
3. A note in the ticket

Hard stops cannot be waived by anyone at any tier. They are irreversible actions or policy violations; the correct response is to stop and escalate, not to obtain permission.

## Version history of the source

| Ver | Date | Author | Type | Description |
|---|---|---|---|---|
| 1.0 | 2025-01-01 | Service Desk | Initial | Baseline SOP |
| 2.0 | 2025-06-15 | L3 Team | Major | Added BitLocker and TPM requirements |
| 3.0 | 2025-11-24 | Enterprise IT | Major | ITIL rebuild with troubleshooting |
| 3.1 | 2025-11-26 | Final build-out | Final | Full appendices and command library |
