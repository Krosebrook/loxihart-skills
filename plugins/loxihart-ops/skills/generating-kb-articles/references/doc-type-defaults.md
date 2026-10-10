# Doc Type Smart Defaults

Each doc type includes a set of **required sections** (always generated) and **optional sections** (included by smart default for that type). Users can add or remove optional sections during the Q&A phase.

## Required Sections (All Doc Types)

These sections are always included regardless of doc type:

- **Cover Page** — Title, subtitle ("Created by Loxihart [Department] Team; [Month Year]"), intro paragraph, callout legend
- **Important Links** — External/internal documentation links
- **Contact Us** — Department support email
- **Table of Contents** — Auto-generated from headings
- **Primary Content** — Main body (structure varies by doc type)
- **Appendices** — At minimum Appendix A placeholder; content-dependent

## Smart Defaults by Doc Type

### SOP (Standard Operating Procedure)
| Section | Included | Rationale |
|---------|----------|-----------|
| Decision Tree | NO | SOPs are linear; decision trees add confusion |
| Requirements & Prerequisites | YES | SOPs need prereqs (access, tools, training) |
| Numbered Steps with Expected Results | YES | Core SOP pattern |
| Validation & Verification Checklist | YES | SOPs need completion confirmation |
| Escalation & Exception Handling | YES | What to do when the process breaks |
| RACI Matrix | YES | SOPs are role-dependent |
| Version History Table | YES | SOPs are audited documents |
| Assumptions & Limitations | NO | Usually unnecessary for SOPs |

### Reference Guide
| Section | Included | Rationale |
|---------|----------|-----------|
| Decision Tree | NO | Reference guides are informational, not decisional |
| Requirements & Prerequisites | NO | Readers look things up, not execute |
| Numbered Steps | NO | Not procedural |
| Validation & Verification | NO | Nothing to verify |
| Escalation & Exception Handling | NO | Not a process |
| RACI Matrix | NO | Not role-based |
| Version History Table | YES | Reference docs need version tracking |
| Assumptions & Limitations | YES | Scope boundaries matter for reference |

### Troubleshooting Guide
| Section | Included | Rationale |
|---------|----------|-----------|
| Decision Tree | YES | Core troubleshooting pattern — diagnosis paths |
| Requirements & Prerequisites | YES | Tools/access needed for diagnosis |
| Numbered Steps | YES | Resolution steps per issue |
| Validation & Verification | YES | Confirm the fix worked |
| Escalation & Exception Handling | YES | When to escalate to L2/L3 |
| RACI Matrix | NO | Usually single-role execution |
| Version History Table | YES | Troubleshooting evolves with system changes |
| Assumptions & Limitations | YES | Environment-specific details |

### Runbook
| Section | Included | Rationale |
|---------|----------|-----------|
| Decision Tree | YES | Incident triage needs decision paths |
| Requirements & Prerequisites | YES | Access, tools, credentials needed |
| Numbered Steps | YES | Operational procedure steps |
| Validation & Verification | YES | Confirm system state post-action |
| Escalation & Exception Handling | YES | Critical for incident response |
| RACI Matrix | YES | Multi-role coordination during incidents |
| Version History Table | YES | Runbooks are audited |
| Assumptions & Limitations | YES | Environment-specific configs |

### Onboarding Guide
| Section | Included | Rationale |
|---------|----------|-----------|
| Decision Tree | NO | Onboarding is sequential |
| Requirements & Prerequisites | YES | What's needed before day 1 |
| Numbered Steps | YES | Setup tasks in order |
| Validation & Verification | YES | Confirm access and setup complete |
| Escalation & Exception Handling | NO | Not an operational process |
| RACI Matrix | NO | Single person executing |
| Version History Table | YES | Onboarding evolves |
| Assumptions & Limitations | NO | Usually straightforward |

### Process Document
| Section | Included | Rationale |
|---------|----------|-----------|
| Decision Tree | YES | Process routing decisions |
| Requirements & Prerequisites | YES | Cross-functional inputs needed |
| Numbered Steps | YES | Process flow steps |
| Validation & Verification | YES | Process completion gates |
| Escalation & Exception Handling | YES | Exception handling paths |
| RACI Matrix | YES | Cross-functional = multi-role |
| Version History Table | YES | Process docs are audited |
| Assumptions & Limitations | YES | Scope boundaries for process |

### Custom
| Section | Included | Rationale |
|---------|----------|-----------|
| All optional sections | ASK USER | No defaults — user selects |
