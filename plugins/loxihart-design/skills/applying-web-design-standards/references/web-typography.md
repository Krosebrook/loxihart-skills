# Typography Reference

## Type Scale (Major Third — 1.250 ratio)

```css
:root {
  --font-size-xs:  0.64rem;   /* 10.24px */
  --font-size-sm:  0.8rem;    /* 12.8px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg:  1.25rem;   /* 20px */
  --font-size-xl:  1.563rem;  /* 25px */
  --font-size-2xl: 1.953rem;  /* 31.25px */
  --font-size-3xl: 2.441rem;  /* 39px */
  --font-size-4xl: 3.052rem;  /* 48.83px */

  --line-height-tight:   1.25;
  --line-height-normal:  1.5;
  --line-height-relaxed: 1.75;

  --font-sans:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;

  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
}
```

## Heading Styles

```css
.heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

.heading-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.01em;
}

.heading-3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--line-height-tight);
}

.body-text {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  max-width: 65ch;
}

.small-text {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}
```

## Readability Rules

- **Line length:** 45–75 characters optimal (use `max-width: 65ch`)
- **Line height:** 1.5–1.75 for body, 1.25 for headings
- **Minimum body size:** 16px on all devices
- **Letter spacing:** Tighten for large text (-0.02em), default for body
- **Paragraph spacing:** Use `margin-bottom` equal to one line height
- **Contrast:** 4.5:1 minimum for body text (WCAG AA)

## Fluid Typography

Scale smoothly between breakpoints using `clamp()`:

```css
html {
  /* Min 14px, preferred 1vw + 10px, max 18px */
  font-size: clamp(0.875rem, 1vw + 0.625rem, 1.125rem);
}

h1 {
  /* Min 28px, scales with viewport, max 48px */
  font-size: clamp(1.75rem, 4vw + 0.5rem, 3rem);
}
```

## Font Stack Recommendations

**Sans-serif (general purpose):**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

**Serif (editorial, long-form):**
```css
font-family: Georgia, 'Times New Roman', Times, serif;
```

**Monospace (code, data):**
```css
font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
```

System font stacks eliminate font loading entirely — fastest possible text rendering.
