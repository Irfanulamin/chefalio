"use client";

import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Cookbook } from "@/hooks/useCookbook";
import Image from "next/image";

interface CookbookFormValues {
  title: string;
  description: string;
  price: number;
  stockCount: number;
  image: File[];
}

interface CookbookFormProps {
  initialData?: Cookbook;
  onSubmit: (values: CookbookFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
  stockCount: z.number().min(1, "Stock must be at least 1"),
  image: z.array(z.instanceof(File)).max(1, "Only one cover image is allowed"),
});

export default function CookbookForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Publish Cookbook",
}: CookbookFormProps) {
  const form = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      stockCount: initialData?.stockCount ?? 1,
      image: [] as File[],
    },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Details */}
      <fieldset className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Details
          </p>
          <div className="space-y-4">
            <FormField
              form={form}
              name="title"
              label="Title"
              placeholder="e.g. The Art of French Cooking"
            />
            <FormField
              form={form}
              name="description"
              label="Description"
              type="textarea"
              placeholder="Describe what makes this cookbook special…"
              rows={4}
              maxLength={2000}
            />
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Pricing & Stock
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              form={form}
              name="price"
              label="Price (USD)"
              type="number"
              placeholder="e.g. 29.99"
            />
            <FormField
              form={form}
              name="stockCount"
              label="Stock Count"
              type="number"
              placeholder="e.g. 100"
            />
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            Cover Image
          </p>
          {initialData ? (
            <p className="text-xs text-zinc-400 mb-4">
              Upload a new image to replace the current cover (optional)
            </p>
          ) : (
            <p className="text-xs text-zinc-400 mb-4">Required</p>
          )}

          {initialData && (
            <div className="relative h-28 w-44 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 mb-4">
              <Image
                src={initialData.cookbook_image}
                alt={initialData.title}
                className="h-full w-full object-cover"
                width={300}
                height={200}
              />
            </div>
          )}
          <FormField
            form={form}
            name="image"
            label={initialData ? "New Cover Image (optional)" : "Cover Image"}
            type="dropzone"
          />
        </div>
      </fieldset>

      {/* Submit */}
      <div className="flex justify-end pb-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 px-5 h-9 text-sm rounded-lg"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
