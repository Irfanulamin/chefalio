import { Skeleton } from "@/components/ui/skeleton";

export const CompactRecipeSkeletonCard = () => {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg"
      style={{
        width: "200px",
        maxWidth: "200px",
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* 1:1 thumbnail */}
      <Skeleton className="w-full" style={{ aspectRatio: "1/1" }} />
      {/* Info */}
      <div className="p-2.5 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};
