# Patch Playbook — 1–3 Panel Changes

Patches are surgical. A patch that rebuilds the artifact is a failed patch.

## Sequence

1. **Read before touching:** SOT §3 (canonical panel list) + §4 (schema) for
   the panels in scope. Adding a panel → also §5 (state).
2. **Lane + guard check:** confirm PERSONAL lane; confirm nothing references
   LOXIHART project `oorstbwcydxwiojrsoim` (hard stop if it does).
3. **Isolate:** locate the panel's component + its demo data block + its live
   query. Those three, nothing else, are in scope.
4. **Patch** with the sandbox walls in mind: whitelisted CDNs only, exact
   versions per §6 (Chart.js `4.5.0` + SRI, Grid.js `5.1.0`, Mermaid `11`,
   jsdelivr URLs; unpkg/cdnjs are network-blocked), no `fetch`/XHR/WebSocket —
   all data via `window.cowork.callMcpTool`, and `color-scheme: light`
   stays on `:root` untouched.
5. **Preserve the Demo fallback.** Every patched panel must still render fully
   with its live source dead. If the patch added a live dependency, it added
   a demo counterpart in the same change.
6. **Deliver as a diff** (+N/−N against the current artifact), never a
   regenerated file. Note which SOT sections the patch touches.
7. **Apply via `mcp__cowork__update_artifact`** (ToolSearch-load it first —
   it defers every session) against the **fixed** `artifact_id:
   flashfusion-control-center`. Never `create_artifact` for a patch — a new
   ID is a new artifact with its own localStorage scope, orphaning the
   user's `ff_pid`/`ff_budget`/`ff_mode` (§9). Version bump goes in the
   `ff-artifact-version` meta tag.

## Patch-scope verify (all must hold)

- Patched panels render in Demo mode with sources killed
- Untouched panels byte-identical
- No new CDN; versions exact per §6 — Chart.js 4.5.0 with SRI hash intact,
  Grid.js 5.1.0, Mermaid 11
- Guard: `grep -i "oorstbwcydxwiojrsoim"` on the patched HTML returns zero (§8)
- `artifact_id` unchanged; meta version bumped
- Mode toggle + refresh still function; §5 state keys untouched unless the
  patch's stated scope includes them

Anything failing → `references/gotchas.md` before improvising.
