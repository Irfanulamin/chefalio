"use client";

import { Recipe } from "@/types/recipes.type";
import { RecipeCard } from "./RecipeCard";
import { useBatchRecipeStats } from "@/hooks/useRecipe";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr";
import { useMemo } from "react";

export const RecipeGrid = ({
  handleRecipeLoading,
  isFetching,
  data,
  recipePath = "/recipes",
  chefPath = "/chefs",
}: {
  handleRecipeLoading: boolean;
  isFetching: boolean;
  data: Recipe[] | undefined;
  recipePath?: string;
  chefPath?: string;
}) => {
  const recipeIds = useMemo(() => data?.map((r) => r._id) ?? [], [data]);
  const { statsFor } = useBatchRecipeStats(recipeIds);

  const isEmpty =
    !isFetching && !handleRecipeLoading && (!data || data.length === 0);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${
        isFetching ? "opacity-50" : "opacity-100"
      }`}
    >
      {data?.map((recipe: Recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          statsFor={statsFor}
          recipePath={recipePath}
          chefPath={chefPath}
        />
      ))}

      {handleRecipeLoading &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden flex flex-col"
            style={{
              backgroundColor: "var(--cs-surface-2)",
              border: "1px solid var(--cs-border-subtle)",
            }}
          >
            <Skeleton className="w-full" style={{ aspectRatio: "4/3" }} />
            <div className="p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-1 pt-1">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          </div>
        ))}

      {isEmpty && (
        <div className="col-span-full">
          <EmptyState
            icon={<ForkKnifeIcon size={28} />}
            title="No recipes found"
            description="Try adjusting your filters or search query."
          />
        </div>
      )}
    </div>
  );
};
