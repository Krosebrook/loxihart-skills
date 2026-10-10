# Good Examples — Web Design Standards

## Typography
```css
/* Modular scale using Perfect Fourth (1.333) */
:root {
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.333rem;  /* ~21px */
  --text-xl:   1.777rem;  /* ~28px */
  --text-2xl:  2.369rem;  /* ~38px */
  --text-3xl:  3.157rem;  /* ~51px */
}
```

## Color (HSL with consistent lightness steps)
```css
:root {
  --color-primary-900: hsl(250, 60%, 10%);
  --color-primary-700: hsl(250, 60%, 30%);
  --color-primary-500: hsl(250, 60%, 50%); /* base */
  --color-primary-300: hsl(250, 60%, 70%);
  --color-primary-100: hsl(250, 60%, 90%);
}
```

## Design Token Three-Tier Architecture
```json
{
  "primitive": { "purple-500": "#7c3aed" },
  "semantic":  { "color-brand-primary": "{primitive.purple-500}" },
  "component": { "button-bg-default": "{semantic.color-brand-primary}" }
}
```

## 8-Point Grid Spacing
```css
:root {
  --space-1:  8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-6:  48px;
  --space-8:  64px;
  --space-12: 96px;
}
```

## Mobile-First Responsive
```css
/* Base: 320px */
.container { padding: var(--space-2); }

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container { padding: var(--space-4); }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container { padding: var(--space-6); max-width: 1200px; margin: 0 auto; }
}
```
