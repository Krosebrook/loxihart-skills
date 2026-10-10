# Anti-Slop Audit Checklist — v2.0

Use this checklist during Phase 9 of the Elite UI Design workflow.
Run every item. Document failures honestly. Do not suppress or rationalize them.

---

## Test 1: Template Detection

For every screen, component, and layout decision, ask:

> "Could this have been produced by any AI tool using defaults?"

If YES for any element:
1. Name the specific element
2. Identify what makes it generic (default colors? card grid? sidebar layout?)
3. Redesign it with an intentional decision
4. Re-test after the redesign

Common template indicators:
- Purple-to-blue gradient as primary palette
- Cards in a 3-column grid as the default layout
- Left sidebar with icon + label navigation
- Hero section → 3 feature cards → CTA footer
- Glassmorphism blur panels with no functional purpose
- Inter/Roboto/system font with no typographic personality
- Generic placeholder illustrations (undraw-style)
- Dashboard with 4 stat cards → chart → table
- Rounded-lg everything with identical padding
- Accent color on more than 10% of visible surface

---

## Test 2: Completeness

### Component States (8 required)
- [ ] Every interactive component has all 8 states defined:
  - [ ] Default (resting, no interaction)
  - [ ] Hover (feedback within 80ms)
  - [ ] Focus (visible, styled ring — not browser default, never removed)
  - [ ] Active / Pressed (mouse down or touch, brief visual compression)
  - [ ] Selected (for toggles, tabs, list items — distinct from focus)
  - [ ] Loading (async in progress, spinner or skeleton, not disabled)
  - [ ] Disabled (reduced opacity, `cursor: not-allowed`, no hover, no focus ring)
  - [ ] Error (with recovery action — color alone is insufficient)

### Async Lifecycle (for data-driven components)
- [ ] Every data component handles: idle → loading → skeleton → populated → stale → refreshing → error
- [ ] For AI-native products: full AI lifecycle covered (idle → validating → queued → processing → streaming → complete → failed)

### Empty States
- [ ] Every content container has an empty state
- [ ] Empty states are instructional, not just "No data"
- [ ] Three empty state variants exist where applicable:
  - [ ] Never had data (onboarding, first-use guidance)
  - [ ] Data cleared (confirmation + undo)
  - [ ] Search/filter found nothing (suggestion to adjust)

### Error Recovery
- [ ] Every error state has a specific recovery action
- [ ] Error messages follow the formula: what happened + why + what to do
- [ ] User input is preserved on error (never cleared)
- [ ] Errors are announced to screen readers (aria-live or focus management)

### Motion
- [ ] Every animation answers: what changed / where from / what's priority / what's next
- [ ] No animation exists purely for decoration
- [ ] `prefers-reduced-motion` fallback defined for every animation
- [ ] Reduced-motion fallback: opacity fades only, max 150ms, no spring physics
- [ ] Exit animations are faster than entrance animations
- [ ] Screen entrance choreography follows stagger sequence (structure → primary → supporting → interactive → decorative)

### Color & Contrast
- [ ] Every text/background pairing checked: 4.5:1 body, 3:1 large/UI
- [ ] No pure `#000000` backgrounds
- [ ] No `#FFFFFF` text on black
- [ ] No `rgba(0,0,0,X)` shadows on colored surfaces
- [ ] Dark mode uses hue-matched darks, not inverted light values
- [ ] Color is never the sole indicator of state (error, success, warning)
- [ ] 60/30/10 color ratio applied (dominant/secondary/accent)
- [ ] Shadow direction consistent with declared light source

### Accessibility
- [ ] Focus rings visible and styled to match design system
- [ ] All primary actions keyboard accessible
- [ ] Tab order matches visual order
- [ ] Escape closes all overlays
- [ ] Modals trap focus
- [ ] Touch targets ≥ 44px × 44px
- [ ] Skip-to-content link present (for full pages)
- [ ] ARIA roles and labels defined for custom components

### Layout & Structure
- [ ] No screen exists only because "apps usually have this"
- [ ] Every screen has a defined user goal and primary action
- [ ] Content max-width ≤ 1200px
- [ ] Prose max-width ≤ 65ch
- [ ] Mobile uses bottom navigation for primary actions (not hamburger)
- [ ] Spacing uses 8-point grid (multiples of 4px only)
- [ ] Responsive behavior defined per screen (not deferred)

### Typography
- [ ] Max 2 typefaces in the system
- [ ] Max 2 weights per component
- [ ] No weight 900 unless the typeface was designed for it
- [ ] Type scale is mathematically consistent (ratio or intentional steps)
- [ ] Line height appropriate per size (tighter for headings, looser for body)
- [ ] Typeface choice justified against material metaphor and temperature

