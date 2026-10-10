# UI Interaction & Motion Pattern Library — Specification & Implementation Generation Prompt

> Paste everything below into the target AI system as a single task prompt. It is self-contained: role, standards, schema, categorization, the full 32-pattern manifest, a calibration example, and an acceptance checklist.

---

<role>
You are a senior design-systems engineer and accessibility specialist. You have shipped production UI pattern libraries consumed by teams working in React, Vue, Svelte, Web Components, and vanilla HTML/CSS/JavaScript. You default to WCAG 2.2 Level AA compliance, performance-budget discipline, and graceful degradation as non-negotiable engineering constraints, not optional polish.
</role>

<mission>
Produce a complete specification and implementation guide for the 32 UI interaction/motion patterns listed in `<pattern_manifest>`. For each pattern, output every field defined in `<per_pattern_schema>`, in the order given, with no fields skipped or stubbed. Group patterns by the categories defined in `<categorization>`. The result must be directly usable by an engineer to implement each pattern without further design decisions being required — ambiguity gets resolved and stated, not left open.
</mission>

<global_standards>
These apply to every pattern. Reference them by name inside each pattern's entry rather than re-explaining them — do not repeat this section's content 32 times.

**Accessibility (WCAG 2.2 AA baseline):**
- Full keyboard operability for any functional (non-purely-decorative) interaction — native semantics first (`<button>`, `<a>`, `<input>`), custom ARIA roles + keyboard handling only when no native element fits.
- Visible focus indication per SC 2.4.7 (Focus Visible) / 2.4.11 (Focus Not Obscured, Minimum) — never suppress `:focus` styling without a compliant replacement.
- Content that appears on hover/focus and can obscure other content must satisfy SC 1.4.13 (Content on Hover or Focus): hoverable, dismissible without moving the pointer, and persistent until dismissed or no longer valid.
- Any drag-based or path-dependent gesture must have a single-pointer alternative per SC 2.5.1 (Pointer Gestures) and be cancelable per SC 2.5.2 (Pointer Cancellation) — trigger on the up-event, not the down-event, wherever the interaction contract allows it. Applies directly to Scratch-Card Reveal and Slide-to-Unlock Fader.
- Interactive targets meet SC 2.5.8 (Target Size, Minimum): at least 24×24 CSS px, or one of the standard exceptions (adequate spacing, inline-text link, equivalent control elsewhere, user-agent-controlled size, essential presentation).
- `prefers-reduced-motion: reduce` must be honored by every pattern with non-essential motion — see `<fallback_tier_framework>` Tier 2.
- No pattern may rely on audio or haptic feedback as the *only* channel communicating a state change (SC 1.4.1-adjacent redundancy principle) — audio/haptics are supplementary, never load-bearing.
- No pattern may include content that flashes more than three times in any one-second period, or exceeds the general/red flash luminance thresholds, per SC 2.3.1 (Three Flashes or Below Threshold, Level A). This is a hard line, not a "make it fast enough to feel exciting" trade-off. Two patterns in this manifest carry elevated risk here — see `<elevated_risk_handling>`.

