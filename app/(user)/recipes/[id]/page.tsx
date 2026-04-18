"use client";
import { use, useState } from "react";
import { useSingleRecipe } from "@/hooks/useRecipe";
import { ShareIcon } from "@phosphor-icons/react/dist/ssr";
import { ImageCarousel } from "./_components/ImageCarousel";
import { Instructions } from "./_components/Instructions";
import { Recipe } from "@/types/recipes.type";
import Image from "next/image";
import { RecipeSingleSkeleton } from "@/components/User/Recipe/RecipeSingleSkeleton";

const DIFF: Record<string, { label: string; dot: string; pill: string }> = {
  beginner: {
    label: "Beginner",
    dot: "bg-emerald-400",
    pill: "text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 ring-emerald-300 dark:ring-emerald-700",
  },
  easy: {
    label: "Easy",
    dot: "bg-sky-400",
    pill: "text-sky-800 dark:text-sky-200 bg-sky-100 dark:bg-sky-900/60 ring-sky-300 dark:ring-sky-700",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-400",
    pill: "text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 ring-amber-300 dark:ring-amber-700",
  },
  advance: {
    label: "Advanced",
    dot: "bg-rose-400",
    pill: "text-rose-800 dark:text-rose-200 bg-rose-100 dark:bg-rose-900/60 ring-rose-300 dark:ring-rose-700",
  },
};

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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
    <>
      {/* ── Page-level grain overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <div className="min-h-screen animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-stretch">
          {/* ═══════════════ LEFT COLUMN ═══════════════ */}
          <div className="lg:flex-1 flex flex-col w-full lg:w-120">
            {/* Ambient glow behind the carousel */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-[2.5rem] opacity-20 dark:opacity-30 blur-3xl -z-10 transition-opacity duration-700"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 60%, #a78bfa 0%, #f59e0b 50%, transparent 75%)",
                }}
              />
              <ImageCarousel
                images={recipe.images}
                title={recipe.title}
                difficulty={recipe.difficulty}
              />
            </div>

            {/* Title */}
            <div className="mb-6 animate-in slide-in-from-bottom-3 fade-in duration-500 delay-100">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-[2.2rem] font-black tracking-tight leading-[1.05] text-[#1a1714] dark:text-[#f0ede8]">
                  {recipe.title}
                </h1>

                <button
                  onClick={handleShareLinkToClipboard}
                  className="cursor-pointer shrink-0 mt-1.5 w-9 h-9 rounded-xl
                    bg-white dark:bg-[#26231f]
                    border border-[#e2ddd8] dark:border-[#35312c]
                    flex items-center justify-center text-[#8a8278]
                    hover:bg-[#f5f2ee] dark:hover:bg-[#2e2b26]
                    hover:scale-105 active:scale-95
                    transition-all duration-200 shadow-sm"
                >
                  <ShareIcon size={15} />
                </button>
              </div>

              <p className="text-sm text-[#6a6258] dark:text-[#7a7268] leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Author card */}
            <div
              className="flex items-center gap-4 rounded-2xl border p-4 mb-5 shadow-sm
                bg-[#eeeae4] dark:bg-[#1a1714]
                border-[#e2ddd8] dark:border-[#35312c]
                animate-in slide-in-from-bottom-3 fade-in duration-500 delay-150
                hover:shadow-md transition-shadow"
            >
              {recipe.authorId.profile_url ? (
                <Image
                  src={recipe.authorId.profile_url}
                  alt={recipe.authorId.fullName}
                  width={200}
                  height={200}
                  className="rounded-xl w-11 h-11 object-cover ring-2 ring-primary shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-[#1a1714] dark:bg-[#f0ede8] flex items-center justify-center text-sm font-black text-[#f0ede8] dark:text-[#1a1714] shrink-0">
                  {initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-[#1a1714] dark:text-[#f0ede8]">
                  {recipe.authorId.fullName}
                </p>
                <p className="text-sm text-[#9a9088] dark:text-[#6a6258] truncate mt-0.5">
                  @{recipe.authorId.username} · {recipe.authorId.email}
                </p>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b0a898] dark:text-[#5a5248]">
                Chef
              </span>
            </div>

            {/* Tags */}
            <div
              className="flex flex-wrap gap-2 mb-8
                animate-in slide-in-from-bottom-3 fade-in duration-500 delay-200"
            >
              {recipe.tags.map((t, i) => (
                <span
                  key={t}
                  className="text-sm font-bold px-3 py-1.5 rounded-lg
                    bg-[#eeeae4] dark:bg-[#1a1714]
                    text-[#1a1714] dark:text-[#f0ede8]
                    hover:bg-[#e2ddd8] dark:hover:bg-[#252118]
                    transition-colors cursor-default"
                  style={{ animationDelay: `${200 + i * 40}ms` }}
                >
                  #{t}
                </span>
              ))}

              <span
                className={`text-sm font-bold px-3 py-1.5 rounded-lg ring-1 flex items-center gap-1.5 ${diff.pill}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                {diff.label}
              </span>
            </div>
          </div>

          {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
          <div
            className="w-full lg:flex-1 flex flex-col lg:pl-6
              lg:border-l lg:border-[#e2ddd8] dark:lg:border-[#2a2720]
              lg:sticky lg:top-6 h-fit
              animate-in slide-in-from-right-4 fade-in duration-600 delay-100"
          >
            {/* Ingredients */}
            <section className="mb-10">
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-xl font-black text-[#1a1714] dark:text-[#f0ede8] tracking-tight">
                  Ingredients
                </h2>
                <span
                  className="text-sm font-semibold text-black dark:text-white
                    bg-white dark:bg-[#26231f]
                    border border-[#e2ddd8] dark:border-[#35312c]
                    px-2.5 py-1 rounded-lg"
                >
                  {recipe.ingredients.length} items
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {recipe.ingredients.map((item, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-3
                      bg-[#eeeae4] dark:bg-[#1a1714]
                      border border-[#e2ddd8] dark:border-[#35312c]
                      rounded-xl px-4 py-3 shadow-sm
                      hover:border-[#c8c0b8] dark:hover:border-[#48433d]
                      hover:-translate-y-0.5 hover:shadow-md
                      transition-all duration-200 cursor-default"
                    style={{
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    {/* Animated dot */}
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 group-hover:opacity-60 transition-opacity" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
                    </span>
                    <span className="text-sm font-medium text-[#3d3830] dark:text-[#c8c0b8] leading-tight">
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
    </>
  );
}

export default function SingleRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { singleRecipe, isSingleRecipeLoading } = useSingleRecipe(id);
  const recipe = singleRecipe?.data as Recipe | undefined;

  if (isSingleRecipeLoading) return <RecipeSingleSkeleton />;
  if (!recipe) return <p>Recipe not found</p>;
  return <RecipeDetail recipe={recipe} />;
}
