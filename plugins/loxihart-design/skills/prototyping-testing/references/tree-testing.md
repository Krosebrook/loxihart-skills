# Tree Testing

Tree testing validates information architecture — the navigation structure — not visual design, labels, or interaction patterns. Users are given tasks and navigate a text-only hierarchy to find the correct destination.

## When to Use

- Validating a proposed or redesigned navigation structure before building
- Diagnosing why users can't find things in the current IA
- Comparing two competing navigation structures
- After card sorting to validate the structure that emerged

**Not the right tool for:** validating labels in isolation (use card sort), testing visual design (use clickable prototype), testing interaction flows (use usability test).

## Setup

**Tree structure:**
- Export navigation as a text-only hierarchy — no icons, no visual design
- Include all real navigation levels; don't simplify the tree to make it easier
- Maximum depth: whatever your real IA has

**Tasks:**
- 8–10 tasks covering the most important user goals
- Keep sessions ≤15 minutes (task count drives this)
- Write in plain language — no category names from the tree, no feature names
- Format: "You want to [realistic goal]. Where would you go?"
- Define success destination before running — not after

**Tools:** Optimal Workshop TreeJack, Maze tree test

## Metrics

| Metric | Definition |
|---|---|
| **Direct success** | Correct destination reached without backtracking |
| **Indirect success** | Correct destination reached after visiting at least one incorrect branch |
| **Failure** | Incorrect destination or gave up |
| **Directness score** | % of participants who went directly to correct answer (no backtracking) |
| **First-click** | Separate metric — which branch was clicked first. Signals label confusion when most users click the same wrong branch. **Not the same as directness.** |

## Analysis

1. Calculate success rate (direct + indirect) per task
2. Calculate directness per task
3. Identify tasks with high indirect success but low directness — users found it but it took backtracking
4. Run first-click analysis — which branches are attracting wrong traffic? Those labels need work.
5. Look for consistent failure patterns — whole categories that users can't find suggests structural problem, not just label problem

## Benchmarks

- **≥80% direct success** — well-performing IA
- **<60% direct success** — IA requires redesign (practitioner heuristic; no published primary source)

## Limitations

Tree testing validates structure, not labels in isolation. A tree test failure can mean:
- Wrong structure (content is in the wrong place)
- Wrong labels (right structure, but users don't recognize the category names)
- Both

Run card sort first to discover structure from users' mental models. Use tree testing to validate that structure. If tree test fails after a card-sort-informed redesign, the problem is likely labels.
