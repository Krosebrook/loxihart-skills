# Reference: KB Article Registry

Grounded in project files. Cross-reference FreshService for the full published list.

## Published Articles (Confirmed in Project)

| Code | Title | Project File | Companion Docs |
|---|---|---|---|
| KB-AUD-001 | Headset Auto-Switch | `KB-AUD-001_Headset_AutoSwitch_v1_0_0.docx` | End-user checklist: `KB-AUD-001-EU_Headset_EndUser_Checklist_v1_0_0.docx` |
| KB-IT-0032 | BitLocker Suspension | `KB-IT-0032_BitLocker_Suspension_v1_0.docx` | Related: `INT__BitLocker_Suspended_Protection.docx` |
| KB-[CLIENT]-KIXIE-VM-001 | Kixie Voicemail Box Setup | `KB-[CLIENT]-KIXIE-VM-001_How_to_Set_Up_a_Voicemail_Box_on_Kixie.docx` | PDF version: `KB[CLIENT]KIXIEVM001_Voicemail_Setup.pdf` |

## Deployment & Setup Docs (Project Files, Not KB-Coded)

| Document | Project File | Scope |
|---|---|---|
| [CLIENT] New Computer Deployment | `[CLIENT]-New_Computer_Deployment_v2_0.docx` | Full [CLIENT] endpoint build procedure |
| [CLIENT] Standard End-User Setup | `[CLIENT]_Standard_EndUser_Setup_Guide_v2_0.docx` | User-facing setup instructions |
| Loxihart Internal KB Business Case | `INT_InternalKB_BusinessCase_v2_0.docx` | Strategy doc for KB program |

## How-To PDFs (Project Files, Potentially Unpublished)

| Document | Project File | Potential KB Code |
|---|---|---|
| How to Block a Website in Chrome | `HowtoBlockaWebsiteinChrome.pdf` | KB-IT-CHROME-BLOCK-001? |
| How to Upload a Solution Article | `HowtoUploadaSolutionArticle.pdf` | Internal process doc |
| Microsoft Bookings Calendar Link | `MicrosoftBookingsHowtoCreateandManageaBookingsCalendarLink_1.pdf` | KB-[CLIENT]-BOOKINGS-001? |
| RAIOAM Webcam Setup | `RAI_Pete_C_webcam.pdf` | KB-RAI-WEBCAM-001? |

## Other Project Assets

| File | Type | Notes |
|---|---|---|
| `IncidentResponse.jsx` | React component | Incident response UI — may integrate with this skill |
| `[CLIENT]_[PERSON]_[DATE]_ShippingLabel.pdf` | Shipping label | Client-specific, not a KB article |

## Protocol

1. Before drafting any note, check this registry for existing coverage.
2. If covered: reference the code and relevant section. Do not reproduce content.
3. If not covered: resolve normally, append KB GAP flag via `workflows/kb-gap-review.md`.

## KB GAP Flag Format

```
⚑ KB GAP: No article covers [topic]. Recommend creating [code] — [title].
```

## Naming Convention

`KB-[CLIENT]-[TOPIC]-[SUBTYPE]-[NNN]`

Client codes: `[CLIENT]`, `IT` (internal), `AUD` (audio/headset), `RAI` (RAIOAM), `GRD` (Guardian)

## Rules

- Never fabricate codes for unpublished articles
- Never include codes in public (client-visible) notes
- Never re-explain steps an existing article covers
- Potential KB codes in the "How-To PDFs" table above are suggestions, not published codes
