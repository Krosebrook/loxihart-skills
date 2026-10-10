# INSTALL.md — FlashFusion Agent Stack v1.9.9 Sprint Kit

## What's in This Zip

```
ff-agent-stack-v199/
├── SKILL.md                          # Claude.ai skill — auto-triggers on keywords
├── INSTALL.md                        # This file
├── WSJF_BACKLOG.md                   # Full WSJF-sorted sprint backlog
├── phases/
│   ├── PHASE_0_GAPS_AUDIT.md         # Run first — always
│   ├── PHASE_1_FOUNDATION.md         # Schema, security, auth
│   ├── PHASE_2_ORCHESTRATION.md      # Agents, graph, memory, tools
│   ├── PHASE_3_OPERATIONS.md         # Billing, observability, recovery
│   └── PHASE_4_VERIFICATION.md       # Contracts, types, smoke tests
├── references/
│   ├── STACK_DECISIONS.md            # Why this stack, not alternatives
│   ├── AGENT_ROLES.md                # Agent boundaries + interaction rules
│   ├── BATON_TEMPLATE.md             # Baton block copy-paste format
│   └── MARKING_CONVENTIONS.md        # [UNVERIFIED] [SHALLOW] ⚠ ! guide
├── scaffolding/
│   ├── monorepo/FOLDER_TREE.md       # Annotated monorepo structure
│   ├── supabase/001_v199_foundation.sql  # Migration stub
│   └── typescript/v199.ts            # Type stubs
└── templates/
    ├── GAPS_AUDIT_OUTPUT.md          # Phase 0 output template
    ├── BATON_BLOCK.md                # Baton pass output template
    └── CLAIMS_FOOTER.md              # CLAIMS/COUNTEREXAMPLE/CONTRADICTIONS
```

---

## Option A — Claude.ai Projects (recommended for doc generation sprints)

Best for: Running phase prompts, generating ARCHITECTURE.md, SECURITY_MODEL.md,
AGENT_CATALOG.md, and all other spec documents.

**Setup (one time):**
1. Open or create a Claude.ai Project for this sprint
2. Go to **Settings → Skills → Upload Skill**
3. Upload `ff-agent-stack-v199.zip`
4. Confirm skill appears as active

**Running a phase:**
1. Open a new conversation in the Project
2. Type: `run phase 0` — skill activates and provides context
3. Paste the full contents of `phases/PHASE_0_GAPS_AUDIT.md` into the message
4. Read the BATON block in the response before proceeding
5. For each subsequent phase, paste the BATON block from the previous phase
   at the TOP of the next phase prompt, then send

**Saving outputs:**
- Copy each phase output to a file in your repo under `docs/v199/`
- Name files to match deliverables: `GAPS_AUDIT.md`, `ARCHITECTURE.md`, etc.
- Track BATON blocks in `docs/v199/BATONS.md` — one entry per completed phase

---

## Option B — Claude Code CLI / Antigravity IDE (recommended for implementation)

Best for: Implementation sprints after docs are generated. Running phases
directly alongside your codebase.

**Setup:**
```bash
# From your FlashFusion repo root
mkdir -p .claude/skills
cp -r /path/to/ff-agent-stack-v199 .claude/skills/

# Drop scaffolding stubs
cp ff-agent-stack-v199/scaffolding/supabase/001_v199_foundation.sql \
   supabase/migrations/
cp ff-agent-stack-v199/scaffolding/typescript/v199.ts \
   src/types/

# Verify Claude Code sees the skill
claude doctor
```

**Running a phase:**
```bash
# Open Claude Code in your project
claude

# Paste the phase prompt content directly into the CLI chat
# Claude Code picks up the skill from .claude/skills/ automatically
```

---

## Option C — Standalone (no skill pack)

If you want to use these prompts without the skill system:

1. Open any Claude conversation (Projects, claude.ai, Claude Code, API)
2. Paste the entire contents of a phase file directly as your message
3. No setup required — the prompts are self-contained
4. The skill pack just auto-injects context; without it, you paste manually

---

## Sprint Workflow

```
Day 1
  └── Run Phase 0 → Save GAPS_AUDIT.md → Review BATON

Day 2
  └── Run Phase 1 (with Phase 0 BATON pasted at top)
      → Save ARCHITECTURE.md + SECURITY_MODEL.md + SQL migration
      → Review BATON

Day 3-4
  └── Run Phase 2 (with Phase 1 BATON pasted at top)
      → Save AGENT_CATALOG.md + GRAPH_SPEC.md + MEMORY_SPEC.md + TOOL_CONTRACTS.md
      → Review BATON

Day 5
  └── Run Phase 3 (with Phase 2 BATON pasted at top)
      → Save BILLING_GUARDRAILS.md + OBSERVABILITY_RUNBOOK.md + ROLLBACK_RECOVERY.md
      → Review BATON

Day 6
  └── Run Phase 4 (with Phases 1-3 BATON blocks pasted at top)
      → Save API_CONTRACTS.md + v199.ts + smoke tests + acceptance criteria
      → Review PIPELINE_STATUS block

Day 7+
  └── If PIPELINE_STATUS = SHIPPABLE → begin implementation sprint
      If NOT SHIPPABLE → close blockers, re-run affected phase only
```

---

## Using the WSJF Backlog

`WSJF_BACKLOG.md` contains a sorted table of all sub-tasks across phases.

WSJF = (Business Value + Time Criticality + Risk Reduction) ÷ Job Size

Use it to:
- Decide what to tackle first within a phase
- Justify cutting scope when time-boxed
- Communicate sprint priority to stakeholders

Update the table after Phase 0 — the gaps audit will surface new items
and may change scores.

---

## Baton Pass Protocol

Every phase ends with a BATON block. This is non-negotiable.

```
PHASE_N_STATUS: [COMPLETE / INCOMPLETE]
LOCKED_OUTPUTS: [what the next phase must reference]
OPEN_ITEMS: [unresolved gaps carried forward]
CONFIDENCE: [0-100%]
```

Rules:
- CONFIDENCE < 80% → resolve gaps before next phase
- STATUS = INCOMPLETE → identify which deliverable failed and re-run
- OPEN_ITEMS → paste them into the next phase prompt verbatim
- Never silently skip a BATON block

---

## Troubleshooting

**Skill not triggering in Claude.ai**
- Confirm zip has single top-level folder `ff-agent-stack-v199/`
- Check SKILL.md has valid YAML frontmatter (--- delimiters)
- Re-upload the zip via Settings → Skills
- Try typing one of the trigger keywords: "phase 0", "v1.9.9", "gaps audit"

**Phase output is shallow or hallucinates**
- The prompt instructs Claude to mark `[SHALLOW]` or `[UNVERIFIED]` rather
  than hallucinate depth. If you see neither marker nor real depth, the
  context window may be overloaded. Split the deliverables: run D1 alone,
  then D2, then D3.

**CONFIDENCE came back below 80%**
- Read the OPEN_ITEMS block — it names exactly what needs resolution
- For business decisions (compliance scope, cost ceiling): answer them
  explicitly and add to the next phase's preamble as LOCKED_DEFAULTS
- For [UNVERIFIED] framework claims: check the official docs and update
  the stub with verified behavior before proceeding

**Baton block is missing from phase output**
- The prompt explicitly requires it. If missing, re-prompt:
  "The BATON block was not included in your output. Please produce it now
  following the format in the phase prompt."
