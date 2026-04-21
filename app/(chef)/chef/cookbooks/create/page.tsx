"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useCreateCookbook } from "@/hooks/useChefs";
import { ArrowLeftIcon, BookOpenIcon } from "@phosphor-icons/react/dist/ssr";
import CookbookForm from "@/components/Chef/CookbookForn";

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
    try {
      if (!values.image || values.image.length === 0) {
        toast.error("Please upload a cover image.", {
          position: "bottom-right",
        });
        return;
      }
      await createCookbook({
        title: values.title,
        description: values.description,
        price: values.price,
        stockCount: values.stockCount,
        image: values.image[0],
      });
      toast.success("Cookbook published successfully!", {
        position: "bottom-right",
      });
      router.push("/chef/cookbooks");
    } catch {
      toast.error("Failed to publish cookbook. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <title>Create Cookbook – Chefalio Chef</title>

      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          href="/chef/cookbooks"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          Back to My Cookbooks
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BookOpenIcon size={22} weight="fill" className="text-primary" />
            Create New Cookbook
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the details to publish your cookbook for sale.
          </p>
        </div>

        <CookbookForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel="Publish Cookbook"
        />
      </div>
    </>
  );
}