### Information Architecture
- [ ] Every primary task reachable in ≤3 clicks/taps
- [ ] No dead-end screens (every screen has a forward path)
- [ ] User flows map happy path, error path, and escape hatches
- [ ] Back button / browser history behaves predictably

### Internationalization (if applicable)
- [ ] Layout works in both LTR and RTL (logical properties used)
- [ ] Text containers tolerate 30–40% expansion
- [ ] Directional icons flip for RTL
- [ ] No hardcoded text in components

### AI-Native (if applicable)
- [ ] Streaming content has stop affordance and scroll-awareness
- [ ] AI-generated content is labeled (not presented as authoritative fact)
- [ ] Agent status is visible during autonomous operations
- [ ] Cost/latency information is accessible to users who need it
- [ ] Fallback behavior defined for provider outages
- [ ] Confidence indicators present where AI certainty varies
- [ ] Regeneration and modification affordances available for generated output

### Performance (BUILD mode only)
- [ ] Images lazy-loaded below the fold
- [ ] Critical CSS inlined, non-critical deferred
- [ ] Code-split by route (no single bundle > 200KB gzipped)
- [ ] Fonts use `font-display: swap` with primary weight preloaded
- [ ] No layout shift after initial paint (space reserved for async content)
- [ ] Animations use `transform` + `opacity` only (no reflow triggers)
- [ ] Long lists virtualized (>100 items)
- [ ] Search inputs debounced, scroll handlers throttled
- [ ] Images have explicit `width`/`height`, serve WebP/AVIF with fallback
- [ ] LCP < 2.5s, CLS < 0.1, total blocking time < 200ms
- [ ] Static assets use hashed filenames with long-term cache headers
- [ ] API responses respect cache headers (`ETag`, `If-None-Match`)

---

## Test 3: Memorability

> "If someone used this for 5 minutes and described it from memory
> to a colleague, what would they say?"

- If the answer is "a clean app with a sidebar and some cards" — **FAIL**
- If the answer references a specific visual choice, interaction, or moment — **PASS**

The goal is not wild creativity. The goal is *one thing worth remembering*.

Identify that thing. If it doesn't exist — design it. Document:
- What is the memorable element?
- Why will users remember it? (visual distinctiveness, interaction delight, unexpected craft)
- Where in the flow does the user encounter it?

---

## Test 4: Category Failure Analysis

Every product category has predictable failure modes. Identify the top 2 for
this specific product type and document how this design avoids them.

Examples by category:

**Dashboards / Monitoring:** (1) Information overload — too many metrics with
no hierarchy. (2) No actionable path — data displayed but no next step.

**Forms / Wizards:** (1) No progress indication — user doesn't know how far
along they are. (2) Destructive errors — form clears on submission failure.

**Content apps:** (1) No reading rhythm — walls of text with identical styling.
(2) Navigation dead ends — user reaches content with no path forward.

**Tools / Utilities:** (1) No empty state — blank screen on first use.
(2) Expert-only affordances — no progressive disclosure for new users.

**E-commerce:** (1) Trust deficit — no visible security, shipping, or return
signals. (2) Decision fatigue — too many products with no filtering/comparison.

**Social / Community:** (1) Cold start — empty feed on first visit.
(2) Notification overload — no priority hierarchy in alerts.

**AI-Native / Model Routing:** (1) Black box — user can't tell what the AI is
doing or why. (2) Latency dead zones — long waits with no progress indicator
or streaming feedback.

Document your category, its failure modes, and your specific countermeasures.

---

## Test 5: Refinement Priorities

After passing all checks, identify the top 2 elements that would raise
quality further if given more time. For each:

1. Name the element or area
2. Describe the current state (what it is now)
3. Describe the target state (what "great" looks like)
4. Estimate effort (quick polish vs. significant rework)

This creates a clear improvement backlog rather than vague "could be better."

---

## Test 6: Programmatic Verification (Level 3 — Optional, Recommended for Multi-Screen Builds)

The 5 tests above are subjective. This test is objective — pixel-level and code-level.
Use when: (a) the build spans >3 screens, (b) multiple sessions are involved, or
(c) you are enforcing a design system across components built separately.

### 6a — Static Code Audits

Before running visual tests, check the code directly against design.md rules:

- [ ] No banned fonts in CSS (scan for `font-family: Inter`, `font-family: Geist` in
  non-FF builds, `font-family: Poppins` in FF builds outside logo context)
- [ ] No banned hex values (scan for deprecated FF tokens: `#0F0618`, `#1A0B2E`, `#F472B6`)
- [ ] No `border-radius` inconsistencies (component-level overrides without justification)
- [ ] Spacing values are multiples of 4px (8-point grid) — no arbitrary px values
- [ ] Color contrast ratios ≥ 4.5:1 body / ≥ 3:1 large text — verify programmatically, not by eye
- [ ] No hardcoded hex in component styles — values use CSS variables defined at `:root`

