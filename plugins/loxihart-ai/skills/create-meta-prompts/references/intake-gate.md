# Intake Gate — create-meta-prompts

## Purpose Detection

Keywords → purpose mapping:
- `implement`, `build`, `create`, `fix`, `add`, `refactor` → **Do**
- `plan`, `roadmap`, `approach`, `strategy`, `decide`, `phases` → **Plan**
- `research`, `understand`, `learn`, `gather`, `analyze`, `explore` → **Research**
- `refine`, `improve`, `deepen`, `expand`, `iterate`, `update` → **Refine**

If unclear, ask Purpose question. If invoked without context, ask Purpose first.

## Chain Detection

Scan `.prompts/*/` for existing `*-research.md` and `*-plan.md` files.
If found, ask user which (if any) this prompt should reference. Match by topic keyword.

## Contextual Questions by Purpose

Load from `references/question-bank.md`.
- Do → artifact type, scope, approach
- Plan → plan purpose, format, constraints
- Research → depth, sources, output format
- Refine → target selection, feedback, what to preserve

## Decision Gate

After answers received, ask: "Proceed / Ask more questions / Let me add context"
Loop until Proceed selected.

## Finalization

State: "Creating a {purpose} prompt for: {topic} | Folder: .prompts/{n}-{topic}-{purpose}/ | References: {chained files}"
Then proceed to generation.
