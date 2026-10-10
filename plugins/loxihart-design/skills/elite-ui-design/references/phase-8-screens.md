## Phase 8 — Screens

For each screen define:

- **User goal:** What task is the user completing?
- **Primary action:** The single most important thing they do
- **Hierarchy:** Label 1st / 2nd / 3rd attention anchors
- **Composition:** Which eye flow pattern applies? (F-pattern / Z-pattern /
  center-focal / Gutenberg — see `references/cinematic-design.md` Section 3)
- **Visual weight:** Where is the intentional imbalance that creates a focal point?
- **Empty state:** Zero-data version (never blank)
- **Error state:** What breaks + what recovery looks like
- **Responsive behavior:** What reflows, what collapses, what gets cut at each
  breakpoint. Not deferred — decided here, per screen.

For AI-native products, also define per screen:
- **AI interaction states:** What does this screen look like at each point in the
  AI lifecycle (idle / processing / streaming / complete / failed)?
- **Latency handling:** What's the expected wait time and what does the UI do
  during it?
- **Cost visibility:** Is cost/usage information shown on this screen? How?

Constraints:
- Touch target minimum: 24×24 CSS pixels (WCAG 2.5.8 AA); 44×44px recommended for comfort
- Mobile: bottom navigation — not hamburger for primary actions
- Content max-width: 1200px. Prose max-width: 65ch.

**Gate before including any screen or section:**
"Why does this specific user need this specific thing here?"
If the answer is "because apps usually have it" — cut it.

**Opening shot** (from cinematic-design reference):
Define the first screen a new user sees. What loads first? What's the visual
hook? What's the first available action? If the answer is "a spinner" — redesign.

---
