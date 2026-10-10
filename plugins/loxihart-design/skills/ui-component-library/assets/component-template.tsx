/**
 * ComponentName — TODO: Brief description of what this component does
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md">
 *   Content
 * </ComponentName>
 * ```
 *
 * @accessibility
 * - Keyboard: TODO: list key interactions
 * - Screen reader: TODO: describe announcements
 * - Focus: Visible focus ring via :focus-visible
 */

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// --- Variants ---
const componentVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'bg-transparent hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm gap-1.5 rounded',
        md: 'h-10 px-4 text-base gap-2 rounded-md',
        lg: 'h-12 px-6 text-lg gap-2.5 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// --- Props ---
export interface ComponentNameProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentVariants> {
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Icon displayed before children */
  leftIcon?: React.ReactNode;
  /** Icon displayed after children */
  rightIcon?: React.ReactNode;
}

// --- Component ---
export const ComponentName = forwardRef<HTMLButtonElement, ComponentNameProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={componentVariants({ variant, size, className })}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

ComponentName.displayName = 'ComponentName';
