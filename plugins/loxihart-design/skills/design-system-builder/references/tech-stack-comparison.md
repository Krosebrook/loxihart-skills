# Tech Stack Comparison

## CSS/JS Framework Options for Design Systems

| Stack | Runtime Cost | Type Safety | DX | Bundle Size | Theming | Best For |
|-------|-------------|-------------|-----|-------------|---------|----------|
| **Tailwind + CVA** | Zero | Via TS props | Fast iteration | Small | Via CSS vars | New systems, rapid dev |
| Styled Components | ~12KB | Via TS props | Good DX | Medium | Runtime themes | Dynamic runtime theming |
| CSS Modules | Zero | Manual | Simple | Small | Via CSS vars | Simplicity, SSR perf |
| Vanilla Extract | Zero | Built-in | Complex setup | Small | Type-safe themes | Max type safety + perf |

---

## Tailwind + CVA (Recommended Default)

**Pros:**
- Zero runtime CSS — styles are compiled at build time
- CVA (class-variance-authority) provides type-safe variant management
- Excellent tree-shaking — unused styles are purged
- Huge ecosystem and community support
- Fast iteration — utility classes compose instantly

**Cons:**
- Long class strings can reduce readability (mitigated by CVA)
- Requires Tailwind config for custom tokens
- Learning curve for utility-first approach

**Best when:** Starting a new system, need rapid development, want smallest bundle, team is comfortable with utility CSS.

---

## Styled Components

**Pros:**
- CSS-in-JS with full JavaScript power
- Dynamic styles based on props at runtime
- Automatic critical CSS extraction
- Scoped styles by default

**Cons:**
- ~12KB runtime overhead
- Larger bundle size than zero-runtime options
- SSR complexity (requires server-side style extraction)
- Performance hit on frequent re-renders with dynamic styles

**Best when:** Need runtime theme switching (e.g., user-selectable themes), heavy dynamic styling, existing styled-components codebase.

---

## CSS Modules

**Pros:**
- Zero runtime — styles compile to static CSS
- Scoped class names prevent collisions
- Simple mental model — write regular CSS
- Excellent SSR performance

**Cons:**
- No built-in theming mechanism
- Manual class name composition for variants
- No type safety for style values
- Harder to share values between CSS and JS

**Best when:** Need simplicity, SSR performance is critical, team prefers traditional CSS, small component library.

---

## Vanilla Extract

**Pros:**
- Zero runtime — styles compile at build time
- Full TypeScript integration — type-safe themes and tokens
- Sprinkles API for utility-like usage
- Recipes API for variant management (similar to CVA)

**Cons:**
- Complex build setup (requires bundler plugin)
- Steeper learning curve
- Smaller community than Tailwind or Styled Components
- All styles must be in `.css.ts` files

**Best when:** Type safety is paramount, need zero runtime cost, team is very TypeScript-oriented, enterprise systems.

---

## Decision Framework

```
Do you need runtime theme switching?
├── YES → Styled Components (or Vanilla Extract with theme provider)
└── NO → Continue

Is TypeScript type safety for styles critical?
├── YES → Vanilla Extract
└── NO → Continue

Does the team prefer utility-first CSS?
├── YES → Tailwind + CVA
└── NO → CSS Modules
```

**Default recommendation: Tailwind + CVA** — best balance of developer experience, performance, and ecosystem support for most new design systems in 2025+.
