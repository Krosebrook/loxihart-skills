## Phase 5 — Interaction Model

### Component States — all 8 required before a component exists

1. **Default** — resting state, no interaction
2. **Hover** — cursor over, feedback within 80ms
3. **Focus** — keyboard navigation, visible styled ring, never hidden or removed
4. **Active / Pressed** — mouse down or touch, brief visual compression
5. **Selected** — for toggles, tabs, list items, multi-select — visually distinct
   from focus (selected = chosen, focus = currently navigable)
6. **Loading** — async operation in progress, spinner or skeleton, not disabled
7. **Disabled** — 40% opacity, `cursor: not-allowed`, no hover, no focus ring
8. **Error** — recovery action required, red alone is not enough

Plus required container states:
- **Empty state** for any content container (instructional, not blank)
- **Success state** (confirm, then fade — do not persist)

### Async Lifecycle (for data-driven components)

Every component that fetches or displays data must handle:
`idle → loading → skeleton → populated → stale → refreshing → error`

For AI-native products, extend to the full AI interaction state machine:
`idle → validating → queued → processing → streaming → complete → failed`
(See `references/ai-native-patterns.md` Quick Reference)

### Keyboard

- All primary actions keyboard accessible
- Tab order logical. Escape closes all overlays.
- Modals: focus trap. Lists: arrow key navigation.
- Focus rings styled to match the design system — beautiful, not hidden.

### Immediate Feedback

- Every action acknowledged within 80ms
- Interactive elements signal interactivity without tooltips
- User always knows system state (loading / saving / error / success)

Map states explicitly in a table: state name, trigger, UI representation, exit conditions. Every state that isn't mapped will be shipped blank.

---
