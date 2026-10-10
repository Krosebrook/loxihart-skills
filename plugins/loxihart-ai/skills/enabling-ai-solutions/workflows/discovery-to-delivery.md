# Workflow: Discovery to Delivery

Full process for taking an AI build from first idea to shipped architecture artifact. For quick builds, use the SKILL.md golden path. This workflow is for anything that needs a full spec, phased plan, or non-trivial decision record.

---

## Phase Overview

```
Phase 1: Scope          → What are you building and how formal does the output need to be?
Phase 2: Constraints    → Extract the inputs that block architecture decisions
Phase 3: Architecture   → Select components, size, map compliance if needed
Phase 4: Draft Output   → Produce artifact using templates/
Phase 5: Review Gate    → Validate against checklist before shipping or building
Phase 6: Ship           → Commit the spec, provision, start Phase 1 of the build
```

Estimated time:
- Quick build: Phase 1–2 combined 10 min, Phase 3–6 30–60 min
- Scoped build with full spec: Phase 1 10 min, Phase 2 20–30 min, Phase 3 1–2 hrs, Phase 4–6 1–2 hrs

---

## Phase 1: Scope

**Goal:** Decide what output format this actually needs.

### Scope Questions

```
1. What are you building?
   (feature / standalone tool / platform addition / internal utility)

2. How complex is it?
   (one integration + one LLM call → quick; multi-system + phased build → full spec)

3. Do you need a cost model?
   (always yes if infra is non-trivial or compliance is in play)

4. Do you need a phased plan?
   (yes if the build spans more than ~1 week or touches multiple systems)
```

### Scope Decision Gate

| Signal | Output Type | Time Required |
|--------|-------------|---------------|
| "What should I use for X?" | Quick Stack Decision | 5–10 min |
| "Help me design this" (fast, personal) | Architecture Diagram + rationale | 30–60 min |
| "I need a full spec before I start" | Spec Doc | 2–4 hrs |
| "Full spec with sizing + compliance" | Spec Doc + Sizing + Compliance | 3–6 hrs |

---

## Phase 2: Constraints

**Goal:** Extract only the inputs that change architecture decisions. Don't over-gather — get what blocks correctness.

### Constraint Questions

**The Build**
```
- What problem does this solve, concretely?
  ("I spend 20 min finding notes" beats "improve knowledge management")
- What does a successful output look like?
  (specific, measurable — not "it's useful")
- What's the primary pattern?
  (RAG / conversational agent / automation / analysis / multi-agent / other)
```

**Scale**
```
- Who uses this? (solo / small team / open to anyone)
- Queries or requests per day at steady state?
- Any known peaks? (batch jobs, scheduled syncs, end-of-sprint)
- Target response latency? (2s for chat, 5s for analysis, background for batch)
```

**Stack and Constraints**
```
- Existing stack and cloud? (don't introduce new infra if existing stack covers it)
- Any systems this must connect to?
- Any vendor restrictions or hard dependencies?
- Do you need offline / local / air-gapped?
```

**Data and Compliance**
```
- What data does the AI process?
  (personal notes / internal docs / user data / PHI / payment data)
- Does any of it leave your infrastructure? (hosted LLM APIs)
- Any compliance requirements? (GDPR if EU user data, HIPAA if PHI, [COMPLIANCE FRAMEWORK] if B2B)
- Data residency hard requirements?
```

**Budget**
```
- Monthly infra budget ceiling? (or "just show me what it costs")
- Is there a threshold where you'd self-host instead of using hosted APIs?
  (typically when LLM API spend > ~$3K/month)
```

### Constraint Summary (write this before Phase 3)

```
"Building [what] for [who / how many users].
Scale: [req/day]. Existing stack: [stack + cloud].
Data: [type — personal / user / PHI / etc.].
Compliance: [framework or none].
Primary constraint: [latency / cost / data sovereignty / integration complexity].
Budget: [ceiling or 'TBD — show tiers']."
```

Mark any input you're defaulting on with `[ASSUMED]`.

---

## Phase 3: Architecture

**Goal:** Select components and size infrastructure. Produces the inputs for the output templates.

### Step 3a: Map Architecture Pattern

| Use Case | Pattern | Key Components |
|----------|---------|----------------|
| Note / doc Q&A | RAG | LLM + vector DB + document pipeline |
| Conversational memory | RAG + memory | LLM + vector DB + conversation store |
| Internal automation | Workflow | LLM + n8n / Make + trigger layer |
| Data analysis / summaries | Structured | LLM + DB connector + output formatter |
| Research / synthesis | Agent + tools | LLM + search API + storage |
| Code review / generation | Agent + tools | Opus 4.6 + file tools + GitHub API |
| Multi-system orchestration | Multi-agent | See `orchestrating-ai-agents` skill |

### Step 3b: Select Components

