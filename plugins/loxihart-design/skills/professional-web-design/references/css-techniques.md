# CSS Techniques Reference

## Table of Contents
- CSS Grid Layouts
- Flexbox Patterns
- Container Queries
- Animations
- Progressive Enhancement

---

## CSS Grid Layouts

### Holy Grail Layout
```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 250px 1fr 250px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }

@media (max-width: 768px) {
  .layout {
    grid-template-areas: "header" "main" "sidebar" "aside" "footer";
    grid-template-columns: 1fr;
  }
}
```

### Auto-Fit Responsive Grid
```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

### Dashboard Grid
```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
}

.widget-wide   { grid-column: span 2; }
.widget-tall   { grid-row: span 2; }
.widget-full   { grid-column: 1 / -1; }
```

---

## Flexbox Patterns

### Card with Expanding Content
```css
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-header { flex-shrink: 0; }
.card-body   { flex: 1; }
.card-footer { flex-shrink: 0; }
```

### Centering
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Space-Between Navigation
```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

### Wrapping Tag List
```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

---

## Container Queries

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card { padding: 1rem; }

@container card (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    padding: 2rem;
  }
}
```

Container queries let components respond to their container width instead of the viewport. Use for reusable components that appear in different layout contexts (sidebar vs. main content).

---

## Animations

### GPU-Accelerated Transitions
```css
.button {
  transition: transform 200ms ease, opacity 200ms ease;
}
.button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
```

Only animate `transform` and `opacity` for 60fps performance. Avoid animating `width`, `height`, `margin`, `padding`, `top`, `left`.

### Respect Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyframe Animation
```css
@keyframes slide-in {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

.slide-enter { animation: slide-in 300ms ease-out; }
```

---

## Progressive Enhancement

```css
/* Base (all browsers) */
.grid { display: block; }
.grid-item { margin-bottom: 1rem; }

/* Enhanced (modern browsers) */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  .grid-item { margin-bottom: 0; }
}
```

**Autoprefixer** handles vendor prefixes automatically — include it in your build pipeline rather than writing prefixes by hand.
