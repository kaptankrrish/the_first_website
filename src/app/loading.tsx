import { GridSkeleton } from "@/components/ui/loading-skeleton";

export default function GlobalLoading() {
  return (
    <div className="w-full animate-fade-in space-y-6">
      <div className="flex flex-col gap-4">
        <div className="h-12 w-48 skeleton rounded-xl"></div>
        <div className="h-4 w-96 skeleton rounded"></div>
      </div>
      <GridSkeleton count={6} />
    </div>
  );
}
