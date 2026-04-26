"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useMyRecipes, useUpdateRecipe } from "@/hooks/useChefs";
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import RecipeForm from "@/components/Chef/RecipeForm";
import { GridLoader } from "@/components/ui/GridLoading";

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { myRecipes, isLoading } = useMyRecipes();
  const { mutateAsync: updateRecipe, isPending } = useUpdateRecipe();

  const recipe = myRecipes.find((r) => r._id === id);

  const handleSubmit = async (
    values: Parameters<typeof updateRecipe>[0]["payload"],
  ) => {
    try {
      await updateRecipe({ id, payload: values });
      toast.success("Recipe updated successfully!", {
        position: "bottom-right",
      });
      router.push("/chef/recipes");
    } catch {
      toast.error("Failed to update recipe. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GridLoader label="Loading recipe..." />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Link
          href="/chef/recipes"
          className="text-sm text-primary hover:underline"
        >
          ← Back to my recipes
        </Link>
      </div>
    );
  }

  return (
    <>
      <title>Edit Recipe – Chefalio Chef</title>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back nav */}
        <Link
          href="/chef/recipes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          Back to My Recipes
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <PencilSimpleIcon
              size={22}
              weight="fill"
              className="text-primary"
            />
            Edit Recipe
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Editing: <strong>{recipe.title}</strong>
          </p>
        </div>

        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
