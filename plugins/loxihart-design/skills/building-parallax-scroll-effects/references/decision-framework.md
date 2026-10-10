# Decision Framework — Deeper Tradeoffs

The Stack Selection Matrix in SKILL.md is the quick version. This is the
version with the edge cases that actually change the decision.

## When "portable, no bundler" stops being the deciding factor

Vanilla CSS+JS (Stack A) is the default in this skill's own examples
because they're single-file, dependency-free demos. That reasoning stops
applying the moment any of these is true:

- The project already has GSAP or Motion installed for something else —
  adding a second animation approach alongside an existing one is a
  maintenance cost with no offsetting benefit. Use what's already there.
- The horizontal scroll-linked panel needs to handle dynamic content
  (a CMS-driven gallery where card count changes) — the hand-rolled
  `measure()`/resize-listener pattern in the recipes is fine for a fixed
  set of cards, but starts fighting you once content-driven width changes
  happen after initial measurement (an image loads late and reflows the
  track, for instance). GSAP's ScrollTrigger has `invalidateOnRefresh` and
  a `ScrollTrigger.refresh()` call specifically for this; hand-rolling the
  equivalent is real, non-trivial work.
- More than roughly 4–5 scroll-linked effects exist on one page. At that
  point a single library managing all of them (GSAP's global timeline
  awareness, or Motion's shared scroll listeners under `useScroll`) avoids
  N independent scroll listeners each doing their own rAF bookkeeping.

## When native CSS scroll-timelines (Stack B) are worth the Firefox gap

Reach for `animation-timeline` when **all** of these hold:

- The effect is expressible as a `@keyframes` animation — a fade, a
  translate, a scale, a rotate, or some combination. If it needs
  arbitrary JS logic mid-animation (branching on scroll direction,
  reading external state), it's not a fit.
- You're willing to actually write and test the `@supports not (...)`
  fallback, not just note that Firefox is behind a flag and move on.
- The section isn't load-bearing for a Firefox-heavy audience today. If
  analytics show meaningful Firefox share, budget real testing time on it
  — "ships behind a flag" means default Firefox users get nothing from
  the CSS path and are entirely dependent on your fallback being correct.

Native CSS timelines are not yet a reason to *drop* Stack A or D outright
— they're a compositor-only upgrade layered on top of whichever JS
fallback you were going to need anyway.

## When GSAP (Stack C) is the right call even though it's a dependency

GSAP earns its dependency weight specifically for:

- **Scrubbing** — an animation whose progress is *driven by* scroll
  position rather than merely *triggered by* crossing a threshold.
  `scrub: true` on a ScrollTrigger instance handles this correctly across
  resize and orientation change in a way that's genuinely fiddly to
  hand-roll well.
- **Pinning with correct measurement** — GSAP measures pinned elements'
  actual rendered size and recalculates on `ScrollTrigger.refresh()`
  (which it also wires to `resize` for you). The vanilla horizontal-panel
  recipe in this skill does a simplified version of the same idea; GSAP's
  version handles more edge cases (nested scroll containers, dynamically
  inserted content, iframe embeds) without you writing that code.
- **Timeline sequencing** — multiple scroll-linked animations that need
  to hand off to each other in a specific order (a "story" made of five
  scroll-scrubbed beats) is what GSAP's timeline model is built for.
  Coordinating five independent vanilla scroll listeners to hit the same
  handoffs is possible but is reinventing a scheduler.

It is *not* worth adding GSAP just for a single depth-layer parallax hero
or a handful of scroll-triggered reveals — Stack A covers those in a
dozen lines with zero dependency weight.

## When Motion for React (Stack D) is the right call

Default to Motion whenever the section already lives inside a React
tree and doesn't need GSAP-level scrubbing/pinning precision. The
`useScroll`/`useTransform` pair covers depth parallax and most reveal
patterns idiomatically; `whileInView` covers simple triggered reveals
without any manual `IntersectionObserver` wiring. The main reason to reach
past Motion toward GSAP inside a React app specifically is the horizontal
scroll-linked panel with dynamic content — Motion can do it, but GSAP's
ScrollTrigger has more mileage on exactly that pattern.

## Technique-selection edge cases

- **"I want it to feel like the site in example X."** Ask what's actually
  moving in that example before picking a technique — most sites that
  "feel alive" are one or two techniques (usually a reveal plus a depth
  layer) executed with restraint, not five techniques stacked. Matching
  the restraint matters more than matching the specific technique.
- **A section needs BOTH a depth layer and a pointer-parallax layer.**
  This combination is genuinely common and genuinely works — scroll and
  cursor are independent input signals, so they compose without
  interference as long as both write to `transform` on different
  elements (or via separate translate axes on the same element, composed
  carefully) and both respect the same reduced-motion and coarse-pointer
  guards.
- **Client explicitly asked for scroll-jacking they've seen elsewhere.**
  Build it, but hold the "never trap scroll" and "effect-off parity"
  rules from SKILL.md as non-negotiable regardless of the request — those
  are accessibility and usability floors, not style preferences, and
  they're compatible with almost any scroll-jacked design if the release
  condition and keyboard path are designed in from the start rather than
  retrofitted.
