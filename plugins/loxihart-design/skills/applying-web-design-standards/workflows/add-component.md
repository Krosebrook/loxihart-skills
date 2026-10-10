# Add Component Workflow

## Purpose
Design, implement, test, and document a single component following design system conventions.

---

## Step 1: Design the API

**Before writing any implementation code, define the props interface.**

```tsx
interface ComponentProps {
  // Content
  children: React.ReactNode;

  // Variants (visual styles)
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';

  // States
  disabled?: boolean;
  loading?: boolean;

  // Behavior
  onClick?: () => void;

  // Composition
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Escape hatch
  className?: string;
}
```

**API Review Checklist (validate before building):**
- [ ] All common use cases supported?
- [ ] Prop naming consistent with existing components? (`variant`, `size`, `disabled`)
- [ ] Composition patterns enabled (slots, render props)?
- [ ] Escape hatches provided (`className`, `...rest`)?
- [ ] TypeScript types exported?
- [ ] Sensible defaults set? (variant="primary", size="md")

**API Design Principles:**
1. **Sensible defaults** — works with zero props
2. **Composition over configuration** — prefer `<Button leftIcon={<Icon />}>` over `iconPosition="left"`
3. **Consistent naming** — same props mean the same thing across all components
4. **Escape hatches** — always provide `className` and `...rest` props
5. **Type safety** — export TypeScript types for all props

---

## Step 2: Implement with CVA

Scaffold the component files first:
```bash
node scripts/generate-component.js ComponentName category
```
This creates the standard file structure with boilerplate. Then customize:

Read `references/component-patterns.md` for the full CVA pattern.

**File structure:**
```
ComponentName/
├── ComponentName.tsx        (implementation)
├── ComponentName.test.tsx   (unit + a11y tests)
├── ComponentName.stories.tsx (Storybook stories)
└── index.ts                  (barrel export)
```

**Implementation template:**
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

const componentVariants = cva(
  // Base styles (always applied)
  'base-classes-here',
  {
    variants: {
      variant: {
        primary: 'primary-classes',
        secondary: 'secondary-classes',
      },
      size: {
        sm: 'small-classes',
        md: 'medium-classes',
        lg: 'large-classes',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Component-specific props here
}

export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={componentVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </element>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

---

## Step 3: Write Tests

**Three test layers (all required):**

```tsx
// 1. Unit tests (Jest + Testing Library)
describe('ComponentName', () => {
  it('renders children', () => {
    render(<ComponentName>Content</ComponentName>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies variant classes', () => { /* ... */ });
  it('handles disabled state', () => { /* ... */ });
  it('forwards ref', () => { /* ... */ });
  it('spreads rest props', () => { /* ... */ });
});

// 2. Accessibility tests (jest-axe)
it('has no a11y violations', async () => {
  const { container } = render(<ComponentName>Content</ComponentName>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 3. Visual regression — handled by Storybook + Chromatic (Step 4)
```

**Minimum test coverage: 80%**

---

## Step 4: Create Storybook Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// One story per variant + key states
export const Primary: Story = { args: { variant: 'primary', children: 'Content' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Content' } };
export const Disabled: Story = { args: { disabled: true, children: 'Content' } };
export const Loading: Story = { args: { loading: true, children: 'Content' } };
```

---

## Step 5: Document

**Component documentation template (in Storybook MDX or standalone):**

```markdown
# ComponentName

Brief description of what this component does and when to use it.

## Usage
[Basic code example]

## Variants
[Show each variant with example]

## Sizes
[Show each size with example]

## States
[Disabled, loading, error, etc.]

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|

## Accessibility
- Keyboard: [what keys do what]
- Focus: [focus behavior]
- Screen readers: [semantic element, ARIA attributes]

## Best Practices
✅ DO: [correct usage patterns]
❌ DON'T: [anti-patterns]
```

---

## Step 6: PR Checklist

Before submitting:

- [ ] TypeScript types exported
- [ ] Props documented with JSDoc
- [ ] All variants implemented
- [ ] Accessibility tested (keyboard, screen reader, WCAG 2.2 AA)
- [ ] Unit tests (>80% coverage)
- [ ] Storybook stories (all variants + states)
- [ ] Performance tested (<10KB gzipped per component)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark mode support (if system supports themes)
- [ ] Backwards compatible (no breaking changes to existing components)
