# Verification harness

Five suites. `npm install` then `npm run all`, or run any single suite with `node <file>`.

Requires a Chromium/Firefox/WebKit set. If your browsers live somewhere non-default:
```bash
PLAYWRIGHT_BROWSERS_PATH=/path/to/browsers npm run all
```

| Suite | Command | What it proves | What it does NOT prove |
|---|---|---|---|
| `phase1-typecheck.mjs` | `npm run typecheck` | Every inline `<script>` type-checks under `tsc --checkJs`. Catches typos on real DOM APIs, wrong arity, misused built-ins. | That the code does what its filename says. |
| `phase1-harness.mjs` | `npm run engines` | Loads in **Chromium + Firefox + WebKit**; every interactive node exposes a real accessible name in the **computed a11y tree**; **zero axe-core WCAG violations**; renders plausibly (screenshot + geometry). | That a correct-looking render is the *intended* render. |
| `phase0-behavior-check.mjs` | `npm run behavior` | The load-bearing accessibility claims actually hold — keyboard paths on drag patterns, state machines, ARIA wiring, caret preservation. 20 checks x 3 engines. | Anything about the 26 patterns it doesn't cover. |
| `phase0-load-check.mjs` | — | Chromium-only quick load smoke. Superseded by `phase1-harness` but kept as a fast single-engine check. | — |
| `phase2-behavior-all.mjs` | `npm run behavior:all` | The remaining 26 patterns each assert the promise in their own DO-NOT-STRIP block. 57 checks x 3 engines. | Depth — one or two assertions per pattern, not exhaustive. |
| `mutate-phase2.mjs` | `npm run mutation:phase2` | The phase-2 suite can actually fail — 7 sabotages (unbounded DOM growth, removed ARIA names, broken Escape handling, hover-only affordance, removed flash cooldown). | — |
| `mutation-test.mjs` | `npm run mutation` | **The harness itself catches injected bugs** — runtime TypeError, broken a11y invariant, flash-rate regression, syntax error, empty render, offscreen layout — and still passes clean files. | — |

## Run the mutation test whenever you touch the harness

A validator nobody has tried to fool is a confidence generator, not a check. This is not a slogan — during this build, a one-line change to status precedence made `EMPTY` mask `SMOKE_FAIL`, silently disabling mutation M3. Every other suite stayed green. Only the mutation test caught it.

## Bugs this harness caught that static analysis missed

1. **`image-glitch-flicker.html` running at 14.3Hz** — a WCAG 2.3.1 seizure-risk violation, inside the file that documented its own mitigation. The comment asserted "well under 3Hz"; the arithmetic was never done. Now single-shot rather than a repeat loop, with a cooldown capping sustained activation at ~1 flash/sec.

2. **`password-peek-toggle.html` caret preservation silently broken** — documented as a "production detail most implementations skip," and it didn't work. Took three wrong fixes before instrumenting the actual call stack. See the correction note in that file; the widely-repeated "changing input.type resets the caret" claim is **false** in all three engines.

3. **`image-hotspot-pulse.html` hung in Firefox** — an external `placehold.co` image that never resolves offline; Firefox waits on `load` where Chromium and WebKit fail fast. Exposed a violation of the library's own self-contained principle. All external images are now inline percent-encoded SVG data URIs.

4. **`aria-label` on a bare `<div>`** in `typing-effect-reset.html` — prohibited, silently dropped by assistive tech, so the "stable label" was doing nothing. Caught by axe (`aria-prohibited-attr`), fixed with `role="img"`.

5. **Nine axe violations** including contrast down to 2.45:1 in files claiming WCAG 2.2 AA support.

6. **`style.setProperty()` called with a number** in two files, where the spec requires a string. Browsers silently coerce, so all 60 behavioral checks passed it. **Only the type-checker saw this one** — neither static analysis nor browser testing did.

## Coverage honesty

- **No real screen reader.** The computed a11y tree is a genuine step up from attribute-presence checking, but whether NVDA/VoiceOver announce *usefully* is untested and not automatable here.
- **Visual checks detect broken, not ugly.** No baseline diffing — a pattern could render correctly-but-wrong and pass. Screenshots in `screenshots/` are a manual-review baseline, not an automated comparison.
- **Behavioural depth varies.** All 32 patterns now have behavioural coverage (6 deep, 26 with 1-3 assertions each). The 26 are covered, not exhaustively covered.
- **Headless only.** No real-device mobile, no iOS Safari — which is exactly where the haptics and touch patterns most need testing.
