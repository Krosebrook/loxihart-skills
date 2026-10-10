# Gotchas — Full Diagnosis + Fix

Ten observed failure modes in the Cowork artifact sandbox. Read before every build.

---

## 1. `create_artifact` and `update_artifact` are ALWAYS deferred

**Symptom:** `InputValidationError` when calling `mcp__cowork__create_artifact` or `mcp__cowork__update_artifact`.

**Diagnosis:** These tools appear in the deferred list every session, every conversation. They are NEVER pre-loaded. Even if you successfully called `create_artifact` earlier in the same conversation, `update_artifact` is still deferred separately.

**Fix:**

```javascript
// Before EVERY call to either tool:
ToolSearch({ query: "select:mcp__cowork__create_artifact", max_results: 1 })
// or
ToolSearch({ query: "select:mcp__cowork__update_artifact", max_results: 1 })
```

**Anti-pattern:** "I just loaded create_artifact, I don't need to load update_artifact." Wrong — they're separate schemas.

---

## 2. `color-scheme: light` on `:root` is non-negotiable

**Symptom:** Background reverts to white in dark-themed dashboards. Text contrast breaks. Frosted panels look broken.

**Diagnosis:** The Cowork artifact iframe inherits browser-level `prefers-color-scheme` settings. Without an explicit `color-scheme` declaration, the browser applies its own dark-mode interventions on top of your CSS, breaking the void background and creating contrast issues.

**Fix:** Make `color-scheme: light` the FIRST property inside `:root`:

```css
:root {
  color-scheme: light;   /* <-- FIRST. Always. */
  --bg0: #0B0B14;
  /* ... */
}
```

Yes, "light" — even though the theme is dark. This tells the browser "I'm handling the dark styling myself, don't override."

---

## 3. No direct network access inside artifact HTML

**Symptom:** Empty panels, no console errors, network tab shows no requests.

**Diagnosis:** The sandbox blocks `fetch()`, `XMLHttpRequest`, `WebSocket`, and any third-party data SDK (`supabase-js`, `axios`, etc.). The block is silent — no CSP violation surfaces, no clear error.

**Fix:** All data goes through the Cowork bridge:

```javascript
const result = await window.cowork.callMcpTool(
  'mcp__plugin_kyle-os_supabase__execute_sql',
  { project_id: pid, query: 'SELECT ...' }
);
```

**Anti-pattern:** Importing `@supabase/supabase-js` from any CDN. Even if the import succeeds, the underlying fetch is blocked.

---

## 4. LOXIHART Supabase project hard stop

**Symptom:** Project ID `oorstbwcydxwiojrsoim` appears in the artifact HTML, comments, or example data.

**Diagnosis:** `oorstbwcydxwiojrsoim` is the LOXIHART (us-east-2) Supabase project. LOXIHART is SOC 2 / ISO 27001 aligned. PERSONAL artifacts must NEVER reference it — not even as a placeholder, not even commented out.

**Fix:** Stop. Search the entire HTML for the string before registering:

```bash
grep -i "oorstbwcydxwiojrsoim" artifact.html
# Must return nothing.
```

If found, replace with `<USER_ENTERED_PROJECT_ID>` placeholder text and confirm the user understands the artifact reads from localStorage `ff_pid`, not a hardcoded value.

---

## 5. Chart.js version lock — exact integrity hash required

**Symptom:** Chart canvas never renders. No JS error, no network failure shown — just a blank `<canvas>`.

**Diagnosis:** The sandbox enforces SRI (Subresource Integrity) checks. Any version other than `4.5.0`, or `@latest`, or a wrong integrity hash → silent rejection of the script. The page loads, the canvas element exists, but `Chart` is `undefined`.

**Fix:**

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js"
  integrity="sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi"
  crossorigin="anonymous"></script>
```

Exact version. Exact hash. Exact `crossorigin` attribute. No deviations.

---

## 6. Per-panel Demo fallback — never a global catch-all

**Symptom:** One SQL query fails (e.g., `hitl_queue` table dropped) → entire dashboard collapses to Demo mode.

**Diagnosis:** A top-level `try/catch` wrapping the entire `fetchLive()` body treats partial failure as total failure. This is bad UX — if 9 of 10 queries succeed, the user should see 9 panels of live data, not Demo across the board.

**Fix:** Catch only at the `Promise.all` level (for total MCP failure), then check each panel's result independently:

```javascript
let aqRaw, runRaw, costRaw, agRaw;
try {
  [aqRaw, runRaw, costRaw, agRaw] = await Promise.all([sql(q1), sql(q2), sql(q3), sql(q4)]);
} catch (e) {
  return DEMO;   // Total failure — fall back fully
}

