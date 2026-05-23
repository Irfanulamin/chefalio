"use client";

import { useLovedRecipes } from "@/hooks/useRecipe";
import { CompactRecipeCard } from "@/components/User/Recipe/CompactRecipeCard";
import { HeartIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { CompactRecipeSkeletonCard } from "@/components/User/Recipe/CompactRecipeSkeletonCard";

export default function LovedRecipesSection() {
  const { lovedRecipes, isLoading, isFetching, error } = useLovedRecipes();

  if (isLoading || isFetching) {
    return (
      <section>
        <div
          className="rounded-2xl overflow-hidden divide-y"
          style={{ border: "1px solid var(--cs-border-subtle)" }}
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
            We couldn&apos;t load your loved recipes. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const recipes = lovedRecipes?.data;

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
          style={{ backgroundColor: "#fee2e2" }}
        >
          <HeartIcon size={24} weight="fill" style={{ color: "#f43f5e" }} />
        </div>
        <h3 className="text-base font-semibold mb-2" style={{ color: "var(--cs-text-primary)" }}>
          No loved recipes yet
        </h3>
        <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--cs-text-secondary)" }}>
          Recipes you love will appear here. Start exploring and like the ones you enjoy.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--cs-border-subtle)" }}
    >
      {recipes.map((recipe) => (
        <CompactRecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}
