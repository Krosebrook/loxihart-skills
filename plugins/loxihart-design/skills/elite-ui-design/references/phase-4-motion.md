## Phase 4 — Motion

Every animation must answer one of:
*What changed? / Where did this come from? / What has priority? / What can I do next?*
If it answers none — remove it.

Read `references/cinematic-design.md` Section 4 (Micro-Interaction Choreography)
for screen entrance sequences, transition choreography, and the "opening shot."

**Easing curves:**
- appear: `cubic-bezier(0.0, 0.0, 0.2, 1)`
- depart: `cubic-bezier(0.4, 0.0, 1, 1)`
- move: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- spring: `cubic-bezier(0.34, 1.56, 0.64, 1)`

**Duration:** micro 80ms, fast 150ms, medium 250ms, slow 400ms

**Rules:**
- Animate `transform` + `opacity` only. Never `width`/`height`/`top`/`left`.
- Exit faster than enter. Stagger max 40ms, max 5 siblings.
- State transitions: crossfade. Never flash.

**Screen entrance choreography** (from cinematic-design reference):
1. Structure (0ms) → 2. Primary content (80–120ms) → 3. Supporting (160–240ms)
→ 4. Interactive elements (240–320ms) → 5. Decorative (320–400ms)
Total under 500ms.

**Reduced motion is required, not optional:**
```css
@media (prefers-reduced-motion: reduce) {
  /* opacity fades only, max 150ms, no spring physics */
}
```

For complex interaction animation specs, define the state machine inline in Phase 5 using the async lifecycle pattern below.

---
