"use client";

import { SavedRecipe } from "@/types/recipes.type";
import Image from "next/image";
import Link from "next/link";

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const difficultyConfig: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: "Easy", color: "#15803d", bg: "rgba(34,197,94,0.12)" },
  intermediate: { label: "Medium", color: "#a16207", bg: "rgba(234,179,8,0.12)" },
  advance: { label: "Hard", color: "#b91c1c", bg: "rgba(239,68,68,0.12)" },
};

export const CompactRecipeCard = ({ recipe }: { recipe: SavedRecipe }) => {
  const r = recipe.recipeId;
  if (!r) return null;

  const initials = getInitials(r.authorId?.fullName);
  const diff = r.difficulty ? difficultyConfig[r.difficulty] : null;
  const firstTag = r.tags?.[0];

  return (
    <Link
      href={`/recipes/${r._id}`}
      className="flex flex-row items-center gap-3 px-4 py-3 w-full transition-all duration-150 hover:opacity-90"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        borderBottom: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* Details — left */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Title */}
        <p
          className="text-sm font-semibold truncate leading-snug"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {r.title}
        </p>

        {/* Chef row */}
        {r.authorId && (
          <div className="flex items-center gap-1.5">
            {r.authorId.profile_url ? (
              <Image
                src={r.authorId.profile_url}
                alt={r.authorId.fullName}
                width={14}
                height={14}
                className="rounded-full w-3.5 h-3.5 object-cover shrink-0"
              />
            ) : (
              <div
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold shrink-0"
                style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
              >
                {initials.charAt(0)}
              </div>
            )}
            <span
              className="text-xs truncate"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {r.authorId.fullName}
            </span>
          </div>
        )}

        {/* Metadata row */}
        <div className="flex items-center gap-2 flex-wrap">
          {diff && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: diff.bg, color: diff.color }}
            >
              {diff.label}
            </span>
          )}
          {firstTag && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: "var(--cs-surface-3)",
                color: "var(--cs-text-tertiary)",
              }}
            >
              {firstTag}
            </span>
          )}
          {r.ingredients?.length > 0 && (
            <span
              className="text-[10px]"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              {r.ingredients.length} ingredients
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail — right */}
      <div
        className="w-16 h-16 shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        {r.images?.[0] ? (
          <Image
            src={r.images[0]}
            alt={r.title}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span
            className="text-xl font-bold opacity-30"
            style={{ color: "var(--cs-accent)" }}
          >
            {r.title.charAt(0)}
          </span>
        )}
      </div>
    </Link>
  );
};
