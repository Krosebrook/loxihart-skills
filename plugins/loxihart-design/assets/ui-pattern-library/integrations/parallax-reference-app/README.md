# Pattern 001 — Parallax Scrolling Reference Integration

## Executive summary

This directory integrates the Parallax Scrolling pilot into a representative, dependency-free TypeScript application with a real semantic token layer and an executable Chromium test gate. [GENERATED: target-application integration decision] All automated cases currently pass; physical screen-reader sessions remain explicitly unverified and therefore block bulk target-application import. [GENERATED: test-report outcome and conservative release gate]

## Representative application

The application is intentionally small but production-shaped:

- Semantic HTML provides the baseline document, landmarks, heading hierarchy, skip navigation, links, and a pressed-state motion control.
- `ParallaxController` owns measurement, state, persistence fallback, lifecycle cleanup, viewport observation, accessibility announcements, and frame-batched rendering.
- CSS uses primitive tokens, semantic tokens, then component aliases; the pattern never consumes primitive colors directly.
- The pattern adds zero runtime dependencies. [GENERATED: implementation constraint]
- The build emits strict ES modules using TypeScript `5.8.3`. [GENERATED: detected compiler runtime]

The integration is framework-independent at runtime because no framework was specified in the source brief. [GENERATED: unresolved-target handling] The same controller boundary can be wrapped in React, Vue, or a Web Component without changing its semantic DOM contract.

## Build and test

```bash
cd integrations/parallax-reference-app
python scripts/build.py
python tests/run_browser_checks.py
```

The test runner requires Python Playwright and Chromium in the execution environment. These are development tools only and are not shipped to application users. [GENERATED: test-harness dependency boundary]

## Directory map

- `src/` — strict TypeScript controller and application entry point.
- `styles/tokens.css` — primitive and semantic design-system tokens.
- `styles/parallax.css` — Pattern `001` component aliases and rendering rules.
- `styles/app.css` — representative application chrome and shared controls.
- `tests/run_browser_checks.py` — executable browser and accessibility checks.
- `tests/manual-assistive-technology-checklist.md` — required physical AT matrix.
- `reports/` — JSON evidence, accessibility tree, contrast calculations, and screenshots.
- `dist/` — deterministic build output.

## Test coverage

The executable matrix verifies:

- Native scrolling remains available and drives distinct depth transforms.
- The explicit motion toggle retains focus, updates `aria-pressed`, and announces the state change.
- Unmount/remount cleanup works and a persisted `pagehide` does not incorrectly destroy the controller.
- Layout reflows without horizontal overflow under a two-hundred-percent zoom-equivalent viewport. [SOURCED: WCAG 2.2 SC 1.4.4, Level AA]
- Every visible pointer target meets the twenty-four-by-twenty-four CSS-pixel minimum in the tested layout. [SOURCED: WCAG 2.2 SC 2.5.8, Level AA, subject to criterion exceptions]
- Forced-colors mode removes decorative layers while preserving content and focus indication.
- Reduced-motion mode removes transforms and releases promoted compositor layers.
- Chromium exposes the named region, navigation, main landmark, button pressed state, and live status while excluding decorative layers from the unignored accessibility tree.
- Dark and light semantic token pairs meet the applicable normal-text and non-text contrast thresholds. [SOURCED: WCAG 2.2 SC 1.4.3 and SC 1.4.11, Level AA]

See `reports/TEST-EVIDENCE.md` and `reports/automated-test-report.json` for the run result.

## Implementation Considerations

The controller uses native window scrolling rather than scroll interception. It observes the pattern with `IntersectionObserver`, measures only in a scheduled animation frame, watches `visualViewport` resize/scroll events where available, and falls back to `innerHeight`. [GENERATED: implementation architecture]

The target application maps the generic pilot contract through component aliases such as `--fsp-001-surface`, `--fsp-001-accent`, and `--fsp-001-travel`. Product teams should replace the reference semantic values—not the component aliases—when integrating into a real design system.

The current persistence strategy uses session storage and treats denied storage as non-fatal. [GENERATED: resilience choice] A product requiring cross-session persistence should inject an application-owned preference adapter rather than coupling this component directly to another storage API.

## Performance/Security Notes

- Scroll and viewport handlers schedule one rendering update per animation frame instead of writing during the raw event.
- Layer movement uses `transform`; `will-change` is enabled only while movement is active and is removed when disabled, reduced, suspended, or unmounted.
- Decorative elements are non-interactive, `aria-hidden`, and pointer-transparent.
- No untrusted HTML is inserted, no dynamic code execution is used, and no network request is required.
- The static blur and backdrop effects are not animated; forced-colors mode removes them.
- Back/forward-cache restoration keeps the controller mounted for persisted navigation and resynchronizes state on `pageshow`.

## Recommended Next Steps

Run the manual matrix in `tests/manual-assistive-technology-checklist.md`, record evidence for each operating-system and screen-reader combination, then approve or reject bulk target-application import. After that gate passes, use this integration as the adapter and test-harness template for the remaining catalog patterns.

## CLAIMS CHECK

| Requirement | Verified result |
|---|---|
| Pilot integrated into a representative target application | **Passed** [GENERATED: source and build inspection] |
| Generic tokens mapped to a real semantic token hierarchy | **Passed** [GENERATED: token-file inspection] |
| Strict TypeScript build | **Passed** [GENERATED: build execution] |
| Browser behavior | **Passed in Chromium `144.0.7559.96`** [GENERATED: automated test runtime] |
| Zoom and target-size checks | **Passed in the automated layout-equivalent test** [GENERATED: test report] |
| Keyboard navigation and activation | **Passed** [GENERATED: automated test report] |
| Forced-colors behavior | **Passed** [GENERATED: automated test report] |
| Reduced-motion behavior | **Passed** [GENERATED: automated test report] |
| Accessibility-tree exposure | **Passed** [GENERATED: Chromium accessibility-tree report] |
| Physical assistive-technology sessions | **Not run — release gate remains open** [GENERATED: environment limitation] |
| WCAG conformance certification | **Not claimed** |
