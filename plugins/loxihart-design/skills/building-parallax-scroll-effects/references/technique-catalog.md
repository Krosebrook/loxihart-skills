# Technique Catalog — Full Write-Ups

Ten techniques. For each: what it actually looks like, when the complexity
is worth it, and the mistake that shows up most often when someone builds
it for the first time.

## Depth-layer parallax

**What it looks like:** two or more layers (background, midground,
foreground) translate vertically at different rates as the page scrolls.
Background moves slowest, foreground fastest or not at all — that gap in
speed is what reads as depth.

**Best for:** hero sections that need to feel like a scene rather than a
flat banner; environmental storytelling where the "world" should feel like
it has recession.

**Earns its complexity when:** there are genuinely separable visual
planes (sky/ridge/foreground silhouette; backdrop/product/light-sweep).
If everything's roughly the same distance from camera, layering does
nothing — you're just moving one image for no reason.

**Common mistake:** using the same speed multiplier for every layer
"to be safe." Depth comes from the *difference* between speeds, not from
movement existing at all. A 0.2 vs 0.5 multiplier reads as depth; 0.4 vs
0.45 reads as nothing.

## Sticky pin + pass-through

**What it looks like:** an element (an image, a large number, a pull
quote) sticks in place via `position: sticky` while unrelated content
scrolls past or over it, then releases once its container's bottom edge
reaches the pin point.

**Best for:** product spotlights where copy changes underneath a fixed
hero shot; a running caption or stat that stays visible while supporting
detail scrolls by.

**Earns its complexity when:** the pinned thing is genuinely the
throughline for a section — glue, not decoration.

**Common mistake:** forgetting the pinned element needs a container
*taller* than the viewport to pin against. `position: sticky` pins
relative to its nearest scrolling ancestor's box — if that box is exactly
viewport-height, there's nothing to scroll "past," and the sticky element
just looks fixed for zero scroll distance.

## Scroll-triggered reveal

**What it looks like:** a headline, paragraph, or image starts hidden
(via opacity, a clip-path mask, or a translate offset) and arrives at its
final state as it crosses into the viewport.

**Best for:** narrative pacing — giving a headline weight by having it
arrive rather than just being present on load; the single cheapest way to
make a static page feel sequenced.

**Earns its complexity when:** used sparingly enough to still read as an
event. A page where every paragraph fades in on scroll trains the eye to
ignore the fade entirely within two sections.

**Common mistake:** animating from too far off-screen or too large a
scale change. A 200px translate with a rotate and a scale-from-zero reads
as a PowerPoint transition, not a considered reveal. Subtle wins:
12–24px translate, opacity 0→1, nothing else, most of the time.

## Scale/zoom on scroll

**What it looks like:** an element grows (or shrinks) as it moves toward
the vertical center of the viewport, using `transform: scale()` tied to
scroll position or IntersectionObserver-driven state.

**Best for:** giving one focal element — a product shot, a portrait — a
"step closer" moment without any camera or video.

**Earns its complexity when:** there's one clear focal point per screen.
Scaling three things independently on the same screen just looks like
everything is breathing at slightly different rates, which is unsettling
rather than cinematic.

**Common mistake:** scaling `width`/`height` instead of `transform:
scale()`. The former triggers layout on every frame; the latter is
compositor-only. Same visual result, very different frame budget.

## Horizontal scroll-linked panel

**What it looks like:** the section pins vertically while normal (vertical)
scroll input drives horizontal translation of its contents — a gallery or
timeline that reads left-to-right, driven by an ordinary scroll gesture.

**Best for:** galleries, case-study rails, timelines — anything with a
natural left-to-right sequence that would otherwise need a separate
horizontal scrollbar or explicit swipe gesture.

**Earns its complexity when:** the content genuinely has a sequence.
Don't reach for this to make a *grid* of unrelated cards feel more
interesting — that's a card grid wearing a costume.

**Common mistake:** hardcoding the scroll distance instead of measuring
the panel's actual content width at runtime. Any content change (a new
card, a font substitution during load, a viewport resize) silently breaks
the math. Measure on load and on resize, always — this is also exactly
the class of problem GSAP's ScrollTrigger exists to solve if the hand-
rolled math starts fighting you.

## Pointer/mouse parallax

**What it looks like:** one or more elements shift a few pixels in the
direction of (or opposite) the cursor as it moves across a container,
independent of scroll.

**Best for:** adding a sense of interactivity to a hero on desktop,
particularly paired with depth-layer parallax so the scene responds to
both scroll and cursor.

**Earns its complexity when:** the container is large enough that cursor
position has room to mean something — a full hero, not a 200px card.

**Common mistake:** shipping it unconditionally. On a touch device
`pointermove` either never fires meaningfully or fires from touch events
that have nothing to do with "where the cursor is," so the effect does
nothing useful and just costs battery. Gate behind
`matchMedia('(pointer: fine)')`.

## Velocity-aware marquee

**What it looks like:** a horizontally-scrolling ticker (logos, tags,
headlines) that speeds up or reverses direction based on how fast — and
which way — the user is scrolling the page, rather than running at one
constant rate.

**Best for:** logo rails and footers that would otherwise be a static,
forgettable strip.

**Earns its complexity when:** the marquee content is genuinely
decorative/ambient. If it's carrying information the user needs to read,
variable speed makes it *harder* to read, not more engaging.

**Common mistake:** letting velocity go unbounded. Fast scroll-flinging
should clamp to a maximum marquee speed, or the effect turns into a blur
that communicates nothing.

## 3D perspective layering

**What it looks like:** layers sit at different `translateZ` depths
inside a `perspective`-having parent, so scroll-driven rotation or
translation produces genuine foreshortening, not just flat offset.

**Best for:** a single cinematic hero moment — this is a "use once, use
well" technique, not a section-by-section pattern.

**Earns its complexity when:** the perspective effect is the point of the
section, not a garnish on top of content that would work fine flat.

**Common mistake:** applying `perspective` to too small a container, which
makes the 3D distortion look broken/warped rather than cinematic —
perspective needs room to read as depth rather than fisheye.

## Scroll-scrubbed media

**What it looks like:** scroll position maps directly to a video's
`currentTime` or a canvas's current frame, so scrolling functions like
manually dragging a video's progress bar.

**Best for:** product demos and explainer sequences where a viewer
controlling the pace (rather than watching autoplay) genuinely helps
comprehension.

**Earns its complexity when:** the source is pre-rendered as a frame
sequence or a seekable video with `preload="auto"` — seeking an
un-buffered video on every scroll tick stutters badly.

**Common mistake:** driving `video.currentTime` directly from a raw
`scroll` event. Set it inside a `requestAnimationFrame` callback and skip
the write entirely if the target time hasn't changed meaningfully since
the last frame — otherwise you're issuing far more seek requests than the
decoder can keep up with.

## Scroll-linked theme shift

**What it looks like:** a background color, an accent variable, or a
larger theme state changes as the user crosses between page zones —
motion of *value*, not of position.

**Best for:** section-to-section mood changes on long single-page sites —
day-to-night, calm-to-urgent, brand-A-to-brand-B.

**Earns its complexity when:** the shift reinforces content the user is
already reading, rather than existing as an unexplained mood swing.

**Common mistake:** animating the raw color values as strings/hex, which
either doesn't interpolate smoothly or requires a color-tweening library.
Drive it through CSS custom properties with `@property` (typed custom
properties) or precompute intermediate stops, so the browser can actually
interpolate the value.
