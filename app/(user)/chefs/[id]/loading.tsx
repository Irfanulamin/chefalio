import { Skeleton } from "@/components/ui/skeleton";

export default function ChefProfileLoading() {
  return (
    <div className="page-root">
      <div className="page-content space-y-6">
        {/* Hero skeleton */}
        <div
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl"
          style={{
            backgroundColor: "var(--cs-surface-2)",
            border: "1px solid var(--cs-border-subtle)",
          }}
        >
          <Skeleton className="w-24 h-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-7 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
        >
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: "var(--cs-surface-2)",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <Skeleton className="w-full" style={{ aspectRatio: "4/3" }} />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
