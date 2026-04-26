import { Recipe } from "@/types/recipes.type";
import { RecipeCard } from "./RecipeCard";
import { useBatchRecipeStats } from "@/hooks/useRecipe";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
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
    <div className="flex justify-center">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 py-3 ${
          isFetching ? "opacity-50" : "opacity-100"
        }`}
      >
        {data?.map((recipe: Recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} statsFor={statsFor} />
        ))}

        {handleRecipeLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-background p-6 rounded-2xl border border-border w-full animate-pulse"
            >
              <div className="space-y-4 animate-pulse">
                <div className="h-6 w-1/3 rounded-md bg-muted" />
                <div className="h-4 w-full rounded-md bg-muted" />
                <div className="h-4 w-5/6 rounded-md bg-muted" />
                <div className="h-32 w-full rounded-xl bg-muted" />
                <div className="flex gap-3">
                  <div className="h-10 w-24 rounded-lg bg-muted" />
                  <div className="h-10 w-24 rounded-lg bg-muted" />
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
