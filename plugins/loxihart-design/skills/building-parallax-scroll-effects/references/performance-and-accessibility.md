# Performance and Accessibility

Detail behind the Non-Negotiables section of SKILL.md — checklists to run
against, not just principles to remember.

## Why compositor-only properties matter

A browser's rendering pipeline runs, in order: layout (compute geometry) →
paint (rasterize pixels) → composite (assemble layers on the GPU).
Animating `top`, `left`, `width`, `height`, or `margin` re-triggers layout
on every single frame — for a 60fps scroll, that's layout running roughly
every 16ms while the user is actively scrolling, which is exactly the
condition under which frame drops are most visible. `transform` and
`opacity` skip layout and paint entirely; the compositor can move an
already-rasterized layer for near-free. Same visual result, radically
different cost. This is why every recipe in this skill only ever touches
`transform` and `opacity`.

## Scroll listener discipline

- Wrap DOM writes in `requestAnimationFrame`; never write styles directly
  inside a raw `scroll` handler.
- Add listeners with `{ passive: true }` so the browser doesn't have to
  wait to find out if you'll call `preventDefault()`.
- Use `IntersectionObserver` for anything that's really an enter/exit
  question (reveals, "has this pin activated yet") — it runs off the main
  thread's scroll path entirely, so it costs nothing while nothing is
  crossing a threshold.
- Reserve continuous scroll-position math (`window.scrollY`,
  `getBoundingClientRect()` inside the scroll handler) for effects that
  truly need a continuous value — real parallax offset, horizontal-scroll
  translate amount. Don't reach for it out of habit.

## Reduced motion — the actual contract

`prefers-reduced-motion: reduce` is not a request to tone an effect down.
It's a signal that motion can trigger real physical symptoms (vestibular
disorders, migraines) for the person who set it. The only correct
response is to remove scroll-linked movement entirely and show content in
its resting state:

```css
@media (prefers-reduced-motion: reduce) {
  [data-parallax], [data-reveal], [data-pin], [data-pointer-parallax] {
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
}
```

Test it before shipping, every time: macOS *System Settings → Accessibility
→ Display → Reduce motion*; Windows *Settings → Accessibility → Visual
effects → Animation effects* off; or in Chrome/Edge DevTools, the Rendering
panel's "Emulate CSS media feature prefers-reduced-motion" — no OS setting
change required for a quick check.

## Mobile and coarse-pointer checklist

- [ ] Pointer-parallax gated behind `matchMedia('(pointer: fine)')` — it
  does nothing useful on touch and just burns battery.
- [ ] Layer count and movement range reduced below some viewport width
  (a `matchMedia('(max-width: 640px)')` check, or a CSS-only reduction via
  a smaller `--parallax-strength` custom property at that breakpoint).
  Three-layer parallax that's subtle at arm's length on desktop reads as
  seasick at phone-holding distance.
- [ ] Actually test on a mid-range Android device, not just a simulator
  at desktop refresh rates — the gap between a flagship phone's GPU and a
  mid-range one is large enough that "smooth in Chrome DevTools device
  mode" is not evidence of anything.
- [ ] Horizontal scroll-jacked sections work with touch swipe, not just
  wheel/trackpad input — verify the scroll math responds to `touchmove`-
  driven scroll the same way it responds to `wheel`-driven scroll (most
  vanilla implementations do, since both ultimately move
  `window.scrollY` — but confirm rather than assume once GSAP's
  `ScrollTrigger` or a smooth-scroll library like Lenis is in the mix,
  since those intercept the native scroll path).

## Keyboard and screen-reader parity

- [ ] Tab order through a scroll-jacked or pinned section matches visual
  reading order with the effect mentally switched off.
- [ ] No content exists *only* behind a hover state or a pointer-parallax
  interaction — everything reachable by mouse hover must also be reachable
  by keyboard focus, and everything conveyed by a pointer-driven visual
  shift must also exist in the DOM in a form a screen reader can announce.
- [ ] Decorative parallax layers (background textures, ambient shapes)
  are marked `aria-hidden="true"` or implemented as CSS backgrounds rather
  than `<img>` elements, so they don't clutter the accessibility tree with
  nothing to announce.
- [ ] A horizontal scroll-jacked section never becomes the *only* way to
  reach the content after it — a keyboard user tabbing past it should be
  able to continue to the next section without having to trigger the
  scroll-jack mechanism at all.

## Never trap scroll — how to verify it

Scroll through the page using only the keyboard (Space / Page Down) and
using a trackpad flick. In both cases: does a pinned or horizontal section
release control back to normal vertical scrolling within roughly one to
two viewport heights? If a user has to find a "correct" scroll speed, a
specific gesture, or has to wait out a minimum dwell time to escape a
section, that's scroll-jacking in the pejorative sense, not the useful
sense — fix the release condition before shipping.

## Self-check before shipping any scroll effect

1. Only `transform`/`opacity` are animated — grep the CSS/JS for `top:`,
   `left:`, animated `width`/`height` tied to scroll, and justify or fix
   every hit.
2. Reduced-motion media query is present and actually zeroes out movement
   (verified via DevTools emulation, not assumed).
3. Any scroll/pointermove listener is rAF-throttled and `{ passive: true }`.
4. Any native `animation-timeline` usage has a working `@supports not (...)`
   fallback.
5. Pointer-parallax is gated behind `(pointer: fine)`.
6. Tab order and content access were checked with the effect off.
7. The section releases scroll control within ~1–2 viewport heights.
