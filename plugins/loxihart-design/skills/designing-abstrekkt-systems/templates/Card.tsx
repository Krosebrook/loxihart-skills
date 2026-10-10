// Abstrekkt Design System — Card.tsx
import React, { ReactNode } from 'react';
import classNames from 'classnames';

type CardVariant = 'elevated' | 'outlined' | 'flat';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-surface-elevated border border-neutral-200 shadow-base hover:shadow-md',
  outlined: 'bg-surface-background border-2 border-neutral-300 hover:border-primary-400',
  flat: 'bg-neutral-50 border border-neutral-200 hover:bg-neutral-100',
};

function Card({ variant = 'elevated', interactive = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-lg p-6 transition-all duration-normal ease-out',
        variantClasses[variant],
        interactive && 'cursor-pointer active:scale-98',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
export type { CardProps, CardVariant };
