# APP NOTES Template

Optional per-article block the user can provide to handle app-specific quirks.
Store at intake; apply during the capture loop.

```markdown
## APP NOTES — <application name>

**Starting URL:** https://…
**Auth state:** [user logs in manually | already authenticated | SSO redirect expected]

**Timing quirks:**
- <e.g., Settings modal takes ~3s to load — wait for the spinner to clear>

**Navigation quirks:**
- <e.g., left sidebar auto-collapses under 1200px — keep viewport at 1280>
- <e.g., "Admin" menu only appears on hover>

**Element naming:**
- <e.g., the doc says "Phone Settings" but the UI label is "Voice & Telephony">

**Forbidden actions (beyond the standard destructive list):**
- <e.g., do not toggle anything under Billing — live account>

**Test data to use:**
- <e.g., use extension 1099 / contact "QA Test" for any lookup steps>
```

Rules: notes override the document's literal wording when they conflict
(they exist because the doc drifted from the UI). Unused sections are omitted,
not filled with n/a. If capture repeatedly fights the same quirk in an app
with no notes, propose adding this block for next time.
