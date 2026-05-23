"use client";

import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import z from "zod";
import type { Cookbook } from "@/types/cookbook.type";
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

const sectionHeaderStyle = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "var(--cs-text-tertiary)",
};

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
      <fieldset
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--cs-border-subtle)", backgroundColor: "var(--cs-surface-2)" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <p style={sectionHeaderStyle} className="mb-4">Details</p>
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

        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
          <p style={sectionHeaderStyle} className="mb-4">Pricing & Stock</p>
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
          <p style={sectionHeaderStyle} className="mb-1">Cover Image</p>
          {initialData ? (
            <p className="text-xs mb-4" style={{ color: "var(--cs-text-tertiary)" }}>
              Upload a new image to replace the current cover (optional)
            </p>
          ) : (
            <p className="text-xs mb-4" style={{ color: "var(--cs-text-tertiary)" }}>Required</p>
          )}

          {initialData && (
            <div
              className="relative h-28 w-44 rounded-lg overflow-hidden mb-4"
              style={{ border: "1px solid var(--cs-border-subtle)" }}
            >
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
