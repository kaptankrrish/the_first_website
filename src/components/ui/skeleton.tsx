'use client';

import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'circle' | 'avatar' | 'button';
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const variants = {
    default: 'rounded-lg',
    card: 'rounded-2xl',
    text: 'rounded-md h-4',
    circle: 'rounded-full',
    avatar: 'rounded-full h-10 w-10',
    button: 'rounded-xl h-10',
  };

  return (
    <div
      className={cn(
        'skeleton',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Skeleton variant="text" className="w-32 h-3" />
        <Skeleton variant="text" className="w-64 h-8" />
        <Skeleton variant="text" className="w-96 h-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl glass-strong border-white/[0.06] overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton variant="text" className="w-20 h-3" />
        <Skeleton variant="text" className="w-full h-5" />
        <Skeleton variant="text" className="w-3/4 h-4" />
        <div className="flex gap-2 pt-2">
          <Skeleton variant="button" className="w-20 h-8" />
          <Skeleton variant="button" className="w-16 h-8" />
        </div>
      </div>
    </div>
  );
}

function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass-strong border-white/[0.06]">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4 h-4" />
            <Skeleton variant="text" className="w-1/2 h-3" />
          </div>
          <Skeleton variant="button" className="w-16 h-8 shrink-0" />
        </div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl glass-strong border-white/[0.06] p-5 text-center space-y-2">
            <Skeleton variant="circle" className="w-10 h-10 mx-auto" />
            <Skeleton variant="text" className="w-16 h-6 mx-auto" />
            <Skeleton variant="text" className="w-20 h-3 mx-auto" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl glass-strong border-white/[0.06] p-5 space-y-3">
            <Skeleton variant="text" className="w-32 h-5" />
            <Skeleton className="w-full h-48" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { Skeleton, PageSkeleton, CardSkeleton, ListSkeleton, DashboardSkeleton };
