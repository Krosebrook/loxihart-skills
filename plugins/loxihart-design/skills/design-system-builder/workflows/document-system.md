# Document System Workflow

## Purpose
Set up comprehensive documentation for an existing design system using Storybook, component docs, and getting-started guides.

---

## Step 1: Set Up Storybook

```bash
npx storybook@latest init
npm run storybook
```

**Configure for design system use:**
- Enable `autodocs` tag for automatic prop documentation
- Install `@storybook/addon-a11y` for accessibility checks
- Install `@storybook/addon-viewport` for responsive testing
- Copy `assets/storybook-theme.js` to `.storybook/theme.js` and customize brand colors/name
- Import the theme in `.storybook/manager.js`

---

## Step 2: Component Documentation Template

Every component needs documentation covering these sections. Use MDX format in Storybook or standalone markdown.

```markdown
# ComponentName

Brief description — what it does, when to use it, what problem it solves.

## Usage

### Basic
[Minimal working example]

### With Variants
[Show each visual variant]

### With Sizes
[Show each size option]

### Composition
[Show component with slots, icons, or nested components]

## Variants

### Primary
[Example + when to use]

### Secondary
[Example + when to use]

### Ghost
[Example + when to use]

### Danger
[Example + when to use]

## Sizes

[Small, Medium, Large examples side by side]

## States

### Disabled
[Example + behavior notes]

### Loading
[Example + behavior notes]

### Error
[Example + how errors are communicated]

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Component size |
| disabled | boolean | false | Disable interaction |
| className | string | - | Additional CSS classes |

## Accessibility

- **Keyboard:** [Which keys trigger actions]
- **Focus:** [Focus ring style, tab order]
- **Screen readers:** [Semantic element used, ARIA attributes]
- **States:** [How disabled/loading states are communicated]

## Best Practices

✅ DO:
- [Correct usage pattern 1]
- [Correct usage pattern 2]

❌ DON'T:
- [Anti-pattern 1]
- [Anti-pattern 2]

## Related Components

- [Link to similar or complementary components]
```

---

## Step 3: Storybook Stories Template

```tsx
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',  // e.g., 'Primitives/Button'
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Default
export const Default: Story = {
  args: { children: 'Content' },
};

// Each variant
export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

// States
export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Loading' },
};

// Composition
export const WithIcons: Story = {
  args: {
    leftIcon: '<IconPlus />',
    children: 'Add Item',
  },
};

// Real-world usage
export const InForm: Story = {
  render: () => (
    <form>
      <ComponentName variant="primary" type="submit">
        Submit Form
      </ComponentName>
    </form>
  ),
};
```

**Story naming conventions:**
- `Primitives/Button` for atoms
- `Components/Card` for molecules
- `Patterns/Modal` for organisms
- `Layouts/AppShell` for templates

---

## Step 4: Getting Started Guide

Create `docs/getting-started.md`:

```markdown
# Getting Started with [Design System Name]

## Installation

npm install @company/design-system

## Setup

### 1. Import CSS (if using Tailwind)
[Tailwind config instructions]

### 2. Import Components
import { Button } from '@company/design-system/button';

### 3. Use Components
<Button variant="primary" size="md">Click Me</Button>

## Token Usage

### CSS Custom Properties
Use tokens as CSS variables:
color: var(--color-primary);
padding: var(--spacing-4);

### TypeScript Constants
import { colors, spacing } from '@company/design-system/tokens';

## Contributing
See [Contributing Guide](./contributing.md)

## Support
- Slack: #design-system
- GitHub Issues: [link]
```

---

## Step 5: Audit Existing Components

If documenting an existing system, audit what's already built:

1. List all components with their current documentation status
2. Identify undocumented or under-documented components
3. Prioritize by usage frequency (most-used components first)
4. Create a tracking table:

| Component | Has Stories | Has Docs | Has Tests | A11y Checked | Priority |
|-----------|------------|----------|-----------|-------------|----------|
| Button | ✅ | ❌ | ✅ | ❌ | HIGH |
| Input | ❌ | ❌ | ❌ | ❌ | HIGH |
| Card | ✅ | ✅ | ❌ | ❌ | MEDIUM |

Work through the table top-to-bottom using the templates above.
