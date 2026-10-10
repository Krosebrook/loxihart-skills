# Accessibility

WCAG 2.2 AA requirements and ARIA patterns for all executing-branded-frontends outputs.
Accessibility is not optional. These requirements apply to every output.

---

## Non-Negotiable Requirements

Every output must pass these before delivery:

- [ ] Color contrast ≥ 4.5:1 for normal text (< 18px regular or < 14px bold)
- [ ] Color contrast ≥ 3:1 for large text (≥ 18px regular or ≥ 14px bold)
- [ ] Color contrast ≥ 3:1 for UI components (borders, icons, interactive elements)
- [ ] Focus rings visible and styled on all interactive elements
- [ ] All interactive elements keyboard-navigable (Tab, Enter, Space, Escape, Arrow keys)
- [ ] Custom interactive elements have ARIA roles
- [ ] Images have meaningful alt text (or `alt=""` for decorative images)
- [ ] Touch targets ≥ 24×24 CSS pixels (AA); ≥ 44×44px recommended
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] Form inputs have associated `<label>` or `aria-label`

---

## Focus Ring Pattern

Never remove focus rings. Style them — don't hide them.

```css
/* Global focus style — use this in every output */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* Remove default only after providing custom */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## Color Contrast Quick Reference

### Loxihart Profile
| Element | Foreground | Background | Ratio |
|---|---|---|---|
| Primary text | #f0f0f5 | #0a0a0f | 17.5:1 ✓ |
| Secondary text | #9898a8 | #0a0a0f | 6.2:1 ✓ |
| Tertiary text | #52525e | #0a0a0f | 3.1:1 (large only) |
| Accent on base | hsl(262 83% 68%) | #0a0a0f | ~7:1 ✓ |

### FlashFusion Profile
| Element | Foreground | Background | Ratio |
|---|---|---|---|
| Primary text | #F8FAFC | #0F0618 | 18.9:1 ✓ |
| Secondary text | #CBD5E1 | #0F0618 | 10.4:1 ✓ |
| Accent on base | #A855F7 | #0F0618 | ~5.2:1 ✓ |

**Custom profiles:** Always verify with a contrast checker before shipping.
Target: Aim for 7:1 on primary text. 4.5:1 is the floor, not the goal.

---

## ARIA Patterns

### Interactive Cards
```html
<!-- If the whole card is clickable, use a button or link — not a div -->
<button class="card" aria-label="View ticket #1042: Network outage - Critical">
  <!-- card content -->
</button>
```

### Icon-Only Buttons
```html
<button aria-label="Close dialog">
  <svg aria-hidden="true" ...>...</svg>
</button>
```

### Status Indicators
```html
<!-- Use role="status" for live updates (non-urgent) -->
<div role="status" aria-live="polite">
  3 tickets updated
</div>

<!-- Use role="alert" for errors (urgent) -->
<div role="alert" aria-live="assertive">
  Connection lost. Retrying...
</div>
```

### Loading States
```html
<div aria-busy="true" aria-label="Loading tickets...">
  <!-- skeleton content -->
</div>
```

### Modal Dialogs
```html
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
>
  <h2 id="modal-title">Confirm action</h2>
  <p id="modal-desc">This cannot be undone.</p>
</div>
```

### Navigation
```html
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/dashboard" aria-current="page">Dashboard</a></li>
    <li><a href="/tickets">Tickets</a></li>
  </ul>
</nav>
```

---

## Keyboard Navigation

Every interactive element must be reachable and operable via keyboard.

```
Tab / Shift+Tab   — move focus forward / backward
Enter             — activate buttons, links
Space             — toggle checkboxes, activate buttons
Escape            — close modals, dismiss dropdowns
Arrow keys        — navigate within menus, tabs, radio groups
Home / End        — first / last item in a list or menu
```

For custom components (dropdowns, tabs, trees):
```html
<!-- Tab panel example -->
<div role="tablist" aria-label="View options">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    Open
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
    Closed
  </button>
</div>

<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  <!-- content -->
</div>
```

---

## Semantic HTML Checklist

- Use `<button>` for actions, `<a>` for navigation — never a div with onClick
- One `<h1>` per page — headings form a logical outline
- `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>` as landmark regions
- `<table>` with `<th scope="col/row">` for data tables
- `<form>` elements with `<label for="...">` or `aria-label`
- `<ul>` / `<ol>` for lists — not a stack of divs

---

## Reduced Motion

```css
/* Included in animation-system.md — repeat here as reminder */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Reduced motion does NOT mean no motion. Fade-only transitions (opacity) are
acceptable even with this preference set. Remove translate/scale animations only.
