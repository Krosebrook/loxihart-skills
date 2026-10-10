# Eval: avoiding-ai-slop

### Should trigger:
1. "De-slop this blog draft — it reads like ChatGPT wrote it."
2. "Scan my newsletter for AI tells before I send it."
3. "Give me negative prompts so the hero image doesn't look like AI slop."

### Should NOT trigger:
1. "What does 'delve' mean etymologically?" (dictionary question — a banned
   word as *topic*, not a slop task)
2. "Fix this regex so it matches multiline input." (regex engineering,
   unrelated to slop detection)

### Borderline (documented intent):
- "Write a LinkedIn post about our migration." → SHOULD apply Mode A
  silently (description covers outward-facing prose drafting), but should
  NOT announce the skill or lecture about slop — constraints only.

### Observed behavior:
- Eval 1: PASS — description matches "de-slop", "reads like ChatGPT"
- Eval 2: PASS — matches "scan", "AI tells", "newsletter"
- Eval 3: PASS — matches "negative prompts", "AI slop", image surface
- Neg 1: PASS (no trigger) — no task verb from the description present
- Neg 2: PASS (no trigger) — no slop vocabulary in a detection/writing context

Note: observed-behavior entries above are authorship-time assessments against
the description text. Re-verify in a live Cowork session after install; if a
negative eval fires, tighten the description's task-verb framing rather than
deleting keywords.
