# Brand Template Contract

The exact standalone-page template per brand. Copy the CSS from an existing
shipped essay verbatim — do not re-derive it. Set `active_brand` in
`assets/config.md`; load the matching block below.

---

## Load-Bearing (default, confirmed)

Reference essay to copy from: any `lb-essay-*.html` (e.g. `lb-essay-01`,
`lb-essay-04`, `lb-essay-07`).

- **Fonts:** Fraunces (display/`--font-serif`), Crimson Pro (body/`--font-body`),
  JetBrains Mono (labels + code/`--font-mono`). Loaded via Google Fonts `<link>`.
- **Tokens:** `--bg:#0d0d0f`, `--surface:#141417`, `--border:rgba(255,255,255,0.07)`,
  `--text-primary:#f0ede8`, `--text-secondary:#8a8680`, `--text-tertiary:#52504e`,
  `--accent:#c9a96e`, `--accent-dim:rgba(201,169,110,0.12)`, `--green:#6db87a`,
  `--red:#c75c5c`.
- **Masthead:** name "Load-Bearing" + tag "AI tools, tested under load".
- **Badge:** `Essay <span>NN</span> — <Act Name>`. Acts: I = **Under Load**,
  II = **The Systems**, III = **The Builder**.
- **Structure (in order):** masthead → series-badge → essay-meta (date / topic /
  ~words) → h1 → deck (italic) → body (`<h2>` sections + `<p>` + one closing
  `<div class="pull">`) → `.claims` (Claims) → `.claims` (Gaps) → essay-footer
  (footer-meta + footer-note).
- **Claim tags:** `<span class="tag tag-s">[SOURCED]</span>` /
  `<span class="tag tag-g">[GENERATED]</span>`.
- **Footer note (standard):** "Load-Bearing covers AI tools tested in real use —
  no hype, no sales pitch, just what holds. flashfusion.co"

⚠ **Brand-token drift.** Shipped essays use `--accent:#c9a96e`; the Abstrekkt
brand doc specifies brass `#C8A86A`. MATCH the shipped assets for consistency,
then reconcile all essays to the brand value in ONE global pass — never a
per-file near-miss. Track which value is canonical in `assets/config.md`.

---

## FlashFusion (color tokens confirmed; fonts UNCONFIRMED)

Only run this block after confirming the display/body fonts — do not invent them.

- **Aesthetic:** void-dark dashboard register, semi-transparent blur panels.
  [SOURCED — building-flashfusion-live-artifacts, FF design tokens]
- **Tokens:** `bg1:#0B0B14`, `bg2:#13131F`, `bg3:#1C1C2E`,
  `border:rgba(168,85,247,0.12)`, `borderHi:rgba(168,85,247,0.35)`,
  violet `--v:#A855F7`, magenta `--m:#EC4899`, cyan `--cy:#22D3EE`,
  `t1:#FFFFFF`, `t2:#C7C7D1`, `t3:#9A9AA6`, `ok:#10b981`, `warn:#f59e0b`,
  `err:#ef4444`.
- **Fonts:** UNCONFIRMED. Ask Kyle or read a shipped FF page before first use.
  Do not reuse the Load-Bearing font stack by default — different brand.
- **Masthead / badge / act names:** UNCONFIRMED — derive from the FF series spec
  at run time, mirror the Load-Bearing structure, confirm with Kyle.
- **Footer:** FlashFusion-appropriate line, not the Load-Bearing one.

When adding a third brand: copy this block's shape, fill only confirmed values,
and mark everything unconfirmed as UNCONFIRMED rather than guessing.
