import { Skeleton } from "@/components/ui/skeleton";

export const CompactRecipeSkeletonCard = () => {
  return (
    <div className="ui-row flex w-full flex-row items-center gap-3 px-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-3.5 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>

      <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
    </div>
  );
};