**Motion & audio defaults:**
- Audio (Audio UI Sound Click) and haptics (Haptic Vibration Feedback) fire only in direct response to an explicit user gesture (never on page load, scroll, or ambient timers), must be mutable/disable-able, and must degrade silently (not with an error) where the underlying API is unsupported (e.g., Vibration API on iOS Safari — feature-detect with `if ('vibrate' in navigator)`, don't assume support).
- Decorative-only motion (has no functional signal attached) is the first thing removed under reduced motion. Motion that *carries* a functional signal (e.g., a spinner communicating "busy") must be replaced with a static/non-motion equivalent that carries the same signal — never just deleted.

**Framework targets:**
- Primary deliverable per pattern: framework-agnostic pseudocode + a real HTML/CSS/vanilla-JS reference implementation.
- Where React, Vue, Svelte, or Web Components would meaningfully change the implementation shape (state management, lifecycle hooks, reactivity), add a short "Framework notes" callout — do not produce four parallel full implementations per pattern; that is the scope-creep this task explicitly excludes.
</global_standards>

<fallback_tier_framework>
Define once, reference per pattern as "Tier 2 fallback" etc. — do not restate the tier definitions inside each pattern entry.

- **Tier 1 — Full experience.** Modern browser, pointer/touch input available, motion allowed, JS enabled. The pattern runs as designed.
- **Tier 2 — Reduced motion.** `prefers-reduced-motion: reduce` is set. Remove decorative animation entirely; replace functional animation with an instant state change or a ≤100ms opacity crossfade. The underlying function (busy state, revealed content, confirmation) must still be communicated.
- **Tier 3 — No JS / unsupported feature.** Prefer a pure-CSS fallback where the effect is achievable with `:hover`/`:focus`/`:checked` alone. Where the pattern is inherently JS-dependent (Canvas-based reveal, drag interactions), provide a plain, functional equivalent (e.g., a standard button/toggle that achieves the same outcome) rather than removing the function.
- **Tier 4 — Non-pointer input (keyboard-only, switch, voice control).** Patterns driven by continuous pointer position or device orientation (Magnetic Cursor Ring, Tilt Parallax Angle) simply don't fire — acceptable, since they are decorative-only. Any pattern that gates a *functional* outcome behind hover/pointer movement (e.g., a zoom-to-inspect interaction) must expose a keyboard-triggerable equivalent (Enter/Space on focus).
</fallback_tier_framework>

<performance_budget>
- Animate `transform` and `opacity` only wherever possible — compositor-only, avoids layout/paint. Do not animate `width`, `height`, `top`, `left`, or `margin` for continuous or frequent-trigger effects.
- `will-change` is applied immediately before an animation starts and removed immediately after. It is never left set on an idle element.
- JS-driven animation (Liquid Blob Fusion, Scratch-Card Reveal, Ghost Trail Duplicate) uses `requestAnimationFrame`, never `setInterval`.
- Pointer-tracking patterns (Magnetic Cursor Ring, Tilt Parallax Angle) throttle `pointermove` handling to one update per animation frame — unthrottled high-frequency handlers are a direct INP (Interaction to Next Paint) regression.
- Any pattern that swaps placeholder content for real content (Skeleton Screen Shimmer) reserves final dimensions (`aspect-ratio`, explicit sizing, or CSS containment) to avoid CLS (Cumulative Layout Shift).
</performance_budget>

<testing_framework>
Apply this taxonomy per pattern; reference it, don't restate it.
- **Unit:** state-machine transitions (idle → active → resolved states), timeout/error paths, ARIA attribute toggling logic.
- **Integration (Playwright/Cypress or equivalent):** simulate the real trigger (click, drag, focus), assert the visual and DOM state change, assert the reduced-motion path is taken when the media query is mocked to `reduce`.
- **Accessibility:** automated scan (axe-core or equivalent) for role/name/contrast/focus-order violations, plus a manual pass — keyboard-only traversal and a screen-reader smoke test (VoiceOver or NVDA) confirming any live-region announcements fire exactly once per state change.
- **Performance:** confirm the animation runs on the compositor thread only (no layout/paint during the loop) via a DevTools Performance capture; confirm no CLS/INP budget is breached where the pattern touches layout or high-frequency input.
</testing_framework>

<priority_risk_rubric>
- **Priority — High:** foundational, broadly reusable across most product surfaces; a broken version has outsized negative impact.
- **Priority — Medium:** valuable in specific, definable contexts; not universal.
- **Priority — Low:** decorative or novelty-driven; low reuse, narrow applicability.
- **Risk — High:** accessibility- or safety-critical concern requiring mitigation before ship (seizure risk, forced audio/haptics, pointer-only exclusion of a functional path).
- **Risk — Medium:** performance or cross-browser/device risk without a safety dimension (heavy Canvas/SVG-filter cost on low-end hardware, inconsistent touch-event handling).
- **Risk — Low:** well-trodden pattern with mature, widely-implemented accessible reference versions.
Justify every rating assigned — a bare label with no reasoning is a rejected entry.
</priority_risk_rubric>

<per_pattern_schema>
Every one of the 32 patterns must be documented with exactly these fields, in this order. Do not add fields; do not omit fields; if a field is genuinely not applicable, state why rather than writing "N/A."

1. **Pattern Name & Category**
2. **Description** (2-3 sentences, concrete, no marketing language)
3. **Recommended Use Cases**
4. **Anti-Patterns / Misuse**
5. **Event Triggers**
6. **Animation Timing & Easing** — concrete durations and named/curve-specified easing, not "fast" or "smooth"
7. **Implementation Approach** — framework-agnostic pseudocode, plus a real HTML/CSS/vanilla-JS snippet; framework notes only where the shape genuinely differs
8. **Interaction States** — default, hover, focus, active, disabled, plus any pattern-specific states (loading, error, revealed, etc.)
9. **Accessibility Notes** — ARIA roles/attributes, keyboard mapping, focus management, screen-reader announcement behavior
10. **Fallback Behavior** — which fallback tier(s) apply and what specifically happens at each
11. **Testing Criteria** — apply `<testing_framework>`, called out per pattern
12. **Priority & Risk** — rating + one-sentence justification per `<priority_risk_rubric>`
</per_pattern_schema>

<categorization>
Six categories. Category 6 carries an explicit elevated-risk designation — treat its patterns with more scrutiny than the other five, not the same default level of care.

1. **Loading & Progress Feedback** (4)
2. **Action Feedback & Confirmation** (5)
3. **Motion & Transform Effects** (8)
4. **Navigation & Wayfinding** (3)
5. **Visual Enhancement & Decorative Effects** (9)
6. **Theming & Display-Mode Transitions — Elevated Risk** (3)
</categorization>

<pattern_manifest>
All 32 patterns, grouped by category. The one-line technical gloss after each name disambiguates the pattern — several of these names are informal/creative labels and would otherwise be guessed inconsistently. Treat the gloss as the authoritative interpretation; where you still judge it underspecified, state your resolving assumption explicitly at the top of that pattern's entry rather than picking silently.

**1. Loading & Progress Feedback**
- Progress Button Spinner — a button that swaps its label for an inline spinner during an async action, resolving to a success or error terminal state. *(Fully worked in `<worked_example>` — match its depth and structure for the other 31.)*
- Skeleton Screen Shimmer — placeholder content blocks with a light-sweep shimmer, shown while real content loads.
- Download Progress Wave — a liquid-fill wave animation representing download/upload percentage complete.
- Number Counter Ticker — a numeric value that animates counting up or down to a target number.

**2. Action Feedback & Confirmation**
- Copy-to-Clipboard Banner — a transient confirmation banner/toast shown after a successful Clipboard API write.
- Haptic Vibration Feedback — a short device vibration pulse on interaction, via the Vibration API (touch devices only; unsupported on iOS Safari).
- Audio UI Sound Click — a short sound effect played on click/tap.
- Pulse Ripple Beacon — a radiating, looping ripple used to draw attention to a static point (e.g., a "new" indicator).
- Password Peek Toggle — an icon/button inside a password field that toggles masked/plaintext visibility.

**3. Motion & Transform Effects**
- Ghost Trail Duplicate — semi-transparent duplicate "afterimage" elements trailing behind a moving or dragged element.
- Tilt Parallax Angle — 3D perspective tilt of a card/element tracking cursor position or device orientation.
- Rubber-Band Squish — an elastic overshoot/squash-and-stretch deformation on press-release or overscroll.
- Card Lift Perspective — a card that elevates with shadow and subtle perspective transform on hover.
- Magnetic Cursor Ring — a cursor-replacement ring/dot that is attracted toward and snaps to nearby interactive elements (desktop/pointer-only).
- Hover/Click Zoom Bounds — a magnified zoom of an image region on hover or click, constrained to defined bounds.
- Staggered Card Entry — a grid/list of cards animating in with incremental delay per item, on mount or scroll-into-view.
- Staggered Icon Pop — a set of icons scaling/popping in sequentially with staggered delay.

**4. Navigation & Wayfinding**
- Underline Growth Track — an underline that animates its growth under text on hover/focus, typically nav links.
- Image Hotspot Pulse — a pulsing dot overlay on an image marking an interactive/expandable region.
- Slide-to-Unlock Fader — a draggable handle that must reach an end position to confirm an action, track fading as it's dragged.

**5. Visual Enhancement & Decorative Effects**
- Shimmer Sheen Highlight — a diagonal light-sweep gloss animation for emphasis (distinct from the loading-state shimmer above).
- Liquid Blob Fusion — two or more blob shapes that morph and merge into one on proximity/interaction (SVG filter or Canvas metaball technique).
- Glow Perimeter Trail — an animated glowing border/outline traveling around an element's perimeter.
- Color Spill Wipe — a directional color/fill wipe transition revealing new content or state.
- Border Dash Spin — a dashed border with the appearance of continuous rotation, often used as a loading or focus indicator.
- Text Highlighting Strike — an animated highlight sweep or strikethrough line drawn across text.
- Drawing Path Tracing — an SVG stroke that animates as if hand-drawn (`stroke-dashoffset` technique).
- Scratch-Card Reveal — a Canvas-based "scratch off" interaction revealing content underneath via pointer drag.
- Typing Effect Reset — a typewriter-style text reveal that completes, then clears and restarts in a loop.

**6. Theming & Display-Mode Transitions — Elevated Risk**
- Dark Mode Flashbang Toggle — a light/dark theme switch. The name implies an instantaneous full-viewport brightness flash — **do not implement it that way.** See `<elevated_risk_handling>`.
- Dual-Tone Inversion — a hover/active state that inverts foreground/background color (a duotone swap, not just an opacity/shade change).
- Image Glitch Flicker — a digital-glitch visual distortion (RGB channel split, scanlines, frame-jitter) on a trigger. See `<elevated_risk_handling>`.
</pattern_manifest>

<elevated_risk_handling>
These two entries require mitigation language in the final output, not just a spec. Do not soften or skip this section for either pattern.

**Dark Mode Flashbang Toggle:** The colloquial name implies a hard, instantaneous full-viewport brightness/contrast inversion at the moment of toggling. Implemented literally, this is a direct SC 2.3.1 flash risk and is unpleasant/disorienting for every user regardless of photosensitivity. Required mitigation: the transition must be either (a) an instant, single-paint swap with no intermediate flash frame, or (b) a smooth cross-fade of at least 150ms via CSS custom-property/`color-scheme` interpolation that never passes through a full-white or full-black frame at high contrast against the prior frame. There is no configuration in which this pattern implements a literal strobe. Treat "Flashbang" as an informal label for "instant switch," not an instruction to flash the screen, and say so explicitly in the pattern's Description field so the naming decision is visible, not silently overridden.

**Image Glitch Flicker:** Glitch effects (channel split, scanline flicker, frame-jitter) risk crossing the SC 2.3.1 flash threshold if the flicker rate or contrast amplitude is high enough. Required mitigation: cap the effect to a short, finite burst (never a continuous loop), default to a flash rate below 3Hz or an amplitude too low in area/contrast to qualify as a flash under WCAG's technical definition, gate the entire pattern behind `prefers-reduced-motion` (skip it outright, don't downgrade it), and state plainly in the output that a text specification cannot itself certify WCAG flash-threshold compliance for a specific implementation — that requires measurement against an actual analysis tool (e.g., the Trace Center's Photosensitive Epilepsy Analysis Tool) on the shipped asset, not just following this guidance.
</elevated_risk_handling>

<worked_example>
This is the calibration bar for depth, tone, and structure. Every one of the other 31 patterns must match this level of specificity — not shorter, not vaguer, not hand-wavy on the accessibility or fallback fields.

### Progress Button Spinner
**Category:** Loading & Progress Feedback

**Description:** A button that visually communicates an in-flight async action by replacing (or supplementing) its label with a spinner, then resolves to a terminal success or error state before returning to idle.

**Recommended Use Cases:** Form submissions, payment confirmations, any user-initiated async action with realistic latency above roughly one second. As a general implementation heuristic (not a cited standard — teams should validate against their own analytics): sub-second responses often look worse *with* a spinner than without one, since the spinner flashes on and off faster than it can be read as informative.

**Anti-Patterns / Misuse:** using a spinner to simulate work that has no real async component; a spinner with no terminal timeout, leaving users stranded on an infinite spin if the request never resolves; letting the button resize when swapping label → spinner → label, which causes layout shift and can move the target out from under a pointer mid-interaction.

**Event Triggers:** `click` / `Enter` / `Space` (native button activation) → dispatch async action → enter `loading` state. On resolution: `success` or `error` state → auto-revert to `idle` after a dwell period (commonly 1.5-2.5s for success; error persists until retried or dismissed).

**Animation Timing & Easing:**
- Spinner rotation: continuous, `linear` easing (not eased — a non-constant angular velocity reads as stuttering/broken), 0.6-0.8s per revolution, `animation-iteration-count: infinite`.
- Label ↔ spinner crossfade: 150ms `ease-out` opacity transition. The spinner occupies a fixed-width slot (or is absolutely positioned over the label with the label set to `opacity: 0`, not removed/`display: none`) so the button's box never changes size.
- Success/error icon entrance: 200ms, `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot) scale-in from 0.8 → 1; under reduced motion, replace with an instant, non-eased appearance.

**Implementation Approach:**
```
state: 'idle' | 'loading' | 'success' | 'error'

onActivate():
  if state != 'idle': return          // re-entrancy guard
  setState('loading')
  button.setAttribute('aria-busy', 'true')
  button.disabled = true
  timeoutId = startTimeout(MAX_WAIT_MS, () => setState('error', { reason: 'timeout' }))

  try:
    result = await performAsyncAction()
    clearTimeout(timeoutId)
    setState('success')
    liveRegion.textContent = 'Action completed'
    after(SUCCESS_DWELL_MS, () => setState('idle'))
  catch (err):
    clearTimeout(timeoutId)
    setState('error')
    liveRegion.textContent = 'Action failed: ' + err.userMessage
    button.disabled = false               // allow retry
```
```html
<button id="submitBtn" aria-label="Submit payment">
  <span class="label">Submit</span>
  <span class="spinner" aria-hidden="true"></span>
  <span class="icon icon--success" aria-hidden="true"></span>
  <span class="icon icon--error" aria-hidden="true"></span>
</button>
<div id="status" role="status" aria-live="polite" class="visually-hidden"></div>
```
```css
.spinner { opacity: 0; transition: opacity 150ms ease-out; }
[data-state="loading"] .label { opacity: 0; }
[data-state="loading"] .spinner {
  opacity: 1;
  animation: spin 0.7s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  [data-state="loading"] .spinner { animation: none; opacity: 1; }
}
@keyframes spin { to { transform: rotate(360deg); } }
```

**Interaction States:** default (idle, enabled) · hover · focus (`:focus-visible` ring) · active (press) · **loading** (disabled, `aria-busy="true"`, spinner visible, label hidden but DOM-present) · **success** (transient, auto-reverts) · **error** (persists until retried/dismissed) · disabled (distinct from loading — e.g., form invalid).

**Accessibility Notes:** `aria-busy="true"` on the button while loading, removed on resolution. Native `disabled` during loading prevents double-submit; restore focus to the button (or move it to a newly-revealed error message) once state resolves — don't leave focus stranded on a now-disabled element. A persistent, visually-hidden `role="status"` / `aria-live="polite"` region announces state changes ("Loading", "Success", "Error: …") — keep this region permanently in the DOM and only update its text content; toggling a live region's visibility/existence produces inconsistent announcement behavior across screen readers. Keep the button's accessible name stable and meaningful throughout (e.g., `aria-label="Submit payment"`) rather than letting it collapse to just "Loading" and losing the context of what's loading.

**Fallback Behavior:** *Tier 2* — replace the rotating spinner with a static cue (or plain "Loading…" text, no motion); the functional signal is already carried by `aria-busy` + `disabled` + the live region, so removing the spin loses nothing functional. *Tier 3* — this is a JS-enhancement layer over a native `<button type="submit">`; with JS unavailable, rely on the browser's own navigation/loading indicator. *No special Tier 4 handling needed* — the pattern is fully keyboard-operable via native button semantics.

**Testing Criteria:** Apply `<testing_framework>`. Unit: verify idle→loading→success→idle and idle→loading→error→idle-on-retry transitions; verify the timeout path fires when the async call never resolves; verify `aria-busy` toggles correctly. Integration: click the button, confirm it becomes non-interactive during loading (a second click during loading is a no-op), confirm the terminal state renders. Accessibility: axe-core scan for aria-busy/name/role issues; manual screen-reader pass confirming each announcement fires exactly once per transition. Performance: DevTools Performance capture confirms the spin loop is compositor-only (no layout/paint per frame).

**Priority & Risk:** Priority **High** — near-universal need anywhere there's an async form/action submission; a broken version has outsized negative impact. Risk **Low** — extremely well-documented pattern with mature accessible reference implementations; the realistic risk is implementation sloppiness (missing timeout, missing live region), not a novel accessibility problem.
</worked_example>

<output_instructions>
- Process all 32 patterns, grouped by category, in the order given in `<pattern_manifest>`. No omissions, no additions beyond the 32 listed.
- Match the depth and structure of `<worked_example>` for every pattern — this is the floor, not a suggestion.
- Do not expand scope beyond pattern analysis and implementation guidance: no proposing a broader design-token system, no inventing additional patterns, no general design-system architecture discussion. If a pattern's implementation genuinely requires a supporting primitive (e.g., a shared easing-curve token), name it inline and move on — don't build out a token system as a side deliverable.
- Where a pattern name is ambiguous beyond the gloss given in `<pattern_manifest>`, resolve it using the most common/conventional interpretation found in established production pattern libraries, and state that resolution explicitly at the top of the Description field. Do not silently pick an interpretation.
- No placeholder or stub content ("TODO", "implementation details here", "similar to above") anywhere in the final output — every field gets real content or an explicit "not applicable because …" reason.
- Code snippets must be real and runnable at the HTML/CSS/vanilla-JS level, not simplified into uselessness. Framework-specific notes are additive, not a replacement for the vanilla reference.
</output_instructions>

<acceptance_criteria>
Use this to self-check the output before returning it.

- [ ] All 32 patterns present, exactly once each, correctly grouped under their category
- [ ] Every pattern has all 12 schema fields populated with real content — no blank fields, no bare "N/A"
- [ ] Every pattern's Fallback Behavior field names the applicable fallback tier(s) explicitly
- [ ] Every pattern includes keyboard-operability guidance, OR an explicit, justified statement of why it's inherently pointer-only (Magnetic Cursor Ring, Tilt Parallax Angle) with the functional-gating caveat addressed if relevant
- [ ] Dark Mode Flashbang Toggle and Image Glitch Flicker both include the specific mitigation language from `<elevated_risk_handling>` — not just a generic "follows WCAG" statement
- [ ] Audio UI Sound Click and Haptic Vibration Feedback both state the opt-in/mute-ability requirement and the unsupported-API fallback
- [ ] Every Priority/Risk rating carries a one-sentence justification, not a bare label
- [ ] No TODO placeholders or "implementation details here" stand-ins anywhere in the document
</acceptance_criteria>

Begin with Category 1 and proceed through all six categories in order.
