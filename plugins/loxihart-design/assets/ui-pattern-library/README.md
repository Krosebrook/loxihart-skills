# UI Interaction & Motion Pattern Library

32 self-contained, runnable HTML/CSS/JS interaction patterns — each one browser-verified across Chromium, Firefox, and WebKit, scanned for WCAG violations, type-checked, and behaviourally tested.

Open `index.html` to browse them, or open any single file directly. Nothing depends on anything else: no build step, no bundler, no CDN, no `node_modules` to render a pattern.

```bash
cd verify && npm install && npm run all    # run every suite yourself
```

---

## Why this exists

Most pattern libraries are asserted, not verified. A file says it handles `prefers-reduced-motion`, and nobody checks. A comment claims a keyboard alternative exists, and nobody presses Tab.

This one is checked, and the checking found real defects — including in files whose own comments claimed the opposite:

| Defect | Caught by | Missed by |
|---|---|---|
| Glitch effect running at **14.3Hz** — a WCAG 2.3.1 seizure risk, in the file documenting its own flash mitigation | browser load test | static analysis, code review, the comment asserting "well under 3Hz" |
| Password caret preservation silently broken — documented as a "production detail most implementations skip" | behavioural test | load test, type-check |
| A pattern that **hung in Firefox** (external image, never resolved) | multi-engine test | Chromium-only testing |
| `aria-label` on a bare `<div>` — prohibited, silently dropped by assistive tech | axe-core | attribute-presence checks |
| Nine contrast failures, down to 2.45:1, in files claiming WCAG AA support | axe-core | everything else |
| `style.setProperty()` passed a number where the spec requires a string | **type-check** | static analysis **and all 171 browser checks** — browsers coerce silently |
| **The entire test harness was non-portable** — 21 hardcoded absolute paths; CI would have failed on its first run | clean-room install test | all six suites, which passed happily on the machine that wrote them |
| **The visual harness suppressed the behaviour it verified** — an animation freeze made removing a whole `prefers-reduced-motion` block invisible to the diff | mutation test | the visual suite itself, reporting 32/32 green |

The last row is the argument for layered verification. No single tool would have found all six.

## Verification status

| Check | Result |
|---|---|
| Type-check (`tsc --checkJs`) | **32/32 files, 0 errors** |
| Load — Chromium / Firefox / WebKit | **32/32 in all three** |
| Computed accessibility tree | **32/32** — every interactive node exposes a real name |
| axe-core (WCAG 2.0/2.1/2.2 A + AA) | **32/32 zero violations** |
| Visual / geometry | **32/32** render plausibly |
| Behavioural — 6 patterns, deep | **60/60** (20 checks × 3 engines) |
| Behavioural — remaining 26 | **171/171** (57 checks × 3 engines) |
| **Mutation tests of the suites** | **19/19** — every injected bug caught, clean files still pass |
| Visual regression vs committed baselines | **32/32 match** |
| Clean-room install (fresh clone, `npm install`, all suites) | **passes end to end** |

That last row matters most. A validator nobody has tried to fool is a confidence generator, not a check. Both suites are deliberately sabotaged — flash-rate regressions, removed ARIA names, unbounded DOM growth, broken keyboard paths — and must go red. During this build, a one-line change silently disabled one mutation while every other suite stayed green; only the mutation test caught it.

## Using a pattern

1. **Read the comment header.** Every file opens with `PATTERN / CATEGORY / PRIORITY / RISK`, then "ADAPT THIS BY" and "DO NOT STRIP WHEN ADAPTING". The second is load-bearing: those are the accessibility, performance, and safety decisions that look removable and aren't.
2. **CSS custom properties at the top of `<style>` are the intended knobs** — colours, durations, easing.
3. **`prefers-reduced-motion` handling is real, not a stub**, in every file.
4. **JSDoc annotations (`/** @type {HTMLButtonElement} */`) are for porting**, so a TypeScript migration starts at zero errors instead of ~40.
5. **Every file shadows `console` locally.** Some sandboxes omit `console.assert`; the shadow keeps the inline smoke checks safe anywhere.
6. **No external assets, deliberately.** Images are inline percent-encoded SVG data URIs. An external placeholder once made a pattern hang in Firefox.
7. **Run `npm run all` after any change.**

## Categories

| # | Category | Count |
|---|---|---|
| 1 | Loading & Progress Feedback | 4 |
| 2 | Action Feedback & Confirmation | 5 |
| 3 | Motion & Transform Effects | 8 |
| 4 | Navigation & Wayfinding | 3 |
| 5 | Visual Enhancement & Decorative | 9 |
| 6 | Theming & Display-Mode Transitions | 3 |

### Elevated-risk patterns

Five files carry a High or Medium risk rating for accessibility reasons, not implementation difficulty:

- **`dark-mode-flashbang-toggle`** — the name implies a literal flash; the implementation deliberately does not do that. A View Transitions circular reveal instead, with an instant-swap fallback.
- **`image-glitch-flicker`** — single-shot rather than a repeat loop, hard-disabled (not toned down) under reduced motion, cooldown capping sustained activation at ~1 flash/sec. **A text spec cannot certify WCAG 2.3.1 compliance** — measure a real deployment with a photosensitivity analysis tool.
- **`haptic-vibration-feedback`** / **`audio-ui-sound-click`** — feedback through a single non-visual channel is exclusionary if it's the *only* signal; both pair the effect with unconditional visual feedback.
- **`scratch-card-reveal`** / **`slide-to-unlock-fader`** — drag gestures with no native keyboard equivalent; both ship a real, non-optional alternative path (SC 2.5.1).

## What this does not claim

- **No real screen reader.** The computed accessibility tree is what an AT *consumes*; whether NVDA or VoiceOver *announce usefully* is untested and not automatable here.
- **Visual baselines are Chromium-only**, and record the current state — if something renders subtly wrong today, that becomes the reference.
- **Headless only.** No real-device mobile, no iOS Safari — exactly where the haptics and touch patterns most need testing.
- **This is not a WCAG conformance claim.** It is a library designed to support WCAG 2.2 AA implementation, with automated checks that catch a real subset of violations.

Full detail and post-mortems in [`verify/README.md`](verify/README.md).

## Structural decisions

- **Self-contained over DRY.** Each file repeats a small CSS custom-property block rather than importing a shared stylesheet — a file grabbed in isolation should never be missing a dependency.
- **Vanilla HTML/CSS/JS as the base layer**, framework notes in comments. Porting one real implementation beats guessing which of four parallel versions matches your conventions.
- **Native elements before custom ARIA.** `<button>`, `<dialog>`, `<progress>` wherever they fit, rather than a styled `<div>` plus a role and a hand-rolled keydown handler.
- **No browser storage.** Any "remember this setting" toggle is session-only; wire real persistence in your app.

## License

MIT — see [LICENSE](LICENSE).
