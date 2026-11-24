# Phases — Full Build Detail

Seven phases. Run in order for a from-scratch build. Skip-ahead is fine for patches (use the Patch Playbook instead).

---

## Phase 1 — Pre-Build Lane Gate

**Purpose:** Prevent LOXIHART contamination. Confirm scope before touching files.

**Checklist:**

- [ ] Confirm lane = PERSONAL (FlashFusion / ChaosClubCo)
- [ ] State blast radius: artifact ID `flashfusion-control-center` only; no shared services touched
- [ ] State irreversible actions: registering / updating the artifact replaces the existing one
- [ ] Search anything you've drafted for `oorstbwcydxwiojrsoim` — LOXIHART project ID. If found, hard stop.
- [ ] Confirm Supabase project ID source = user-provided (Config UI), NOT hardcoded

**Output:** "PERSONAL lane confirmed. Building flashfusion-control-center. No LOXIHART refs."

---

## Phase 2 — Brand Token Load

**Purpose:** Lock the visual contract before writing any HTML. Brand drift = rebuild.

**Source of truth:** CLAUDE.md → FlashFusion profile.

**Tokens (canonical):**

```css
:root {
  color-scheme: light;                    /* NON-NEGOTIABLE — first property */
  --bg0: #0B0B14;                         /* primary void background */
  --bg1: #1a0b2e;                         /* elevated surface */
  --glass: rgba(168, 85, 247, 0.08);      /* frosted panel fill */
  --border: rgba(168, 85, 247, 0.2);      /* panel border */
  --primary: #A855F7;                     /* primaryGlow — violet */
  --secondary: #EC4899;                   /* secondaryGlow — pink */
  --accent: #22D3EE;                      /* cyanAccent */
  --text: #e2d9f3;                        /* primary text */
  --text-dim: #9d7ec9;                    /* secondary/dim text */
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --font-head: 'Instrument Serif', Georgia, serif;
  --font-body: 'Geist', system-ui, sans-serif;
}

body {
  margin: 0;
  background: var(--bg0);
  color: var(--text);
  font-family: var(--font-body);
}

.panel {
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 16px;
}

h1, h2, h3 { font-family: var(--font-head); }
```

**Glassmorphic recipe:** `var(--glass)` + 1px `var(--border)` + `border-radius: 12px` + `backdrop-filter: blur(12px)`. Always include the `-webkit-` prefix for Safari.

---

## Phase 3 — HTML Build

**Purpose:** Single self-contained HTML document. Inline `<style>` and `<script>`. Only CDN imports allowed are the whitelist (Phase 5).

**Document skeleton:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FlashFusion Agent Control Center</title>

  <!-- Fonts (self-hostable later if needed) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">

  <!-- Chart.js — EXACT version + integrity hash (see Phase 5) -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js"
    integrity="sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi"
    crossorigin="anonymous"></script>

  <style>
    /* Phase 2 tokens here */
    /* Layout, panels, modal, overlay */
  </style>
</head>
<body>
  <!-- Top nav: logo, mode badge, config button -->
  <header class="topnav">...</header>

  <!-- KPI strip: 4 cards -->
  <section class="kpi-strip">...</section>

  <!-- Main grid: budget gauge | trend chart | approval queue | active runs | agent health | heatmap -->
  <main class="grid">...</main>

  <!-- Config modal (hidden by default, opens on ? or C key) -->
  <div id="config-modal" class="modal" hidden>...</div>

  <!-- Keyboard shortcuts overlay (hidden by default) -->
  <div id="kbd-overlay" class="overlay" hidden>...</div>

  <script>
    /* DEMO object (Phase 4) */
    /* fetchLive() (Phase 4) */
    /* renderAllPanels() */
    /* init() */
    /* event handlers: ?, C, Escape, Config save */
  </script>
