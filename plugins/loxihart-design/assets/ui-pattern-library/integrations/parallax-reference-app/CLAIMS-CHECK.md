# Pattern 001 Integration Claims Check

## Executive summary

All executable checks in the reference environment pass. [GENERATED: automated test report] Bulk target-application import remains blocked because physical assistive-technology sessions were not available and are not interchangeable with Chromium accessibility-tree inspection. [GENERATED: release-gate decision]

| Claim | Status | Evidence |
|---|---|---|
| Source compiles under strict TypeScript | **Passed** | `dist/` and build command |
| Native vertical scroll is preserved | **Passed** | `reports/automated-test-report.json` |
| Scroll produces bounded, depth-specific transforms | **Passed** | Browser behavior case |
| Explicit motion opt-out is keyboard operable | **Passed** | Keyboard and browser cases |
| Reduced motion removes decorative transforms | **Passed** | Reduced-motion case |
| Forced colors preserves content and focus | **Passed** | Forced-colors case |
| Tested layout avoids horizontal overflow at the zoom-equivalent viewport | **Passed** | Zoom case |
| Tested interactive targets meet the twenty-four CSS-pixel minimum | **Passed** | Zoom case [SOURCED: WCAG 2.2 SC 2.5.8, Level AA, subject to criterion exceptions] |
| Reference normal-text token pairs meet four-and-one-half to one | **Passed** | `reports/contrast-report.json` [SOURCED: WCAG 2.2 SC 1.4.3, Level AA] |
| Reference UI token pairs meet three to one | **Passed** | `reports/contrast-report.json` [SOURCED: WCAG 2.2 SC 1.4.11, Level AA] |
| Decorative layers are absent from the unignored accessibility tree | **Passed** | `reports/accessibility-tree.json` |
| NVDA, JAWS, VoiceOver, and TalkBack operation | **Not run** | `tests/manual-assistive-technology-checklist.md` |
| Product-level WCAG conformance | **Not claimed** | Requires integrated product audit |
