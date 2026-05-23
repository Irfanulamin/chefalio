import type { RecipeStats } from "@/types/recipes.type";
import { useToggleLove, useToggleSave } from "@/hooks/useRecipe";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/recipes.type";
import {
  BookmarkSimpleIcon,
  HeartIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";

const DIFFICULTY_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  beginner: { label: "Easy", bg: "#dcfce7", color: "#15803d" },
  intermediate: { label: "Medium", bg: "#fef9c3", color: "#a16207" },
  advance: { label: "Hard", bg: "#fee2e2", color: "#b91c1c" },
};

export const RecipeCard = memo(
  ({
    recipe,
    statsFor,
    recipePath = "/recipes",
    chefPath = "/chefs",
  }: {
    recipe: Recipe;
    statsFor: (id: string) => RecipeStats;
    recipePath?: string;
    chefPath?: string;
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

    const diff =
      DIFFICULTY_CONFIG[recipe.difficulty] ?? DIFFICULTY_CONFIG.advance;
    const initials = (recipe.authorId.fullName || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        className="group w-full overflow-hidden rounded-xl flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        style={{
          backgroundColor: "var(--cs-surface-2)",
          border: "1px solid var(--cs-border-subtle)",
        }}
      >
        {/* 4:3 Image */}
        <Link
          href={`${recipePath}/${recipe._id}`}
          className="relative block w-full overflow-hidden"
          style={{ aspectRatio: "4/3", backgroundColor: "var(--cs-surface-3)" }}
        >
          {recipe.images?.[0] ? (
            <Image
              src={recipe.images[0]}
              alt={recipe.title}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--cs-accent-muted), var(--cs-surface-3))",
              }}
            >
              <span
                className="text-3xl font-bold opacity-20"
                style={{ color: "var(--cs-accent)" }}
              >
                {recipe.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Difficulty badge — top right */}
          <span
            className="absolute right-2.5 top-2.5 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
            style={{ backgroundColor: diff.bg, color: diff.color }}
          >
            {diff.label}
          </span>
        </Link>

        {/* Body */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          {/* Author */}
          <Link
            href={`${chefPath}/${recipe.authorId._id}`}
            className="flex items-center gap-2 w-fit group/author"
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
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ backgroundColor: "var(--cs-accent)" }}
              >
                {initials}
              </div>
            )}
            <span
              className="text-xs font-medium capitalize truncate max-w-[120px] transition-colors duration-150"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {recipe.authorId.fullName}
            </span>
          </Link>

          {/* Title */}
          <Link href={`${recipePath}/${recipe._id}`}>
            <h2
              className="text-[15px] font-semibold leading-snug line-clamp-2 transition-colors duration-150 group-hover:text-[color:var(--cs-accent)]"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {recipe.title}
            </h2>
          </Link>

          {/* Tags as cuisine labels */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] rounded-full capitalize"
                  style={{
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer actions */}
          <div
            className="mt-auto pt-3 flex items-center gap-3"
            style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
          >
            <button
              onClick={handleLoveToggle}
              className="flex items-center gap-1 text-xs transition-colors duration-150"
              style={{ color: stats?.isLoved ? "#f43f5e" : "var(--cs-text-tertiary)" }}
            >
              <HeartIcon weight={stats?.isLoved ? "fill" : "bold"} className="h-4 w-4" />
              <span className="font-medium">{recipe.lovedCount.toLocaleString()}</span>
            </button>

            <button
              onClick={handleSaveToggle}
              className="flex items-center gap-1 text-xs transition-colors duration-150"
              style={{
                color: stats?.isSaved ? "var(--cs-text-primary)" : "var(--cs-text-tertiary)",
              }}
            >
              <BookmarkSimpleIcon weight={stats?.isSaved ? "fill" : "bold"} className="h-4 w-4" />
              <span className="font-medium">{recipe.savedCount.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    );
  },
);

RecipeCard.displayName = "RecipeCard";