</body>
</html>
```

**Required panels (10):** see SKILL.md Required Panels table.

**Layout rules:**
- Grid uses `display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;`
- KPI strip is its own `flex` row above the grid
- Config modal is fixed-position with backdrop blur
- All interactive elements have visible focus rings (accessibility — `:focus-visible`)

---

## Phase 4 — Data Fetch Architecture

**Purpose:** Per-panel Demo fallback. One broken SQL query never collapses the dashboard.

**The DEMO object — required shape:**

```javascript
const DEMO = {
  kpis: {
    runs_24h: 47,
    success_rate: 0.94,
    active_agents: 6,
    cost_30d: 12.34
  },
  budget: { spent: 12.34, ceiling: 50 },
  trend: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    runs:   [32,    41,    38,    52,    47,    19,    24]
  },
  approvals: [
    { id: 'a1', task: 'Publish weekly newsletter draft', agent: 'newsletter-bot', ts: '09:42', priority: 'high' },
    { id: 'a2', task: 'Send invoice to ChaosClubCo client', agent: 'finance-bot', ts: '09:18', priority: 'medium' },
    { id: 'a3', task: 'Approve content calendar for May', agent: 'social-bot', ts: '08:51', priority: 'low' }
  ],
  runs: [
    { id: 'r1', agent: 'newsletter-bot', status: 'running', started: '09:30', elapsed: '12m' },
    { id: 'r2', agent: 'social-bot',     status: 'running', started: '09:42', elapsed: '0m' }
  ],
  agents: [
    { name: 'newsletter-bot', status: 'healthy', last_run: '09:30', success_rate: 0.96 },
    { name: 'social-bot',     status: 'healthy', last_run: '09:42', success_rate: 0.91 },
    { name: 'finance-bot',    status: 'idle',    last_run: '08:18', success_rate: 0.99 },
    { name: 'kb-bot',         status: 'healthy', last_run: '07:55', success_rate: 0.94 },
    { name: 'audit-bot',      status: 'degraded', last_run: '06:12', success_rate: 0.78 },
    { name: 'plugin-bot',     status: 'idle',    last_run: '05:00', success_rate: 0.97 }
  ],
  heatmap: /* 7×24 array of run counts */ Array.from({length: 7}, () => Array.from({length: 24}, () => Math.floor(Math.random() * 8)))
};
```

**fetchLive() pattern:** see SKILL.md → Data Fetch Architecture. Key invariant: `aqRaw?.rows?.length` check is per-panel, NOT a top-level guard.

**elapsedStr helper:**

```javascript
function elapsedStr(startISO) {
  const ms = Date.now() - new Date(startISO).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
```

---

## Phase 5 — CDN Requirements

**Purpose:** Sandbox enforces a strict whitelist. Wrong CDN = silent failure.

**Allowed:**

| Library | Version | URL | Integrity |
|---|---|---|---|
| Chart.js | `4.5.0` | `https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js` | `sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi` |
| Grid.js | `5.1.0` | `https://cdn.jsdelivr.net/npm/gridjs@5.1.0/dist/gridjs.umd.js` | (load and verify in dev) |
| Mermaid | `11` | `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js` | (load and verify in dev) |

**Blocked:**

- `unpkg.com/*` — all blocked
- `cdnjs.cloudflare.com/*` — all blocked
- Any version of Chart.js other than `4.5.0` — silent integrity failure
- `@latest` tags — silent failure

**Fonts:** Google Fonts CSS is permitted (`fonts.googleapis.com` + `fonts.gstatic.com`). Self-host if you want zero external dependencies.

---

## Phase 6 — Register Artifact

**Purpose:** Hand the HTML to Cowork. Two tools, both deferred every session.

**Sequence:**

```
1. ToolSearch → load create_artifact OR update_artifact schema
2. Call the tool with artifact_id="flashfusion-control-center"
3. Verify tool returned success (no InputValidationError)
4. Surface the artifact link to the user
```

**Code:**

```javascript
// First-time create:
ToolSearch({ query: "select:mcp__cowork__create_artifact", max_results: 1 })

mcp__cowork__create_artifact({
  artifact_id: "flashfusion-control-center",
  title: "FlashFusion Agent Control Center",
  description: "Live HITL queue, agent health, cost tracking, and approval management",
  html: artifactHtml,
  mcp_tools: [
    "mcp__plugin_kyle-os_supabase__execute_sql",
    "mcp__plugin_kyle-os_supabase__list_tables"
  ]
})

// Subsequent updates:
ToolSearch({ query: "select:mcp__cowork__update_artifact", max_results: 1 })

mcp__cowork__update_artifact({
  artifact_id: "flashfusion-control-center",
  html: patchedHtml
})
```

**Critical:** The `artifact_id` is FIXED. Never invent a new ID — that creates a duplicate and orphans the user's localStorage state.

---

## Phase 7 — Smoke Test

**Purpose:** Catch the predictable failure modes before the user does.

Run through the 10-item checklist in SKILL.md. Every item must pass before declaring the build complete.

**Common failures and where to look:**

| Symptom | Likely Cause | Fix |
|---|---|---|
| Background reverts to white in dark mode | Missing `color-scheme: light` | Add as first property in `:root` |
| Empty panels, no console errors | Direct `fetch()` blocked | Replace with `window.cowork.callMcpTool` |
| Chart never renders | Wrong Chart.js version or hash | Use exact `4.5.0` + correct integrity |
| Mode badge stuck on "DEMO" | `ff_pid` not set in localStorage | Open Config modal, enter project ID |
| InputValidationError on register | Skipped ToolSearch | Always ToolSearch before create/update |
| Whole dashboard blanks on one query failure | Top-level catch-all | Refactor to per-panel `?.rows?.length` checks |
| New artifact appears instead of update | Different `artifact_id` | Use `flashfusion-control-center` exactly |

If any smoke test item fails: do NOT register. Fix first, re-run the test, then register.
