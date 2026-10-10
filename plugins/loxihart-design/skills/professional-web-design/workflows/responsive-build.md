# Responsive Build Workflow

## Purpose
Build a mobile-first responsive page from scratch, following industry-standard breakpoint patterns and testing practices.

---

## Step 1: Start with Mobile (320px)

**Start from the boilerplate** — copy `assets/boilerplate.html` as your starting point. It includes the viewport meta tag, design tokens, skip link, critical CSS structure, dark mode, and reduced motion support out of the box.

**Base mobile styles — no media queries:**
```css
.container {
  padding: 1rem;
  max-width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
```

Everything stacks vertically on mobile. Single column, full width, adequate touch targets (minimum 44x44px).

---

## Step 2: Add Breakpoints (Scale Up)

```css
/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { padding: 2rem; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1280px;
    margin: 0 auto;
  }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large (1440px+) */
@media (min-width: 1440px) {
  .container { max-width: 1440px; }
}
```

**Container max-widths:**
- Mobile: 100% with 1rem padding
- Tablet: 100% with 2rem padding
- Desktop: 1280px centered
- Large: 1440px centered

---

## Step 3: Responsive Images

```html
<picture>
  <source srcset="hero-large.webp" media="(min-width: 1024px)" type="image/webp">
  <source srcset="hero-medium.webp" media="(min-width: 768px)" type="image/webp">
  <source srcset="hero-small.webp" type="image/webp">
  <img src="hero-small.jpg" alt="Descriptive alt text"
       loading="lazy" width="800" height="600"
       sizes="(min-width: 1024px) 1280px, (min-width: 768px) 768px, 100vw">
</picture>
```

**Rules:**
- Always set `width` and `height` attributes (prevents CLS)
- Use `loading="lazy"` for below-the-fold images
- Serve WebP with JPEG/PNG fallback via `<picture>`
- Use `srcset` + `sizes` for responsive resolution switching

---

## Step 4: Responsive Typography

```css
/* Fluid typography (scales between breakpoints) */
html {
  font-size: clamp(14px, 1vw + 10px, 18px);
}

/* Or step-based scaling */
html { font-size: 16px; }

@media (min-width: 768px) { html { font-size: 17px; } }
@media (min-width: 1024px) { html { font-size: 18px; } }
```

Read `references/typography.md` for full type scale systems.

---

## Step 5: Navigation Pattern

```css
/* Mobile: Hamburger menu */
.nav-menu {
  display: none;
  flex-direction: column;
  position: fixed;
  inset: 0;
  background: var(--color-background);
  z-index: 100;
  padding: 2rem;
}

.nav-menu[data-open="true"] {
  display: flex;
}

/* Desktop: Horizontal nav */
@media (min-width: 1024px) {
  .nav-menu {
    display: flex;
    flex-direction: row;
    position: static;
    background: transparent;
    padding: 0;
    gap: 2rem;
  }

  .hamburger-btn { display: none; }
}
```

---

## Step 6: Testing

**Test at these widths (minimum):**
- 320px (small phone)
- 375px (iPhone SE/standard)
- 414px (larger phones)
- 768px (iPad portrait)
- 1024px (iPad landscape / small laptop)
- 1280px (standard laptop)
- 1440px (large desktop)
- 1920px (full HD)

**Check for:**
- Horizontal scroll (should never appear)
- Text overflow or truncation
- Touch targets under 44px
- Images stretching or distorting
- Hidden content not reachable
- Navigation usable at all sizes

**Tools:**
- Chrome DevTools responsive mode
- BrowserStack for real device testing
- Lighthouse mobile audit
