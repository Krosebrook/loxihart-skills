## Phase 9 — Anti-Slop Audit (required deliverable)

Read `references/anti-slop-checklist.md` for the full audit checklist.

Run all four tests. Document failures. Do not suppress them.

### Test 1: Template Test

"Could this have been produced by any AI tool with defaults?"
If YES → identify the element. Redesign it. Repeat.

### Test 2: Completeness Test

- Every component has all 8 states?
- Every screen has an empty state?
- Every error has a recovery action?
- Every animation has a purpose + reduced-motion fallback?
- Every color pairing contrast-checked and passed?
- Focus rings visible and styled?
- Touch targets ≥24×24 CSS pixels (AA minimum); 44×44px preferred?
- No screen exists only because templates include it?

### Test 3: Memorability Test

(from `references/cinematic-design.md` Section 5)

> "If someone used this for 5 minutes and described it from memory,
> what would they say?"

- If the answer is "a clean app with a sidebar and some cards" — **FAIL**
- If the answer references a specific visual choice, interaction, or moment — **PASS**

Identify the single most memorable element. If it doesn't exist — design it.

### Test 4: Category Failure Analysis

Identify the 2 most common failure modes for this product type.
State specifically how this design avoids them.

### Refinement Priorities

Top 2 elements that would raise quality further — with direction.

---

## Quality Bar

This output should not embarrass a senior designer.
It will not compete with Linear or Figma. That is not the goal.

The goal: ship a prototype that has a real point of view, a defensible design
system, and zero obvious AI slop.

If it has any of those — find it, name it, fix it.
