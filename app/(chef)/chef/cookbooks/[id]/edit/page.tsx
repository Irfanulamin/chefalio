"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useMyCookbooks, useUpdateCookbook } from "@/hooks/useChefs";
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import CookbookForm from "@/components/Chef/CookbookForn";
import { GridLoader } from "@/components/ui/GridLoading";

export default function EditCookbookPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { myCookbooks, isLoading } = useMyCookbooks();
  const { mutateAsync: updateCookbook, isPending } = useUpdateCookbook();

  const cookbook = myCookbooks.find((c) => c._id === id);

  const handleSubmit = async (values: {
    title: string;
    description: string;
    price: number;
    stockCount: number;
    image: File[];
  }) => {
    try {
      await updateCookbook({
        id,
        payload: {
          title: values.title,
          description: values.description,
          price: values.price,
          stockCount: values.stockCount,
          ...(values.image?.length > 0 ? { image: values.image[0] } : {}),
        },
      });
      toast.success("Cookbook updated successfully!", {
        position: "bottom-right",
      });
      router.push("/chef/cookbooks");
    } catch {
      toast.error("Failed to update cookbook. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GridLoader label="Loading cookbook..." />
      </div>
    );
  }

  if (!cookbook) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-muted-foreground">Cookbook not found.</p>
        <Link
          href="/chef/cookbooks"
          className="text-sm text-primary hover:underline"
        >
          ← Back to my cookbooks
        </Link>
      </div>
    );
  }

  return (
    <>
      <title>Edit Cookbook – Chefalio Chef</title>

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
            <PencilSimpleIcon
              size={22}
              weight="fill"
              className="text-primary"
            />
            Edit Cookbook
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Editing: <strong>{cookbook.title}</strong>
          </p>
        </div>

        <CookbookForm
          initialData={cookbook}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
