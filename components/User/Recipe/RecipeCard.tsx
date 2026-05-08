import type { RecipeStats } from "@/types/recipes.type";
import { useToggleLove, useToggleSave } from "@/hooks/useRecipe";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/recipes.type";
import {
  BookmarkSimpleIcon,
  HeartIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";

const difficultyConfig: Record<string, { label: string; className: string }> = {
  beginner: {
    label: "Beginner",
    className: "bg-emerald-600 text-white",
  },
  intermediate: {
    label: "Intermediate",
    className: "bg-amber-500 text-white",
  },
  advance: {
    label: "Advanced",
    className: "bg-red-600 text-white",
  },
};

export const RecipeCard = memo(
  ({
    recipe,
    statsFor,
  }: {
    recipe: Recipe;
    statsFor: (id: string) => RecipeStats;
  }) => {
    const stats = statsFor(recipe._id);
    const { mutate: toggleSave } = useToggleSave();
    const { mutate: toggleLove } = useToggleLove();

    const handleLoveToggle = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLove(recipe._id);
      },
      [recipe._id, toggleLove],
    );

    const handleSaveToggle = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(recipe._id);
      },
      [recipe._id, toggleSave],
    );

    const diff = difficultyConfig[recipe.difficulty] ?? difficultyConfig.advance;

    return (
      <div className="group w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 flex flex-col">
        {/* Image */}
        <Link href={`/recipes/${recipe._id}`} className="relative h-44 w-full overflow-hidden block bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={recipe.images[0]}
            alt={recipe.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Difficulty badge */}
          <span
            className={cn(
              "absolute left-2.5 top-2.5 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium",
              diff.className,
            )}
          >
            {diff.label}
          </span>
        </Link>

        {/* Body */}
        <div className="flex flex-col gap-2.5 p-4 flex-1">
          {/* Author */}
          <Link
            href={`/chefs/${recipe.authorId._id}`}
            className="flex items-center gap-2 w-fit"
          >
            {recipe.authorId.profile_url ? (
              <Image
                src={recipe.authorId.profile_url}
                alt={recipe.authorId.fullName}
                width={20}
                height={20}
                loading="lazy"
                className="rounded-full w-5 h-5 object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-600 dark:text-zinc-300">
                {(recipe.authorId.fullName || "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors capitalize truncate max-w-[120px]">
              {recipe.authorId.fullName}
            </span>
          </Link>

          {/* Title */}
          <Link href={`/recipes/${recipe._id}`}>
            <h2 className="text-[15px] font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
              {recipe.title}
            </h2>
          </Link>

          {/* Description */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {recipe.description}
          </p>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 capitalize"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider + actions */}
          <div className="mt-auto pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            {/* Love */}
            <button
              onClick={handleLoveToggle}
              className={cn(
                "flex items-center gap-1 text-xs transition-colors",
                stats?.isLoved
                  ? "text-rose-500"
                  : "text-zinc-400 hover:text-rose-500",
              )}
            >
              <HeartIcon
                weight={stats?.isLoved ? "fill" : "bold"}
                className="h-4 w-4"
              />
              <span className="font-medium">{recipe.lovedCount.toLocaleString()}</span>
            </button>

            {/* Save */}
            <button
              onClick={handleSaveToggle}
              className={cn(
                "p-1 transition-colors",
                stats?.isSaved
                  ? "text-foreground"
                  : "text-zinc-400 hover:text-foreground",
              )}
            >
              <BookmarkSimpleIcon
                weight={stats?.isSaved ? "fill" : "bold"}
                className="h-4 w-4"
              />
            </button>

            <div className="flex-1" />

            <Link
              href={`/recipes/${recipe._id}`}
              className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors"
            >
              View <ArrowRightIcon weight="bold" className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  },
);

RecipeCard.displayName = "RecipeCard";
