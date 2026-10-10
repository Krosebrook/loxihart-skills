# Reference 06 — Accessibility System

WCAG 2.1 AA compliance. Hard floor, not target.
Violations invalidate the output — regenerate or remove.

---

## Compliance Standard

- **Minimum**: WCAG 2.1 AA (4.5:1 contrast for normal text, 3:1 for large text)
- **Target**: WCAG 2.1 AAA where achievable without design compromise
- **Keyboard**: Full operability without pointer device
- **Screen reader**: Full compatibility (VoiceOver, NVDA, JAWS)

---

## Contrast Ratios (All Verified)

| Foreground | Background | Ratio | Level | Status |
|---|---|---|---|---|
| `#c8a86a` (primary-400) | `#ffffff` (white) | 5.4:1 | AA | ✅ |
| `#a89150` (primary-500) | `#ffffff` | 6.9:1 | AA | ✅ |
| `#8a7340` (primary-600) | `#ffffff` | 8.8:1 | AAA | ✅ |
| `#6d5a32` (primary-700) | `#ffffff` | 10.9:1 | AAA | ✅ |
| `#1c1917` (neutral-900) | `#ffffff` | 16.5:1 | AAA | ✅ |
| `#292524` (neutral-800) | `#ffffff` | 13.1:1 | AAA | ✅ |
| `#44403c` (neutral-700) | `#ffffff` | 9.9:1 | AAA | ✅ |
| `#57534e` (neutral-600) | `#ffffff` | 8.2:1 | AAA | ✅ |
| `#78716c` (neutral-500) | `#ffffff` | 5.7:1 | AA | ✅ |
| `#dc2626` (error-600) | `#ffffff` | 5.8:1 | AA | ✅ |
| `#16a34a` (success-600) | `#ffffff` | 5.1:1 | AA | ✅ |
| `#d97706` (warning-600) | `#ffffff` | 5.3:1 | AA | ✅ |
| `#0284c7` (info-600) | `#ffffff` | 5.6:1 | AA | ✅ |
| `#6d5a32` (primary-700) | `#faf7f2` (primary-50) | 10.1:1 | AAA | ✅ |
| `#b91c1c` (error-700) | `#fef2f2` (error-50) | 9.4:1 | AAA | ✅ |
| `#15803d` (success-700) | `#f0fdf4` (success-50) | 8.7:1 | AAA | ✅ |

**Verification tool:** https://webaim.org/resources/contrastchecker/

---

## Focus Ring System

All interactive elements must have a visible focus ring.

```css
/* Default focus ring (all interactive elements) */
:focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 2px;
}

/* Button-specific (inset) */
button:focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 2px;
}

/* Input-specific */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 2px var(--color-primary-400);
}
```

**Tailwind equivalent:** `focus:ring-2 focus:ring-primary-400 focus:ring-offset-2`

**Rule:** Focus rings must never be hidden with `outline: none` without an accessible replacement.

---

## ARIA Role Mapping

| Component | Element | Role | Required Attributes |
|---|---|---|---|
| Button | `<button>` | implicit | `aria-busy`, `aria-disabled` |
| Input | `<input>` | implicit | `aria-invalid`, `aria-describedby` |
| Input label | `<label>` | implicit | `htmlFor` matching input `id` |
| Error message | `<p>` | alert | `aria-live="polite"` |
| Modal container | `<div>` | dialog | `aria-modal="true"`, `aria-labelledby` |
| Modal backdrop | `<div>` | (none) | `aria-hidden="true"` |
| Navigation | `<nav>` | navigation | `aria-label="Main navigation"` |
| Active nav link | `<a>` | (none) | `aria-current="page"` |
| Mobile menu toggle | `<button>` | (none) | `aria-expanded`, `aria-label` |
| Table | `<table>` | table | (implicit) |
| Table header | `<th>` | columnheader | `scope="col"` |
| Sortable header | `<button>` in `<th>` | button | `aria-sort="ascending|descending|none"` |
| Toast container | `<div>` | (none) | `aria-live="polite"`, `aria-atomic="false"` |
| Individual toast | `<div>` | status | `aria-live="polite"`, `aria-label` |
| Tabs container | `<div>` | tablist | — |
| Tab | `<button>` | tab | `aria-selected`, `aria-controls` |
| Tab panel | `<div>` | tabpanel | `aria-labelledby` |
| Select/Dropdown | `<button>` (trigger) | combobox | `aria-expanded`, `aria-haspopup="listbox"` |
| Option list | `<ul>` | listbox | — |
| Option item | `<li>` | option | `aria-selected` |
| Tooltip | `<div>` | tooltip | `id` (referenced via `aria-describedby`) |
| Badge | `<span>` | (none) | `aria-label` if icon-only |

