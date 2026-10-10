<process>

## Phase S: Specification (20% of effort)

Cheapest place to catch problems — spec change costs minutes, code change costs hours, production fix costs days.

### Produce a specification block with all of the following:

**Objectives** (2–5 bullets: what problem are we solving?)

**Functional requirements** — each must be:
- Testable (you can write a pass/fail assertion for it)
- Prioritized: P0 = must have, P1 = should have, P2 = nice to have
- Independent where possible

**Non-functional requirements** — be specific:
- "Responds in <200ms at p95" not "should be fast"
- "Supports 10K concurrent users" not "should scale"

**Constraints** — technical (stack, compatibility), business (timeline, budget), regulatory (compliance, data handling)

**Acceptance criteria** — Given/When/Then format:
```
Given [precondition],
When [action],
Then [expected outcome within measurable bound].
```

**Assumptions** — unstated assumptions are where projects fail. State every one explicitly.

**Unknowns** — more valuable than the requirements list. Forces decisions before they become emergencies.

### When to ask vs. decide:
- Unknown changes the architecture (auth model, DB choice, deployment target) → **ask**
- Implementation detail (variable naming, exact error message text) → **decide and state assumption**

### Over-spec guard:
A small utility function needs 3 bullet points, not a formal requirements document. Match spec depth to implementation complexity.

### Output:
Present the full specification block to the user. Wait for approval before moving to Phase P.

</process>
