# Gotchas — Numbered (SKILL.md routing references these numbers; do not renumber)

1. **CDN whitelist is strict (§6 — exact versions + hashes).** Allowed:
   Chart.js `4.5.0`, Grid.js `5.1.0`, Mermaid `11` — jsdelivr URLs only —
   plus the documented Google Fonts exception (`fonts.googleapis.com` /
   `fonts.gstatic.com`). Blocked at the network layer: `unpkg.com/*`,
   `cdnjs.cloudflare.com/*`, every other CDN. Any `@latest` tag or
   off-whitelist version = **silent integrity failure**. Need a lib not on
   the list → inline it or do without.
2. **`color-scheme: light` required on `:root`** even though the design is
   void-dark. Removing it breaks form-control rendering in the sandbox.
   Style dark on top of it; never delete it.
3. **`fetch()`, `XMLHttpRequest`, and `WebSocket` are all blocked silently
   (§7).** Every data access goes through
   `window.cowork.callMcpTool(toolName, args)` — nothing else reaches the
   network. Third-party SDKs (`supabase-js`, `axios`) fail even when the
   import succeeds, because their underlying calls die. Symptom: panels
   stuck on spinners with a clean console. Fix: route through
   `callMcpTool`; demo fallback covers the gap.
4. **OAuth TTL expires within one turn.** Live connections are ephemeral by
   design → Demo mode is the *primary* UX, live is the enhancement. Never
   build a panel that's blank without live auth.
5. **Per-panel demo independence.** One shared demo dataset = one dead source
   blanks the board. Each panel owns its fallback and degrades alone.
6. **Chart.js pin is exact — version AND integrity.** `4.5.0` from
   `https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js` with
   SRI `sha384-iU8HYtnGQ8Cy4zl7gbNMOhsDTTKX02BTXptVP/vqAWIaTfM7isw76iyZCsjL2eVi`
   + `crossorigin="anonymous"` (§6 reference snippet). "Latest" or a newer
   pin = silent rejection. Check version + hash during every QA pass.
7. **LOXIHART project ID `oorstbwcydxwiojrsoim` is a hard stop (§8 — supersedes
   everything).** PERSONAL-lane artifact; the string must never appear in
   artifact HTML, comments, examples, or placeholders — even commented out.
   **Enforcement before any register/patch:**
   `grep -i "oorstbwcydxwiojrsoim" artifact.html` → must return zero. If
   found: stop, replace with `<USER_ENTERED_PROJECT_ID>`, confirm the
   artifact reads `ff_pid` from localStorage, never a hardcoded value.
   (This is half of every "fix live connection" task, per SKILL.md routing.)
8. **Blur panels cost GPU — and the recipe is canonical (§2).** One recipe
   for all panels: `blur(12px)` **with the `-webkit-backdrop-filter` Safari
   prefix (required)**, 12px radius, 16px padding. No `box-shadow`, no
   gradient overlays, no alternate radii on individual panels — cohesion is
   the brand. Cap stacked blur surfaces per view; static translucency for
   the rest.
