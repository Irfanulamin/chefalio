"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useCreateRecipe } from "@/hooks/useChefs";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import RecipeForm from "@/components/Chef/RecipeForm";

export default function CreateRecipePage() {
  const router = useRouter();
  const { mutateAsync: createRecipe, isPending } = useCreateRecipe();

  const handleSubmit = async (values: Parameters<typeof createRecipe>[0]) => {
    try {
      await createRecipe(values);
      toast.success("Recipe published successfully!", {
        position: "bottom-right",
      });
      router.push("/chef/recipes");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to publish recipe. Please try again.",
        { position: "bottom-right" },
      );
    }
  };

  return (
    <>
      <title>Create Recipe – Chefalio Chef</title>

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
          <h1 className="text-base font-semibold text-foreground">
            Create Recipe
          </h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            Fill in the details below to publish your recipe.
          </p>
        </div>

        <RecipeForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel="Publish Recipe"
        />
      </div>
    </>
  );
}
