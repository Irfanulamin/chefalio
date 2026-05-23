import { Skeleton } from "@/components/ui/skeleton";

export const RecipeSingleSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* Hero image */}
      <Skeleton className="w-full rounded-xl mb-6" style={{ aspectRatio: "16/7" }} />

      {/* Metadata row */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-8 w-2/3 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-4/5 mb-8" />

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ingredients column */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-28 mb-2" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>

        {/* Steps column */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-32 mb-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
