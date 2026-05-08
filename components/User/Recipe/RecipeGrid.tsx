import { Recipe } from "@/types/recipes.type";
import { RecipeCard } from "./RecipeCard";
import { useBatchRecipeStats } from "@/hooks/useRecipe";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export const RecipeGrid = ({
  handleRecipeLoading,
  isFetching,
  data,
}: {
  handleRecipeLoading: boolean;
  isFetching: boolean;
  data: Recipe[] | undefined;
}) => {
  const recipeIds = useMemo(() => data?.map((r) => r._id) ?? [], [data]);
  const { statsFor } = useBatchRecipeStats(recipeIds);

  const isEmpty =
    !isFetching && !handleRecipeLoading && (!data || data.length === 0);

  return (
    <div className="w-full">
      <div
        className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-6 transition-opacity duration-200 py-3 w-full ${
          isFetching ? "opacity-50" : "opacity-100"
        }`}
      >
        {data?.map((recipe: Recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} statsFor={statsFor} />
        ))}

        {handleRecipeLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/40 overflow-hidden flex flex-col"
            >
              <Skeleton className="h-52 w-full rounded-none" />
              <div className="p-5 space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-8" />
                  <div className="flex-1" />
                  <Skeleton className="h-9 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}

        {isEmpty && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
            <MagnifyingGlassIcon size={48} className="mb-3 opacity-30" />
            <p className="text-sm">No recipes found</p>
          </div>
        )}
      </div>
    </div>
  );
};