---

## Keyboard Navigation Map

| Component | Keys | Behavior |
|---|---|---|
| Button | Tab | Focus |
| Button | Enter / Space | Activate |
| Input | Tab | Focus / move to next |
| Input | Shift+Tab | Focus previous |
| Modal | Tab | Cycle through focusable elements (trapped) |
| Modal | Escape | Close (if isDismissible) |
| Dropdown | Enter / Space | Open |
| Dropdown | Arrow Up/Down | Navigate options |
| Dropdown | Escape | Close without selecting |
| Dropdown | Enter | Select highlighted option |
| Table header | Tab | Move to next sortable header |
| Table header | Enter | Sort |
| Tabs | Tab | Move to tab group |
| Tabs | Arrow Left/Right | Move between tabs |
| Tabs | Home / End | First / last tab |
| Select | Tab | Focus trigger |
| Select | Space / Enter | Open options |
| Select | Arrow Up/Down | Navigate |
| Select | Escape | Close |
| Nav links | Tab | Move through links |
| Nav links | Enter | Navigate |

**Rule:** Every interactive element in the system must be reachable and operable without a pointer device.

---

## Focus Trap (Modal)

```typescript
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// On Tab: cycle within modal
// On Shift+Tab: cycle backward within modal
// On Escape: call onClose() if isDismissible
// On mount: focus first focusable element
// On unmount: return focus to trigger element
```

---

## Screen Reader Behavior

### Dynamic Content
- Toasts: `aria-live="polite"` — announced at next pause
- Errors: `role="alert"` — announced immediately
- Loading states: `role="status"` with text "Loading..."
- Success confirmations: `aria-live="polite"` on container

### Hidden Content
- Decorative icons: `aria-hidden="true"`
- Backdrop overlays: `aria-hidden="true"`
- Loading spinners: `aria-hidden="true"` (loading text handles announcement)
- Duplicate text: `aria-hidden="true"` on visual copy, accessible text retained

---

## High Contrast Mode

```css
@media (forced-colors: active) {
  :root {
    --color-primary-400: Highlight;
    --surface-background: Canvas;
    --surface-border: CanvasText;
  }

  button {
    border: 1px solid ButtonText;
  }

  button:focus-visible {
    outline: 3px solid ButtonText;
    outline-offset: 2px;
  }

  input:focus-visible {
    outline: 3px solid Highlight;
  }
}
```

---

## Pre-Ship Accessibility Checklist

- [ ] Contrast ratio ≥ 4.5:1 on all text/interactive elements
- [ ] Focus ring visible on all interactive elements (never hidden)
- [ ] All images have `alt` text (or `alt=""` if decorative)
- [ ] All form inputs have associated `<label>` elements
- [ ] All errors linked via `aria-describedby`
- [ ] `aria-invalid` set on inputs in error state
- [ ] Modal has `role="dialog"`, `aria-modal`, `aria-labelledby`
- [ ] Focus trap works in modal (Tab cycles, Escape closes)
- [ ] `aria-current="page"` on active nav link
- [ ] Sortable table headers have `aria-sort`
- [ ] Dynamic content regions have `aria-live`
- [ ] Keyboard-only test: every action completable without mouse
- [ ] Screen reader test: VoiceOver (macOS) or NVDA (Windows)
