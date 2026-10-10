# Reference 07 — Acceptance Criteria + Anti-Slop Gates

14-point system gate. Run before every ship.
Any FAIL = reject + regenerate. No partial compliance.

---

## Anti-Slop Gate (Pre-Ship)

| # | Gate | Behavior | Level |
|---|---|---|---|
| 1 | No hardcoded color values | Scan for hex, rgb, hsl in style props | FAIL |
| 2 | No hardcoded spacing values | Scan for arbitrary px, rem not in token scale | FAIL |
| 3 | No missing ARIA on interactive elements | Check buttons, inputs, modals, toasts | FAIL |
| 4 | Focus ring visible on all interactive elements | 2px minimum, visible on all bg colors | FAIL |
| 5 | No animation duration > 500ms | Check all `transition-duration`, `animation` values | FAIL |
| 6 | No missing state definitions | Every component has full state machine | FAIL |
| 7 | No incomplete prop interfaces | Zero `any` types, all required props defined | FAIL |
| 8 | No placeholder content in deliverable | No "Lorem ipsum", "TBD", "TODO", "placeholder" | FAIL |
| 9 | Contrast ratio ≥ 4.5:1 on all text | Verify with webaim.org/resources/contrastchecker | FAIL |
| 10 | No `outline: none` without replacement | Must have box-shadow or border replacement | FAIL |
| 11 | No spring/bounce/elastic easing | Only cubic-bezier curves or linear | WARN |
| 12 | Disabled state actually disables interaction | Check pointer-events, cursor, event handlers | FAIL |
| 13 | Modal has focus trap + Escape handler | Verify Tab cycles within, Escape exits | FAIL |
| 14 | No hardcoded strings in error messages | Error messages use errorMessages const | WARN |

**Scoring:**
- 0 FAIL: ✅ Ship
- 1+ FAIL: ❌ Block ship, fix and re-run
- WARN only: ⚠️ Document and defer with issue ticket

---

## Component-Level Acceptance Criteria

### Button

```
AC-BTN-01: Primary variant renders with bg-primary-400, text-neutral-0
AC-BTN-02: Hover state transitions to bg-primary-500 in 150ms
AC-BTN-03: Focus state shows 2px ring-primary-400 with ring-offset-2
AC-BTN-04: Loading state shows spinner, disables interaction, sets aria-busy=true
AC-BTN-05: Disabled state shows neutral-200 bg, cursor-not-allowed, no click events
AC-BTN-06: All three variants render (primary, secondary, ghost)
AC-BTN-07: All three sizes render (sm, base, lg)
AC-BTN-08: Icon renders in correct position (left or right)
AC-BTN-09: Tab navigation reaches button
AC-BTN-10: Enter and Space activate button
```

### Input

```
AC-INP-01: Label renders with htmlFor matching input id
AC-INP-02: Required field shows asterisk in error-600 color
AC-INP-03: Focus state shows primary-400 border and shadow-sm in 200ms
AC-INP-04: Error state shows error-600 border, error-50 background
AC-INP-05: Error message renders with role="alert" and aria-live="polite"
AC-INP-06: Input has aria-invalid=true when error state
AC-INP-07: Input has aria-describedby pointing to error element id
AC-INP-08: Success state shows success-600 border with checkmark
AC-INP-09: Disabled state shows neutral-200 border, disabled-bg, cursor-not-allowed
AC-INP-10: Helper text renders below input (below error if both present)
```

### Modal

```
AC-MOD-01: Modal renders via createPortal to document.body
AC-MOD-02: Modal has role="dialog", aria-modal="true", aria-labelledby
AC-MOD-03: Backdrop has aria-hidden="true"
AC-MOD-04: document.body.overflow = hidden when open
AC-MOD-05: Tab key cycles through focusable elements (trapped)
AC-MOD-06: Escape key closes modal if isDismissible=true
AC-MOD-07: Backdrop click closes modal if isDismissible=true
AC-MOD-08: Content has scaleIn animation on open (300ms)
AC-MOD-09: Content has scaleOut animation on close (200ms)
AC-MOD-10: Actions slot renders in flex justify-end with gap-3
```

### Toast

```
AC-TST-01: All four types render (success, error, warning, info)
AC-TST-02: Type-specific bg, border, and text colors applied
AC-TST-03: slideIn animation on enter (300ms)
AC-TST-04: slideOut animation on dismiss (200ms)
AC-TST-05: Auto-dismiss fires after `duration` ms (default 5000)
AC-TST-06: duration=0 disables auto-dismiss
AC-TST-07: Manual close button triggers dismiss
AC-TST-08: Container uses aria-live="polite" aria-atomic="false"
AC-TST-09: Individual toast has role="status"
AC-TST-10: Close button has aria-label="Dismiss notification"
```

### Navbar

```
AC-NAV-01: role="navigation" with aria-label="Main navigation"
AC-NAV-02: Active link has aria-current="page"
AC-NAV-03: Active link has border-b-2 border-primary-400, text-primary-700
AC-NAV-04: Mobile menu toggle has aria-expanded attribute
AC-NAV-05: Mobile menu hidden below md breakpoint by default
AC-NAV-06: Hamburger shows when mobileMenuOpen=false
AC-NAV-07: X shows when mobileMenuOpen=true
AC-NAV-08: All nav links keyboard accessible via Tab
```

---

## System-Level Acceptance Criteria

### Token Compliance

```
SYS-TOK-01: Zero hardcoded hex values in any component file
SYS-TOK-02: Zero hardcoded spacing values outside token scale
SYS-TOK-03: Zero hardcoded border-radius values outside token scale
SYS-TOK-04: Zero hardcoded shadow values outside token scale
SYS-TOK-05: All animation durations reference --duration-* tokens
```

### TypeScript

```
SYS-TS-01: `tsc --strict` passes with zero errors
SYS-TS-02: Zero `any` types in component files
SYS-TS-03: All event handlers typed (not inferred)
SYS-TS-04: All component props interfaces exported
```

### Performance

```
SYS-PERF-01: Component bundle < 150KB gzipped
SYS-PERF-02: No blocking transitions (no transitions on initial render)
SYS-PERF-03: Skeleton animation uses CSS (not JS)
SYS-PERF-04: Modal uses createPortal (no DOM stacking context issues)
```

### Accessibility

```
SYS-A11Y-01: All contrast ratios ≥ 4.5:1 (verified)
SYS-A11Y-02: All interactive elements keyboard accessible
SYS-A11Y-03: Focus never lost (always visible after state change)
SYS-A11Y-04: prefers-reduced-motion handled in globals.css
SYS-A11Y-05: forced-colors mode handled in globals.css
```

---

## Smoke Tests

Run after implementation:

```bash
# TypeScript
npx tsc --strict --noEmit

# Lint
npx eslint src --ext .ts,.tsx

# Accessibility (automated, not replacement for manual)
npx axe-core --dir src/components

# Bundle size check
npx bundlesize

# Visual regression (if Storybook installed)
npx chromatic --project-token=[token]
```

---

## Definition of Done

A component is shippable when:

- [ ] All component-level ACs pass
- [ ] All system-level ACs pass
- [ ] Anti-slop gate: 0 FAILs
- [ ] TypeScript strict mode: 0 errors
- [ ] Keyboard-only test: passed manually
- [ ] Screen reader test: passed manually (VoiceOver or NVDA)
- [ ] Contrast ratio: verified for all color pairings
- [ ] Storybook story: created with all variants and states
- [ ] JSDoc: added to all exported types and component
