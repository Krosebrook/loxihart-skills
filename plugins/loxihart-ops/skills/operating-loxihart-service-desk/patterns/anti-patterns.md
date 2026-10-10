# Anti-Patterns — Operating Loxihart Service Desk

- Including tier labels (L1, L2) in public/client-visible notes
- Including KB article codes in public notes
- Escalating with "it didn't work" instead of specific evidence with error codes
- Fabricating KB codes for unpublished articles instead of using KB GAP flag
- Listing "potential KB codes" from the registry as if they're published — those are suggestions only
- Executing credential/access action THEN flagging [COMPLIANCE FRAMEWORK] — must be BEFORE
- L1 resetting a password without L2 review — [COMPLIANCE FRAMEWORK] violation even if technically able
- Assuming missed ticket = Loxihart Tech dropped it — check CS/[CLIENT] queue (`[EMAIL]`)
- Acting on Loxihart-ADMIN without confirming local staging vs domain admin (L3 required)
- Re-explaining steps an existing KB article covers — reference the code and section
- Treating Kixie outage as low priority for [CLIENT] — no desk phone fallback = P2 minimum
- Conflating FreshService Project Time Entries with Ticket Time Entries
- Suggesting Mac tools or desk phones for [CLIENT] — Windows-only, Kixie-only environment
- Using Zapier to create M365 Outlook drafts — known silent OAuth failure
- Closing a ticket without KB reference or KB GAP flag — every resolution needs one
- Running HKU offline hive loading in KRC sessions — HKCU is correct scope when logged in as admin
