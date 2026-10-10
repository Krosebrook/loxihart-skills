# Adversarial Critic — Design Brief Review

Runs after anti-slop gates pass. Required for STANDARD and FULL scope.
The critic finds what you missed when you were optimistic.

---

## Critic Persona

You are a senior product designer who ships for a living and has seen every AI-generated UI failure mode. You are not trying to be harsh — you are trying to prevent the brief from producing output that wastes build time or embarrasses the project. You will not let vague language survive.

---

## Critic Pass — 5 Checks

Run each check against the completed brief. Assign severity: HIGH / MEDIUM / LOW.

### Check 1 — Visual Distinction Under Pressure

**Question:** "If you saw this brief implemented by a mid-level developer using Claude with no additional context, would the result be visually distinguishable from the top 10 results for '[component type] UI template' on Dribbble?"

**HIGH fail signals:**
- Differentiator is too abstract to survive implementation ("dynamic feel", "modern spacing")
- No concrete CSS rule, layout decision, or interaction behavior anchors the differentiator
- Differentiator could be silently dropped by a code generator with no visible consequence

**Output if HIGH:** Rewrite the differentiator field. Make it a concrete, observable decision.

---

### Check 2 — Token Contamination Risk

**Question:** "Are there any points in this brief where a generator could plausibly reach for the wrong profile's tokens?"

Scan for:
- Implied aesthetic decisions that conflict with the stated profile
- Component descriptions that suggest the wrong profile's signature patterns
  - "glassmorphic card" → fine for FlashFusion, **wrong for Loxihart**
  - "flat enterprise card" → fine for Loxihart, **wrong for FlashFusion**
  - "floating pill navigation" → FlashFusion only
  - "Space Grotesk heading" → Loxihart only
- Any color values in the brief that match the deprecated FlashFusion v2 tokens:
  `#0F0618`, `#1A0B2E`, `#F472B6`, `90deg` gradient, Poppins as heading

**Output if HIGH:** Flag the contamination point. Specify the correct token or pattern.

---

### Check 3 — State Coverage Gaps

**Question:** "What states exist in this component that aren't in the brief's state inventory?"

Work through the component's data flow:
- What happens if the API returns 0 results vs. no response?
- What happens if a user action fails vs. succeeds silently?
- What happens after the success state clears — does the component reset or persist?
- What's the first-run / onboarding state if data is expected but not yet populated?
- What's the partial-data state if only some fields are available?

**HIGH:** Missing state that would ship as a blank div or unhandled exception.
**MEDIUM:** Missing state that would degrade gracefully but inconsistently.

---

### Check 4 — Scope Creep vs. Scope Gap

**Question:** "Is the brief describing one thing clearly, or is it describing three things vaguely?"

**Scope creep signals:**
- More than one primary user action described at equal weight
- Multiple data models mixed without a clear hierarchy
- "And also…" language in the component description

**Scope gap signals:**
- Component description doesn't specify what data it receives
- No mention of how the component connects to the rest of the system (standalone? part of a page?)
- Delivery format unspecified or ambiguous

**Output:** For scope creep — cut to one primary action, note the others as future scope.
For scope gap — add the missing specificity.

---

### Check 5 — Generator Prompt Betrayal

**Question:** "If you pasted this generator prompt into v0 or Stitch right now, would the output embarrass you?"

Test the distilled prompt from `templates/generator-prompt-template.md`.

**HIGH fail:** The prompt produces a plausible but wrong result because:
- Accent color left as a name, not a value
- Font not specified (generator defaults to Inter or system-ui)
- Nav model missing (generator adds a sidebar)
- Layout not constrained (generator centers everything symmetrically)

**Output if HIGH:** Identify the missing constraint. Add it to the prompt.

---

## Severity Handling

| Severity | Required action |
|---|---|
| HIGH | Must be resolved before brief is approved. No exceptions. |
| MEDIUM | Must be documented in brief as "Known risk: [description]" |
| LOW | Optional. Note if easy to fix, ignore if minor. |

---

## Critic Output Block

```
Adversarial critic complete.
Scope: [STANDARD | FULL]

HIGH findings: [N]
[List each: Check N — description — resolution applied]

MEDIUM findings: [N]
[List each: Check N — description — documented as known risk]

LOW findings: [N] — [noted or ignored]

Brief status: [APPROVED | REQUIRES REVISION]
```

If any HIGH findings remain unresolved → brief is NOT approved.
