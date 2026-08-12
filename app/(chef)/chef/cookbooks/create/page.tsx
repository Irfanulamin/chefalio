"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateCookbook } from "@/hooks/useChefs";
import CookbookForm from "@/components/Chef/CookbookForn";
import { CreatePageShell } from "@/components/Chef/studio/CreatePageShell";

const FORM_ID = "chef-cookbook-create-form";

export default function CreateCookbookPage() {
  const router = useRouter();
  const { mutateAsync: createCookbook, isPending } = useCreateCookbook();

  const handleSubmit = async (values: {
    title: string;
    description: string;
    price: number;
    stockCount: number;
    image: File[];
  }) => {
    if (!values.image || values.image.length === 0) {
      toast.error("Add a cover image first.", { position: "bottom-right" });
      return;
    }

    try {
      await createCookbook({
        title: values.title,
        description: values.description,
        price: values.price,
        stockCount: values.stockCount,
        image: values.image[0],
      });
      toast.success("Cookbook published.", { position: "bottom-right" });
      router.push("/chef/cookbooks");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to publish cookbook.",
        { position: "bottom-right" },
      );
    }
  };

  return (
    <>
      <title>New cookbook – Chefalio</title>

      <CreatePageShell
        title="New cookbook"
        description="Put a collection up for sale."
        backHref="/chef/cookbooks"
        backLabel="My cookbooks"
        formId={FORM_ID}
        isSubmitting={isPending}
        submitLabel="Publish cookbook"
      >
        <CookbookForm
          formId={FORM_ID}
          hideSubmit
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </CreatePageShell>
    </>
  );
}