// Per-panel — each independently checks its own result
const approvals = aqRaw?.rows?.length ? mapApprovals(aqRaw.rows) : DEMO.approvals;
const runs      = runRaw?.rows?.length ? mapRuns(runRaw.rows)      : DEMO.runs;
const spent     = Number(costRaw?.rows?.[0]?.total) || DEMO.budget.spent;
const agents    = agRaw?.rows?.length ? mapAgents(agRaw.rows)      : DEMO.agents;
```

Note: `Promise.all` with `.catch()` swallowing individual rejections won't help here because the array destructuring throws if any element is undefined. The pattern above is the safe one.

---

## 7. OAuth TTL expires within one turn

**Symptom:** `"No OAuth flow is in progress for plugin:kyle-os:supabase"` error during Live data fetch.

**Diagnosis:** The Supabase OAuth handshake has an aggressive TTL — observed to expire before the user can complete authentication and the artifact can fetch in the same conversation turn. Designing a UX that requires OAuth on artifact load fails consistently.

**Fix:** Demo mode is the PRIMARY UX. The artifact loads with Demo data immediately, no auth required. Live mode is a user-initiated upgrade:

1. User opens Config modal (`?` or `C` key)
2. User enters their Supabase project ID
3. Project ID stored in localStorage `ff_pid`
4. On reload, artifact attempts Live with stored ID
5. If OAuth fails, gracefully stay on Demo

Never block first paint on OAuth.

---

## 8. Artifact ID is fixed — never change it

**Symptom:** A new artifact appears in the user's Cowork artifact list instead of updating the existing one. User's localStorage state (project ID, budget, mode) is lost.

**Diagnosis:** `mcp__cowork__create_artifact` and `update_artifact` use `artifact_id` as the primary key. A different ID = a different artifact. Each artifact has its own localStorage scope.

**Fix:** Use `flashfusion-control-center` for every call, every time. This is the canonical ID for the FlashFusion Control Center. Treat it as immutable.

```javascript
// CORRECT
{ artifact_id: "flashfusion-control-center", ... }

// WRONG — creates duplicate
{ artifact_id: "flashfusion-control-center-v2", ... }
{ artifact_id: "ff-dashboard", ... }
{ artifact_id: "flashfusion-control-center-2026-05-15", ... }
```

If you need to version: bump the `version` field inside the artifact (e.g., a `<meta>` tag), not the ID.

---

## 9. `unpkg.com` and `cdnjs.cloudflare.com` are blocked

**Symptom:** `<script>` tag loads from one of these CDNs and the script never executes. No CSP violation shown.

**Diagnosis:** The sandbox CDN whitelist is narrow. Only `cdn.jsdelivr.net` is permitted, and only for the three approved libraries (Chart.js@4.5.0, Grid.js@5.1.0, Mermaid@11). Other CDNs are blocked at the network layer.

**Fix:**

- For approved libraries → use `cdn.jsdelivr.net` URLs only
- For other libraries → inline the source into the artifact `<script>` block, or skip the library
- Google Fonts (`fonts.googleapis.com` + `fonts.gstatic.com`) is the documented exception for fonts

**Anti-pattern:** "I'll just use unpkg as a fallback" — there is no fallback. Block is enforced.

---

## 10. Patching beats rebuilding

**Symptom:** Tempted to "just regenerate the whole thing" for a small change. Then layout shifts, localStorage state is lost, and you spend 20 minutes diffing what changed.

**Diagnosis:** Full rebuild is expensive. It's also error-prone — easy to accidentally drift on brand tokens, panel order, or the `artifact_id` itself. Most changes are 1–3 panels.

**Fix:** Default to the Patch Playbook. Rebuild only when:

- Layout changes radically (grid → tabs)
- More than 6 of 10 panels affected
- New CDN library introduced
- Brand redesign (token philosophy change)

For everything else — even "I'd like to add a new panel and tweak the colors" — patch in two passes.

---

## Diagnosis Quick-Reference

| What you see | Most likely cause | Section |
|---|---|---|
| `InputValidationError` | Forgot ToolSearch | #1 |
| White background in dark theme | Missing `color-scheme: light` | #2 |
| Empty panels, no errors | Direct fetch blocked | #3 |
| LOXIHART project ID in HTML | Hardcoded reference | #4 |
| Chart canvas blank | Wrong Chart.js version/hash | #5 |
| Whole dashboard on Demo | Top-level catch-all | #6 |
| OAuth error on load | Designed for OAuth-on-load UX | #7 |
| Duplicate artifact created | Changed `artifact_id` | #8 |
| Script doesn't execute | Used `unpkg` or `cdnjs` | #9 |
| Spent 20m diffing rebuild | Should have patched | #10 |
