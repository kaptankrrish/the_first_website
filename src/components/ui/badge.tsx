'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-white text-black shadow',
        secondary:
          'border-transparent bg-white/10 text-white',
        destructive:
          'border-transparent bg-red-600 text-white shadow',
        outline:
          'border-white/20 text-white',
        success:
          'border-transparent bg-emerald-600 text-white shadow',
        warning:
          'border-transparent bg-amber-600 text-white shadow',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
