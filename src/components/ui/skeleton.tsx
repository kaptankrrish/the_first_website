'use client';

import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-r from-white/[0.03] via-white/[0.06] to-white/[0.03] animate-shimmer',
        className
      )}
      style={style}
    />
  );
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-2xl glass-strong p-5 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass-strong">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6, className }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('flex flex-col items-center space-y-6 py-16', className)}>
      <div className="flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
      <Skeleton className="h-16 w-96 max-w-full" />
      <Skeleton className="h-6 w-64 max-w-full" />
      <div className="flex gap-3">
        <Skeleton className="h-12 w-40 rounded-2xl" />
        <Skeleton className="h-12 w-36 rounded-2xl" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${30 + Math.random() * 70}%` }} />
        ))}
      </div>
    </div>
  );
}
