## Phase 8.5 — Performance (BUILD mode only)

Skip this phase for SPEC mode. For BUILD mode, performance is a design decision
— not an afterthought bolted on after code review.

For full performance guidance, chain to `applying-web-design-standards` skill. The
requirements below are the minimum bar for any BUILD output from this skill.

**Loading strategy:**
- Lazy-load images and heavy components below the fold (`loading="lazy"`,
  dynamic imports, `React.lazy` / `Suspense` or framework equivalent)
- Critical CSS inlined in `<head>`. Non-critical CSS deferred.
- Code-split by route. No single bundle over 200KB gzipped.
- Fonts: `font-display: swap` + preload the primary weight only.
  Load additional weights on demand.
- Prefetch likely next-navigation targets (`<link rel="prefetch">`)

**Caching strategy:**
- Static assets: immutable hashes in filenames, `Cache-Control: max-age=31536000`
- API responses: cache-aware headers (`ETag`, `If-None-Match`)
- For AI-native products: cache completed AI responses client-side where
  appropriate (same prompt + params = cached result). Never cache streaming
  partial responses.
- Service worker for offline shell (if applicable)

**Render performance:**
- No layout shift after initial paint (reserve space for async content)
- Animations on `transform` + `opacity` only (GPU-composited, no reflow)
- Virtualize long lists (>100 items). Do not render 500 DOM nodes.
- Debounce search inputs (300ms). Throttle scroll handlers (16ms).
- Images: `width` and `height` attributes set, WebP/AVIF with fallback

**Performance budget:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total blocking time: < 200ms
- Initial bundle: < 200KB gzipped (JS + CSS)

Measure after build. If any metric exceeds budget, it's a bug — not a tradeoff.

---
