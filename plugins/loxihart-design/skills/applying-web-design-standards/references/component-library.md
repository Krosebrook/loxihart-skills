# Component Patterns Reference

## Table of Contents
- CVA Implementation Pattern
- Testing Strategy
- Bundle Size Optimization
- Accessibility Patterns

---

## CVA Implementation Pattern

Full Button example — use this as the template for all components:

```tsx
// Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-base gap-2',
        lg: 'h-11 px-6 text-lg gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, leftIcon, rightIcon, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={loading || props.disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner className="animate-spin" /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Key patterns to replicate across all components:**
- `forwardRef` for ref forwarding
- CVA for variant management
- Extending native HTML attributes
- `className` escape hatch
- `...rest` spread for unknown props
- `displayName` for DevTools

---

## Testing Strategy

### Unit Tests (Jest + Testing Library)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  // Rendering
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // Variants
  it('applies variant classes', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  // Interaction
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // States
  it('disables when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // Ref forwarding
  it('forwards ref', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

### Accessibility Tests (jest-axe)

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no a11y violations', async () => {
  const { container } = render(<Button>Accessible</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Visual Regression (Chromatic)

Storybook stories are automatically captured by Chromatic for visual diffs. No additional test code needed — every story is a visual test case.

### Integration Tests (Playwright)

```tsx
test('form submission flow', async ({ page }) => {
  await page.goto('/form');
  await page.click('button:has-text("Submit")');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

## Bundle Size Optimization

**Package.json configuration:**
```json
{
  "sideEffects": false,
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/button.js",
      "types": "./dist/button.d.ts"
    }
  }
}
```

**Tree-shakeable imports:**
```tsx
// CORRECT — only Button code is bundled
import { Button } from '@company/design-system/button';

// AVOID — may pull in entire library
import { Button } from '@company/design-system';
```

**Bundle analysis:**
```bash
npm run build -- --analyze
# Target: <100KB gzipped for entire system
# Target: <10KB gzipped per component
```

---

## Accessibility Patterns

**Every component must implement:**

1. **Semantic HTML** — use the correct element (`<button>`, not `<div onClick>`)
2. **Keyboard navigation** — all interactive elements reachable via Tab, activated via Enter/Space
3. **Focus management** — visible focus ring (2px outline), logical tab order
4. **ARIA attributes** — `aria-disabled`, `aria-busy`, `aria-expanded`, `aria-label` where needed
5. **Color contrast** — WCAG 2.2 AA minimum (4.5:1 for text, 3:1 for large text)
6. **Motion** — respect `prefers-reduced-motion`

**Common ARIA patterns by component type:**

| Component | Key ARIA |
|-----------|----------|
| Button | `aria-disabled`, `aria-busy` |
| Modal | `role="dialog"`, `aria-modal`, `aria-labelledby` |
| Dropdown | `role="listbox"`, `aria-expanded`, `aria-activedescendant` |
| Alert | `role="alert"`, `aria-live="polite"` |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` |
| Toggle | `role="switch"`, `aria-checked` |
