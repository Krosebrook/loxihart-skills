// Abstrekkt Design System — Button.tsx
// Token-bound, fully typed, WCAG 2.1 AA compliant
// All states: default | hover | active | focus | loading | disabled

import React, { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'base' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-primary-400 text-neutral-0 border border-primary-400',
    'hover:bg-primary-500 hover:border-primary-500',
    'active:bg-primary-600 active:border-primary-600',
    'disabled:bg-neutral-200 disabled:border-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
  ].join(' '),
  secondary: [
    'bg-neutral-100 text-neutral-900 border border-neutral-300',
    'hover:bg-neutral-200 hover:border-neutral-400',
    'active:bg-neutral-300 active:border-neutral-500',
    'disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
  ].join(' '),
  ghost: [
    'bg-transparent text-primary-400 border border-transparent',
    'hover:bg-primary-50 hover:border-primary-200',
    'active:bg-primary-100 active:border-primary-300',
    'disabled:text-neutral-400 disabled:cursor-not-allowed',
    'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-0',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm font-semi',
  base: 'px-4 py-2 text-base font-semi',
  lg: 'px-6 py-3 text-lg font-semi',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'base',
      children,
      isLoading = false,
      icon,
      iconPosition = 'left',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={classNames(
          'inline-flex items-center justify-center gap-2',
          'rounded-md font-body transition-all duration-fast ease-out',
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'opacity-75 cursor-wait',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="inline-flex flex-shrink-0" aria-hidden="true">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="inline-flex flex-shrink-0" aria-hidden="true">{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export type { ButtonProps, ButtonVariant, ButtonSize };
