# Manual Assistive-Technology Validation Checklist

Automated Chromium accessibility-tree inspection is evidence of semantic exposure, not a substitute for operating-system assistive-technology testing. [GENERATED: validation boundary]

## Required manual matrix

- NVDA with current Firefox ESR on Windows: navigate by landmarks, headings, links, buttons, and status messages. [GENERATED: representative Windows screen-reader matrix]
- JAWS with current Chromium-based browser on Windows: repeat the same navigation and status checks. [GENERATED: representative enterprise screen-reader matrix]
- VoiceOver with current Safari on macOS: confirm rotor ordering, button state, and live-status announcement. [GENERATED: representative macOS screen-reader matrix]
- VoiceOver with current Safari on iOS: confirm dynamic viewport resizing does not hide the action controls. [GENERATED: representative mobile screen-reader matrix]
- TalkBack with current Chrome on Android: confirm touch exploration skips decorative layers and reaches semantic actions in DOM order. [GENERATED: representative Android screen-reader matrix]

## Pass conditions

1. The region is announced with the visible heading “Depth without losing the document.” [GENERATED: integration-specific accessible-name expectation]
2. Decorative parallax layers are absent from the accessibility reading order. [GENERATED: semantic contract]
3. The “Disable depth motion” control is exposed as a button with an unpressed state before activation. [GENERATED: interaction-state expectation]
4. Activating the control changes its pressed state and announces that motion is disabled without moving focus. [GENERATED: live-region and focus expectation]
5. Links and controls remain reachable in DOM order at browser zoom of two hundred percent. [SOURCED: WCAG 2.2 SC 1.4.4, Level AA]
6. No content meaning depends on the decorative depth movement. [GENERATED: progressive-enhancement contract]

Record operating-system version, assistive-technology version, browser version, result, and evidence link for each row before claiming product-level validation.
