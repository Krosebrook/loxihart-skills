# Patch Playbook — Surgical Edits Without Rebuilds

Use this for 1–3 panel changes, schema updates, or token tweaks. Full rebuild only when layout changes radically OR more than 6 of 10 panels are affected.

---

## When to Patch vs Rebuild

**Patch (use this playbook):**
- Schema change touching 1–3 panels (column added, renamed, dropped)
- Adding ONE new panel to an existing layout
- Updating brand tokens (color shift, font swap)
- Fixing a broken SQL query
- Adjusting a Demo slice

**Rebuild (skip this, run the full Phase 1–7 flow):**
- Layout overhaul (grid → tabs, columns → rows)
- More than 6 of 10 panels affected
- New CDN library required
- Brand redesign (token philosophy change, not just values)

---

## The 5 Steps

### Step 1 — Identify Affected Panels

Map the change to the panel(s) it touches. Be ruthless about scope.

**Diagnostic questions:**
1. Which SQL queries reference the changed table or column?
2. Which `DEMO.<key>` slices depend on the same shape?
3. Which render functions read those data shapes?
4. Are there any cross-panel dependencies (e.g., shared utility functions)?

**Output:** A list of exact panel names from the Required Panels table. If the list has more than 3 entries OR more than 6, abandon the patch and rebuild.

**Example:**
> "Approvals table got a new `priority` column."
> Affected: Approval queue panel only.
> Demo slice: `DEMO.approvals`.
> Render function: `renderApprovalQueue()`.
> Cross-panel dependencies: None.

---

### Step 2 — Update SQL Query

Open the artifact HTML. Find the relevant `sql(...)` call inside `fetchLive()`. Update the SELECT clause.

**Test in isolation FIRST.** Run the query against the live Supabase project (Supabase console or `mcp__plugin_kyle-os_supabase__execute_sql` directly) to confirm it returns the expected shape. If it errors there, the artifact will silently fall back to Demo — fix the query before touching the HTML.

**Example:**

```javascript
// Before
sql("SELECT id, task_name, agent_id, created_at FROM hitl_queue WHERE status='pending' ORDER BY created_at DESC LIMIT 20")

// After
sql("SELECT id, task_name, agent_id, created_at, priority FROM hitl_queue WHERE status='pending' ORDER BY created_at DESC LIMIT 20")
```

---

### Step 3 — Update Demo Slice

The Demo slice MUST mirror the live data shape. If the live query returns `priority`, the Demo objects need `priority` too — otherwise Demo rendering breaks the moment the panel tries to read the field.

**Example:**

```javascript
// DEMO.approvals — add `priority` to every row
DEMO.approvals = [
  { id: 'a1', task: '...', agent: '...', ts: '09:42', priority: 'high' },
  { id: 'a2', task: '...', agent: '...', ts: '09:18', priority: 'medium' },
  { id: 'a3', task: '...', agent: '...', ts: '08:51', priority: 'low' }
];
```

Also update the per-panel fallback mapping in `fetchLive()`:

```javascript
const approvals = aqRaw?.rows?.length ? aqRaw.rows.map(r => ({
  id: r.id, task: r.task_name, agent: r.agent_id,
  ts: new Date(r.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
  priority: r.priority ?? 'medium'   // <-- new field with safe default
})) : DEMO.approvals;
```

---

### Step 4 — Update Render Function

Add the new field to the panel's render output. Style it with existing CSS variables — never invent new colors mid-patch.

**Example:**

```javascript
function renderApprovalQueue(items) {
  const html = items.map(item => `
    <tr>
      <td>${escape(item.task)}</td>
      <td>${escape(item.agent)}</td>
      <td>${item.ts}</td>
      <td><span class="badge badge-${item.priority}">${escape(item.priority)}</span></td>
    </tr>
  `).join('');
  document.getElementById('approval-queue-body').innerHTML = html;
}
```

Add minimal CSS for the new badge:

```css
.badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
.badge-high   { background: var(--danger);  color: white; }
.badge-medium { background: var(--warning); color: white; }
.badge-low    { background: var(--success); color: white; }
```

---

### Step 5 — Test Demo → Live Toggle, Then Re-Register

**Test sequence:**

1. Render artifact in Demo mode — confirm new field appears with Demo data
2. Set `ff_pid` in localStorage to your test project ID
3. Reload — confirm Live mode shows real data with new field
4. Clear `ff_pid` — confirm fallback to Demo still works
5. Re-run smoke test items 1, 2, 7, 8 (panels render, no JS errors, charts/tables load)

**Re-register:**

```javascript
ToolSearch({ query: "select:mcp__cowork__update_artifact", max_results: 1 })

mcp__cowork__update_artifact({
  artifact_id: "flashfusion-control-center",   // SAME ID — never change
  html: patchedHtml
})
```

**Critical:** Use `update_artifact`, not `create_artifact`. Same `artifact_id` preserves user state. A different ID creates a duplicate.

---

## Patch Templates by Change Type

### Adding a Panel (single panel only — use rebuild for more)

1. Add panel HTML to grid (use existing `.panel` class)
2. Add Demo slice to `DEMO` object
3. Add SQL query to `fetchLive()` Promise.all
4. Add per-panel fallback mapping
5. Add render function call to `renderAllPanels()`
6. Add smoke test item #11 (or extend list)
7. Test → register

### Brand Token Tweak (color/font only)

1. Update CSS variable values in `:root`
2. Run smoke test items 1, 3, 4 only (renders, modal works, mode toggle works)
3. Re-register

### SQL Query Bugfix

1. Test corrected query in Supabase console
2. Replace the `sql(...)` string in `fetchLive()`
3. Confirm Demo fallback still triggers if query fails
4. Re-register

### Demo Slice Refresh (more realistic data)

1. Update Demo object values only — no shape changes
2. No render function changes needed
3. Re-register

---

## Anti-Patterns (Don't Do These)

- **"While I'm in here, I'll also fix..."** — scope creep. Each patch = one diff. New requests = new patches.
- **Changing the artifact_id during a patch** — creates a duplicate, orphans state. Hard rule.
- **Skipping Demo slice update on schema change** — Demo mode breaks the next time live queries fail.
- **Patching without testing in Supabase console first** — silent Demo fallback masks the broken query.
- **Editing CSS without using existing tokens** — token drift compounds. Always `var(--primary)`, never `#A855F7`.