**Tool:** Run contrast checks with `npx @accessibility-checker/cli` or equivalent.

### 6b — Visual Regression with Vizzly

**Vizzly** (`vizzly.dev`) is a visual TDD CLI. It takes screenshots during Playwright
tests and compares them frame-by-frame using the Honeydiff engine (Rust-based,
231M px/sec). Rejected diffs feed back as context for the next agent pass.

**Pricing (verified May 2026):**
- **Free** — $0/forever. 1 private project, unlimited public, local TDD, GitHub PR checks, 30-day retention. Sufficient for solo commercial use on a single project.
- **Starter** — $12/user/month. Unlimited private projects, preview hosting, auto-approval, 90-day retention.
- **Local TDD mode** — runs entirely on your machine with no account required. `npx vizzly tdd` only requires cloud auth for PR checks and baseline sync.

**Install:**
```bash
npm install -D @vizzly-testing/cli
npx vizzly tdd "npx playwright test"
```

**Local TDD loop** (no account required):
```bash
npx vizzly tdd "npm test"
# Opens live dashboard at http://localhost:47392/dashboard
# Visual diffs appear in milliseconds as tests run
```

**Write tests BEFORE generating UI.** If written after, agents optimize tests to
pass existing flawed code. Tests are the pins — implementation must conform to them.

**Test-first workflow:**
1. Define `design.md` (OKLCH tokens, typography, spacing, anti-patterns)
2. Write Playwright tests that assert design.md rules (font, color, spacing, states)
3. Generate UI — agent writes code to pass the pre-written tests
4. Run `npx vizzly tdd` — approve/deny diffs
5. Rejected diffs (delta between current and desired) feed back to agent as instruction
6. Loop until all diffs are approved

**Example Playwright + Vizzly test skeleton:**
```typescript
import { test, expect } from '@playwright/test';

test('primary button uses correct FF violet token', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('[data-testid="primary-cta"]');
  const bg = await btn.evaluate(el =>
    getComputedStyle(el).backgroundColor
  );
  // Assert against CSS variable resolved value, not raw hex
  expect(bg).toBe('rgb(168, 85, 247)'); // #A855F7
});

test('no Inter font in rendered page', async ({ page }) => {
  await page.goto('/');
  const fonts = await page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .map(el => getComputedStyle(el).fontFamily)
      .filter(f => f.toLowerCase().includes('inter'))
  );
  expect(fonts).toHaveLength(0);
});
```

**Approve/Deny loop:**
- APPROVE → baseline updated, design is converging
- DENY → rejected diff sent back to agent: "The header background shifted from
  oklch(8% 0.01 265) to oklch(12% 0.01 265). Revert to the locked surface-1 value."

### 6c — Convergence Criteria

The build passes Level 3 when:
- [ ] All static code audits pass (no banned tokens, no arbitrary values)
- [ ] All Vizzly diffs approved against baseline
- [ ] No agent-introduced token drift detected across sessions
- [ ] design.md updated with any new tokens discovered during implementation

**Level 3 verdict:** SHIP / NEEDS CONVERGENCE / REDESIGN REQUIRED

---

## Audit Output Format

```
## Anti-Slop Audit Report

### Template Test
- [PASS/FAIL] — [details of any generic elements found and redesigned]

### Completeness
- Component states (8):  [X/X passing]
- Async lifecycle:       [X/X components covered]
- Empty states:          [X/X screens covered]
- Error recovery:        [X/X errors have recovery actions]
- Motion:                [X/X animations justified + reduced-motion fallback]
- Color & contrast:      [X/X pairings passing WCAG]
- Accessibility:         [X/X checks passing]
- Layout & structure:    [X/X checks passing]
- Typography:            [X/X checks passing]
- Information arch:      [X/X checks passing]
- i18n (if applicable):  [X/X checks passing]
- AI-native (if appl.):  [X/X checks passing]
- Performance (BUILD):   [X/X checks passing]

### Memorability Test
- [PASS/FAIL]
- Memorable element: [what it is]
- Why memorable: [justification]

### Category Failures
- Category: [product type]
- Failure mode 1: [name] — Countermeasure: [what this design does]
- Failure mode 2: [name] — Countermeasure: [what this design does]

### Refinement Priorities
1. [Element] — Current: [state] → Target: [state] — Effort: [estimate]
2. [Element] — Current: [state] → Target: [state] — Effort: [estimate]

### Verdict
[SHIP / SHIP WITH CAVEATS / REDESIGN REQUIRED]
```
