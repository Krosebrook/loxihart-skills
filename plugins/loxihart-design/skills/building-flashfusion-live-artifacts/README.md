# flashfusion-artifacts

Cowork plugin for building, patching, and maintaining the FlashFusion Agent Control Center live artifact.

**Version 1.1.0** — Refactored to Anthropic progressive-disclosure pattern. Canonical specs in `sot/`, navigation in `SKILL.md`, detail in `references/`.

## What it does

- One skill (`building-flashfusion-live-artifacts`) — ~200-line navigation layer that routes to specs and references on demand
- One canonical authority document (`sot/FF-PLAT-CORE-SOT.md`) — Tier 2 source-of-truth for brand tokens, schemas, panel list, CDN whitelist, LOXIHART quarantine rules, artifact identity
- One framework explainer (`sot/INFOGRAPHIC-CORRECTED.md`) — clean reverse-engineering of the FlashFusion-Compliant tier model with Anthropic grounding
- Three reference files (`references/`) — phase detail, patch playbook, gotcha diagnoses
- Three slash commands — `/ff-build`, `/ff-patch`, `/ff-smoketest`

## Tier architecture (per FF-PLAT-CORE-SOT framework)

| Tier | File | Load behavior |
|---|---|---|
| 0 — Hard constraints | Your global + project CLAUDE.md | Every turn (untouched by this plugin) |
| 1 — Skill body | `skills/building-flashfusion-live-artifacts/SKILL.md` (~200 lines) | On activation via trigger phrases |
| 2 — Authority | `sot/FF-PLAT-CORE-SOT.md` | Selectively, by section anchor (§1–§10) |
| 3 — Cold storage | (out of scope for this plugin) | On explicit request |

## Lane discipline

PERSONAL lane only. Hard stop if the LOXIHART Supabase project ID (`oorstbwcydxwiojrsoim`) appears anywhere in the artifact HTML. Enforced by SOT §8 and the skill's self-verification checklist.

## Install

Drop the `flashfusion-artifacts/` folder into your Cowork plugins directory, or zip and install via Cowork plugin management.

## Structure

```
flashfusion-artifacts/
├── .claude-plugin/
│   └── plugin.json
├── README.md                                  # You are here
├── sot/                                       # Tier 2 — Authority
│   ├── FF-PLAT-CORE-SOT.md                   # Canonical specs (§1–§10)
│   └── INFOGRAPHIC-CORRECTED.md              # Framework explainer
├── skills/
│   └── building-flashfusion-live-artifacts/
│       ├── SKILL.md                          # Navigation layer (~200 lines)
│       └── references/                       # Loaded on demand
│           ├── phases.md                     # Phase 1–7 build detail
│           ├── patch-playbook.md             # 5-step surgical patch flow
│           └── gotchas.md                    # 10 gotchas with diagnosis + fix
└── commands/
    ├── ff-build.md
    ├── ff-patch.md
    └── ff-smoketest.md
```

## Required MCP tools (per SOT §10)

- `mcp__cowork__create_artifact` (deferred every session — ToolSearch first)
- `mcp__cowork__update_artifact` (deferred every session — ToolSearch first)
- `mcp__plugin_kyle-os_supabase__execute_sql` (live mode only)
- `mcp__plugin_kyle-os_supabase__list_tables` (live mode only)

## Compliance

All file sizes verified against Anthropic Skills authoring best practices:
- SKILL.md body: 200 lines (<500-line cap)
- Each `references/*.md`: <500 lines
- SOT sections individually queryable; never injected fully

## Version History

- **1.1.0** (2026-05-16) — Added `sot/` tier with FF-PLAT-CORE-SOT canonical authority. Refactored SKILL.md to navigation layer (365 → ~200 lines). Reverse-engineered and corrected the FlashFusion-Compliant infographic framework.
- **1.0.0** (2026-05-15) — Initial release. All content inline in SKILL.md.
