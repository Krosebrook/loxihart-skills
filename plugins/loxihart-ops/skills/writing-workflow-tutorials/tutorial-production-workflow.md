# Tutorial Production Workflow

End-to-end process for producing a FlashFusion workflow tutorial — from idea to delivered output.

---

## Step 1 — Idea Intake

Capture before writing:
- Tool or workflow being covered
- Tutorial type (Quick / Deep-dive / Automation / AI Config / Integration)
- Target difficulty (Beginner / Intermediate / Advanced)
- Destination section (Workflow of the Week / Standalone / Newsletter appendix)

If any of these are missing, apply defaults from context and label them.

---

## Step 2 — Type Selection

Run the Quick-Start Decision Tree in SKILL.md:

```
Quick workflow (5–10 steps) → ≤400 words, newsletter section length
Deep-dive               → 600–900 words + screenshots
Automation setup        → n8n/Zapier/Make; include JSON/blueprint
AI tool configuration   → Setup + prompt + test run
Integration             → Connect two tools; prereqs → steps → verify
```

**Default when uncertain:** Quick workflow, Beginner. Readers can follow up for depth; they don't come back after bouncing on step 3.

---

## Step 3 — Draft

Use `templates/tutorial-output.md` as the fill-in guide.

Writing rules:
- Steps are imperative verbs: "Open", "Paste", "Click", "Navigate to" — never "You will need to" or "Now it's time to"
- Each step has exactly one action
- Each step has one `→ [expected result]` line
- "WHAT YOU'LL BUILD" names the thing, not the benefit

---

## Step 4 — Test

Run every step exactly as written. Do not paraphrase or skip.

Record:
- Actual time taken
- Any step that failed or required a deviation
- The exact version/UI state of each tool

Update the tutorial:
- Replace `~X minutes (estimated)` with the actual time
- Add any error + fix pairs discovered
- If tested: remove the `NOT YET TESTED` label and replace with `Tested on [date], [tool version]`
- If untested: keep the label; do not remove it

---

## Step 5 — Quality Gate Check

Run every item in the Delivery Checklist in SKILL.md.

Every FAIL condition must pass before delivery. If a condition fails, fix the tutorial — do not adjust the FAIL condition to match.

---

## Step 6 — Deliver

1. Declare output mode per Rule 0
2. Produce content
3. If file output: write to `outputs/[tutorial-slug].md`
