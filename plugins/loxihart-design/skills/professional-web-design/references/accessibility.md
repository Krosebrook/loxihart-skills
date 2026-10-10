# Accessibility Reference (WCAG 2.2 AA)

## Table of Contents
- Semantic HTML
- ARIA Patterns
- Focus Management
- Color and Contrast
- Testing

---

## Semantic HTML

```html
<!-- Use the right element for the job -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main id="main-content">
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer>
  <p>Copyright 2025</p>
</footer>
```

**Element selection guide:**

| Need | Use | Not |
|------|-----|-----|
| Clickable action | `<button>` | `<div onclick>` |
| Navigation link | `<a href>` | `<span onclick>` |
| Page section | `<section>` with heading | `<div class="section">` |
| Independent content | `<article>` | `<div class="article">` |
| Site navigation | `<nav>` | `<div class="nav">` |
| Page header | `<header>` | `<div class="header">` |

---

## ARIA Patterns

### Skip Link
```html
<!-- First focusable element on the page -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
</style>
```

### Live Region (Dynamic Content)
```html
<div role="status" aria-live="polite" aria-atomic="true">
  Form submitted successfully
</div>
```

### Tab Interface
```html
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">
    General
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">
    Privacy
  </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  General settings content
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
  Privacy settings content
</div>
```

### Modal Dialog
```html
<dialog aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Confirm Action</h2>
  <p>Are you sure?</p>
  <button>Confirm</button>
  <button>Cancel</button>
</dialog>
```

Focus must be trapped inside the modal. Return focus to the trigger element on close.

---

## Focus Management

```css
/* Visible focus ring for keyboard users */
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* No outline for mouse clicks */
:focus:not(:focus-visible) {
  outline: none;
}
```

**Rules:**
- Every interactive element must have a visible focus indicator
- Tab order must match visual order (avoid `tabindex` greater than 0)
- Modals trap focus (Tab cycles within modal)
- After closing a modal/dropdown, return focus to the trigger
- Skip link lets keyboard users bypass repeated navigation

---

## Color and Contrast

**WCAG 2.2 AA requirements:**
- Normal text: 4.5:1 contrast ratio minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components and graphical objects: 3:1 minimum
- Information never conveyed by color alone (use icons, text, patterns)

**Testing tools:**
- `scripts/contrast-checker.py` — check any color pair from the command line
- Chrome DevTools: Inspect element → Accessibility pane shows contrast ratio
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- axe DevTools browser extension

---

## Testing

### Automated
- `scripts/a11y-audit.js` — run axe-core against a URL or local file
- **axe DevTools** (browser extension): catches ~30-40% of issues
- **Lighthouse accessibility audit**: built into Chrome DevTools
- **jest-axe**: unit test integration

### Manual (required — automation misses these)
- **Keyboard-only navigation**: unplug mouse, complete all workflows via Tab/Enter/Space/Escape
- **Screen reader**: test critical paths with VoiceOver (Mac) or NVDA (Windows)
- **Zoom**: test at 200% and 400% zoom — layout should remain usable
- **Reduced motion**: enable `prefers-reduced-motion` in OS settings, verify animations stop
