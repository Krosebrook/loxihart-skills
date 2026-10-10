<required_reading>
This workflow runs at the end of every SPARC cycle.
The completion checklist runs first. Then the audit loop.
Both are required. Neither is optional.
</required_reading>

<process>

## Phase C: Completion Checklist (run first)

- [ ] Full test suite passes — all tests, not just new ones (catch regressions here)
- [ ] Every acceptance criterion from Phase S verified — walk through each one
- [ ] Security review — no secrets in code, no injection paths, no missing auth checks
- [ ] Documentation — README section, API docs if new endpoints, inline comments for non-obvious logic, migration notes if DB changed
- [ ] Performance spot-check — if NFRs specified targets, verify them
- [ ] Integration verification — connections to other components work end-to-end

---

## Phase C: 6-Persona Staff Audit Loop

**Invoke with: RUN AUDIT LOOP**

This is a staff-level audit — personas evaluate the feature in the context of the entire system. The question is not "is this code correct?" The question is "does this feature introduce systemic risk?"

Each persona outputs: `| Finding | Severity | Blast Radius | Location | Fix | Accept Risk? |`

Blast Radius = how many systems, users, or data flows does this affect?

**Severity:**
- P0 — Feature does not ship. Fix before merge.
- P1 — Log in backlog. Ship with note. Fix next sprint.
- P2 — Accepted risk. Document blast radius and rationale.

### Persona 1 — Security Auditor
New auth bypass? New injection surface in inputs? New data stored without RLS? New endpoint missing rate limiting? Agent tool surface expanded without whitelist update? New cross-tenant data access path?

### Persona 2 — Staff Architect
Does this feature couple things that were previously independent? Does it respect existing boundaries? Does it require a shared state assumption that breaks under concurrent access? Does it create a parallel data flow that will diverge from the established pattern?

### Persona 3 — QA / Test Engineer
What branch is NOT tested? What happens if an external dependency is unavailable? Is there a race condition in the async path? Will a regression in this feature be caught by the test suite, or does it pass regardless of correctness?

### Persona 4 — Performance Engineer
New DB query on a hot path? New synchronous operation that should be async? Token/cost amplification vector if this runs in an agent loop? What's the cost at 1,000 calls/day? At 10,000?

### Persona 5 — DevOps / Infra
Behind a feature flag? Rollback procedure documented? DB migration backward-compatible with previous deploy? New env vars in `.env.example` and CI? Runbook for "this feature returns garbage" failure mode?

### Persona 6 — Accessibility / UX
Loading / empty / error state trifecta present? Streaming or progress indicator if response is slow? Error messages expose internal details to users? Graceful degradation if the agent or API is down? Keyboard-only navigation works? Mobile layout covered?

---

## Audit Synthesis

```
AUDIT SUMMARY — [Feature] — [Date]

P0 (Blockers — does not ship): N
P1 (High — backlog + ship with note): N
P2 (Low — accepted risk): N

Highest blast radius: [finding] — [scope]

Fix order:
1. [P0 + fix + blast radius]
2. [P0 + fix + blast radius]

Risk decisions:
- [P1/P2]: Accept / Defer / Fix now?
```

---

## Completion Output

```
Built [feature] implementing [N] requirements.
[X] tests passing. Security review clean.
Audit: [N] P0, [N] P1, [N] P2 findings.
[P1/P2 items]: logged in backlog with blast radius.
Status: Ready to ship / [P0 blockers outstanding].
```

</process>
