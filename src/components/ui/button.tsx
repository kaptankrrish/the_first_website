'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-white to-white/90 text-black hover:from-white hover:to-white shadow-lg shadow-white/10 hover:shadow-white/20',
        destructive:
          'bg-gradient-to-b from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/20',
        outline:
          'border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 text-white',
        secondary:
          'bg-white/[0.05] text-white border border-white/[0.06] hover:bg-white/[0.1] hover:border-white/10 shadow-sm',
        ghost: 'text-white/70 hover:text-white hover:bg-white/[0.06]',
        link: 'text-white underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base rounded-2xl',
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