Read `references/component-selection.md`. For each layer:
- What you selected
- Why (which constraint drove it)
- What you ruled out and why

Rationale is mandatory. A list of names without "why" is not a design.

### Step 3c: Size Infrastructure

Run `scripts/sizing_calc.py`:

```bash
python scripts/sizing_calc.py \
  --dau [DAU] \
  --sessions [sessions/user/day] \
  --rps [requests/session] \
  --peak [multiplier] \
  --tokens-in [avg_prompt_tokens] \
  --tokens-out [avg_completion_tokens] \
  --compliance [none|gdpr|hipaa|soc2|pci]
```

If scale is unknown, run two scenarios: conservative (lower estimate) and expected (best guess).

### Step 3d: Compliance Gate

**Run this before finalizing LLM selection:**

- PHI in prompts → Azure OpenAI (BAA) or self-hosted only. Not negotiable.
- EU user data / data residency → Azure OpenAI EU regions, Mistral EU, or self-hosted.
- [COMPLIANCE FRAMEWORK] requirement → document all security controls in the spec before proposing infra.
- No regulated data → skip this step, proceed.

For implementation details: `references/compliance-patterns.md`.

---

## Phase 4: Draft Output

**Goal:** Produce the artifact using the right template.

### Template Selection

| Phase 1 Scope Decision | Template |
|-----------------------|----------|
| Quick Stack Decision | `templates/quick-stack-decision.md` |
| Architecture Diagram | `templates/architecture-diagram.md` |
| Full Spec | `templates/spec-doc.md` |

### Authoring Rules

1. **Fill every bracket.** `[TBD]` is a deferred decision, not a placeholder. Make the call.
2. **Mark assumptions.** Any input you defaulted on: `[ASSUMED: 500 docs at launch]`.
3. **Diagram before component table.** Visual first, then the supporting table.
4. **Cost ranges, not point estimates.** "$30–60/month" is more honest than "$47/month."
5. **Phases are commitments.** If you put it in Phase 2, mean it. Add buffer in the timeline.
6. **Remove all authoring notes** before archiving or sharing.

---

## Phase 5: Review Gate

**Goal:** Catch mistakes before building. This gate prevents mid-build pivots.

### Technical Completeness
- [ ] Architecture pattern explicitly named
- [ ] Every component has a selection rationale
- [ ] Integration points documented: system, method, direction, frequency
- [ ] LLM selection justified against latency SLA and data privacy
- [ ] Routing architecture present if daily_requests > 1K
- [ ] No single points of failure — DB, LLM provider, auth

### Cost and Sizing
- [ ] Tier confirmed via `scripts/sizing_calc.py` or tier table
- [ ] Cost broken down by component, not just total
- [ ] LLM cost shown as a range
- [ ] AI FinOps targets defined (cost per query, cache hit rate)
- [ ] Cost alert threshold defined (80% of monthly budget ceiling)

### Security
- [ ] No API keys in frontend or client-side code
- [ ] Secrets: env vars + server-side only
- [ ] Auth: session expiry, access scope documented
- [ ] Input sanitization / prompt injection mitigation present
- [ ] Compliance requirements addressed or explicitly out of scope

### Output Quality
- [ ] All brackets filled or marked `[ASSUMED]`
- [ ] No authoring notes remaining
- [ ] Diagram renders correctly (test in Claude.ai or mermaid.live)
- [ ] Risks section has ≥ 4 specific risks with mitigations
- [ ] Success criteria are measurable, not aspirational

---

## Phase 6: Ship

**Goal:** Commit the spec and start building.

### Before Starting Phase 1

- [ ] Spec archived (Notion, Google Drive, or repo `/docs`)
- [ ] API keys and env vars provisioned in correct environments
- [ ] Accounts and services provisioned (DB, hosting, LLM API, auth)
- [ ] Phase 1 acceptance criteria written before first line of code

### Post-Build

- Update `examples/` with a condensed version of the output if it introduces a new pattern not already covered
- Note any component combination or constraint that doesn't appear in `references/component-selection.md` — update it

---

## Common Failure Modes

| Failure | Signal | Fix |
|---------|--------|-----|
| Architecture without a problem statement | "Here's what I'd build..." with no constraint mapping | Write the constraint summary first |
| Component list without rationale | Table of names with no "why" | Add selection criteria for each layer |
| Cost estimate without assumptions | "$X/month" with no usage basis | Run `scripts/sizing_calc.py`, show the math |
| Diagram missing integration points | Islands of components, no arrows to external systems | Add all integration points explicitly |
| Compliance checked at Phase 4 | LLM selected before data residency was mapped | Compliance gate is Phase 3d, not an afterthought |
| Risks section is generic | "API rate limits," "migration delays" applied to every build | Each risk must be specific to this build |
| Phases exceed planning horizon | 12-week plan written before Phase 1 proves the architecture | Plan Phase 1 and Phase 2 fully; sketch the rest |
