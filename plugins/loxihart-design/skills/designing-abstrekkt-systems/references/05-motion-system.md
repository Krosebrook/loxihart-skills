# Reference 05 — Motion System

State-driven animation engine. All transitions tied to UI state machines.
No independent animation logic allowed.

---

## Core Rule

Motion exists only to communicate state change.
If there is no state change, there is no animation.

---

## Duration-to-State Mapping

| Duration | Token | Use |
|---|---|---|
| 0ms | `--duration-instant` | Disabled state, synchronous toggles |
| 150ms | `--duration-fast` | Hover bg/border feedback |
| 200ms | `--duration-normal` | Focus rings, input borders, color transitions |
| 300ms | `--duration-slow` | Toast entrance, modal entrance, slideIn |
| 500ms | `--duration-slower` | Loading skeleton pulse, progress animations |

**Hard rule:** Maximum duration 500ms. No exceptions.

---

## Easing-to-Context Mapping

| Easing | Token | Value | Use |
|---|---|---|---|
| Entrance | `--easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the viewport |
| Exit | `--easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the viewport |
| Transform | `--easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State transformations |
| Linear | `--easing-linear` | `linear` | Looping animations (spinner, skeleton) |

**Never use:** spring, bounce, elastic, or any non-cubic-bezier easing.

---

## Transition Rules Per Component

| Component | State Transition | Duration | Easing | Properties |
|---|---|---|---|---|
| Button | default → hover | 150ms | ease-out | background-color, border-color |
| Button | default → focus | 200ms | ease-out | box-shadow (ring) |
| Button | hover → active | instant | — | background-color (immediate) |
| Input | default → focus | 200ms | ease-out | border-color, box-shadow |
| Input | focus → error | instant | — | border-color, background-color |
| Input | any → disabled | instant | — | background-color, color |
| Card | default → hover | 200ms | ease-out | box-shadow, border-color |
| Toast | hidden → entering | 300ms | ease-out | transform (slideIn), opacity |
| Toast | visible → exiting | 200ms | ease-in | transform (slideOut), opacity |
| Modal backdrop | hidden → visible | 200ms | ease-out | opacity |
| Modal content | hidden → visible | 300ms | ease-out | transform (scale+translateY), opacity |
| Modal content | visible → hidden | 200ms | ease-in | transform (scale), opacity |
| Dropdown | closed → open | 200ms | ease-out | opacity, transform (slideIn) |
| Nav link | default → hover | 150ms | ease-out | color |
| Nav link | default → active | instant | — | border-bottom, color |
| Skeleton | loading | 1000ms | ease-in-out | opacity (0.5 → 1, loops) |

---

## Keyframe Definitions

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(10px);
    opacity: 0;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scaleOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.95);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Tailwind Animation Classes

Add to tailwind.config.ts under `extend.animation`:

```typescript
animation: {
  fadeIn: 'fadeIn 200ms cubic-bezier(0, 0, 0.2, 1) forwards',
  fadeOut: 'fadeOut 200ms cubic-bezier(0.4, 0, 1, 1) forwards',
  slideIn: 'slideIn 300ms cubic-bezier(0, 0, 0.2, 1) forwards',
  slideOut: 'slideOut 300ms cubic-bezier(0.4, 0, 1, 1) forwards',
  scaleIn: 'scaleIn 300ms cubic-bezier(0, 0, 0.2, 1) forwards',
  scaleOut: 'scaleOut 200ms cubic-bezier(0.4, 0, 1, 1) forwards',
  pulse: 'pulse 1000ms linear infinite',
  spin: 'spin 600ms linear infinite',
},
```

---

## Reduced Motion

Required. Always implement.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Tailwind: use `motion-reduce:` variants where applicable.

```jsx
<div className="animate-slideIn motion-reduce:animate-none">...</div>
```

---

## Anti-Patterns (Hard Reject)

- ❌ `transition: all` — always be specific about which properties
- ❌ Duration > 500ms
- ❌ Spring or bounce easing
- ❌ Animation that runs without a state trigger
- ❌ Looping animation on static content
- ❌ Missing `prefers-reduced-motion` handling
- ❌ Hardcoded `cubic-bezier(...)` in component — always use token
