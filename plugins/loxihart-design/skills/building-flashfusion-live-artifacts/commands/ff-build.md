---
description: Build the FlashFusion Agent Control Center artifact from scratch (Phase 1–7 full build)
---

# /ff-build — Full FlashFusion Artifact Build

Run the full Phase 1–7 build of the FlashFusion Agent Control Center as a Cowork live artifact.

**Lane gate:** PERSONAL only. If the active lane is LOXIHART or FREELANCE, refuse and ask for explicit lane confirmation.

## Steps

1. **Phase 1 — Pre-Build Lane Gate**
   - Confirm PERSONAL lane
   - State blast radius: artifact ID `flashfusion-control-center` (will replace existing)
   - Search any draft content for `oorstbwcydxwiojrsoim` — LOXIHART project ID. Hard stop if found.

2. **Phase 2 — Brand Token Load**
   - Load FlashFusion tokens from CLAUDE.md profile
   - `color-scheme: light` must be the FIRST property in `:root`

3. **Phase 3 — HTML Build**
   - 10 required panels (see SKILL.md Required Panels table)
   - Inline `<style>` and `<script>`
   - Glassmorphic recipe: `var(--glass)` + `var(--border)` + `border-radius: 12px` + `backdrop-filter: blur(12px)`

4. **Phase 4 — Data Fetch Architecture**
   - Define `DEMO` object first
   - `fetchLive()` with per-panel fallback (NEVER global catch-all)
   - Init pattern: always start Demo, upgrade to Live if `ff_pid` set in localStorage

5. **Phase 5 — CDN Requirements**
   - Chart.js exact version `4.5.0` with integrity hash `sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi`
   - Grid.js@5.1.0 and Mermaid@11 from `cdn.jsdelivr.net` only
   - No `unpkg.com`, no `cdnjs.cloudflare.com`

6. **Phase 6 — Register Artifact**
   - **ToolSearch first** — `mcp__cowork__create_artifact` is deferred every session
   - `artifact_id: "flashfusion-control-center"` (FIXED — never change)
   - `mcp_tools` includes `mcp__plugin_kyle-os_supabase__execute_sql` and `list_tables`

7. **Phase 7 — Smoke Test**
   - Run all 10 smoke test items from SKILL.md
   - Do NOT declare complete until all pass

## Self-Verification (before registering)

Read SKILL.md → Self-Verification Checklist. All boxes must be checkable.

## Reference Files

- Full phase detail: `skills/building-flashfusion-live-artifacts/references/phases.md`
- All 10 gotchas with diagnosis + fix: `skills/building-flashfusion-live-artifacts/references/gotchas.md`

$ARGUMENTS
