'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder:text-white/40 backdrop-blur-xl transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white hover:border-white/20 focus-visible:outline-none focus-visible:border-blue-400/40 focus-visible:ring-2 focus-visible:ring-blue-400/20 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
