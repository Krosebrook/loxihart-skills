---
description: Surgical patch (1–3 panels) to the FlashFusion artifact using the Patch Playbook
---

# /ff-patch — Surgical FlashFusion Artifact Patch

Apply a targeted change to 1–3 panels of the FlashFusion Agent Control Center without rebuilding.

**Use this for:** schema changes, single panel additions, brand token tweaks, SQL bugfixes, Demo slice refreshes.

**Do NOT use for:** layout overhauls, more than 6 affected panels, new CDN libraries, brand redesigns. Run `/ff-build` instead.

## The 5-Step Patch Flow

1. **Identify Affected Panels**
   - List exact panel names from the Required Panels table
   - If list > 3 entries OR > 6, abandon patch and run `/ff-build`
   - Map cross-panel dependencies (shared utility functions, shared Demo data)

2. **Update SQL Query**
   - **Test in Supabase console FIRST** — silent Demo fallback masks broken queries
   - Update the `sql(...)` call inside `fetchLive()`
   - Confirm shape of returned rows matches what the render function expects

3. **Update Demo Slice**
   - Mirror the live data shape — every new field must exist in Demo too
   - Update the per-panel fallback mapping in `fetchLive()` with safe defaults
   - Use `?? defaultValue` for optional new fields

4. **Update Render Function**
   - Use existing CSS variables (`var(--primary)`, `var(--text)`) — never invent new colors mid-patch
   - Add minimal CSS for new visual elements
   - Maintain accessibility: focus rings, ARIA where applicable

5. **Test Demo → Live Toggle, Then Re-Register**
   - Render artifact in Demo mode → confirm new field renders
   - Set `ff_pid` in localStorage → confirm Live mode shows real data with new field
   - Clear `ff_pid` → confirm fallback to Demo still works
   - Re-run smoke test items 1, 2, 7, 8
   - **ToolSearch** for `mcp__cowork__update_artifact`
   - Call with SAME `artifact_id: "flashfusion-control-center"`

## Anti-Patterns

- "While I'm in here, I'll also fix..." — scope creep. Each patch = one diff.
- Changing `artifact_id` during a patch — creates duplicate, orphans state
- Skipping Demo slice update on schema change
- Patching without testing query in Supabase console first
- Editing CSS without using existing tokens

## Reference

Full Patch Playbook with templates by change type:
`skills/building-flashfusion-live-artifacts/references/patch-playbook.md`

$ARGUMENTS
