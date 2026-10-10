# Smart Error Grouping Reference

## Grouping Strategy

When a test suite has multiple failures, group them before fixing:

### Group 1: Import / Module Errors
Symptom: "Cannot find module", "is not exported from"
Fix: Usually one missing export or wrong path fixes many tests.
Always fix first — may resolve downstream failures.

### Group 2: Type Errors
Symptom: "Type X is not assignable to type Y", "Property does not exist"
Fix: Often caused by a single interface change.
Fix after import errors — some may resolve automatically.

### Group 3: Assertion Failures
Symptom: "Expected X but received Y"
Fix: Actual logic bugs or outdated snapshots.
Fix after type errors — the expected types are now correct.

### Group 4: Timeout / Async Errors
Symptom: "Exceeded timeout of 5000ms", "unresolved promise"
Fix: Missing await, missing done() callback, or slow test environment.
Fix last — these are environment or async issues, not logic bugs.

## Fix Order Decision Tree

```
Start with failing test count
  ├─ 1-3 failures ──── Fix individually, no grouping needed
  ├─ 4-10 failures ─── Group by error type, fix groups in order above
  ├─ 10-50 failures ── Likely a root cause — look for shared dependency
  └─ 50+ failures ──── Almost certainly a config or setup issue
```

## After Each Fix

1. Re-run the full test suite (not just the fixed test)
2. Check if the fix resolved other failures in the same group
3. Update the failure count
4. Move to next group only when current group is clear
