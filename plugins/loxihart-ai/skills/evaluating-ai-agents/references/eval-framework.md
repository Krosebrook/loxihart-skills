# Eval Framework — AI Agent Evaluator

Detailed methodology moved out of SKILL.md for progressive disclosure. Standalone; no cross-links to other reference files.

## Grader Selection (was: Section 3)

## Section 3: Grader Selection

Full code-based grader patterns are detailed in this guide.

**Three grader types. Most evals use all three.**

### Code-based graders (fastest, cheapest, most objective)

Use for:
- Did the agent call the right tool?
- Did it call the tool with the correct parameters?
- Does the outcome match exactly? (database row exists, API call made)
- Did it stay within token/turn limits?
- String match, regex, binary pass/fail on deterministic outputs

Brittle to valid variations that don't match expected patterns exactly.
Don't use for subjective quality or open-ended generation.

### Model-based graders (flexible, handles nuance)

Use for:
- Output quality judgment ("Is this a helpful response?")
- Instruction following ("Did the agent do what was asked?")
- Rubric-based scoring of generated content
- Behaviors that humans would recognize but can't precisely specify

**Calibration requirement:** Run a sample of model-graded tasks through
human review. Divergence between the LLM judge and humans indicates a
bad rubric. The test: two domain experts working independently should
reach the same pass/fail verdict. If they can't, the rubric is too vague.

See the model-based grader patterns below for LLM-as-judge prompt templates.

### Human graders (gold standard, most expensive)

Use for:
- Initial calibration of model-based graders
- High-stakes agent outputs (client-facing, consequential)
- Quarterly sample review of production interactions
- Anything where you're not yet confident in automated grading

Establish inter-rater reliability (IRR) before relying on human graders —
two independent reviewers should agree on ~90%+ of ratings.

### Scoring modes

| Mode | When to use |
|---|---|
| Binary | All graders must pass (strict regression tests) |
| Weighted | Combined scores must hit a threshold (quality evals) |
| Hybrid | Binary for critical checks, weighted for quality dimensions |

---

## Task Set Construction (was: Section 4)

## Section 4: Task Set Construction

Full task-set construction guidance is detailed in this guide.

**Start with 20–50 tasks from real failures, not hundreds of curated examples.**

Early-stage agents have large effect sizes per change. A small, well-chosen
set provides adequate signal. Scale to hundreds only once the agent is stable
and you're measuring smaller improvements.

### Where to get tasks

1. **Real production failures** — every time the agent gets something wrong
   in production, that input + expected output becomes a test case
2. **Edge cases you've thought of** — inputs where you're not sure the
   agent will handle correctly
3. **Happy path confirmations** — basic cases that must always work
4. **Adversarial inputs** — unusual phrasing, missing fields, bad data

**Distribution requirement:** tasks should reflect the actual distribution
of inputs the agent receives, not just the easy ones.

### Task format

Every task needs:
```yaml
task_id: "unique-identifier"
input: "[exact input to the agent]"
expected_outcome: "[what should actually happen in the environment]"
graders:
  - type: code | model | human
    assertion: "[what to check]"
notes: "[why this case matters]"
```

### Growing the task set

- When you fix a production bug: add that bug as a task immediately
- Weekly: review production interactions for new edge cases
- After a model upgrade: add tasks for any new failure modes discovered
- Before a major release: add tasks for the new behaviors being shipped

---

## Agent-Type Patterns (was: Section 5)

## Section 5: Agent-Type Patterns

### n8n workflow agents

**What to grade:**
- Did the workflow route to the correct branch?
- Did the correct downstream tool get called?
- Is the output data in the expected format at each node?
- Did the workflow complete without hanging?

**Transcript:** the execution log showing which nodes ran and with what data
**Outcome:** the actual state of the destination (database, API, notification)

**Practical approach:** Export webhook payloads from production, replay them
through a test workflow. Grade the outcome in the test destination (a
separate Supabase table or test FreshService environment).

**The 11 blocked workflows:** before evaluating these, unblock them first
(Base44 Bearer credentials + SCH-02 lane field). Eval infrastructure only
tells you if they work once they're running.

### Claude API agents (Anthropic-native)

**What to grade:**
- Tool call accuracy: did it call the right tool for this input?
- Tool parameters: were the parameters correct?
- Multi-turn coherence: did it maintain the right context across turns?
- Termination condition: did it stop at the right point?

**For transcript grading:** collect the full `messages` array at the end of
each trial. This is the complete record of every API call and response.

**For outcome grading:** check the actual state in the environment — not
what Claude said happened, but what the tool actually did.

### MCP server tools

**What to grade:**
- Does the tool return the expected result for known inputs?
- Does it handle malformed inputs gracefully (not crash, return useful error)?
- Does it respect auth boundaries (one user can't access another's data)?

**Approach:** unit-test each tool function independently with code-based
graders, then integration-test the agent that uses the tool.

### Multi-agent systems (CrewAI, LangGraph)

**Additional complexity:** errors can propagate between agents and compound.
An early agent producing subtly wrong output can cause a later agent to
fail in a way that's hard to trace.

**Approach:** eval each agent independently first (unit evals), then eval
the full pipeline (integration evals). Failures in integration evals that
pass unit evals indicate inter-agent communication problems.

---

## pass@k vs pass^k — statistical formulas (was: Section 6)

### pass@k vs pass^k

For any eval, report both:

- **pass@k:** did the agent succeed in at least one of k trials?
  (optimistic — best-case performance)
- **pass^k:** did the agent succeed in *all* k trials?
  (reliable — consistent performance)

Research shows up to 25 percentage point gaps between pass@k and pass^k
in agentic benchmarks. A system can appear to work (pass@k is high) while
being unreliable in practice (pass^k is low). For production agents, pass^k
is the number that matters.

Recommended: run 3–5 trials per task minimum. Report both metrics.
