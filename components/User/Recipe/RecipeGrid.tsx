"use client";

import { Recipe } from "@/types/recipes.type";
import { RecipeCard } from "./RecipeCard";
import { useBatchRecipeStats } from "@/hooks/useRecipe";
import { EmptyState } from "@/components/common/EmptyState";
import { CardSkeletonGrid } from "@/components/User/shared/CardSkeleton";
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr";
import { useMemo } from "react";

export const RecipeGrid = ({
  handleRecipeLoading,
  isFetching,
  data,
  recipePath = "/recipes",
  chefPath = "/chefs",
  hasActiveFilters = false,
  onClearFilters,
}: {
  handleRecipeLoading: boolean;
  isFetching: boolean;
  data: Recipe[] | undefined;
  recipePath?: string;
  chefPath?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}) => {
  const recipeIds = useMemo(() => data?.map((r) => r._id) ?? [], [data]);
  const { statsFor } = useBatchRecipeStats(recipeIds);

  const isEmpty =
    !isFetching && !handleRecipeLoading && (!data || data.length === 0);

  if (isEmpty) {
    return (
      <EmptyState
        icon={<ForkKnifeIcon size={24} />}
        title={hasActiveFilters ? "No recipes match those filters" : "No recipes yet"}
        description={
          hasActiveFilters
            ? "Nothing here matches every filter at once. Try removing the tag or level filter first — those narrow results the fastest."
            : "Recipes published by chefs will appear here. Follow a chef or browse cookbooks in the meantime."
        }
        action={
          hasActiveFilters
            ? undefined
            : { label: "Browse cookbooks", href: "/cookbooks" }
        }
      />
    );
  }

  return (
    <>
      {/* Refetching dims the grid rather than replacing it with skeletons:
          the results you're looking at are still the results, and swapping
          them for placeholders on every keystroke is what makes a filtered
          list feel like it's thrashing.

          The dim is deliberately shallow. It fires once per debounced
          keystroke, so at 0.55 a fast typist watched the whole grid strobe
          — the signal was louder than the thing it was reporting. This is
          enough to read as "working", quiet enough to type through. */}
      <div
        className="grid grid-cols-1 gap-5 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3"
        style={{ opacity: isFetching ? 0.72 : 1 }}
        aria-busy={isFetching || handleRecipeLoading}
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

        {handleRecipeLoading && <CardSkeletonGrid variant="recipe" count={6} />}
      </div>

      {hasActiveFilters && onClearFilters && data && data.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClearFilters}
            className="ui-chip focus-ring"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
};
