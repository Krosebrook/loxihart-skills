# Pre-Launch Audit Workflow

## Purpose
Comprehensive checklist to validate a website before deploying to production. Covers performance, accessibility, SEO, cross-browser compatibility, and security.

---

## Performance Audit

**Run automated check first:**
```bash
node scripts/lighthouse-audit.js https://your-site.com
node scripts/lighthouse-audit.js https://your-site.com --mobile
```

### Core Web Vitals (must pass)
- [ ] **LCP (Largest Contentful Paint):** under 2.5 seconds
- [ ] **INP (Interaction to Next Paint): under 200ms (FID deprecated March 2024)
- [ ] **CLS (Cumulative Layout Shift):** under 0.1

### Asset Optimization
- [ ] Images: WebP format with JPEG/PNG fallback
- [ ] Images: Lazy-loaded below the fold (`loading="lazy"`)
- [ ] Images: Explicit `width` and `height` attributes set
- [ ] Images: Compressed (target under 100KB each)
- [ ] Images: Served via CDN
- [ ] Fonts: `font-display: swap` set
- [ ] Fonts: Subsetted to required character ranges
- [ ] Fonts: Preloaded critical fonts (`<link rel="preload">`)

### Loading Strategy
- [ ] Critical CSS inlined in `<head>` (under 14KB gzipped)
- [ ] Non-critical CSS deferred (`preload` + `onload` pattern)
- [ ] JavaScript deferred (`defer`) or async (`async`)
- [ ] Third-party scripts audited and minimized
- [ ] Preconnect to required origins (`<link rel="preconnect">`)

### Targets
- [ ] Lighthouse Performance score: 90+
- [ ] Total page weight: under 1.5MB (first load)
- [ ] Time to Interactive: under 3.5 seconds

---

## Accessibility Audit (WCAG 2.2 AA)

**Run automated check first:**
```bash
node scripts/a11y-audit.js https://your-site.com
python scripts/contrast-checker.py "#333333" "#ffffff"
```

### Structure
- [ ] Semantic HTML used (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- [ ] Heading hierarchy correct (one `<h1>`, logical `<h2>`–`<h6>` nesting)
- [ ] Skip link present and functional
- [ ] Language attribute set (`<html lang="en">`)
- [ ] Page title descriptive and unique per page

### Interaction
- [ ] All interactive elements keyboard-accessible
- [ ] Visible focus indicators on all focusable elements
- [ ] Focus order matches visual order
- [ ] No keyboard traps
- [ ] Touch targets minimum 44x44px

### Content
- [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text
- [ ] Information not conveyed by color alone
- [ ] Form inputs have visible labels
- [ ] Error messages are descriptive and associated with fields

### Dynamic Content
- [ ] ARIA live regions for dynamically updated content
- [ ] Modals trap focus and return focus on close
- [ ] Loading states communicated to screen readers

### Testing
- [ ] axe DevTools: 0 critical/serious violations
- [ ] Keyboard-only navigation: complete all workflows
- [ ] Screen reader test (VoiceOver or NVDA): critical paths

---

## SEO Audit

- [ ] Meta title: under 60 characters, unique per page
- [ ] Meta description: under 160 characters, unique per page
- [ ] Canonical URL set
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD) for relevant content types
- [ ] XML sitemap generated and submitted
- [ ] robots.txt configured
- [ ] All pages reachable within 3 clicks from homepage
- [ ] No broken links (run crawler)
- [ ] HTTPS enforced (HTTP redirects to HTTPS)

---

## Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)

**Check for:**
- Layout rendering differences
- Font rendering differences
- CSS feature support (use `@supports` for progressive enhancement)
- JavaScript errors in console
- Touch interaction on mobile browsers

---

## Security Basics

- [ ] HTTPS enforced
- [ ] Content Security Policy (CSP) header set
- [ ] X-Frame-Options header set
- [ ] No sensitive data in client-side code or URLs
- [ ] Forms use CSRF protection
- [ ] Input sanitization on all user inputs
- [ ] API keys and tokens stored in environment variables (never in client-side code)

**Environment-specific configuration:**
```bash
# Use process.env for server-side config, never expose in client bundle
ANALYTICS_ID=UA-xxxxx          # via process.env.ANALYTICS_ID
API_BASE_URL=https://api.example.com
```

---

## Final Checks

- [ ] 404 page designed and functional
- [ ] Favicon set (multiple sizes)
- [ ] No console errors or warnings
- [ ] Analytics/tracking installed and verified
- [ ] Forms tested end-to-end
- [ ] Print stylesheet (if applicable)
- [ ] RSS feed (if content site)
