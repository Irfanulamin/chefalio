"use client";

import { useLovedRecipes } from "@/hooks/useRecipe";
import { CompactRecipeCard } from "@/components/User/Recipe/CompactRecipeCard";
import {
  BookmarkSimpleIcon,
  ChefHatIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CompactRecipeSkeletonCard } from "@/components/User/Recipe/CompactRecipeSkeletonCard";

export default function LovedRecipesSection() {
  const { lovedRecipes, isLoading, isFetching, error } = useLovedRecipes();

  if (isLoading || isFetching) {
    return (
      <section>
        <div className="rounded-2xl border border-lime-200 dark:border-lime-700 overflow-hidden bg-white dark:bg-lime-900 divide-y divide-lime-100 dark:divide-lime-800">
          {Array.from({ length: 2 }).map((_, i) => (
            <CompactRecipeSkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 mb-4">
            <ChefHatIcon className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-base font-semibold text-rose-800 dark:text-rose-200 mb-1">
            Something went wrong
          </h3>
          <p className="text-sm text-rose-600 dark:text-rose-400">
            We couldn&apos;t load your loved recipes. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const recipes = lovedRecipes?.data;

  if (!recipes || recipes.length === 0) {
    return (
      <div className="rounded-2xl border border-lime-200 dark:border-lime-700 bg-white dark:bg-lime-900 px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime-100 dark:bg-lime-800 mb-5">
          <BookmarkSimpleIcon className="w-7 h-7 text-lime-400" />
        </div>
        <h3 className="text-base font-semibold text-lime-800 dark:text-lime-200 mb-2">
          No loved recipes yet
        </h3>
        <p className="text-sm text-lime-500 dark:text-lime-400 max-w-xs mx-auto">
          Recipes you love will appear here. Start exploring and like the ones
          you like.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-lime-200 dark:border-lime-700 overflow-hidden divide-y divide-lime-100 dark:divide-lime-800 shadow-lg dark:shadow-lime-950">
        {recipes.map((recipe) => {
          return (
            <CompactRecipeCard key={recipe._id} recipe={recipe} button="love" />
          );
        })}
      </div>
    </>
  );
}
