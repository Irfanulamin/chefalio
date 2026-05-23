import { Skeleton } from "@/components/ui/skeleton";

function ChefCardSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-3 p-5 rounded-xl"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="flex flex-col items-center gap-1.5 w-full">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export default function ChefsLoading() {
  return (
    <div className="page-root">
      <div className="page-content">
        {/* Header skeleton */}
        <div className="pb-6 mb-6" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        {/* Search bar skeleton */}
        <div className="mb-6">
          <Skeleton className="h-9 w-64 rounded-full" />
        </div>
        {/* Grid of 8 skeleton cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ChefCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
