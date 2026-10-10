# Spec Sections — Per-Section Generation Instructions

Seven sections, always in this order. Depth scales LITE → STANDARD → FULL
per the SKILL.md table; instructions below are the STANDARD bar.

1. **Outcome Contract** — one paragraph: what exists when this is done, who
   uses it, and the single sentence that would prove it works. Reject vague
   verbs ("improve", "streamline") — a contract you can't test isn't one.
2. **States** — enumerate every state the feature can be in, including the
   embarrassing ones: empty, loading, partial, error, stale, unauthorized,
   first-run. Each state names what the user sees. Missing states here are
   the #1 source of "done" builds that aren't.
3. **Data Contract** — inputs, outputs, shapes, and ownership. Reference real
   types and real tables from the project (pull actual file paths). Note
   which fields are sourced vs derived vs user-entered.
4. **Failure Taxonomy** — for each external dependency and user input: how it
   fails, what the user sees, whether retry is safe. Cause → Fix → Retry
   structure. Silent failure paths get named explicitly so they can be rejected.
5. **Platform Constraints** — the walls: sandbox rules, RLS, rate limits,
   bundle limits, auth boundaries, lane rules. Sourced from the project's
   actual configs, not generic platform lore.
6. **Adversarial Questions** — 5–8 questions a hostile senior reviewer would
   ask, each answered or explicitly deferred with an owner. Unanswered ≠
   deleted — deferred with a name.
7. **Unknown Unknowns** — what discovery work would surface what this spec
   can't see: an experiment, a stakeholder to ask, a log to read. Naming the
   blind spots is the section's job; pretending there are none fails it.
