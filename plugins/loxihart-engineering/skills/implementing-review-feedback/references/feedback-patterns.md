# Common Review Feedback Patterns

## Type: Style / Formatting
Priority: Low. Fix first (quick wins).
Examples: naming conventions, import ordering, whitespace, comment style.
Approach: Apply consistently across all touched files. Use editor auto-format.

## Type: Logic Bug
Priority: High. Fix second.
Examples: off-by-one errors, null checks missing, race conditions, incorrect comparisons.
Approach: Write a failing test first, then fix the code, then verify test passes.

## Type: Architecture / Design
Priority: High. Fix third (may require multi-file changes).
Examples: wrong abstraction, circular dependency, business logic in controller layer.
Approach: Plan the refactor, discuss scope with reviewer if large, execute in one commit.

## Type: Performance
Priority: Medium. Fix after logic bugs.
Examples: N+1 queries, unnecessary re-renders, unindexed queries, large payloads.
Approach: Measure before and after. Include benchmark in PR comment.

## Type: Security
Priority: Critical. Fix immediately.
Examples: SQL injection, XSS, missing auth check, exposed secrets.
Approach: Fix and add a test that verifies the vulnerability is closed.

## Type: Testing
Priority: Medium. Fix last.
Examples: missing test cases, brittle assertions, insufficient coverage.
Approach: Add tests for the specific scenarios the reviewer identified.

## Handling Disagreements

If you disagree with feedback:
1. Acknowledge the reviewer's perspective
2. Explain your reasoning with code context
3. Propose an alternative that addresses their concern
4. If no resolution, escalate to team lead or defer to reviewer
