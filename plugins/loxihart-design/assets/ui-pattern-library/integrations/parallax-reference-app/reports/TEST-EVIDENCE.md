# Pattern 001 Integration Test Evidence

## Gate status

**AUTOMATED CHECKS PASSED**

The automated matrix covers Chromium behavior, layout-equivalent zoom, keyboard operation, forced colors, reduced motion, contrast calculations, and Chromium accessibility-tree exposure. [GENERATED: executable integration-test scope]

Physical sessions with NVDA, JAWS, VoiceOver, and TalkBack were not available in this execution environment. Their checklist remains a required manual release gate; the accessibility-tree result is not represented as equivalent evidence. [GENERATED: test-environment limitation]

## Automated results

| Test area | Result | Evidence |
|---|---|---|
| Browser behavior | **PASSED** | See JSON evidence and screenshots. |
| Keyboard navigation | **PASSED** | See JSON evidence and screenshots. |
| Two-hundred-percent zoom equivalent | **PASSED** | See JSON evidence and screenshots. |
| Forced colors | **PASSED** | See JSON evidence and screenshots. |
| Reduced motion | **PASSED** | See JSON evidence and screenshots. |
| Accessibility tree | **PASSED** | See JSON evidence and screenshots. |
| Token contrast | **PASSED** | See JSON evidence and screenshots. |

## Release decision

Bulk target-application import of patterns two through one hundred remains blocked until the manual assistive-technology matrix is recorded. [GENERATED: conservative release-gate decision]

The pilot is eligible for target-application review because all executable checks in this package passed. [GENERATED: automated-test outcome]

## Environment

- Browser: `Chromium 144.0.7559.96` [GENERATED: detected test runtime]
- TypeScript: `Version 5.8.3` [GENERATED: detected compiler runtime]
- Test timestamp: `2026-07-23T18:32:14.409949+00:00` [GENERATED: UTC report timestamp]

## Claims boundary

No WCAG conformance certification is claimed. Automated checks reduce implementation risk but do not replace product-context auditing or physical assistive-technology testing. [GENERATED: conformance boundary]
