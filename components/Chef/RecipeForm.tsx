"use client";

import { useState, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import z from "zod";
import { Recipe } from "@/types/recipes.type";
import Image from "next/image";
import GridLoader from "../ui/GridLoading";

const DIFFICULTIES = ["beginner", "intermediate", "advance"] as const;
const DIFFICULTY_STYLES: Record<string, string> = {
  beginner:
    "border-emerald-500 text-emerald-600 data-[active=true]:bg-emerald-500 data-[active=true]:text-white data-[active=true]:border-emerald-500",
  intermediate:
    "border-amber-500 text-amber-600 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500",
  advance:
    "border-rose-500 text-rose-600 data-[active=true]:bg-rose-500 data-[active=true]:text-white data-[active=true]:border-rose-500",
};

const POPULAR_TAGS = [
  "vegetarian",
  "dessert",
  "French",
  "Italian",
  "seafood",
  "modernist",
  "fine dining",
  "Nordic",
];

interface Instruction {
  step: number;
  instruction: string;
}

interface RecipeFormValues {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advance";
  images: File[];
  ingredients: string[];
  tags: string[];
  instructions: Instruction[];
}

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (values: RecipeFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

const schema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  difficulty: z.enum(["beginner", "intermediate", "advance"]),
  images: z.array(z.instanceof(File)),
});
export default function RecipeForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Publish Recipe",
}: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<string[]>(
    initialData?.ingredients ?? [""],
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [instructions, setInstructions] = useState<Instruction[]>(
    initialData?.instructions.map((i) => ({
      step: i.step,
      instruction: i.instruction,
    })) ?? [{ step: 1, instruction: "" }],
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "beginner" | "intermediate" | "advance"
  >(initialData?.difficulty ?? "beginner");

  // Ingredient helpers
  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, val: string) =>
    setIngredients((prev) => prev.map((v, idx) => (idx === i ? val : v)));

  // Tag helpers
  const addTag = useCallback(
    (tag: string) => {
      const clean = tag.trim().toLowerCase();
      if (clean && !tags.includes(clean) && tags.length < 5) {
        setTags((prev) => [...prev, clean]);
      }
      setTagInput("");
    },
    [tags],
  );
  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  // Instruction helpers
  const addInstruction = () =>
    setInstructions((prev) => [
      ...prev,
      { step: prev.length + 1, instruction: "" },
    ]);
  const removeInstruction = (i: number) =>
    setInstructions((prev) =>
      prev
        .filter((_, idx) => idx !== i)
        .map((ins, idx) => ({ ...ins, step: idx + 1 })),
    );
  const updateInstruction = (i: number, val: string) =>
    setInstructions((prev) =>
      prev.map((ins, idx) => (idx === i ? { ...ins, instruction: val } : ins)),
    );
  const moveInstruction = (i: number, dir: "up" | "down") => {
    const next = [...instructions];
    const target = dir === "up" ? i - 1 : i + 1;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setInstructions(next.map((ins, idx) => ({ ...ins, step: idx + 1 })));
  };

  const form = useForm({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      difficulty: initialData?.difficulty ?? "beginner",
      images: [] as File[],
    },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      const cleanIngredients = ingredients.filter((i) => i.trim());
      const cleanInstructions = instructions.filter((i) =>
        i.instruction.trim(),
      );

      await onSubmit({
        title: value.title,
        description: value.description,
        difficulty: selectedDifficulty,
        images: value.images,
        ingredients: cleanIngredients,
        tags,
        instructions: cleanInstructions,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {/* Basic info */}
      <section className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-foreground">
          Basic Information
        </h2>
        <FormField
          form={form}
          name="title"
          label="Recipe Title"
          placeholder="e.g. Truffle Risotto"
        />
        <FormField
          form={form}
          name="description"
          label="Description"
          type="textarea"
          placeholder="Describe your recipe..."
          rows={4}
          maxLength={2000}
        />

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Difficulty
          </label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                data-active={selectedDifficulty === d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border capitalize transition-all ${DIFFICULTY_STYLES[d]}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Recipe Images
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {initialData
              ? "Upload new images to replace existing ones (optional)"
              : "Upload exactly 3 images (required)"}
          </p>
        </div>
        {initialData && (
          <div className="flex gap-2">
            {initialData.images.map((url, i) => (
              <div
                key={i}
                className="relative h-20 w-28 rounded-lg overflow-hidden"
              >
                <Image
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="h-full w-full object-cover"
                  width={300}
                  height={200}
                />
              </div>
            ))}
          </div>
        )}
        <FormField
          form={form}
          name="images"
          label={initialData ? "New Images (optional)" : "Upload 3 Images"}
          type="dropzone"
          multiple
        />
      </section>

      {/* Ingredients */}
      <section className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Ingredients
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              List each ingredient
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
            className="gap-1.5 rounded-lg"
          >
            <PlusIcon size={13} weight="bold" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 text-xs text-muted-foreground text-right shrink-0">
                {i + 1}.
              </span>
              <input
                type="text"
                value={ing}
                onChange={(e) => updateIngredient(i, e.target.value)}
                placeholder={`Ingredient ${i + 1}`}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                >
                  <XIcon size={14} weight="bold" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tags */}
      <section className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Tags</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Up to 5 tags</p>
        </div>

        {/* Popular tags */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              disabled={tags.includes(tag.toLowerCase()) || tags.length >= 5}
              className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Tag input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Type a tag and press Enter"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40"
            disabled={tags.length >= 5}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addTag(tagInput)}
            disabled={!tagInput.trim() || tags.length >= 5}
            className="rounded-lg"
          >
            Add
          </Button>
        </div>

        {/* Selected tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="gap-1.5 px-2.5 py-1 text-xs bg-primary/10 text-primary border-0"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-primary/70"
                >
                  <XIcon size={10} weight="bold" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </section>

      {/* Instructions */}
      <section className="rounded-2xl border border-border/60 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Instructions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Step-by-step cooking instructions
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addInstruction}
            className="gap-1.5 rounded-lg"
          >
            <PlusIcon size={13} weight="bold" />
            Add Step
          </Button>
        </div>

        <div className="space-y-3">
          {instructions.map((ins, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex flex-col items-center gap-1 pt-2">
                <button
                  type="button"
                  onClick={() => moveInstruction(i, "up")}
                  disabled={i === 0}
                  className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent disabled:opacity-30 transition-colors"
                >
                  <ArrowUpIcon size={11} weight="bold" />
                </button>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {ins.step}
                </span>
                <button
                  type="button"
                  onClick={() => moveInstruction(i, "down")}
                  disabled={i === instructions.length - 1}
                  className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-accent disabled:opacity-30 transition-colors"
                >
                  <ArrowDownIcon size={11} weight="bold" />
                </button>
              </div>

              <textarea
                value={ins.instruction}
                onChange={(e) => updateInstruction(i, e.target.value)}
                placeholder={`Step ${ins.step} instruction...`}
                rows={2}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(i)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors mt-1"
                >
                  <TrashIcon size={14} weight="bold" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 px-6 rounded-xl"
        >
          {isSubmitting ? (
            <>
              <GridLoader label="Saving..." />
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
