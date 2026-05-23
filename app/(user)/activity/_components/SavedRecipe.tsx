"use client";

import { useSavedRecipes } from "@/hooks/useRecipe";
import { CompactRecipeCard } from "@/components/User/Recipe/CompactRecipeCard";
import { BookmarkSimpleIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { CompactRecipeSkeletonCard } from "@/components/User/Recipe/CompactRecipeSkeletonCard";

export default function SavedRecipesSection() {
  const { savedRecipes, isLoading, isFetching, error } = useSavedRecipes();

  if (isLoading || isFetching) {
    return (
      <section>
        <div
          className="rounded-2xl overflow-hidden divide-y"
          style={{
            border: "1px solid var(--cs-border-subtle)",
            borderColor: "var(--cs-border-subtle)",
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <CompactRecipeSkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{
            border: "1px solid var(--cs-border-subtle)",
            backgroundColor: "var(--cs-surface-2)",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
            style={{ backgroundColor: "var(--cs-surface-3)" }}
          >
            <WarningCircleIcon size={22} style={{ color: "var(--cs-text-tertiary)" }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: "var(--cs-text-primary)" }}>
            Something went wrong
          </h3>
          <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
            We couldn&apos;t load your saved recipes. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const recipes = savedRecipes?.data;

  if (!recipes || recipes.length === 0) {
    return (
      <div
        className="rounded-2xl px-8 py-16 text-center"
        style={{
          border: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-1)",
        }}
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ backgroundColor: "var(--cs-accent-muted)" }}
        >
          <BookmarkSimpleIcon size={24} style={{ color: "var(--cs-accent)" }} />
        </div>
        <h3 className="text-base font-semibold mb-2" style={{ color: "var(--cs-text-primary)" }}>
          No saved recipes yet
        </h3>
        <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--cs-text-secondary)" }}>
          Recipes you save will appear here. Start exploring and bookmark the ones you love.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden divide-y shadow-sm"
      style={{
        border: "1px solid var(--cs-border-subtle)",
        borderColor: "var(--cs-border-subtle)",
      }}
    >
      {recipes.map((recipe) => (
        <CompactRecipeCard key={recipe.recipeId?._id} recipe={recipe} button="save" />
      ))}
    </div>
  );
}
