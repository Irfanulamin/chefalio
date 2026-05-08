"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useForm, useStore } from "@tanstack/react-form";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
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

const DIFFICULTIES = ["beginner", "intermediate", "advance"] as const;
const DIFFICULTY_STYLES: Record<
  string,
  { active: string; base: string }
> = {
  beginner: {
    active: "bg-emerald-500 text-white border-emerald-500",
    base: "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-emerald-400 hover:text-emerald-600 dark:text-zinc-400",
  },
  intermediate: {
    active: "bg-amber-500 text-white border-amber-500",
    base: "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-amber-400 hover:text-amber-600 dark:text-zinc-400",
  },
  advance: {
    active: "bg-red-500 text-white border-red-500",
    base: "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-red-400 hover:text-red-600 dark:text-zinc-400",
  },
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
  removeImages?: string[];
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
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const markForRemoval = (url: string) =>
    setRemoveImages((prev) => [...prev, url]);
  const unmarkForRemoval = (url: string) =>
    setRemoveImages((prev) => prev.filter((u) => u !== url));

  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, val: string) =>
    setIngredients((prev) => prev.map((v, idx) => (idx === i ? val : v)));

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
      prev.map((ins, idx) =>
        idx === i ? { ...ins, instruction: val } : ins,
      ),
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
      const cleanInstructions = instructions.filter((i) => i.instruction.trim());

      const errors: string[] = [];

      if (cleanIngredients.length === 0)
        errors.push("Add at least one ingredient");
      if (tags.length === 0) errors.push("Add at least one tag");
      if (cleanInstructions.length === 0)
        errors.push("Add at least one instruction step");

      if (initialData) {
        const kept = initialData.images.filter(
          (url) => !removeImages.includes(url),
        );
        const finalCount = kept.length + value.images.length;
        if (finalCount !== 3)
          errors.push(
            `Images: need exactly 3 (${kept.length} kept + ${value.images.length} new = ${finalCount})`,
          );
      } else {
        if (value.images.length !== 3)
          errors.push(
            `Images: upload exactly 3 (${value.images.length} selected)`,
          );
      }

      if (errors.length > 0) {
        setSubmitAttempted(true);
        errors.forEach((e) => toast.error(e, { position: "bottom-right" }));
        return;
      }

      setSubmitAttempted(false);
      await onSubmit({
        title: value.title,
        description: value.description,
        difficulty: selectedDifficulty,
        images: value.images,
        ingredients: cleanIngredients,
        tags,
        instructions: cleanInstructions,
        ...(removeImages.length > 0 ? { removeImages } : {}),
      });
    },
  });

  const imageCount = useStore(
    form.store,
    (s) => (Array.isArray(s.values.images) ? s.values.images.length : 0),
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Basic info */}
      <fieldset className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Basic Info
          </p>
          <div className="space-y-4">
            <FormField
              form={form}
              name="title"
              label="Title"
              placeholder="e.g. Truffle Risotto"
            />
            <FormField
              form={form}
              name="description"
              label="Description"
              type="textarea"
              placeholder="Describe your recipe…"
              rows={4}
              maxLength={2000}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Difficulty
              </label>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => {
                  const styles = DIFFICULTY_STYLES[d];
                  const isActive = selectedDifficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDifficulty(d)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border capitalize transition-colors ${
                        isActive ? styles.active : styles.base
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            Images
          </p>
          {initialData ? (
            <p className="text-xs text-zinc-400 mb-4">
              Mark current images for removal, then upload replacements to keep the total at 3.
            </p>
          ) : (
            <p
              className={`text-xs mb-4 ${submitAttempted && imageCount !== 3 ? "text-red-500" : "text-zinc-400"}`}
            >
              {imageCount}/3 images selected
              {submitAttempted && imageCount !== 3 ? " — upload exactly 3." : "."}
            </p>
          )}

          {initialData && (
            <div className="mb-4 space-y-2">
              <p className="text-xs text-zinc-400">
                Current images — click to mark for removal
              </p>
              <div className="flex gap-2 flex-wrap">
                {initialData.images.map((url, i) => {
                  const marked = removeImages.includes(url);
                  return (
                    <div key={i} className="relative h-20 w-28">
                      <div
                        className={`relative h-full w-full rounded-lg overflow-hidden border-2 transition-all ${
                          marked
                            ? "opacity-40 border-red-400"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={url}
                          alt={`Image ${i + 1}`}
                          className="h-full w-full object-cover"
                          width={300}
                          height={200}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          marked ? unmarkForRemoval(url) : markForRemoval(url)
                        }
                        className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] transition-colors ${
                          marked
                            ? "bg-zinc-400 hover:bg-zinc-500"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {marked ? "↩" : <XIcon size={9} weight="bold" />}
                      </button>
                    </div>
                  );
                })}
              </div>
              {removeImages.length > 0 && (
                <p className="text-xs text-red-500">
                  {removeImages.length} image{removeImages.length !== 1 ? "s" : ""}{" "}
                  marked for removal — upload {removeImages.length} new image
                  {removeImages.length !== 1 ? "s" : ""} to replace them.
                </p>
              )}
            </div>
          )}

          <FormField
            form={form}
            name="images"
            label={
              initialData ? "Upload replacement images" : "Upload 3 images"
            }
            type="dropzone"
            multiple
          />
        </div>

        {/* Ingredients */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Ingredients
              </p>
              {submitAttempted && !ingredients.some((i) => i.trim()) && (
                <p className="text-xs text-red-500 mt-0.5">Add at least one ingredient.</p>
              )}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <PlusIcon size={12} weight="bold" />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 text-xs text-zinc-400 text-right shrink-0 tabular-nums">
                  {i + 1}.
                </span>
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => updateIngredient(i, e.target.value)}
                  placeholder={`Ingredient ${i + 1}`}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-zinc-400"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <XIcon size={12} weight="bold" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="px-5 py-4">
          <div className="mb-4">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Tags{" "}
              <span className="font-normal normal-case">({tags.length}/5)</span>
            </p>
            {submitAttempted && tags.length === 0 && (
              <p className="text-xs text-red-500 mt-0.5">Add at least one tag.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                disabled={tags.includes(tag.toLowerCase()) || tags.length >= 5}
                className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

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
              placeholder="Custom tag, press Enter"
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-zinc-400"
              disabled={tags.length >= 5}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTag(tagInput)}
              disabled={!tagInput.trim() || tags.length >= 5}
              className="h-8 rounded-lg text-xs"
            >
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary/60 transition-colors"
                  >
                    <XIcon size={10} weight="bold" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Instructions
              </p>
              {submitAttempted && !instructions.some((i) => i.instruction.trim()) && (
                <p className="text-xs text-red-500 mt-0.5">Add at least one instruction step.</p>
              )}
            </div>
            <button
              type="button"
              onClick={addInstruction}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <PlusIcon size={12} weight="bold" />
              Add step
            </button>
          </div>

          <div className="space-y-2">
            {instructions.map((ins, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex flex-col items-center gap-0.5 pt-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveInstruction(i, "up")}
                    disabled={i === 0}
                    className="flex h-5 w-5 items-center justify-center rounded text-zinc-300 dark:text-zinc-600 hover:text-foreground disabled:opacity-20 transition-colors"
                  >
                    <ArrowUpIcon size={10} weight="bold" />
                  </button>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold">
                    {ins.step}
                  </span>
                  <button
                    type="button"
                    onClick={() => moveInstruction(i, "down")}
                    disabled={i === instructions.length - 1}
                    className="flex h-5 w-5 items-center justify-center rounded text-zinc-300 dark:text-zinc-600 hover:text-foreground disabled:opacity-20 transition-colors"
                  >
                    <ArrowDownIcon size={10} weight="bold" />
                  </button>
                </div>

                <textarea
                  value={ins.instruction}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  placeholder={`Step ${ins.step}…`}
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-zinc-400"
                />

                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-1 shrink-0"
                  >
                    <TrashIcon size={12} weight="bold" />
                  </button>
                )}
              </div>
            ))}
          </div>
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
