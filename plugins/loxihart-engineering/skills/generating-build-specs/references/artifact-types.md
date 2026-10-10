# Phase 2 Artifacts — Generation Instructions

Each artifact derives from a Phase 1 section. Every one must reference real
project paths and patterns — an artifact that could apply to any codebase
unchanged has failed.

| Artifact | Derived from | Generation rules |
|---|---|---|
| **Build Prompt** | Outcome Contract | Self-contained paste-ready brief: stack, constraints, file paths to extend, acceptance criteria. Assume the build session has zero other context. |
| **State Scaffold** | States | One state enum/union + per-state render or handler stubs *with real names from the codebase* — stubs of structure, never TODO bodies presented as done. |
| **Type Definitions** | Data Contract | Actual TypeScript (or project language) types matching the contract, import paths correct, no `any` unless justified inline. |
| **Error Scaffold** | Failure Taxonomy | Error classes/handlers per taxonomy row; every catch has handling; retry logic carries backoff where taxonomy says retry-safe. |
| **Pre-Ship Checklist** | Constraints + Failures | Checkable binary items ("RLS policy exists for table X and denies anon writes"), not vibes ("security reviewed"). |
| **Test Scenarios** | States + Failures | One scenario per state and per failure row, given/when/then, including the unhappy paths — the empty-state test is not optional. |
| **Task List** | All sections | Ordered, dependency-aware, each task ≤ half a day with a done-signal. Anything bigger gets split before it ships in the list. |

Output discipline: artifacts ship as separate labeled blocks so each can be
copied independently; the spec's section numbers are cross-referenced so a
reviewer can trace artifact → spec line.
