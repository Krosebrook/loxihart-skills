# Pipeline Templates — Steps 1–4 + 7–9 Skeletons

Per-step output skeletons for the compile pipeline. Steps 5–6 (types, utils,
components) live in `references/react19-gotchas.md`.

## Step 1 — `design/design.md`
```markdown
# <Brand> Design Spec
## Identity        — one paragraph; the feeling, not the features
## Type thresholds — display/body/code roles, min sizes, scale ratio
## Surface hierarchy — bg levels 0–3, elevation rules, border logic
## Texture         — grain/noise policy, where it applies, opacity cap
## UX state machines — per interactive pattern: idle→hover→active→focus→disabled→loading→error
```

## Step 2 — `tokens/tokens.tokens.json` (DTCG v1, 2025.10)
Three tiers, `$value`/`$type` throughout, ext `.tokens.json`:
`primitive` (raw scales) → `semantic` (bg/fg/accent/status aliases) →
`component` (button/input/card aliases into semantic). Aliases reference
upward only — a component token never points at a primitive directly.

## Step 3 — `tokens/tokens.css`
Order matters: `:root` dark values → `[data-theme="light"]` overrides →
component `@layer` → `:focus-visible` ring → `@media (prefers-reduced-motion)`
kill-switch → optional grain layer last.

## Step 4 — Tailwind bridge
v4 default: `@theme` block mapping CSS vars. v3 fallback: `tailwind.config.ts`
full-override (`colors`/`fontFamily` replaced, not extended) so raw palette
classes can't leak past the tokens.

## Steps 7–9
**7 Docs:** `voice.md` (tone rules + banned list), `accessibility.md`
(contrast table with measured pairs, focus policy, motion policy),
`patterns.md` (composition do/don't with code refs).
**8 Example page:** every component, both themes, one realistic composed view.
**9 Compile gate (all must pass before zip):** every component consumes only
token vars (no raw hex in components) · both themes render · focus visible on
all interactives · reduced-motion honored · contrast table complete · voice
doc has ≥1 anti-example.
