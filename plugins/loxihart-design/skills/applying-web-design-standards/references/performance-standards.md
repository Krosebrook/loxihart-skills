# Performance Reference

## Table of Contents
- Core Web Vitals
- Critical CSS
- Image Optimization
- Font Loading
- JavaScript Loading

---

## Core Web Vitals

| Metric | Target | What It Measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | under 2.5s | How fast the main content loads |
| INP (Interaction to Next Paint) | under 200ms | How fast the page responds to first interaction |
| CLS (Cumulative Layout Shift) | under 0.1 | How much the layout shifts during load |

---

## Critical CSS

Inline above-the-fold styles directly in `<head>` to eliminate render-blocking:

```html
<head>
  <!-- Critical CSS inline -->
  <style>
    .hero { /* above-fold styles */ }
    .nav  { /* above-fold styles */ }
  </style>

  <!-- Non-critical CSS deferred -->
  <link rel="preload" href="styles.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

Target: critical CSS under 14KB gzipped (fits in first TCP round-trip).

---

## Image Optimization

### Format Selection
| Format | Use For |
|--------|---------|
| WebP | Photos, complex graphics (30% smaller than JPEG) |
| AVIF | Photos (50% smaller than JPEG, limited browser support) |
| SVG | Icons, logos, simple illustrations |
| PNG | Screenshots, images requiring transparency |

### Responsive Images
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description"
       loading="lazy" width="800" height="600"
       srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
       sizes="(min-width: 1024px) 50vw, 100vw">
</picture>
```

### Rules
- Always set `width` and `height` (prevents CLS)
- Use `loading="lazy"` for below-the-fold images
- Compress: target under 100KB per image
- Serve via CDN (Cloudflare, Cloudinary)
- Use `srcset` + `sizes` for resolution switching

---

## Font Loading

```css
@font-face {
  font-family: 'Custom Font';
  src: url('font.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0000-00FF; /* Latin subset only */
}
```

**Strategy:**
1. Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)
2. Preload critical fonts: `<link rel="preload" href="font.woff2" as="font" crossorigin>`
3. Subset fonts to only required characters
4. Prefer WOFF2 format (best compression)
5. Consider system font stack to eliminate font loading entirely:
   ```css
   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
   ```

---

## JavaScript Loading

```html
<!-- Defer: executes after HTML parsing, maintains order -->
<script src="main.js" defer></script>

<!-- Async: executes as soon as downloaded, no order guarantee -->
<script src="analytics.js" async></script>

<!-- Preconnect to third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://analytics.example.com">
```

**Rules:**
- `defer` for app scripts (order matters)
- `async` for independent scripts (analytics, tracking)
- Never use blocking `<script>` in `<head>` without `defer`/`async`
- Audit third-party scripts — each one adds latency
- Code-split: load only what the current page needs
