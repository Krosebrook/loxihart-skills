# Build Phases — FlashFusion Agent Control Center

Seven phases for a from-scratch build. **SOT section numbers are canonical**
(`sot/FF-PLAT-CORE-SOT.md`) — phase names here are working labels; on any
conflict the SOT wins.

| # | Phase | Reads | Exit criterion |
|---|---|---|---|
| 1 | Brand shell — tokens, void-dark ground, `color-scheme: light` on `:root` (sandbox requirement), blur-panel recipe | SOT §1, §2 | Empty shell renders correctly in sandbox |
| 2 | Layout + navigation — panel grid, header, responsive frame | SOT §2, §3 | All panel slots present, no content |
| 3 | Panels — all **10** canonical panels per SOT §3 (nav, KPI strip, budget gauge, trend chart, approval queue, active runs, agent health, heatmap, config modal, keyboard overlay); builds without all 10 fail the smoke test | SOT §3, §4 | Every one of the 10 renders with placeholder-free demo data |
| 4 | Demo data layer — per-panel `DEMO.*` slices per §3's Demo Slice column; independent fallback is the primary UX (OAuth TTL expires within one turn) | SOT §3, §5 | Kill any single data source → its panel degrades alone, rest unaffected |
| 5 | Live wiring — all data via `window.cowork.callMcpTool` (`fetch` is blocked): `mcp__plugin_kyle-os_supabase__execute_sql` against §4's three tables (`agents`, `agent_runs`, `hitl_queue`, RLS respected); LOXIHART grep guard | SOT §4, §7, §8, §10 | Live mode works; §8 grep returns zero matches |
| 6 | State + interactions — §5 localStorage contract exactly: `ff_pid` (`''` = Demo), `ff_budget` (default 50), `ff_mode`; writes only via Config modal Save | SOT §5 | No dead controls; contract keys read on init, written only on Save |
| 7 | QA + register — gotchas sweep (`references/gotchas.md`), CDN version+SRI check, register via `mcp__cowork__create_artifact` (ToolSearch-load it first) with **fixed** `artifact_id: flashfusion-control-center`; version bumps go in the `ff-artifact-version` meta tag, never the ID | SOT §6, §9, §10 | Full checklist green |

**Hard stop at every phase:** LOXIHART project ID `oorstbwcydxwiojrsoim` — any
operation targeting it aborts the build step. PERSONAL lane only.
