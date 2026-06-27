export function ArticleSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-4 card-premium animate-pulse">
      <div className="h-48 w-full bg-surface-2 rounded-xl skeleton"></div>
      <div className="h-6 w-3/4 bg-surface-2 rounded skeleton"></div>
      <div className="h-4 w-1/2 bg-surface-2 rounded skeleton"></div>
      <div className="h-4 w-full bg-surface-2 rounded skeleton"></div>
      <div className="h-4 w-full bg-surface-2 rounded skeleton"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl card-premium flex flex-col gap-3">
      <div className="h-10 w-10 rounded-full bg-surface-2 skeleton"></div>
      <div className="h-5 w-2/3 bg-surface-2 rounded skeleton"></div>
      <div className="h-4 w-full bg-surface-2 rounded skeleton"></div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
