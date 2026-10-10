# Execution Engine — create-meta-prompts

## Execution Modes

### Single Prompt
1. Read prompt file contents
2. Spawn Task agent with subagent_type="general-purpose"
3. Include complete prompt contents + output location
4. Wait for completion, validate output, archive to `completed/`, report

### Sequential Execution
For chained prompts where each depends on previous output.
Build execution queue from dependency order. Execute each in sequence.
Stop on validation failure — report failure, offer recovery (retry / continue anyway / cancel).

Progress reporting:
```
Executing 1/3: 001-auth-research... ✓
Executing 2/3: 002-auth-plan... ✓
Executing 3/3: 003-auth-implement... (running)
```

### Parallel Execution
For independent prompts with no dependencies.
Spawn ALL Task agents in a SINGLE message (required for true parallelism).
Collect all results. Archive successful. Report failures. Offer retry on failed.

### Mixed Dependencies (DAGs)
Analyze dependency graph from @ references. Group into execution layers.
Execute each layer in parallel; layers are sequential.
Stop if any dependency fails — downstream prompts cannot run.

---

## Dependency Detection

Scan prompt contents for `@.prompts/{number}-{topic}/` patterns. Build dependency graph. Detect cycles (error if found).

**Inference rules when no explicit @ references:**
- Research prompts: No dependencies (can parallel)
- Plan prompts: Depend on same-topic research
- Do prompts: Depend on same-topic plan

**Missing dependencies:** Warn user, offer: create missing prompt first / continue anyway / cancel.

---

## Validation

After each prompt completes:
1. File exists at expected output path
2. Not empty (> 100 chars)
3. Metadata present for research/plan: `<confidence>`, `<dependencies>`, `<open_questions>`, `<assumptions>`
4. SUMMARY.md exists with required sections: Key Findings, Decisions Needed, Blockers, Next Step
5. One-liner is substantive — not generic like "Research completed"

---

## Archiving

Sequential: archive immediately after each successful completion.
Parallel: archive all at end after collecting results.

```bash
mv .prompts/{n}-{topic}-{purpose}/{n}-{topic}-{purpose}.md \
   .prompts/{n}-{topic}-{purpose}/completed/
```

---

## Failure Handling

Sequential failure — stop chain immediately, report completed/failed/not-started, offer retry/view/stop.
Parallel failure — continue others, collect all results, report per-prompt status, offer retry on failed.

---

## Special Cases

- **Re-running completed prompts:** Move from `completed/` back to parent, optionally backup output, execute normally.
- **Output conflicts:** Backup existing to `.bak`, ask user to confirm overwrite.
- **Git:** Never auto-commit. Mention created/modified files. User controls git workflow.
- **Recursive prompts:** Don't auto-detect. Present output, let user invoke skill again for follow-up prompts.

---

## Result Presentation

Single result: show ✓/✗ status, display SUMMARY.md content inline, offer next-step options.
Chain result: show condensed one-liner from each SUMMARY.md, flag decisions/blockers, confirm all archived.
