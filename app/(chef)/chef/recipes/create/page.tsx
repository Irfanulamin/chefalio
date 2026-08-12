"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateRecipe } from "@/hooks/useChefs";
import RecipeForm from "@/components/Chef/RecipeForm";
import { CreatePageShell } from "@/components/Chef/studio/CreatePageShell";

const FORM_ID = "chef-recipe-create-form";

export default function CreateRecipePage() {
  const router = useRouter();
  const { mutateAsync: createRecipe, isPending } = useCreateRecipe();

  const handleSubmit = async (values: Parameters<typeof createRecipe>[0]) => {
    try {
      await createRecipe(values);
      toast.success("Recipe published.", { position: "bottom-right" });
      router.push("/chef/recipes");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to publish recipe.",
        { position: "bottom-right" },
      );
    }
  };

  return (
    <>
      <title>New recipe – Chefalio</title>

      <CreatePageShell
        title="New recipe"
        description="Publish a dish to your catalogue."
        backHref="/chef/recipes"
        backLabel="My recipes"
        formId={FORM_ID}
        isSubmitting={isPending}
        submitLabel="Publish recipe"
      >
        <RecipeForm
          formId={FORM_ID}
          hideSubmit
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </CreatePageShell>
    </>
  );
}
