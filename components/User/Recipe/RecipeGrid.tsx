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
        className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 transition-opacity duration-200 w-full ${
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
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col bg-white dark:bg-zinc-900"
            >
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-4 space-y-2.5 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-14 rounded" />
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-6" />
                  <div className="flex-1" />
                  <Skeleton className="h-4 w-10" />
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
