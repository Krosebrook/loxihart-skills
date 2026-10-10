# B — Design System Specification: 013 Back-to-Top Fast Jump

## Executive summary

**Back-to-Top Fast Jump** provides floating button smoothly resets scroll position. The component is a progressive enhancement, not a content gate. Its reference semantics, tokens, state model, and test requirements are portable across React with Tailwind, Vue, Web Components, and vanilla HTML/CSS/JavaScript.

## Intent and non-goals

Use the pattern when it strengthens orientation, hierarchy, disclosure, or action confirmation without making motion or pointer precision essential. Do not use it to conceal required content, intercept normal navigation, manufacture artificial latency, or replace an established native control. The specification is designed toward WCAG 2.2 Level AA integration; only the integrated product can be evaluated for conformance.

## Anatomy

The component contains: semantic content root; optional visual layer; measured scroll surface; status output; enhancement opt-out control when scrolling is materially altered. DOM order follows reading and keyboard order. Decorative effect nodes are hidden from assistive technology. Content remains reachable when styles, scripts, observers, media, or optional capabilities fail.

## Semantic model

Use a real button whose accessible name states that it returns focus and scroll position to the document start. Keyboard operation follows this contract: Enter or Space activates the button; focus moves to the document heading only after the scroll operation completes or immediately in reduced motion. Focus indicators remain visible. [SOURCED: W3C WCAG 2.2 SC 2.4.7 Focus Visible, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html] Text can resize to two hundred percent without loss of content or operation. [SOURCED: W3C WCAG 2.2 SC 1.4.4 Resize Text, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html]

## Public API

The portable API exposes a root element, disabled state, optional duration token, mount and unmount lifecycle, a programmatic activation or update method, and typed custom events for activation, completion, cancellation, and error. Controlled integrations must nominate one source of truth. Uncontrolled integrations keep state on the component instance, never in a module-level singleton.

## Design tokens

| Token | Default | Rationale |
|---|---:|---|
| `--fsp-013-target-min` | `24px` | Minimum non-inline target dimension, subject to criterion exceptions. [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html] |
| `--fsp-013-duration` | `280ms` | Balanced starting duration; product teams must validate with real tasks and motion guidance. [GENERATED: staff-level default] |
| `--fsp-013-distance` | `16px` | Compact transform distance based on a four-pixel spacing base. [GENERATED: library spacing model] |
| `--fsp-013-focus-width` | `2px` | Visible outline starting point; contrast and clipping require integration tests. [GENERATED: component token] |
| surface, text, accent, border | system colors | Supports forced-colors behavior and avoids assuming a brand palette. [GENERATED: framework-agnostic default] |

