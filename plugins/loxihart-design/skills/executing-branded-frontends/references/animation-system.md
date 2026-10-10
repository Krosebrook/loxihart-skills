# Animation System

Production motion rules for executing-branded-frontends outputs.
All animations must serve a purpose. Motion for motion's sake is a slop signal.

---

## Core Principle

One well-orchestrated entrance animation beats ten scattered micro-interactions.
Invest in high-impact moments: page load, completion states, error states, discovery.

---

## Easing Reference

```css
/* Use these — do not invent ad-hoc cubic-bezier values */
--ease-out-smooth:  cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-out-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);   /* slight overshoot */
--ease-in-out-sharp: cubic-bezier(0.4, 0, 0.2, 1);        /* Material standard */
--ease-in-fast:     cubic-bezier(0.55, 0, 1, 0.45);       /* exit animations */
```

**When to use each:**
- `ease-out-smooth` — default entrance, tooltips, modals appearing
- `ease-out-spring` — success states, completion moments, element "landing"
- `ease-in-out-sharp` — layout shifts, tab switching, page transitions
- `ease-in-fast` — exits, dismissals, errors fading out

---

## Duration Scale

```css
--duration-instant:  80ms;   /* feedback: button press, checkbox toggle */
--duration-fast:    150ms;   /* micro: hover state, focus ring */
--duration-medium:  250ms;   /* component: modal open, drawer slide */
--duration-slow:    400ms;   /* page: section entrance, hero animation */
--duration-deliberate: 600ms; /* narrative: onboarding, success moments */
```

Never exceed 600ms for UI transitions. User perception of "slow" starts at 500ms.

---

## Staggered Entrance Pattern

For lists, cards, and grids — stagger reveals to imply sequence.

```css
/* Parent container */
.card-grid { }

/* Apply to each child with animation-delay */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 60ms; }
.card:nth-child(3) { animation-delay: 120ms; }
/* Cap stagger at 5 items — beyond that, batch the rest */
.card:nth-child(n+6) { animation-delay: 240ms; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## Permitted Properties for Animation

**Always safe (GPU-composited, no layout reflow):**
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness) — use sparingly

**Use with care (triggers paint but not layout):**
- `background-color`
- `color`
- `box-shadow`
- `border-color`

**Never animate:**
- `width`, `height`, `margin`, `padding`, `top`, `left` — causes reflow
- `font-size` — reflows everything
- `border-radius` on large surfaces — expensive repaint

---

## Reduced Motion

**Mandatory in every output with animation:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## High-Impact Moments (invest here)

### Page Load — Staggered Reveal
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-title   { animation: fadeSlideUp var(--duration-slow) var(--ease-out-smooth) both; }
.hero-subtitle { animation: fadeSlideUp var(--duration-slow) var(--ease-out-smooth) 80ms both; }
.hero-cta      { animation: fadeSlideUp var(--duration-slow) var(--ease-out-smooth) 160ms both; }
```

### Success State — Spring Landing
```css
@keyframes successPop {
  0%   { opacity: 0; transform: scale(0.85); }
  60%  { transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
}
.success-icon { animation: successPop var(--duration-deliberate) var(--ease-out-spring) both; }
```

### Error State — Attention Shake
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
.error-field { animation: shake var(--duration-medium) var(--ease-in-out-sharp); }
```

### Hover Lift — Subtle Depth
```css
.card {
  transition: transform var(--duration-fast) var(--ease-out-smooth),
              box-shadow var(--duration-fast) var(--ease-out-smooth);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

---

## Loading States

Never use a spinner alone. Always pair with skeleton or optimistic UI.

```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-raised) 25%,
    var(--surface-overlay) 50%,
    var(--surface-raised) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
```

---

## React Motion (when available)

If Framer Motion is available in the artifact context:

```jsx
import { motion, AnimatePresence } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

// Usage
<motion.div
  custom={index}
  variants={cardVariants}
  initial="hidden"
  animate="visible"
>
```

If Framer Motion is NOT available — use CSS animations from this file. Do not add it as an external dependency without confirming with the user.
