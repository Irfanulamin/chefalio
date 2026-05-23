import { Skeleton } from "@/components/ui/skeleton";

export default function ChefDashboardLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 space-y-3"
            style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3.5 w-3.5 rounded-sm" />
            </div>
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Chart rows */}
      {[0, 1, 2].map((row) => (
        <div key={row} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[0, 1].map((col) => (
            <div
              key={col}
              className="rounded-xl p-5"
              style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
            >
              <Skeleton className="h-4 w-36 mb-5" />
              <Skeleton className="h-44 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ))}

      {/* Recent recipes table */}
      <div
        className="rounded-xl p-5"
        style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-14" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="h-10 w-14 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-full max-w-[120px]" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
