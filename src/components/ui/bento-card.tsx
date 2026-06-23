'use client';
import * as React from 'react';
import { cn } from '@/utils/cn';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface BentoCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glow' | 'aurora' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const variantClasses: Record<NonNullable<BentoCardProps['variant']>, string> = {
  default: 'glass hover-lift',
  glow: 'glass-strong glow-mixed hover-glow',
  aurora: 'glass-strong overflow-hidden relative',
  gradient: 'bg-gradient-to-br from-blue-500/8 via-purple-500/8 to-pink-500/4 border border-white/5 hover-lift',
};

const sizeClasses: Record<NonNullable<BentoCardProps['size']>, string> = {
  sm: 'rounded-xl p-4',
  md: 'rounded-2xl p-5',
  lg: 'rounded-3xl p-6',
};

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, variant = 'default', size = 'md', interactive = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -3 } : undefined}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className={cn(
          'relative transition-all duration-300',
          variantClasses[variant],
          sizeClasses[size],
          interactive && 'cursor-pointer shimmer-border',
          className
        )}
        {...props}
      >
        {variant === 'aurora' && (
          <>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          </>
        )}
        <div className="relative">{children as React.ReactNode}</div>
      </motion.div>
    );
  }
);
BentoCard.displayName = 'BentoCard';
