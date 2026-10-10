<process>

## Phase P: Pseudocode (15% of effort)

Design the algorithm in structured English before any real code. Forces logic flow, edge cases, and data transformation thinking without syntax friction.

### Rules:
- Structured English — not code syntax, no import statements, no semicolons
- Include input/output types for each function
- Explicitly handle the error path, not just the happy path
- Call out design decisions with rationale ("chose iteration over recursion because...")
- Name the data structures you'll need

### Format:
```
FUNCTION [name](inputs):
  INPUT: [name] ([type], [constraints])
  OUTPUT: [return type] OR error ([code], [message])

  [steps in plain English]
  IF [edge case]:
    [how it's handled and why]
  RETURN [result]
```

### Skip when:
Well-known pattern (CRUD endpoint, form validation) with no novel algorithmic decisions. State you're skipping and why.

### Value of this phase:
Good pseudocode reveals things that pure "write the code" misses: lockout logic, counter resets, session record storage. See `references/patterns.md` for a worked example.

</process>
