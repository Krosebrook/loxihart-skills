# Good Examples — Operating Loxihart Service Desk

## Strong Public Note
```
**Issue:** Calls through Kixie weren't connecting — users heard silence after dialing.
**Steps Taken:**
1. Verified Chrome running and up to date — Chrome 125.0, current
2. Cleared Kixie extension cache and restarted Chrome — no change
3. Reinstalled Kixie extension from Chrome Web Store — calls connected after reinstall
**Outcome:** Resolved
**Next Action:** None required. If the issue recurs, please contact us and reference this ticket.
```
Why: Plain language. Each step has a result. No jargon. Clear outcome.

## Strong Escalation Note
```
**Escalation to L2**
**Why this needs L2:** BitLocker suspension requires MBAM/AD admin access. L1 cannot retrieve recovery keys per [COMPLIANCE FRAMEWORK].
**Steps Attempted:**
- Confirmed BitLocker recovery screen (Key ID prefix 8A3F2D)
- Verified KB5034765 installed overnight — known UEFI Secure Boot trigger
- Referenced KB-IT-0032 BitLocker Suspension procedure — requires admin access to execute
**Recommended Next Step:** Retrieve key from MBAM using prefix 8A3F2D. Suspend for 1 reboot cycle.
**[COMPLIANCE FRAMEWORK] Flag:** Yes — endpoint security posture change.
```
Why: Specific evidence. Error codes. KB referenced. Actionable. [COMPLIANCE FRAMEWORK] flagged.

## Strong Resolution Summary (KB-grounded)
```
**Root Cause:** Exclusive audio control enabled on USB headset. Teams seized device, blocking Kixie.
**Fix Applied:** Followed KB-AUD-001 headset auto-switch procedure. Unchecked exclusive control, set as Default Communication Device, restarted Chrome.
**Verification:** Test call via Kixie with Teams open in background — audio bidirectional. Stable 10 minutes.
**KB Reference:** KB-AUD-001
**Recurrence Risk:** Low — setting persists unless Windows Update resets audio device properties.
```
Why: Root cause specific. Fix references KB. Verification is the actual failure scenario. Risk justified.

## Strong KB GAP Flag
```
⚑ KB GAP: No article covers Kixie voicemail PIN reset. Recommend creating KB-[CLIENT]-KIXIE-PIN-001.
Context: KB-[CLIENT]-KIXIE-VM-001 covers voicemail box SETUP but not PIN reset. PIN reset requires Kixie admin portal access: Settings → Users → [user] → Voicemail → Reset PIN.
```
Why: Differentiates from existing coverage. Includes resolution context for future authoring.

## Strong Tier Routing
Agent identified Kixie-HubSpot call logging failure as integration issue (L2), not telephony (L1). Routed correctly first time.
