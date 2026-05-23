import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3.5 w-3.5 rounded-sm" />
      </div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export default function ChefAnalyticsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-9 w-52 rounded-lg" />
      </div>

      {/* Earnings section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-4 w-20" />
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--cs-surface-3)" }} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        {/* Chart placeholders */}
        <div
          className="rounded-xl p-5"
          style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
        >
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-3 w-48 mb-5" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
        <div
          className="rounded-xl p-5"
          style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
        >
          <Skeleton className="h-4 w-36 mb-2" />
          <Skeleton className="h-3 w-44 mb-5" />
          <Skeleton className="h-[160px] w-full rounded-lg" />
        </div>
      </div>

      {/* Engagement section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-4 w-36" />
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--cs-surface-3)" }} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-5"
            style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
          >
            <Skeleton className="h-4 w-40 mb-5" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
          <div
            className="rounded-xl p-5"
            style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
          >
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-3 w-4" />
                  <Skeleton className="h-9 w-12 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-1.5 w-full rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