Color pairs must be tested in context: normal text requires a four-and-one-half-to-one ratio and large-scale text requires a three-to-one ratio. [SOURCED: W3C WCAG 2.2 SC 1.4.3 Contrast (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html] Required component boundaries and graphical objects require a three-to-one ratio against adjacent colors. [SOURCED: W3C WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html]

## Responsive and international behavior

Use logical properties and computed writing direction. Do not assume left-to-right motion. Mobile browser chrome changes must not collapse critical content; prefer modern dynamic viewport units with a safe content-based fallback. Nested scrolling must remain possible. Browser zoom and pinch zoom remain enabled, and controls stay reachable when magnified.

## Motion and reduced motion

Normal behavior uses native scroll restoration with instant reduced-motion behavior. Adjustable timing and distance are tokens. The reduced-motion mode is: Jump immediately while preserving focus restoration. Continuous or automatically moving variants require a pause or stop mechanism when applicable. [SOURCED: W3C WCAG 2.2 SC 2.2.2 Pause, Stop, Hide, Level A — https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html]

## Full state matrix

| State | Visual cue | ARIA state | Keyboard action |
|---|---|---|---|
| Unenhanced | Semantic content and native controls only | No enhancement-specific ARIA | Native behavior |
| Idle | Stable resting presentation | Current state attributes reflect idle | Enter or Space activates the button; focus moves to the document heading only after the scroll operation completes or immediately in reduced motion. |
| Focused | Visible focus indicator independent of color alone | Native focus semantics | Tab and Shift+Tab follow DOM order |
| Active | Bounded transform or opacity feedback | Pattern-specific active state updates atomically | Enter, Space, arrows, or Escape according to role |
| Complete | Persistent result cue or settled layout | Status or selected/current state is available | Focus remains predictable |
| Reduced motion | Jump immediately while preserving focus restoration. | Same semantic state as animated mode | Same commands without animation |
| Forced colors | System colors, outlines, and visible boundaries | No semantic change | Same commands |
| Disabled | Disabled cue plus non-color distinction | Native disabled or aria-disabled as appropriate | Unavailable actions are not focus traps |
| Error | Inline text message adjacent to affected control | Status or alert chosen by urgency | Focus moves only when necessary to recover |
| Unmounted | Enhancement removed; semantic baseline remains | Transient attributes cleared | Native behavior remains |

## Category-specific requirements

Momentum-scroll conflicts with snap points; a visible scroll-jacking opt-out; mobile dynamic viewport resizing and viewport-unit collapse.

## Complete edge-case coverage matrix

| ID | Risk | Required handling |
|---:|---|---|
| 01 | Unmounted-component state updates | Use an AbortController or generation token; cleanup invalidates pending work before it may commit. |
| 02 | Rapid multi-click/tap events | Serialize transition state and deduplicate the same pointer activation while allowing distinct commands. |
| 03 | Network race conditions | Bound payload and rendered-item growth; expose retry and explicit loading state when data is involved. |
| 04 | Stale-closure state in event handlers | Read current values from instance-owned state or attached elements at execution time rather than captured stale values. |
| 05 | Controlled vs. uncontrolled mode mismatch | Keep instance state isolated and define one source of truth; reset through a single state transition. |
| 06 | Initial hydration mismatch between server and client | Render a motion-neutral server state and apply persisted or measured values after client attachment. |
| 07 | Empty, null, or undefined data | Treat missing optional nodes as a disabled enhancement; throw only when the required root or trigger is absent. |
| 08 | Data payload overshoot with huge lists or objects | Bound payload and rendered-item growth; expose retry and explicit loading state when data is involved. |
| 09 | Async operation cancellation on rapid re-trigger | Use an AbortController or generation token; cleanup invalidates pending work before it may commit. |
| 10 | Partial state resets leaving inconsistent UI | Keep instance state isolated and define one source of truth; reset through a single state transition. |
| 11 | Development-mode double-invoked effects corrupting one-time initialization | Make mount idempotent and make cleanup safe to run more than once. |
| 12 | Debounce or throttle timers leaking across rapid mount and unmount | Use an AbortController or generation token; cleanup invalidates pending work before it may commit. |
| 13 | Out-of-order async responses overwriting fresher state | Use an AbortController or generation token; cleanup invalidates pending work before it may commit. |
| 14 | Concurrent-rendering interruption of an in-flight update | Use an AbortController or generation token; cleanup invalidates pending work before it may commit. |
| 15 | Derived state desynchronizing from a controlled prop updated in the same tick | Read current values from instance-owned state or attached elements at execution time rather than captured stale values. |
| 16 | Event handler referencing a ref that is not attached yet | Read current values from instance-owned state or attached elements at execution time rather than captured stale values. |
| 17 | Module-level singleton state leaking across component instances | Keep instance state isolated and define one source of truth; reset through a single state transition. |
| 18 | Reentrant toggle calls before the prior transition finishes | Serialize transition state and deduplicate the same pointer activation while allowing distinct commands. |
| 19 | Storage read racing hydration and flashing the wrong initial state | Render a motion-neutral server state and apply persisted or measured values after client attachment. |
| 20 | Back-forward cache restoring stale state without setup rerun | Listen for pageshow and recompute measured or persisted state when the page is restored. |
| 21 | Keyboard focus traps | Contain focus only for a true modal surface and restore it to the connected opener on close. |
| 22 | Focus restoration on close or unmount | Contain focus only for a true modal surface and restore it to the connected opener on close. |
| 23 | Screen-reader live-region alerts | Use one polite status region per component instance and replace, rather than stack, transient messages. |
| 24 | Visible focus indicator [SOURCED: W3C WCAG 2.2 SC 2.4.7 Focus Visible, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html] | Never remove focus indication; use a tokenized outline that remains visible in forced colors. |
| 25 | Normal-text contrast ratio of 4.5:1 [SOURCED: W3C WCAG 2.2 SC 1.4.3 Contrast (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html] | Require text token pairs to meet the stated normal-text contrast threshold before release. |
| 26 | High-contrast and forced-colors mode | Use system colors and outline semantics under forced-colors; do not rely on filter, shadow, or background images. |
| 27 | Text resize to 200% [SOURCED: W3C WCAG 2.2 SC 1.4.4 Resize Text, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html] | Use relative units and reflow-safe layout; do not clip labels or controls when text is enlarged. |
| 28 | Target size of 24 by 24 CSS pixels minimum, subject to the criterion exceptions [SOURCED: W3C WCAG 2.2 SC 2.5.8 Target Size (Minimum), Level AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html] | Size each non-inline target to the minimum or document the applicable spacing, inline, or equivalent-target exception. |
| 29 | Semantic HTML rather than generic containers | Use a real button whose accessible name states that it returns focus and scroll position to the document start. |
| 30 | Reduced-motion fallback for every animation | Jump immediately while preserving focus restoration. |
| 31 | Live-region announcement collisions | Use one polite status region per component instance and replace, rather than stack, transient messages. |
| 32 | Focus order diverging from visual or DOM order | Keep DOM order aligned with reading and focus order; transforms may change appearance but not semantic sequence. |
| 33 | Missing skip mechanism for a large injected interactive region | Provide a skip link or region navigation when the pattern adds a substantial repeated interaction area. |
| 34 | Forced-colors mode hiding a custom focus ring or SVG icon | Use system colors and outline semantics under forced-colors; do not rely on filter, shadow, or background images. |
| 35 | Nested interactive elements breaking semantics | Never nest links, buttons, or other interactive controls inside an interactive ancestor. |
| 36 | Missing or incorrect active-item ARIA state | Update the pattern-appropriate active-state attribute atomically with the visual state. |
| 37 | Drag-only or swipe-only interaction without an equivalent control [SOURCED: W3C WCAG 2.2 SC 2.5.7 Dragging Movements, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html] | Enter or Space activates the button; focus moves to the document heading only after the scroll operation completes or immediately in reduced motion. |
| 38 | Auto-advancing or auto-dismissing content without pause or extension [SOURCED: W3C WCAG 2.2 SC 2.2.2 Pause, Stop, Hide, Level A — https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html] | Provide pause, stop, or persistence controls when feedback moves, advances, or dismisses automatically. |
| 39 | Right-to-left reading-order mismatch for directional patterns | Derive direction from computed writing mode and logical properties rather than assuming left-to-right. |
| 40 | Pinch zoom disabled or content clipped at high browser zoom | Do not disable zoom; use overflow and containment rules that keep controls reachable at high magnification. |
| 41 | Layout thrashing | Batch geometry reads before writes and schedule visual updates through a single animation-frame callback. |
| 42 | Memory leaks from uncleared listeners or timers | Register every listener, timer, observer, and animation handle in instance cleanup and cancel it idempotently. |
| 43 | Off-screen DOM left mounted and animating | Suspend observers and animation when the root is hidden or outside the active viewport. |
| 44 | Scroll-handler-induced jank | Batch geometry reads before writes and schedule visual updates through a single animation-frame callback. |
| 45 | Frame-rate loss under heavy DOM load | Degrade effect fidelity under load; preserve input and semantic state before visual polish. |
| 46 | Touch and pointer event handling parity | Use Pointer Events as the primary model and prevent compatibility-click duplication by tracking pointer identity and timing. |
| 47 | Non-composited animation properties | Animate transform and opacity where possible; convert expensive effects to bounded static states under load. |
| 48 | GPU memory leaks from unreleased layers | Promote only during active motion and remove will-change or transient layers at completion and cleanup. |
| 49 | Non-passive scroll listeners blocking the compositor thread | Keep observation listeners passive unless cancellation is essential; never cancel page scrolling merely for decoration. |
| 50 | Intersection Observer churn from overly tight thresholds | Use a small threshold set and one shared observer per component instance where observation is needed. |
| 51 | Animation-frame loops not cancelled on unmount | Register every listener, timer, observer, and animation handle in instance cleanup and cancel it idempotently. |
| 52 | Paint storms from shadow or filter animation | Animate transform and opacity where possible; convert expensive effects to bounded static states under load. |
| 53 | Cumulative layout shift from late-loading content | Reserve geometry with aspect ratio or explicit block size before media or async content resolves. |
| 54 | Long main-thread tasks blocking input | Degrade effect fidelity under load; preserve input and semantic state before visual polish. |
| 55 | Web-font loading causing reflow jank | Avoid font-metric-dependent measurement until fonts settle; use fallback metrics and recompute once if required. |
| 56 | Thermal or battery throttling on low-power devices | Degrade effect fidelity under load; preserve input and semantic state before visual polish. |
| 57 | Unbounded DOM growth in infinite scroll | Virtualize or window large collections and expose deterministic pagination boundaries. |
| 58 | Repeated geometry reads forcing synchronous layout | Batch geometry reads before writes and schedule visual updates through a single animation-frame callback. |
| 59 | Compositor-layer contention across concurrent animations | Promote only during active motion and remove will-change or transient layers at completion and cleanup. |
| 60 | Missing will-change cleanup retaining GPU memory | Promote only during active motion and remove will-change or transient layers at completion and cleanup. |

## Validation requirements

Test semantic baseline without JavaScript; keyboard-only operation; screen-reader announcements; visible focus; forced colors; enlarged text; browser zoom; right-to-left layout; reduced motion; rapid repeated input; mount/unmount cycles; back-forward-cache restoration; low-power throttling; and heavy DOM conditions. For any drag or swipe enhancement, verify an equivalent single-pointer and keyboard path. [SOURCED: W3C WCAG 2.2 SC 2.5.7 Dragging Movements, Level AA — https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html]

## Implementation considerations

Framework adapters must preserve the same state machine and semantics. Tailwind utilities may consume tokens but must not erase the CSS-variable contract. Vue and React adapters must avoid mirrored derived state. Web Components must avoid cross-instance static state. Vanilla usage must retain and invoke cleanup.

## Performance and security notes

Do not insert untrusted markup. Bound list growth, media allocation, observer count, animation-frame work, and promoted layers. Reserve media dimensions to avoid layout shift. Prefer native CSS and browser primitives; declare and justify any dependency before adoption.

## CLAIMS CHECK

The design uses the Level AA minimum target-size criterion and does not substitute the Level AAA enhanced size. It distinguishes text contrast from non-text contrast. It provides reduced-motion and forced-colors behavior. It does not claim conformance before integration testing.
