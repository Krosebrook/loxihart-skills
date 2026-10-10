# Anti-Patterns — Elite UI Design

## Experience Anti-Patterns
- No experience thesis — designing features without a unifying point of view
- "Clean and modern" as a design direction — means nothing, produces nothing memorable
- Designing for yourself instead of the stated primary user persona
- Feature-first design (what it does) instead of experience-first (how it feels)

## Visual Anti-Patterns
- Inter or Space Grotesk as display font without justification
- Purple gradient on white background — category default
- Flat solid backgrounds — always atmospheric
- Card grid as primary layout — default dashboard smell
- Shallow glassmorphism as the entire aesthetic — 2021 trend, now a slop signal
- Everything centered — destroys visual tension
- Accent color >10% of visible surface — dilutes emphasis

## Interaction Anti-Patterns
- Hover as the only discovery affordance — invisible on touch
- Tooltip as only label — not accessible
- Spinner with no skeleton or optimistic UI — low effort loading state
- No empty state design — blank page is a broken experience
- No error state — silent failures destroy trust

## Component Anti-Patterns
- Components that own their own margins — breaks composition
- No documented states: hover, focus, active, disabled, error, loading
- Hardcoded sizes that break at unexpected viewports

## BUILD Mode Anti-Patterns
- Animating width, height, top, left — always use transform/opacity
- No explicit image dimensions — causes layout shift
- Skipping Phase 8.5 performance checks in BUILD mode
