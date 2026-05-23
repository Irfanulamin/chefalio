import { Skeleton } from "@/components/ui/skeleton";

function CookbookCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      <Skeleton className="w-full" style={{ aspectRatio: "3/4" }} />
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full shrink-0" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-9 w-full rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function CookbooksLoading() {
  return (
    <div className="page-root">
      <div className="page-content">
        {/* Header skeleton */}
        <div className="pb-6 mb-6" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-6">
          <Skeleton className="h-9 w-56 rounded-full" />
          <Skeleton className="h-9 w-44 rounded-full" />
        </div>
        {/* Grid of 6 skeleton cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CookbookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
