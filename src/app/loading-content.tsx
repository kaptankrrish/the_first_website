import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingContent({ variant = 'page' }: { variant?: 'page' | 'dashboard' | 'list' | 'grid' }) {
  if (variant === 'dashboard') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-3">
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-72 h-8" />
          <Skeleton className="w-96 h-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass-strong border-white/[0.06] p-5 space-y-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-16 h-6" />
              <Skeleton className="w-20 h-3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass-strong border-white/[0.06] p-5 space-y-3">
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-full h-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-3">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-96 h-4" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass-strong border-white/[0.06]">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-3">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-96 h-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass-strong border-white/[0.06] overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <Skeleton className="w-32 h-3" />
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-96 h-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl glass-strong border-white/[0.06] overflow-hidden">
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
