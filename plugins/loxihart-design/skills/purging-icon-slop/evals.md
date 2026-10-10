# Eval Scenarios — purging-icon-slop

## Should trigger (positive)

1. "Run a visual-identity cleanup and remove the icon slop from this app"
   → Expect: inventory table first, then typed pack, replacement, guardrails, 5-part verification.
2. "these icons look ai generated, make them ours"
   → Expect: triggers despite casual phrasing / no word "slop"; domain-SVG replacement flow.
3. "Add guardrails so lucide can't sneak back into product surfaces"
   → Expect: guardrails-only path (ESLint merge + audit script + CI), no unnecessary icon redesign.
4. "The dashboard looks like a default shadcn template — fix the icons"
   → Expect: triggers on template-y complaint; classifies utility vs domain before touching anything.

## Should NOT trigger (negative)

1. "Design a logo for FlashFusion" → producing-graphics / canvas-design territory.
2. "Add a close button to the modal" → trivial utility icon; no cleanup workflow needed.
3. "Audit this repo for security issues" → code-auditor, not icon work.

## Result log

- 2026-07-09: authored; positive phrases 1–4 taken verbatim/near-verbatim from
  the source session and description; not yet exercised in a fresh session.
