# Tutorial Output Template

Fill-in-the-blank format for FlashFusion workflow tutorials. Supplement to the inline template in SKILL.md.

---

```
WORKFLOW OF THE WEEK: [Short descriptive title]
[INITIAL WALKTHROUGH — NOT YET TESTED. | Tested on [date], [tool version].]
Time to implement: [X minutes | X minutes setup + Y minutes/week | ~X minutes (estimated)]
Tools needed: [Tool 1 (free tier / Pro required), Tool 2 (free), ...]
Difficulty: [Beginner | Intermediate | Advanced]

WHAT YOU'LL BUILD
[1–2 sentences naming the specific deliverable.
✗ Wrong: "Save time on research."
✓ Right: "A Claude prompt chain that returns scored article summaries with creator angles from 5 URLs in under 10 minutes."]

[PREREQUISITES — omit section if none]
Before starting, you need:
- [Account or tool that must exist before Step 1]
- [Any paid tier or API key required]

STEPS
1. [Imperative verb phrase — Open / Paste / Click / Navigate to]
   → [What the reader should see or receive as a result]

2. [Next step — single action only; split multi-action steps]
   → [Expected result]

[... continue for all steps]

TEST IT
[Specific instruction naming the exact input and the exact expected output.]
[Recovery instruction: "If you see [X], [do Y]."]

VARIATIONS
- [Adaptation 1 — a different tool, use case, or audience]
- [Adaptation 2 — optional]
```

---

## Field Rules

**Title:** Should include the outcome, not just the tool. "AI Research Brief with Claude" > "Using Claude."

**Test status line:** Required on every tutorial. Either confirmed tested or labeled as not tested. No omitting.

**Time to implement:** Use the actual time after running it yourself. If untested, use `~` prefix to signal estimate.

**Tools needed:** List every tool. Format: `Tool Name (free tier | Pro | $X/month at time of writing)`. If a tool requires a paid tier, that must appear here — not buried in a step.

**WHAT YOU'LL BUILD:** Test by asking: "Can the reader picture the thing they'll have when done?" If not, rewrite.

**STEPS:** Each step = one action. If a step requires the reader to think before acting, it needs a sub-note, not a new imperative.

**TEST IT:** Must name: (1) what input to use, (2) what output to look for, (3) what to do if it fails. All three.

**VARIATIONS:** Optional but preferred. Shows range. Keep to 1–2 — more dilutes focus.
