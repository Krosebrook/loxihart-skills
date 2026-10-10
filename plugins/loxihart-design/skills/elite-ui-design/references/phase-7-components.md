## Phase 7 — Components

Build from hierarchy — never design a page from scratch:
**Primitives → Composites → Patterns → Layouts → Pages**

For each component define:
- Name + purpose (1 sentence)
- Variants
- All 8 interaction states (from Phase 5)
- Internal spacing (using space tokens)
- Motion (easing + duration from Phase 4)
- ARIA role + keyboard behavior + screen reader label
- i18n behavior (if applicable): text expansion tolerance, RTL mirroring

If a page needs a component that doesn't exist yet — define it first.

For AI-native products: define AI-specific components from
`references/ai-native-patterns.md`:
- Streaming text container
- Confidence indicator
- Agent status feed
- Prompt input with parameter controls
- Cost/latency metadata display
- Regeneration controls

For component library architecture, chain to `applying-web-design-standards` if building
a reusable system. For individual advanced component patterns (virtualized lists,
drag-and-drop, command palette), chain to `ui-component-library`.

---
