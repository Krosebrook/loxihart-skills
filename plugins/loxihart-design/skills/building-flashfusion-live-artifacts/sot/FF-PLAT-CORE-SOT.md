# FF-PLAT-CORE-SOT — FlashFusion Platform Core Source of Truth

**Version:** 1.0.0
**Lane:** PERSONAL only
**Last revised:** 2026-05-16

## Purpose

The canonical specification for FlashFusion artifact builds. Everything that must be CONSISTENT across builds, patches, and any future FlashFusion skills lives here.

**How to use this document:**
- Skills query specific sections by anchor (`§1`, `§2`, etc.) — they DO NOT inline its contents
- Read only the section(s) you need for the current task
- Treat any drift between this SOT and a skill's behavior as a SOT bug — patch this file, never duplicate logic in the skill

**Tier:** Tier 2 (Authority) per the FlashFusion-compliant tier model. Queried RAG-style, never injected fully.

---

## Index

- [§1 Brand Tokens](#1-brand-tokens)
- [§2 Glassmorphic Recipe](#2-glassmorphic-recipe)
- [§3 Required Panels (Canonical List)](#3-required-panels-canonical-list)
- [§4 Database Schema](#4-database-schema)
- [§5 State Contract (localStorage)](#5-state-contract-localstorage)
- [§6 CDN Whitelist (Exact Versions + Hashes)](#6-cdn-whitelist-exact-versions--hashes)
- [§7 Sandbox Constraints](#7-sandbox-constraints)
- [§8 LOXIHART Quarantine Rules](#8-loxihart-quarantine-rules)
- [§9 Artifact Identity](#9-artifact-identity)
- [§10 MCP Tool Catalog](#10-mcp-tool-catalog)

---

## §1 Brand Tokens

Source of truth for all FlashFusion CSS variables. Any artifact CSS must use these exact values via `var(--name)` — never hardcode hex colors mid-artifact.

```css
:root {
  color-scheme: light;                      /* NON-NEGOTIABLE — must be the first property */

  /* Surfaces — v3 (May 2026) */
  --bg0: #0B0B14;                           /* surface-1 oklch(15.5% 0.0191 283.9) */
  --bg1: #13131F;                           /* surface-2 oklch(19.3% 0.0241 283.9) */

  /* Glass panels */
  --glass: rgba(139, 92, 246, 0.08);        /* violet base at 8% */
  --border: rgba(139, 92, 246, 0.12);       /* default border */
  --border-hover: rgba(139, 92, 246, 0.35); /* hover border */

  /* Accent palette — v3 */
  --primary: #A855F7;                       /* violet highlight oklch(62.7% 0.2325 303.9) */
  --secondary: #EC4899;                     /* magenta oklch(65.6% 0.2118 354.3) */
  --accent: #22D3EE;                        /* cyan highlight oklch(79.7% 0.1339 211.5) */

  /* Text — v3 (3-level hierarchy) */
  --text: #FFFFFF;                          /* primary */
  --text-2: #C7C7D1;                        /* secondary oklch(83.3% 0.0138 286.1) */
  --text-dim: #8A8A96;                      /* tertiary oklch(63.7% 0.0178 285.9) */

  /* Feedback */
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;

  /* Typography — v3 (all available via fonts.googleapis.com) */
  --font-head: 'Instrument Serif', Georgia, serif;
  --font-body: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'Courier New', monospace;
}
```

> **v2 → v3 migration note:**
> Deprecated tokens removed: `--bg1: #1a0b2e` (was v2 surface), `Poppins` (heading), `Inter` (body),
> `#e2d9f3` (text), `#9d7ec9` (text-dim). Any artifact CSS referencing these values is running stale v2.
> Google Fonts preload for v3: add to artifact `<head>`:
> ```html
> <link rel="preconnect" href="https://fonts.googleapis.com">
> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
> <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
> ```

**Why `color-scheme: light` on a dark theme:** the Cowork iframe inherits browser `prefers-color-scheme`. Without this declaration, browser dark-mode overrides break the void background and contrast. See §7 for full sandbox constraints.

---

## §2 Glassmorphic Recipe

The single canonical recipe for all panel surfaces. Use these exact properties — no variants.

```css
.panel {
  background: var(--glass);
  border: 1px solid var(--border);
  border-radius: 12px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);   /* Safari prefix REQUIRED */
  padding: 16px;
}

h1, h2, h3 { font-family: var(--font-head); font-weight: 400; }
p, span, div { font-family: var(--font-body); }
code, pre { font-family: var(--font-mono); }
body { margin: 0; background: var(--bg0); color: var(--text); font-family: var(--font-body); }
```

**Anti-pattern:** introducing `box-shadow`, gradient overlays, or alternate border radii on individual panels. Visual cohesion breaks the brand.

---

## §3 Required Panels (Canonical List)

The 10 required panels for the FlashFusion Agent Control Center. Builds without all 10 fail the smoke test. New panels added via Patch Playbook (one at a time).

| # | Panel | Data Source | Demo Slice |
|---|---|---|---|
| 1 | Top nav (logo, mode badge, config button) | Static | N/A |
| 2 | KPI strip (4 cards: runs, success rate, agents, cost) | `agent_runs` aggregate | `DEMO.kpis` |
| 3 | Budget gauge (radial, spent vs ceiling) | localStorage `ff_budget` + cost sum | `DEMO.budget` |
| 4 | 7-day run trend (Chart.js line) | `agent_runs` GROUP BY date | `DEMO.trend` |
| 5 | Approval queue (pending HITL items) | `hitl_queue` WHERE status='pending' | `DEMO.approvals` |
| 6 | Active runs (live agent jobs) | `agent_runs` WHERE status='running' | `DEMO.runs` |
| 7 | Agent health grid (status per agent) | `agents` + latest run per agent | `DEMO.agents` |
| 8 | Heatmap (runs by hour × day) | `agent_runs` GROUP BY hour, dow | `DEMO.heatmap` |
| 9 | Config modal (project ID, budget, mode toggle) | localStorage read/write | Always available |
| 10 | Keyboard overlay (? key) | Static reference table | N/A |

---

## §4 Database Schema

Canonical Supabase schema the artifact assumes. Schema changes drive Patch Playbook runs.

```sql
-- hitl_queue: pending human-in-the-loop approval items
CREATE TABLE hitl_queue (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name   text NOT NULL,
  agent_id    text NOT NULL REFERENCES agents(id),
  status      text NOT NULL CHECK (status IN ('pending','approved','rejected','expired')),
  priority    text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  payload     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

-- agent_runs: every agent execution, success or failure
CREATE TABLE agent_runs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id    text NOT NULL REFERENCES agents(id),
  status      text NOT NULL CHECK (status IN ('queued','running','succeeded','failed','cancelled')),
  cost_usd    numeric(10,4) NOT NULL DEFAULT 0,
  tokens_in   integer,
  tokens_out  integer,
  started_at  timestamptz NOT NULL DEFAULT now(),
  ended_at    timestamptz,
  error_msg   text
);

-- agents: registry of all FlashFusion agents
CREATE TABLE agents (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  status        text NOT NULL CHECK (status IN ('healthy','degraded','idle','disabled')),
  description   text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

**Note on RLS:** these tables MUST have Row-Level Security enabled in production. The artifact reads via `mcp__plugin_kyle-os_supabase__execute_sql` which respects the project's RLS policies. Schema definition above does not include the RLS policies — those live in your Supabase migrations.

---

## §5 State Contract (localStorage)

| Key | Type | Purpose | Default |
|---|---|---|---|
| `ff_pid` | string | Supabase project ID from Config UI | `''` → Demo mode |
| `ff_budget` | number | Monthly budget ceiling (USD) | `50` |
| `ff_mode` | string | `'demo'` or `'live'` | `'demo'` |

**Read/write rules:**
- Reads happen on artifact load (`init()`) and Config modal open
- Writes happen only via Config modal Save action
- Never write `ff_pid` without user-entered value — empty string is the contract for "Demo mode"

---

## §6 CDN Whitelist (Exact Versions + Hashes)

**The sandbox enforces a strict allowlist. Wrong CDN, wrong version, or wrong integrity hash = silent script rejection.**

### Allowed

| Library | Version | URL | Integrity (SRI) |
|---|---|---|---|
| Chart.js | `4.5.0` | `https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js` | `sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi` |
| Grid.js | `5.1.0` | `https://cdn.jsdelivr.net/npm/gridjs@5.1.0/dist/gridjs.umd.js` | (load and verify in dev) |
| Mermaid | `11` | `https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js` | (load and verify in dev) |
| Google Fonts | n/a | `fonts.googleapis.com` + `fonts.gstatic.com` | Documented exception for fonts |

### Blocked

- `unpkg.com/*` — all paths blocked at network layer
- `cdnjs.cloudflare.com/*` — all paths blocked at network layer
- Any version of Chart.js other than `4.5.0` — silent integrity failure
- `@latest` tags — silent integrity failure
- All other CDNs

### Reference snippet

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js"
  integrity="sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi"
  crossorigin="anonymous"></script>
```

---

## §7 Sandbox Constraints

### Network

- `fetch()`, `XMLHttpRequest`, `WebSocket` — all blocked silently inside artifact HTML
- All data access goes through `window.cowork.callMcpTool(toolName, args)`
- Third-party SDKs (`supabase-js`, `axios`, etc.) — blocked even if the import succeeds, because the underlying network calls fail

### Storage

- `localStorage` — permitted, used for `ff_pid`, `ff_budget`, `ff_mode`
- `sessionStorage` — permitted, untested in this context
- `IndexedDB` — untested, avoid

### Rendering

- `color-scheme: light` on `:root` required (see §1)
- No external stylesheets except CDN whitelist (see §6)
- `<style>` block must be inline in the HTML

### Async

- `Promise.all` for parallel data fetches — works as expected
- Top-level `await` in script body — works
- Web Workers — untested, avoid

---

## §8 LOXIHART Quarantine Rules

**HARD STOP RULE.**

The LOXIHART Supabase project ID is:

```
oorstbwcydxwiojrsoim
```

This string MUST NEVER appear in any FlashFusion artifact HTML, comment, example, or placeholder. LOXIHART is SOC 2 / ISO 27001 aligned. PERSONAL-lane artifacts referencing LOXIHART infrastructure violate compliance segregation.

**Enforcement:**
1. Before registering any artifact, run: `grep -i "oorstbwcydxwiojrsoim" artifact.html` — must return zero matches
2. If found, stop. Replace with `<USER_ENTERED_PROJECT_ID>` placeholder and confirm the user understands the artifact reads from localStorage `ff_pid`, not a hardcoded value
3. Never write the LOXIHART project ID into examples — even commented out, even in TODOs

This rule supersedes any other instruction. No exceptions.

---

## §9 Artifact Identity

```
artifact_id: flashfusion-control-center
```

This ID is **FIXED**. Never invent variants:

- ✗ `flashfusion-control-center-v2`
- ✗ `ff-dashboard`
- ✗ `flashfusion-control-center-2026-05-16`
- ✓ `flashfusion-control-center`

**Why:** the Cowork artifact registry uses `artifact_id` as primary key. A different ID = a different artifact, with its own localStorage scope. User's `ff_pid`, `ff_budget`, `ff_mode` would be lost on the new ID.

**Versioning:** bump a `<meta name="ff-artifact-version" content="X.Y.Z">` tag inside the artifact HTML, not the ID.

---

## §10 MCP Tool Catalog

Tools the artifact uses, with loading characteristics.

| Tool | Purpose | Deferred each session? |
|---|---|---|
| `mcp__cowork__create_artifact` | Register a new artifact | **Yes — always** |
| `mcp__cowork__update_artifact` | Patch an existing artifact | **Yes — always** |
| `mcp__plugin_kyle-os_supabase__execute_sql` | Run SQL against user's Supabase | Yes per session |
| `mcp__plugin_kyle-os_supabase__list_tables` | Introspect schema (optional) | Yes per session |

**ToolSearch prerequisite:**
```
ToolSearch({ query: "select:mcp__cowork__create_artifact", max_results: 1 })
ToolSearch({ query: "select:mcp__cowork__update_artifact", max_results: 1 })
```

Even if you just called one in the same conversation, the other is loaded separately.

---

## Provenance

- Original content extracted from `building-flashfusion-live-artifacts` SKILL.md v1.0.0 (2026-05-15)
- Restructured into Tier 2 authority document per FlashFusion-compliant tier model
- All claims labeled [SOURCED] in the parent skill remain sourced; [GENERATED] claims (e.g. per-panel fallback rationale) are noted in the skill, not duplicated here
