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
import Link from "next/link";

const DIFF: Record<string, { label: string; bg: string; color: string }> = {
  beginner: { label: "Easy", bg: "#dcfce7", color: "#15803d" },
  intermediate: { label: "Medium", bg: "#fef9c3", color: "#a16207" },
  advance: { label: "Hard", bg: "#fee2e2", color: "#b91c1c" },
};

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { stats } = useRecipeStats(recipe._id);
  const { mutate: toggleLove } = useToggleLove();
  const { mutate: toggleSave } = useToggleSave();

  const toggleStep = (step: number) =>
    setCompletedSteps((prev) => {
      const n = new Set(prev);
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
    <div className="page-root">
      <div className="page-content">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:w-[480px] flex flex-col w-full shrink-0">
            <ImageCarousel
              images={recipe.images}
              title={recipe.title}
              difficulty={recipe.difficulty}
            />

            {/* Title */}
            <div className="mb-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1
                  className="text-2xl font-bold tracking-tight leading-snug"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {recipe.title}
                </h1>
                <button
                  onClick={handleShareLinkToClipboard}
                  className="cursor-pointer shrink-0 mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-150"
                  style={{
                    backgroundColor: "var(--cs-surface-2)",
                    border: "1px solid var(--cs-border-subtle)",
                    color: "var(--cs-text-secondary)",
                  }}
                >
                  <ShareIcon size={15} />
                </button>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--cs-text-secondary)" }}>
                {recipe.description}
              </p>
            </div>

            {/* Author card */}
            <Link
              href={`/chefs/${recipe.authorId._id}`}
              className="flex items-center gap-3 rounded-xl p-4 mb-5 transition-all duration-150 hover:shadow-sm"
              style={{
                backgroundColor: "var(--cs-surface-2)",
                border: "1px solid var(--cs-border-subtle)",
              }}
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
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: "var(--cs-accent)" }}
                >
                  {initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm" style={{ color: "var(--cs-text-primary)" }}>
                  {recipe.authorId.fullName}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--cs-text-secondary)" }}>
                  @{recipe.authorId.username} · {recipe.authorId.email}
                </p>
              </div>

              <span
                className="text-[10px] font-semibold uppercase tracking-widest shrink-0"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                Chef
              </span>
            </Link>

            {/* Tags + difficulty */}
            <div className="flex flex-wrap gap-2 mb-5">
              {recipe.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg"
                  style={{
                    backgroundColor: "var(--cs-surface-3)",
                    color: "var(--cs-text-secondary)",
                  }}
                >
                  #{t}
                </span>
              ))}
              <span
                className="px-2.5 py-1 text-xs font-semibold rounded-lg"
                style={{ backgroundColor: diff.bg, color: diff.color }}
              >
                {diff.label}
              </span>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLove(recipe._id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
                style={
                  stats?.isLoved
                    ? { backgroundColor: "#f43f5e", color: "#fff", border: "1px solid #f43f5e" }
                    : {
                        backgroundColor: "var(--cs-surface-2)",
                        color: "var(--cs-text-secondary)",
                        border: "1px solid var(--cs-border-default)",
                      }
                }
              >
                <HeartIcon weight={stats?.isLoved ? "fill" : "bold"} className="w-4 h-4" />
                <span>{recipe.lovedCount.toLocaleString()}</span>
              </button>

              <button
                onClick={() => toggleSave(recipe._id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
                style={
                  stats?.isSaved
                    ? {
                        backgroundColor: "var(--cs-text-primary)",
                        color: "var(--cs-surface-1)",
                        border: "1px solid transparent",
                      }
                    : {
                        backgroundColor: "var(--cs-surface-2)",
                        color: "var(--cs-text-secondary)",
                        border: "1px solid var(--cs-border-default)",
                      }
                }
              >
                <BookmarkSimpleIcon weight={stats?.isSaved ? "fill" : "bold"} className="w-4 h-4" />
                {stats?.isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div
            className="w-full flex flex-col lg:pl-6 lg:sticky lg:top-6 h-fit"
            style={{ borderLeft: "1px solid transparent" }}
          >
            {/* Apply border only on lg */}
            <style>{`@media (min-width: 1024px) { .recipe-right { border-left: 1px solid var(--cs-border-subtle); } }`}</style>
            <div className="recipe-right w-full flex flex-col">
              {/* Ingredients */}
              <section className="mb-8">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-lg font-bold tracking-tight" style={{ color: "var(--cs-text-primary)" }}>
                    Ingredients
                  </h2>
                  <span
                    className="text-sm font-medium px-2.5 py-1 rounded-lg"
                    style={{
                      backgroundColor: "var(--cs-surface-2)",
                      border: "1px solid var(--cs-border-subtle)",
                      color: "var(--cs-text-secondary)",
                    }}
                  >
                    {recipe.ingredients.length} items
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {recipe.ingredients.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-150"
                      style={{
                        backgroundColor: "var(--cs-surface-2)",
                        border: "1px solid var(--cs-border-subtle)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--cs-accent)" }}
                      />
                      <span className="text-sm leading-tight" style={{ color: "var(--cs-text-primary)" }}>
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
