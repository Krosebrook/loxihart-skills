# Cinematic Design Reference

Use this reference during Phase 1 (Experience Thesis), Phase 3 (Design System),
Phase 4 (Motion), and Phase 9 (Anti-Slop Audit — Memorability Test).

This document bridges the gap between *systematic* design (tokens, grids, states)
and *authored* design (mood, material, narrative, emotion). A technically correct
interface can still be forgettable. This reference prevents that.

---

## 1. Visual Direction — Before Tokens

Phase 1 produces brand adjectives. This section translates adjectives into a
visual language before any HSL value is chosen.

### Mood Definition

For each project, define:

**Lighting direction:** Where does the conceptual light come from?
- Top-left ambient (default, neutral — fine for productivity tools)
- Overhead dramatic (strong shadows, high contrast — authority, tension)
- Side-lit (asymmetric shadows — editorial, cinematic)
- Back-lit / rim-lit (glowing edges, dark surfaces — futuristic, high-tech)
- Diffuse / overcast (soft shadows, low contrast — calm, approachable)

The light source must be consistent across all elevations and shadows.
Mixed shadow directions break spatial coherence.

**Temperature:** Where does the palette sit on the warm/cool spectrum?
- Cool clinical (blue-gray surfaces, white light — medical, finance, data)
- Warm organic (amber/cream undertones — hospitality, social, creative)
- Neutral technical (true grays, no undertone — developer tools, utilities)
- High contrast split (warm accents on cool surfaces — dramatic, modern)

Temperature informs surface colors, shadow hues, and text rendering.
It is not the same as "pick a brand color."

**Density:** How much information per viewport?
- Sparse (editorial — one idea per screen, generous whitespace)
- Balanced (productivity — clear hierarchy, moderate density)
- Dense (professional tools — information-rich, compact, power-user)
- Adaptive (changes density based on user expertise or data volume)

Density drives type scale, spacing tokens, and component sizing.

**Material metaphor:** What is the surface made of?
Every interface has an implied material. Name it explicitly:
- Paper (layered sheets, subtle texture, soft shadows — editorial, docs)
- Glass (transparency, blur, light refraction — overlays, media)
- Metal (hard edges, reflective highlights, industrial — tools, dashboards)
- Fabric (soft edges, organic shadows, texture — social, creative)
- Void (no material — elements float in dark space — futuristic, immersive)
- Concrete (raw, tactile, heavy shadows — brutalist, developer-facing)

The material metaphor drives:
- Edge treatment (sharp vs. rounded vs. irregular)
- Shadow character (crisp vs. diffuse vs. none)
- Surface texture (flat vs. noise/grain vs. gradient)
- Depth perception (layered vs. flat vs. floating)

### Translating Mood to Tokens

After defining mood, constrain your design system:

| Mood Decision | Token Impact |
|--------------|-------------|
| Lighting direction | Shadow angle + spread + opacity in elevation system |
| Temperature | Surface base hue, shadow hue, text color undertone |
| Density | Base font size, spacing scale multiplier, component padding |
| Material metaphor | Border radius, shadow diffusion, surface texture, edge treatment |

Do not pick HSL values in Phase 3 without completing this translation first.

---

## 2. Color as Narrative

Color is not a lookup table. It tells a story across the interface.

### Color Roles in Composition

**Dominant color** (60% of visible surface): The environment. Usually a surface
color. Sets the emotional baseline. If this is wrong, nothing else matters.

**Secondary color** (30%): Supporting structure. Navigation, cards, secondary
surfaces. Creates rhythm and grouping.

**Accent color** (10%): The punctuation. Brand primary, CTAs, active states,
critical indicators. Scarcity creates impact — if accent is everywhere, it's
just another surface.

Apply the 60/30/10 ratio intentionally. Audit screens against it. Most AI-
generated UIs fail because accent is overused (buttons, badges, links, icons,
borders all in brand primary = visual noise).

### Color Transitions

How color shifts across states and contexts:
- **Hover:** Darken 8–12% lightness (light mode) or lighten 8–12% (dark mode).
  Never shift hue on hover — it breaks spatial consistency.
- **Active/pressed:** Darken 15–20% from default. Brief, not sustained.
- **Focus:** Border/ring in brand primary. Never change the element's fill.
- **Disabled:** Desaturate 60%, reduce opacity to 40%.
- **Selected:** Tint the surface with brand primary at 8–12% opacity.

### Color and Emotional Pacing

Not every screen should feel the same. Map emotional intensity to screen purpose:

- **High intensity** (onboarding, first impression, celebration): More contrast,
  more accent, more visual energy
- **Working state** (daily use, data entry, reading): Quieter palette, less
  accent, more neutral surface
- **Alert/crisis** (errors, warnings, critical decisions): Palette shifts toward
  feedback colors, reduced decorative elements

This is the cinematic equivalent of color grading shifting between scenes.

---

## 3. Compositional Principles

Hierarchy labels (1st/2nd/3rd) define *importance*. Composition defines *how
the eye travels through the frame*.

### Eye Flow Patterns

**F-pattern:** Text-heavy screens. Eye scans top-left → right, drops down,
scans shorter lines. Place primary actions top-left, secondary top-right.

**Z-pattern:** Landing pages, sparse screens. Eye moves: top-left → top-right →
diagonal to bottom-left → bottom-right. Place CTA at the terminal point.

**Center-focal:** Single-purpose screens (login, confirmation, empty state).
Everything orbits the center. Peripheral elements are minimal.

**Gutenberg diagram:** Dense content. Four quadrants — primary optical area
(top-left), strong fallow (top-right), weak fallow (bottom-left), terminal
area (bottom-right). Most important info goes primary optical; CTA goes terminal.

