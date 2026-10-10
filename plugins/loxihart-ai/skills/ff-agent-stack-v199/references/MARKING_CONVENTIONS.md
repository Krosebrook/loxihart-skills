# MARKING_CONVENTIONS.md — Honest Depth Markers

## Why These Markers Exist

The main risk in a large multi-phase build prompt is a model producing
confident-sounding but incorrect output to appear thorough. These markers
are the antidote. They create a contract: shallow + honest beats deep + wrong.

Use these markers freely. Their presence is a sign of quality, not weakness.

---

## Marker Reference

### `[UNVERIFIED]`

**Meaning:** A claim is being made that the author cannot currently confirm
against an authoritative source. The claim may be correct — it has not
been checked.

**When to use:**
- Framework API behavior that may have changed in recent versions
- SDK method signatures you believe exist but have not confirmed
- Performance characteristics you are estimating, not measuring
- Third-party service behavior (rate limits, SLA, pricing)

**Example:**
> LangGraph's checkpointer supports Postgres as a backend [UNVERIFIED — 
> check LangGraph release notes for current version]

**Action required:** Before shipping v1.9.9, every `[UNVERIFIED]` item
must be resolved. Add to OPEN_ITEMS in the phase BATON block.

---

### `[SHALLOW — expand in Phase N]`

**Meaning:** The direction given is correct, but the depth is insufficient
for production use. More detail is needed before this section can be
implemented safely.

**When to use:**
- A section is directionally correct but missing implementation specifics
- A concept is introduced but the failure modes are not fully enumerated
- A schema is sketched but edge cases are unhandled
- A security mitigation is named but the implementation is not detailed

**Example:**
> Tool permission scopes should be enforced at the agent level.
> [SHALLOW — expand in Phase 2: define exact scope format, where scope
> is stored, how it is validated at invocation time, Phase 2 D7]

**Action required:** The referenced phase must produce the expanded detail.
Add to the phase prompt's OPEN_ITEMS if not already covered.

---

### `[ASSUMED]`

**Meaning:** A constraint or value that was not explicitly stated has been
assumed. The assumption is being called out explicitly.

**When to use:**
- A design decision depends on an unstated constraint
- A default value is being used without explicit confirmation
- A technology choice is being made based on context clues, not
  explicit instruction

**Example:**
> Using UUID v4 for idempotency keys [ASSUMED — Phase 0 did not specify
> key format. If a different format is required, update TOOL_CONTRACTS.md]

**Action required:** Track in LOCKED_DEFAULTS if the assumption becomes
a stable decision. If it needs human confirmation, track in OPEN_QUESTIONS.

---

### `⚠` (Adversarial Finding)

**Meaning:** An adversarial critic pass identified a weakness, risk, or
failure mode that needs attention.

**When to use:**
- After each deliverable's adversarial critic gate
- When a design decision has a known risk that the current spec does not
  fully address

**Example:**
> ⚠ The Validator Agent has a max retry cap, but if the Planner re-plans
> after each failed validation, the outer loop has no cap. This could run
> indefinitely. Fix: add max_replanning_attempts to bounded autonomy table.

**Action required:** Either resolve before the phase is marked COMPLETE,
or add to OPEN_ITEMS in the BATON block with a Phase N resolution target.

---

### `!` (Contradiction)

**Meaning:** An internal contradiction has been found within the spec,
between two deliverables, or between a locked assumption and a proposed
design.

**When to use:**
- When two requirements conflict
- When a Phase N design contradicts a Phase M locked decision
- When a scope lock is violated by a proposed implementation

**Example:**
> ! Agent Studio is listed as a full operator dashboard in the original
> spec, but Phase 0 locked it as a read-only trace viewer only. These
> conflict. This phase implements the locked scope (read-only viewer).
> The full dashboard is deferred to v2.0.

**Action required:** State which version takes precedence. Document the
resolution in OPEN_ITEMS_AND_2.0_NOTES.md.

---

## How to Handle Markers in Review

When reviewing phase output, scan for markers first:

1. Count all `[UNVERIFIED]` items → add to open items tracker
2. Count all `[SHALLOW]` items → confirm the referenced phase covers them
3. Count all `[ASSUMED]` items → confirm assumptions are reasonable or
   escalate for human decision
4. Count all `⚠` items → confirm each is either resolved or tracked
5. Count all `!` items → confirm each contradiction is resolved with
   an explicit decision

A phase output with zero markers is a red flag — either the output is
genuinely flawless (rare) or the model did not apply honest depth checking.

---

## Release Gate Rule

Before Phase 4 PIPELINE_STATUS can be SHIPPABLE:
- All `[UNVERIFIED]` items resolved or explicitly accepted with documentation
- All `[SHALLOW]` items expanded in their referenced phase
- All `[ASSUMED]` items confirmed or updated
- All `⚠` findings either resolved or documented as accepted risk
- All `!` contradictions resolved with explicit decision
