import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeDetailLoading() {
  return (
    <div className="page-root">
      <div className="page-content">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:w-[480px] flex flex-col w-full shrink-0">
            {/* Image carousel skeleton */}
            <div
              className="rounded-2xl overflow-hidden mb-8"
              style={{ border: "1px solid var(--cs-border-subtle)" }}
            >
              <Skeleton className="w-full" style={{ aspectRatio: "4/3" }} />
            </div>

            {/* Title skeleton */}
            <div className="mb-5 space-y-2">
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Author card skeleton */}
            <div
              className="flex items-center gap-3 rounded-xl p-4 mb-5"
              style={{
                backgroundColor: "var(--cs-surface-2)",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-2 mb-5">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-6 w-14 rounded-lg" />
            </div>

            {/* Action bar skeleton */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full flex flex-col">
            {/* Ingredients skeleton */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: "var(--cs-surface-2)",
                      border: "1px solid var(--cs-border-subtle)",
                    }}
                  >
                    <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 flex-1" />
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions skeleton */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full mb-4" />
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-5 py-4"
                    style={{
                      backgroundColor: "var(--cs-surface-2)",
                      border: "1px solid var(--cs-border-subtle)",
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <Skeleton className="w-7 h-7 rounded-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1.5" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
