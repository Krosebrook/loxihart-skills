# Testing and Performance Reference

## Table of Contents
- Unit Testing
- Accessibility Testing
- Performance Optimization
- Styling Options

---

## Unit Testing

Test every component across these dimensions:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MyComponent } from './MyComponent';

expect.extend(toHaveNoViolations);

describe('MyComponent', () => {
  // Rendering
  it('renders with default props', () => {
    render(<MyComponent label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  // Interactions
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MyComponent label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Keyboard
  it('responds to Enter key', () => {
    const handleClick = jest.fn();
    render(<MyComponent label="Click me" onClick={handleClick} />);
    fireEvent.keyDown(screen.getByText('Click me'), { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });

  // States
  it('disables when loading', () => {
    render(<MyComponent label="Click me" loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // Accessibility
  it('has no a11y violations', async () => {
    const { container } = render(<MyComponent label="Click me" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Target: over 80% coverage for every component.**

---

## Accessibility Testing

### Automated (catches ~30-40% of issues)
- `jest-axe` in unit tests
- `@storybook/addon-a11y` in Storybook
- Lighthouse accessibility audit

### Manual (required — automation misses these)
- **Keyboard-only:** Complete all interactions using Tab, Enter, Space, Escape, Arrow keys
- **Screen reader:** Test with VoiceOver (Mac) or NVDA (Windows) on critical paths
- **Zoom:** Verify at 200% and 400% — no horizontal scroll, no hidden content
- **Reduced motion:** Enable `prefers-reduced-motion` and verify animations stop

---

## Performance Optimization

### Memoize Components
```tsx
const ExpensiveComponent = memo(({ data }: Props) => {
  return <div>{/* render data */}</div>;
});
```

### Memoize Computations
```tsx
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);
```

### Memoize Callbacks
```tsx
const handleSave = useCallback(() => {
  onSave(formData);
}, [onSave, formData]);
```

### Virtualize Long Lists
```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} itemCount={items.length} itemSize={50} width="100%">
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

### When to Optimize
- List over 100 items → virtualize
- Computation taking over 1ms → useMemo
- Callback causing child re-renders → useCallback
- Component re-rendering when props haven't changed → memo
- Don't optimize prematurely — profile first with React DevTools Profiler

---

## Styling Options

### Tailwind + CVA (Recommended)
```tsx
import { cva } from 'class-variance-authority';

const button = cva('rounded font-medium transition-colors', {
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
    },
  },
});
```
Zero runtime, type-safe variants, tree-shakeable.

### CSS Modules
```tsx
import styles from './Button.module.css';
<button className={`${styles.button} ${styles['button--primary']}`}>Click</button>
```
Zero runtime, scoped class names, simple mental model.

### Styled Components
```tsx
const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  background: ${p => p.variant === 'primary' ? '#2563eb' : '#e5e7eb'};
`;
```
Runtime CSS-in-JS, dynamic styles, ~12KB overhead.

### JSDoc Documentation
```tsx
/**
 * Button - Primary action trigger
 *
 * @param label - Button text
 * @param onClick - Click handler
 * @param size - 'sm' | 'md' | 'lg'
 *
 * @accessibility
 * - Keyboard: Enter/Space triggers onClick
 * - Screen reader: aria-label announces purpose
 * - Focus: 3px outline indicator
 */
```

---

## CI Environment Configuration

When running component tests in CI, configure via environment variables:
```bash
CI=true                          # Enables CI-specific test behavior
CHROMATIC_PROJECT_TOKEN=chpt_xxx  # For visual regression (via process.env)
NODE_ENV=test                     # Ensures test configuration is loaded
```

Never hardcode tokens in test config — use CI secrets (GitHub Actions, GitLab CI, etc.).