Choose the pattern per screen based on content type, then compose to it.

### Visual Weight and Balance

Every element has visual weight determined by size, color, contrast, detail
density, and isolation (more whitespace = more weight).

**Intentional imbalance:** One element per screen should be deliberately heavier
than everything else — this is your focal point. If everything is balanced, nothing
leads. Symmetry is static. Asymmetry creates movement.

**The "break" rule from the original doc:** One element per screen intentionally
breaks the grid. This is not random — it's the visual accent. It draws the eye
to the single most important thing. Use it for the primary action or the key
piece of information.

### Negative Space as Active Element

Whitespace is not "empty." It is the frame around content that gives it meaning.

- **Breathing room around primary actions** increases perceived importance
- **Tight spacing between related items** creates grouping without borders
- **Asymmetric margins** (more space on one side) create directional pull
- **Vertical rhythm** — consistent spacing creates a beat; breaking it
  creates emphasis (same principle as silence in music)

---

## 4. Micro-Interaction Choreography

Individual animations are Phase 4. Choreography is how multiple animations
coordinate to tell a coherent story.

### Screen Entrance Choreography

When a screen loads or transitions in, elements don't all appear at once.
They arrive in a sequence that guides attention:

1. **Structure first** (0ms): Background, layout skeleton, navigation — the frame
2. **Primary content** (80–120ms): The main thing the user came for
3. **Supporting content** (160–240ms): Secondary information, metadata
4. **Interactive elements** (240–320ms): Buttons, inputs, controls
5. **Decorative elements** (320–400ms): Badges, indicators, subtle details

Stagger: 40–60ms between groups. Max 5 stagger groups per screen.
Total entrance choreography: under 500ms.

### Transition Choreography

When navigating between screens:
- **Exit:** Current screen fades/slides out (150–200ms)
- **Gap:** Brief pause (40–80ms) — prevents jarring overlap
- **Enter:** New screen arrives with entrance choreography

Shared elements (navigation, headers) should NOT exit and re-enter.
They stay anchored while content transitions around them. This creates
spatial continuity.

### State Change Choreography

When a component changes state (e.g., list item expands to detail view):
- The triggering element transforms first
- Related elements reflow around it
- New content fades in within the transformed container
- Never move the trigger element off-screen during its own transition

### The "Opening Shot"

Cinematic productions have an establishing shot. Your app has one too —
the first thing the user sees on initial load. Design this moment deliberately:

- What loads first? (The thing that communicates "you're in the right place")
- What's the visual hook? (The element that makes them want to explore)
- What's the first available action? (Not hidden behind loading states)

If your opening shot is a spinner followed by a dashboard — you've lost
the cinematic opportunity.

---

## 5. Emotional Design and Delight

Aarron Walter's hierarchy: functional → reliable → usable → **pleasurable**.
Most design systems stop at usable. This section covers the top of the pyramid.

### Where to Invest in Delight

Not everywhere. Delight in the wrong place is annoying. Invest at:

- **First impression** (opening shot, onboarding)
- **Completion moments** (task done, goal reached, milestone hit)
- **Recovery from frustration** (error resolved, retry succeeded)
- **Discovery moments** (found a feature, unlocked a capability)

Do NOT invest delight at:
- **During focused work** (data entry, reading, analysis)
- **Error states** (this is not the time to be clever)
- **Repeated high-frequency actions** (delight that fires every click becomes noise)

### Delight Techniques

- **Satisfying motion:** A toggle that snaps with slight overshoot. A card that
  settles into place with a subtle bounce. Physics-based, not decorative.
- **Contextual personality:** Micro-copy that acknowledges the moment ("All caught
  up" on an empty inbox vs. generic "No items")
- **Progressive reward:** Interface that feels richer the more you use it
  (keyboard shortcuts revealed over time, density that adapts to expertise)
- **Unexpected craft:** A loading state that's actually beautiful. An error page
  that makes you smile. A transition that feels like the app is alive.

### The Memorability Test (Phase 9 addition)

After the anti-slop Template Test, run this:

> "If someone used this app for 5 minutes and then described it from memory
> to a colleague, what would they say?"

- If the answer is "a clean app with a sidebar and some cards" — FAIL
- If the answer references a specific visual choice, interaction, or moment — PASS

The goal is not wild creativity. The goal is *one thing worth remembering*.
Document what that thing is. If it doesn't exist — design it.

---

## Quick Reference: Mood → Token Translation Table

| Brand Adjective | Lighting | Temperature | Density | Material | Radius | Motion |
|----------------|----------|-------------|---------|----------|--------|--------|
| Precise | Top ambient | Cool neutral | Balanced | Metal/Glass | sm (4px) | Fast, no spring |
| Warm | Diffuse | Warm organic | Sparse | Paper/Fabric | md–lg (8–12px) | Medium, gentle ease |
| Brutal | Overhead dramatic | Cool clinical | Dense | Concrete/Void | none (0px) | Instant, no animation |
| Playful | Back-lit | Warm split | Sparse | Fabric/Paper | lg–full (12px–pill) | Spring, overshoot |
| Luxurious | Side-lit | Warm neutral | Sparse | Glass/Metal | sm–md (4–8px) | Slow, deliberate ease |
| Technical | Top ambient | Neutral | Dense | Metal/Void | sm (4px) | Fast, mechanical |
| Editorial | Side-lit | Cool warm split | Sparse | Paper | none–sm (0–4px) | Slow crossfade |

This is a starting point, not a formula. Combine and adjust per project.
