"use client";

import { useSavedRecipes } from "@/hooks/useRecipe";
import { CompactRecipeCard } from "@/components/User/Recipe/CompactRecipeCard";
import { CompactRecipeSkeletonCard } from "@/components/User/Recipe/CompactRecipeSkeletonCard";
import { AsyncSection } from "@/components/User/shared/AsyncSection";
import { BookmarkSimpleIcon } from "@phosphor-icons/react/dist/ssr";

export default function SavedRecipesSection() {
  const { savedRecipes, isLoading, error } = useSavedRecipes();
  const recipes = savedRecipes?.data;

  return (
    <AsyncSection
      loading={isLoading}
      error={error}
      isEmpty={!recipes || recipes.length === 0}
      errorSubject="your saved recipes"
      skeleton={Array.from({ length: 3 }).map((_, i) => (
        <CompactRecipeSkeletonCard key={i} />
      ))}
      empty={{
        icon: <BookmarkSimpleIcon size={24} />,
        title: "Nothing saved yet",
        description:
          "The bookmark on any recipe card puts it here, so you can find it without searching again.",
        action: { label: "Browse recipes", href: "/recipes" },
      }}
    >
      {recipes?.map((recipe) => (
        <CompactRecipeCard key={recipe.recipeId?._id} recipe={recipe} />
      ))}
    </AsyncSection>
  );
}
