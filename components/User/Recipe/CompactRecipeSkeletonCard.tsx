import { Skeleton } from "@/components/ui/skeleton";

export const CompactRecipeSkeletonCard = () => {
  return (
    <div
      className="flex flex-row items-center gap-3 px-4 py-3 w-full"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        borderBottom: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* Text column — left */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-full" style={{ backgroundColor: "var(--cs-surface-3)" }} />
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: "var(--cs-surface-3)" }} />
          <Skeleton className="h-3 w-20" style={{ backgroundColor: "var(--cs-surface-3)" }} />
        </div>
        <Skeleton className="h-3 w-16" style={{ backgroundColor: "var(--cs-surface-3)" }} />
      </div>

      {/* Thumbnail — right */}
      <Skeleton
        className="w-16 h-16 rounded-lg shrink-0"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      />
    </div>
  );
};
