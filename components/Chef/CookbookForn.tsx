"use client";

import { useForm } from "@tanstack/react-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import z from "zod";
import type { Cookbook } from "@/types/cookbook.type";
import { SPRING } from "@/lib/motion";
import {
  FormSection,
  TextInput,
  TextArea,
  LabelledField,
} from "@/components/common/form/FormKit";
import { ImageDropzone } from "@/components/common/form/ImageDropzone";

/**
 * Cookbook editor — the same three-card structure as the recipe form, so
 * the two feel like one editor with different contents rather than two
 * screens that happen to live in the same product.
 *
 * The cover image is the one place this diverges: a cookbook has exactly
 * one, so the dropzone runs at a single slot and the existing cover appears
 * *in* that slot rather than as a separate preview block above an empty
 * upload box. Replacing it is pressing the thing you want to replace.
 */

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
  /** Set when hosted in a sheet — the sheet's pinned footer submits this
   *  form by id rather than the button that ships inside it. */
  formId?: string;
  hideSubmit?: boolean;
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
  submitLabel = "Publish cookbook",
  formId,
  hideSubmit = false,
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
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-3"
    >
      <FormSection title="The book">
        <div className="space-y-4">
          <form.Field name="title">
            {(field) => (
              <LabelledField label="Title" htmlFor={field.name}>
                <TextInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="The Art of French Cooking"
                />
                <FieldError messages={field.state.meta.errors} />
              </LabelledField>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <LabelledField
                label="Description"
                htmlFor={field.name}
                hint={`${field.state.value.length} / 2000`}
              >
                <TextArea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  maxLength={2000}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="What will readers come away able to cook?"
                />
                <FieldError messages={field.state.meta.errors} />
              </LabelledField>
            )}
          </form.Field>
        </div>
      </FormSection>

      <FormSection title="Pricing and stock">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field name="price">
            {(field) => (
              <LabelledField label="Price" htmlFor={field.name} hint="In USD">
                <TextInput
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="29.99"
                  className="tabular-nums"
                />
                <FieldError messages={field.state.meta.errors} />
              </LabelledField>
            )}
          </form.Field>

          <form.Field name="stockCount">
            {(field) => (
              <LabelledField
                label="Stock"
                htmlFor={field.name}
                hint="Copies available to sell"
              >
                <TextInput
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  step="1"
                  inputMode="numeric"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="100"
                  className="tabular-nums"
                />
                <FieldError messages={field.state.meta.errors} />
              </LabelledField>
            )}
          </form.Field>
        </div>
      </FormSection>

      <FormSection
        title="Cover"
        hint={
          initialData
            ? "Press the cover to swap it, then add the replacement."
            : "The first thing anyone sees in the shop."
        }
      >
        <form.Field name="image">
          {(field) => (
            <ImageDropzone
              label="Cover image"
              slots={1}
              files={Array.isArray(field.state.value) ? field.state.value : []}
              onChange={field.handleChange}
              /* An existing cover is shown in the slot itself. It is never
                 marked for removal, because a cookbook must always have
                 one — adding a new file simply supersedes it. */
              existing={
                initialData && field.state.value.length === 0
                  ? [{ url: initialData.cookbook_image, markedForRemoval: false }]
                  : undefined
              }
              onToggleExisting={() => {}}
            />
          )}
        </form.Field>
      </FormSection>

      {!hideSubmit && (
        <div className="flex justify-end pb-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-5 h-9 text-sm rounded-lg"
          >
            {isSubmitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}

function FieldError({ messages }: { messages: unknown[] }) {
  const text = messages
    .map((m) =>
      typeof m === "string" ? m : (m as { message?: string } | null)?.message,
    )
    .filter(Boolean)[0];

  return (
    <AnimatePresence initial={false}>
      {text && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={SPRING.snappy}
          className="text-xs overflow-hidden"
          style={{ color: "var(--cs-danger-fg)" }}
        >
          {text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
