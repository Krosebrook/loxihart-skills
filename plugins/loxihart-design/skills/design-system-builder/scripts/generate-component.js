#!/usr/bin/env node
/**
 * generate-component.js — Scaffold a new design system component
 *
 * Creates the standard file structure for a new component:
 *   ComponentName/
 *   ├── ComponentName.tsx
 *   ├── ComponentName.test.tsx
 *   ├── ComponentName.stories.tsx
 *   └── index.ts
 *
 * Usage:
 *   node scripts/generate-component.js Button primitives
 *   node scripts/generate-component.js SearchInput components
 *   node scripts/generate-component.js DataTable patterns
 *
 * Args:
 *   1: ComponentName (PascalCase)
 *   2: Category (primitives | components | patterns | layouts)
 */

const fs = require('fs');
const path = require('path');

const componentName = process.argv[2];
const category = process.argv[3] || 'components';

if (!componentName) {
  console.error('Usage: node generate-component.js <ComponentName> [category]');
  console.error('  Categories: primitives, components, patterns, layouts');
  process.exit(1);
}

// Validate PascalCase
if (!/^[A-Z][a-zA-Z0-9]+$/.test(componentName)) {
  console.error(`❌ Component name must be PascalCase (e.g., Button, SearchInput). Got: ${componentName}`);
  process.exit(1);
}

const validCategories = ['primitives', 'components', 'patterns', 'layouts'];
if (!validCategories.includes(category)) {
  console.error(`❌ Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}`);
  process.exit(1);
}

const kebab = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const dir = path.join(category, componentName);

if (fs.existsSync(dir)) {
  console.error(`❌ Directory already exists: ${dir}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

// Component implementation
const component = `import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const ${kebab}Variants = cva(
  // Base styles
  '',
  {
    variants: {
      variant: {
        primary: '',
        secondary: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ${componentName}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${kebab}Variants> {
  /** Add component-specific props here */
}

/**
 * ${componentName} — TODO: Brief description
 *
 * @example
 * \`\`\`tsx
 * <${componentName} variant="primary" size="md">
 *   Content
 * </${componentName}>
 * \`\`\`
 */
export const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={${kebab}Variants({ variant, size, className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;

// Unit tests
const test = `import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ${componentName} } from './${componentName}';

expect.extend(toHaveNoViolations);

describe('${componentName}', () => {
  it('renders children', () => {
    render(<${componentName}>Content</${componentName}>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(
      <${componentName} variant="primary">Content</${componentName}>
    );
    expect(container.firstChild).toBeDefined();
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<${componentName} ref={ref}>Ref</${componentName}>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('spreads rest props', () => {
    render(<${componentName} data-testid="custom">Content</${componentName}>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<${componentName}>Accessible</${componentName}>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
`;

// Storybook stories
const stories = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: '${category.charAt(0).toUpperCase() + category.slice(1)}/${componentName}',
  component: ${componentName},
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    children: '${componentName} content',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};
`;

// Barrel export
const index = `export { ${componentName} } from './${componentName}';
export type { ${componentName}Props } from './${componentName}';
`;

// Write files
fs.writeFileSync(path.join(dir, `${componentName}.tsx`), component);
fs.writeFileSync(path.join(dir, `${componentName}.test.tsx`), test);
fs.writeFileSync(path.join(dir, `${componentName}.stories.tsx`), stories);
fs.writeFileSync(path.join(dir, 'index.ts'), index);

console.log(`✅ Component scaffolded: ${dir}/`);
console.log(`   ${componentName}.tsx       (implementation)`);
console.log(`   ${componentName}.test.tsx  (unit + a11y tests)`);
console.log(`   ${componentName}.stories.tsx (Storybook)`);
console.log(`   index.ts               (barrel export)`);
console.log('');
console.log('Next steps:');
console.log('  1. Fill in CVA variant classes');
console.log('  2. Add component-specific props');
console.log('  3. Implement accessibility (ARIA, keyboard)');
console.log('  4. Run tests: npm test');
console.log('  5. Preview: npm run storybook');
