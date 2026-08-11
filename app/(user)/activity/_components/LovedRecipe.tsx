"use client";

import { useLovedRecipes } from "@/hooks/useRecipe";
import { CompactRecipeCard } from "@/components/User/Recipe/CompactRecipeCard";
import { CompactRecipeSkeletonCard } from "@/components/User/Recipe/CompactRecipeSkeletonCard";
import { AsyncSection } from "@/components/User/shared/AsyncSection";
import { HeartIcon } from "@phosphor-icons/react/dist/ssr";

export default function LovedRecipesSection() {
  const { lovedRecipes, isLoading, error } = useLovedRecipes();
  const recipes = lovedRecipes?.data;

  return (
    <AsyncSection
      loading={isLoading}
      error={error}
      isEmpty={!recipes || recipes.length === 0}
      errorSubject="your favourites"
      skeleton={Array.from({ length: 3 }).map((_, i) => (
        <CompactRecipeSkeletonCard key={i} />
      ))}
      empty={{
        icon: <HeartIcon size={24} />,
        title: "No favourites yet",
        description:
          "The heart on a recipe tells its chef you liked it, and keeps a copy here for you.",
        action: { label: "Browse recipes", href: "/recipes" },
      }}
    >
      {recipes?.map((recipe) => (
        <CompactRecipeCard key={recipe.recipeId?._id} recipe={recipe} />
      ))}
    </AsyncSection>
  );
}
