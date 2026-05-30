'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10',
        destructive:
          'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20',
        outline:
          'border border-white/10 bg-transparent hover:bg-white/10 text-white',
        secondary:
          'bg-white/10 text-white hover:bg-white/20 shadow-sm',
        ghost: 'text-white/70 hover:text-white hover:bg-white/10',
        link: 'text-white underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const MotionButton = motion.button as React.ForwardRefExoticComponent<
  HTMLMotionProps<'button'> & React.RefAttributes<HTMLButtonElement>
>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Separate DOM event handlers that conflict with motion props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const { onAnimationStart, onDragStart, onDragEnd, onDrag, ...rest } = props as any;

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <MotionButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileTap={{ scale: 0.97 }}
        {...rest}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
