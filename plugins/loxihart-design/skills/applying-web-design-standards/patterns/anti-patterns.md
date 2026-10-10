# Anti-Patterns — Web Design Standards

## Typography Anti-Patterns
- Using Inter, Roboto, Arial as primary display font — generic, applies to 40% of AI-generated UIs
- System font stack as intentional choice without justification
- More than 3 type sizes on a single screen without hierarchy reasoning
- Body text below 16px on mobile
- Line height below 1.5 for body text

## Color Anti-Patterns
- Distributing accent color evenly — dilutes emphasis
- Pure #ffffff or #000000 backgrounds — always use off-white/near-black
- Purple gradient on white — category default, instantly forgettable
- Not testing contrast with actual rendered fonts (font rendering affects contrast)
- Building light mode only — dark mode is expected

## Grid Anti-Patterns
- Mixing spacing values that aren't multiples of 8 without justification
- Centering everything — eliminates visual tension
- Treating padding and margin as separate concerns at the token level
- Ignoring negative space — whitespace is structure, not emptiness

## Design Token Anti-Patterns
- Using primitive tokens (raw hex/px values) directly in components
- One-tier token system — semantic aliases are non-negotiable
- Component-specific tokens that can't be themed
- No dark mode token set
- Updating token values without versioning

## Component Anti-Patterns
- Hardcoded hex values in component styles
- Components that own layout (use composition instead)
- Prop explosion instead of variant system
- No documented component states (hover, focus, disabled, error, loading)
- Skipping Storybook stories for edge case states

## Responsive Anti-Patterns
- Desktop-first media queries (always mobile-first)
- Fixed pixel widths on containers
- Overflow hidden as a responsive fix instead of proper layout
- Touch targets below 44x44px on mobile

## Performance Anti-Patterns
- Animating layout-triggering properties (width, height, top, left) — use transform
- No explicit width/height on images — causes CLS
- Loading all fonts synchronously — use font-display: swap
- Unoptimized images above the fold
