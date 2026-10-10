# Design Tokens Reference

## CSS Custom Properties System

```css
:root {
  /* Color Palette */
  --blue-50:  #eff6ff;
  --blue-100: #dbeafe;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-900: #1e3a8a;

  /* Semantic Colors (map to palette) */
  --color-primary:       var(--blue-500);
  --color-primary-hover: var(--blue-600);
  --color-secondary:     #64748b;
  --color-success:       #10b981;
  --color-danger:        #ef4444;
  --color-warning:       #f59e0b;
  --color-background:    #ffffff;
  --color-surface:       var(--blue-50);
  --color-text:          #111827;
  --color-text-muted:    #6b7280;
  --color-border:        #e5e7eb;

  /* Spacing (8px base) */
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* Border Radius */
  --radius-sm:   0.125rem;
  --radius-md:   0.375rem;
  --radius-lg:   0.5rem;
  --radius-xl:   0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}
```

## Usage in Components

```css
/* Components consume tokens, never raw values */
.button {
  background: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.button:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}
```

## Dark Mode

Swap semantic tokens only — components don't change:

```css
[data-theme="dark"] {
  --color-primary:       #3b82f6;
  --color-background:    #111827;
  --color-surface:       #1f2937;
  --color-text:          #f9fafb;
  --color-text-muted:    #9ca3af;
  --color-border:        #374151;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4);
}

/* Or use system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #111827;
    --color-surface:    #1f2937;
    --color-text:       #f9fafb;
  }
}
```

## File Organization

```
tokens/
├── colors.css      (palette + semantic colors)
├── spacing.css     (spacing scale)
├── typography.css  (font sizes, weights, line heights)
├── shadows.css     (elevation system)
├── borders.css     (radius, widths)
└── transitions.css (duration, easing)
```

Import all tokens in a single entry point:
```css
@import 'tokens/colors.css';
@import 'tokens/spacing.css';
@import 'tokens/typography.css';
@import 'tokens/shadows.css';
@import 'tokens/borders.css';
@import 'tokens/transitions.css';
```
