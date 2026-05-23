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

export const CompactRecipeCard = ({ recipe }: { recipe: SavedRecipe }) => {
  const r = recipe.recipeId;
  if (!r) return null;

  const initials = getInitials(r.authorId?.fullName);

  return (
    <Link
      href={`/recipes/${r._id}`}
      className="flex flex-col overflow-hidden rounded-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        maxWidth: "200px",
        width: "200px",
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* 1:1 Thumbnail */}
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ aspectRatio: "1/1", backgroundColor: "var(--cs-surface-3)" }}
      >
        {r.images?.[0] ? (
          <Image
            src={r.images[0]}
            alt={r.title}
            fill
            sizes="200px"
            loading="lazy"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-2xl font-bold opacity-20"
            style={{ color: "var(--cs-accent)" }}
          >
            {r.title.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 min-w-0">
        <h3
          className="text-sm font-semibold truncate"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {r.title}
        </h3>

        <div className="flex items-center gap-1.5">
          {r.authorId?.profile_url ? (
            <Image
              src={r.authorId.profile_url}
              alt={r.authorId.fullName}
              width={14}
              height={14}
              className="rounded-full w-3.5 h-3.5 object-cover shrink-0"
            />
          ) : (
            <div
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
              style={{ backgroundColor: "var(--cs-accent)" }}
            >
              {initials.charAt(0)}
            </div>
          )}
          <span
            className="text-xs truncate"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {r.authorId?.fullName ?? "Unknown"}
          </span>
        </div>

        {r.ingredients?.length > 0 && (
          <span className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
            {r.ingredients.length} ingredients
          </span>
        )}
      </div>
    </Link>
  );
};
