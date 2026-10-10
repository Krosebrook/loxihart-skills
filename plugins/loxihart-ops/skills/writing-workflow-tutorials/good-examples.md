# Good Examples — Writing Workflow Tutorials

Annotated correct outputs. Reference these when unsure whether an element meets standard.

---

## Example 1: Correct Verification Step

**From:** Claude Research Brief tutorial

```
TEST IT
Share 3 articles with the prompt. Verify each returns:
- A relevance score (1–5)
- A creator-angle paragraph
- One immediate action item

If output is too generic, add "assume reader is a solo newsletter creator
writing about AI tools" to the system prompt and re-run.
```

**Why this is correct:**
- Names a specific observable output (score, paragraph, action item — not just "it works")
- Provides a specific recovery action for the most common failure mode
- Reader knows exactly what success looks like and what to do when it fails

---

## Example 2: Correct Complexity Calibration

A tutorial with:
- 6 steps
- Tools: Claude (claude.ai free tier) and Notion (free tier)
- No code blocks
- Tested at 12 minutes

→ Correctly labeled: **Beginner**

Why:
- ≤8 steps ✓
- Free tools only ✓
- No code ✓
- ≤15 minutes ✓

If step 4 had required pasting a Python script: → escalates to **Intermediate** regardless of step count.

---

## Example 3: Correct Tools List

```
Tools needed: Claude (claude.ai, free tier), Notion (free tier), n8n (cloud trial or self-hosted)
```

**Why this is correct:**
- Every tool listed by name
- Tier requirement explicit for each
- Reader can audit their access before starting, not mid-tutorial

---

## Example 4: Correct Untested Label

```
WORKFLOW: HeyGen Avatar Video from Newsletter Section
INITIAL WALKTHROUGH — NOT YET TESTED. Verified desktop browser flow only.
Will update with mobile + error cases in next issue.
Time to implement: ~30 minutes (estimated)
```

**Why this is correct:**
- Signals testing status transparently — reader knows what to trust
- States what IS verified (desktop browser)
- `~` prefix on time signals estimate, not confirmed time
- Commits to an update — builds credibility rather than hiding the gap

---

## Example 5: Correct "WHAT YOU'LL BUILD"

```
WHAT YOU'LL BUILD
A Claude prompt chain that returns a structured research brief — with scores, creator angles,
and one action item per article — from 5 article URLs in under 10 minutes.
```

**Why this is correct:**
- Describes the specific deliverable (structured research brief)
- Names what's in it (scores, angles, action items)
- Quantifies the experience (5 articles, 10 minutes)
- Reader can picture the output before reading a single step
