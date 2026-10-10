# Workflow — Capture Screenshots (Mode A)

Requires the Claude in Chrome connector active (verified at intake — do not re-check here).

## Pre-navigation

1. Parse the document into an ordered step list per section. For each step
   extract: action verb (click/navigate/select/type/scroll), target element
   (button label, menu name, field), and expected UI state after the action.
2. Confirm the section slug names with the user if the naming convention
   (see `references/screenshot-standards.md`) would be ambiguous.
3. Navigate to the starting URL. If a login screen appears → STOP, hand
   control to the user, resume only after they confirm they're in.

## Capture loop (per step)

1. Perform the step's action — except state-committing actions. **Never click
   Save, Submit, Delete, Confirm, Send, or Pay** unless the user explicitly
   instructed it for that step. For those, capture the pre-click state and
   note `[captured pre-action — not executed]` in the log.
2. Wait for the UI to settle (spinners gone, modal fully rendered). Apply any
   user-provided APP NOTES quirks (slow modals, collapsing sidebars).
3. Screenshot per the naming convention → save to the working directory.
4. Element not found → retry once with scroll + wait. Second failure → STOP,
   report the step number and what was searched for, ask the user to advance
   the UI manually or reword the step.
5. Pacing: default step-by-step (report done/next, wait for "continue").
   In auto-run, proceed until a stop condition: destructive action, auth
   prompt, file upload/hardware interaction, 2× element failure, page crash.

## Exit

Report captured count vs placeholder count from intake. Any gap gets an
explicit per-step reason. Then proceed to `workflows/assemble-document.md`.
