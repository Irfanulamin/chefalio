import { Skeleton } from "@/components/ui/skeleton";

export default function ChefRecipesLoading() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3.5 w-32" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
      >
        {/* Search bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <Skeleton className="h-8 flex-1 max-w-[280px] rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Header row */}
        <div className="flex items-center gap-4 px-4 py-3" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20 hidden sm:block" />
          <Skeleton className="h-3 w-24 hidden md:block" />
          <Skeleton className="ml-auto h-3 w-16" />
        </div>

        {/* 5 data rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3"
            style={{ borderBottom: i < 4 ? "1px solid var(--cs-border-subtle)" : undefined }}
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-10 w-14 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-56 hidden sm:block" />
              </div>
            </div>
            <Skeleton className="h-5 w-20 rounded-md hidden sm:block" />
            <div className="hidden md:flex gap-1">
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
            <div className="ml-auto flex gap-1.5">
              <Skeleton className="h-7 w-16 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
