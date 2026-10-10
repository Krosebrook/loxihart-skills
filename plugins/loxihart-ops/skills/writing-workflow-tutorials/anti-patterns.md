# Anti-Patterns — Writing Workflow Tutorials

Common mistakes and why they fail. Each maps to a Delivery Checklist gate.

---

## Anti-Pattern 1: Aspirational Time Estimate (Gate 3)

**Wrong:**
```
Time to implement: 5 minutes
```
(Tutorial has 12 steps including OAuth app creation and credential configuration)

**Why it fails:** Reader's first experience is disappointment. Trust is broken at step 3 when they're still in account setup 20 minutes later.

**Fix:** Run the tutorial. Use the actual time. If untested, write `~X minutes (estimated)`.

---

## Anti-Pattern 2: Hidden Prerequisites (Gate 4)

**Wrong:**
```
Tools needed: n8n, Gmail
Steps:
1. In n8n, open your existing Gmail credential...
```
(Setting up the Gmail credential requires creating a Google Cloud project, enabling the Gmail API, and configuring OAuth 2.0 — a 15-minute process not in the tools list)

**Why it fails:** Reader hits a wall at step 1. They didn't know they needed a Google Cloud project. They bounce.

**Fix:** List every account, key, permission, and paid tier in "Tools needed". If prerequisite setup is complex, add a Prerequisites section before Step 1 or make it Step 0.

---

## Anti-Pattern 3: Vague Verification (Gate 5)

**Wrong:**
```
TEST IT
Run the workflow and verify it works.
```

**Why it fails:** Reader can't distinguish "working but wrong output" from "actually broken." They trust a broken workflow and publish a newsletter with bad data.

**Fix:** Name the specific input and the specific expected output. "Run with this input: [X]. You should see [Y] appear in [Z tool]."

---

## Anti-Pattern 4: Complexity Mismatch (Gate 6)

**Wrong:**
```
Difficulty: Beginner
...
Step 7: Configure the webhook endpoint in your n8n cloud instance and paste your
production API key from the Make.com secrets vault.
```

**Why it fails:** A Beginner reader doesn't have a production API key, doesn't know what a webhook endpoint is, and doesn't use a secrets vault. They don't fail — they don't even try.

**Fix:** If any step requires API keys, cloud credentials, or technical infrastructure → minimum Intermediate. If it requires understanding the concept before doing the action → minimum Intermediate.

---

## Anti-Pattern 5: Generic "WHAT YOU'LL BUILD" (Rule 2)

**Wrong:**
```
WHAT YOU'LL BUILD
Save time on newsletter research.
```

**Why it fails:** Every productivity tool "saves time." This says nothing. Reader has no reason to read on.

**Fix:** Name the specific deliverable. "A Claude prompt chain that returns a structured research brief — with scores, creator angles, and action items — from 5 article URLs in under 10 minutes."

---

## Anti-Pattern 6: Missing Test Status (Gate 2)

**Wrong:**
```
WORKFLOW: HeyGen Avatar Script Generator
Time to implement: 20 minutes
```
(No testing note, no tested-on date, no "INITIAL WALKTHROUGH" label)

**Why it fails:** Reader trusts the tutorial because it looks polished. They follow it. It breaks on step 6 because HeyGen's API changed last month. They never try a FlashFusion tutorial again.

**Fix:** Every tutorial carries one of two lines:
- `Tested on [date], [tool version].`
- `INITIAL WALKTHROUGH — NOT YET TESTED.`

Never omit the testing status.
