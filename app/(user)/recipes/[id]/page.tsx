"use client";
import { use, useState } from "react";
import { useSingleRecipe, useRecipeStats, useToggleLove, useToggleSave } from "@/hooks/useRecipe";
import {
  ShareIcon,
  HeartIcon,
  BookmarkSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ImageCarousel } from "./_components/ImageCarousel";
import { Instructions } from "./_components/Instructions";
import { Recipe } from "@/types/recipes.type";
import Image from "next/image";
import { RecipeSingleSkeleton } from "@/components/User/Recipe/RecipeSingleSkeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DIFF: Record<string, { label: string; dot: string; pill: string }> = {
  beginner: {
    label: "Beginner",
    dot: "bg-emerald-500",
    pill: "bg-emerald-600 text-white",
  },
  easy: {
    label: "Easy",
    dot: "bg-sky-500",
    pill: "bg-sky-600 text-white",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-500",
    pill: "bg-amber-500 text-white",
  },
  intermediate: {
    label: "Intermediate",
    dot: "bg-amber-500",
    pill: "bg-amber-500 text-white",
  },
  advance: {
    label: "Advanced",
    dot: "bg-red-500",
    pill: "bg-red-600 text-white",
  },
};

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { stats } = useRecipeStats(recipe._id);
  const { mutate: toggleLove } = useToggleLove();
  const { mutate: toggleSave } = useToggleSave();

  const toggleStep = (step: number) =>
    setCompletedSteps((prev) => {
      const n = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      n.has(step) ? n.delete(step) : n.add(step);
      return n;
    });

  const initials = recipe.authorId.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const diff = DIFF[recipe.difficulty] ?? DIFF.advance;
  const progress = Math.round(
    (completedSteps.size / recipe.instructions.length) * 100,
  );
  const allDone = completedSteps.size === recipe.instructions.length;

  const handleShareLinkToClipboard = () => {
    const url = `${window.location.origin}/recipes/${recipe._id}`;
    navigator.clipboard.writeText(url);
    if (navigator.share) {
      void navigator
        .share({ title: recipe.title, text: recipe.description, url })
        .catch(() => undefined);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-start">
        {/* ═══════════════ LEFT COLUMN ═══════════════ */}
        <div className="lg:w-[480px] flex flex-col w-full shrink-0">
          <ImageCarousel
            images={recipe.images}
            title={recipe.title}
            difficulty={recipe.difficulty}
          />

          {/* Title */}
          <div className="mb-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground leading-snug">
                {recipe.title}
              </h1>
              <button
                onClick={handleShareLinkToClipboard}
                className="cursor-pointer shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <ShareIcon size={15} />
              </button>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Author card */}
          <Link
            href={`/chefs/${recipe.authorId._id}`}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 mb-5 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all cursor-pointer"
          >
            {recipe.authorId.profile_url ? (
              <Image
                src={recipe.authorId.profile_url}
                alt={recipe.authorId.fullName}
                width={44}
                height={44}
                className="rounded-xl w-11 h-11 object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-foreground">
                {recipe.authorId.fullName}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                @{recipe.authorId.username} · {recipe.authorId.email}
              </p>
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 shrink-0">
              Chef
            </span>
          </Link>

          {/* Tags + difficulty */}
          <div className="flex flex-wrap gap-2 mb-5">
            {recipe.tags.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                #{t}
              </span>
            ))}
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${diff.pill}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-white/60`} />
              {diff.label}
            </span>
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleLove(recipe._id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border",
                stats?.isLoved
                  ? "bg-rose-500 text-white border-rose-500 hover:bg-rose-600"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
              )}
            >
              <HeartIcon
                weight={stats?.isLoved ? "fill" : "bold"}
                className="w-4 h-4"
              />
              <span>{recipe.lovedCount.toLocaleString()}</span>
            </button>

            <button
              onClick={() => toggleSave(recipe._id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border",
                stats?.isSaved
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-transparent"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
              )}
            >
              <BookmarkSimpleIcon
                weight={stats?.isSaved ? "fill" : "bold"}
                className="w-4 h-4"
              />
              {stats?.isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
        <div
          className="w-full flex flex-col lg:pl-6
            lg:border-l lg:border-zinc-200 dark:lg:border-zinc-800
            lg:sticky lg:top-6 h-fit"
        >
          {/* Ingredients */}
          <section className="mb-8">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Ingredients
              </h2>
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-lg">
                {recipe.ingredients.length} items
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {recipe.ingredients.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm text-foreground leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <Instructions
            recipe={recipe}
            progress={progress}
            allDone={allDone}
            completedSteps={completedSteps}
            toggleStep={toggleStep}
          />
        </div>
      </div>
    </div>
  );
}

export default function SingleRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { singleRecipe, isSingleRecipeLoading } = useSingleRecipe(id);
  const recipe = singleRecipe?.data;

  if (isSingleRecipeLoading) return <RecipeSingleSkeleton />;
  if (!recipe) return <p>Recipe not found</p>;
  return <RecipeDetail recipe={recipe} />;
}
