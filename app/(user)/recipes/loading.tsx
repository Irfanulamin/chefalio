import { Skeleton } from "@/components/ui/skeleton";

function RecipeCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      <Skeleton className="w-full" style={{ aspectRatio: "4/3" }} />
      <div className="p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full shrink-0" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function RecipesLoading() {
  return (
    <div className="page-root">
      <div className="page-content">
        {/* Header skeleton */}
        <div className="pb-6 mb-6" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-6">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
        {/* Grid of 9 skeleton cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
