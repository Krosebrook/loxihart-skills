# Implementation Recipes

Working code per stack, for the techniques people ask for most: depth-layer
parallax, scroll-triggered reveal, pointer parallax, and the horizontal
scroll-linked panel. Every snippet respects `prefers-reduced-motion` and
uses compositor-only properties. Adapt selectors/markup to the project.

## A. Vanilla CSS + JS

**Depth-layer parallax** — HTML: `<div class="layer" data-depth="0.2">`.

```js
const layers = document.querySelectorAll('[data-depth]');
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (layers.length && !prefersReduced) {
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    layers.forEach((el) => {
      const depth = parseFloat(el.dataset.depth); // e.g. 0.2 (slow) .. 0.8 (fast)
      el.style.transform = `translate3d(0, ${(y * depth).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}
```

**Scroll-triggered reveal** — one-shot, via `IntersectionObserver`:

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
```

```css
[data-reveal] { opacity: 0; transform: translateY(20px); transition: opacity .6s ease, transform .6s ease; }
[data-reveal].is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

**Pointer parallax** — gated to fine pointers, one rAF in flight at a time:

```js
const hero = document.querySelector('[data-pointer-parallax]');
const fine = matchMedia('(pointer: fine)').matches;

if (hero && fine && !prefersReduced) {
  let rafId = null;
  hero.addEventListener('pointermove', (e) => {
    if (rafId) return;
    const rect = hero.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rafId = requestAnimationFrame(() => {
      hero.querySelectorAll('[data-pointer-depth]').forEach((el) => {
        const strength = parseFloat(el.dataset.pointerDepth); // px of max travel
        el.style.transform = `translate3d(${nx * strength}px, ${ny * strength}px, 0)`;
      });
      rafId = null;
    });
  }, { passive: true });
}
```

**Horizontal scroll-linked panel** — pins the section, translates a wide
track. Measures on load and resize; see the catalog entry for why that
matters.

```css
[data-h-scroll-section] { position: relative; }
[data-h-scroll-track] { position: sticky; top: 0; display: flex; height: 100vh; will-change: transform; }
```

```js
const track = document.querySelector('[data-h-scroll-track]');
const section = track?.closest('[data-h-scroll-section]');

if (track && section && !prefersReduced) {
  let distance = 0;
  const measure = () => {
    distance = track.scrollWidth - window.innerWidth;
    section.style.height = `${distance + window.innerHeight}px`;
  };
  measure();
  window.addEventListener('resize', measure);

  let ticking = false;
  const update = () => {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const progress = Math.min(Math.max(-rect.top / total, 0), 1);
    track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}
```

## B. Native CSS scroll-timelines (+ required fallback)

```css
@supports (animation-timeline: view()) {
  [data-reveal] {
    animation: reveal-in linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
  @keyframes reveal-in {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}
@supports not (animation-timeline: view()) {
  /* Same visual contract, delivered by the IntersectionObserver recipe above */
  [data-reveal] { opacity: 0; transform: translateY(20px); transition: opacity .6s, transform .6s; }
  [data-reveal].is-visible { opacity: 1; transform: none; }
}
```

A named scroll timeline for a depth-style drift, scoped to one section
rather than the whole document:

```css
.scene { scroll-timeline: --scene-scroll block; }
.layer-back {
  animation: drift linear;
  animation-timeline: --scene-scroll;
  animation-range: cover 0% cover 100%;
}
@keyframes drift { from { transform: translateY(0); } to { transform: translateY(-15%); } }
```

`prefers-reduced-motion` still applies exactly as in the Non-Negotiables
section of SKILL.md — scroll-timeline animations are still `animation`,
so the same media-query override zeroes them out.

## C. GSAP + ScrollTrigger

Free for commercial use since April 2025 — no Club membership or license
key needed for `ScrollTrigger` or any other plugin [SOURCED, see SKILL.md
CLAIMS]. `npm install gsap`, then:

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// gsap.matchMedia() is GSAP's own responsive/reduced-motion switch —
// prefer it over a manual matchMedia check when everything in the
// animation lives inside GSAP already.
gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
  gsap.utils.toArray("[data-depth]").forEach((el) => {
    gsap.to(el, {
      yPercent: () => -parseFloat(el.dataset.depth) * 30,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // Horizontal scroll-linked panel — ScrollTrigger's strongest case,
  // because it owns measurement + resize + pin for you.
  const track = document.querySelector("[data-h-scroll-track]");
  if (track) {
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: track.parentElement,
        start: "top top",
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }
});
```

`gsap.matchMedia()` automatically tears down and rebuilds the animations
when the query flips — including on reduced-motion changes mid-session —
which the manual `matchMedia().matches` check does not do by itself.

## D. Motion for React (formerly Framer Motion)

`npm install motion`, import from `motion/react` — the old
`framer-motion` package still works but isn't where development happens
now [SOURCED, see SKILL.md CLAIMS].

```jsx
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

function ParallaxHero() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [0, -150]);

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <motion.div style={{ y }}>{/* background layer */}</motion.div>
    </section>
  );
}
```

Scroll-triggered reveal via `whileInView`:

```jsx
<motion.h2
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
  Headline
</motion.h2>
```

For app-wide reduced-motion handling instead of checking
`useReducedMotion()` in every component, Motion exposes a `MotionConfig`
provider with a `reducedMotion` prop — wrap the app once instead of
threading the hook through every animated component:

```jsx
import { MotionConfig } from "motion/react";
// <MotionConfig reducedMotion="user"> ... </MotionConfig>
```

This provider-level API moves fast enough that it's worth confirming
against current Motion docs before shipping — treat it as a strong lead,
not a guarantee, the way you would any single-source recall of a library
detail that isn't pinned to a version number here.
