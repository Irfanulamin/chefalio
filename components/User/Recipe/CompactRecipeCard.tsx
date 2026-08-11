"use client";

import { SavedRecipe } from "@/types/recipes.type";
import { difficultyDisplay, initialsOf } from "@/lib/recipe-display";
import { StatusPill } from "@/components/User/shared/StatusPill";
import { SafeImage } from "@/components/common/SafeImage";
import Link from "next/link";

/**
 * A saved or loved recipe, as a list row.
 *
 * This file held a fourth copy of the difficulty ramp, with its own third
 * set of colours (`rgba(34,197,94,0.12)` here vs `#dcfce7` on the grid
 * card) — so the same recipe's "Easy" badge was a different green
 * depending on which screen you were looking at. It reads from
 * `difficultyDisplay` now, like everything else.
 */
export const CompactRecipeCard = ({ recipe }: { recipe: SavedRecipe }) => {
  const r = recipe.recipeId;
  if (!r) return null;

  const initials = initialsOf(r.authorId?.fullName ?? "");
  const diff = r.difficulty ? difficultyDisplay(r.difficulty) : null;
  const firstTag = r.tags?.[0];

  return (
    <Link
      href={`/recipes/${r._id}`}
      className="ui-row focus-ring flex w-full flex-row items-center gap-3 px-4 py-3"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p
          className="ui-subheading truncate"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {r.title}
        </p>

        {r.authorId && (
          <div className="flex items-center gap-1.5">
            <SafeImage
              src={r.authorId.profile_url}
              alt=""
              width={14}
              height={14}
              className="h-3.5 w-3.5 shrink-0 rounded-full object-cover"
              fallback={
                <span
                  className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[7px] font-bold"
                  style={{
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent-text)",
                  }}
                >
                  {initials.charAt(0)}
                </span>
              }
            />
            <span
              className="ui-micro truncate"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {r.authorId.fullName}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {diff && <StatusPill tone={diff.tone}>{diff.label}</StatusPill>}
          {firstTag && (
            <span
              className="ui-micro rounded-md px-1.5 py-0.5 capitalize"
              style={{
                backgroundColor: "var(--cs-surface-3)",
                color: "var(--cs-text-secondary)",
              }}
            >
              {firstTag}
            </span>
          )}
          {r.ingredients?.length > 0 && (
            <span className="ui-micro ui-numeric" style={{ color: "var(--cs-text-tertiary)" }}>
              {r.ingredients.length} ingredients
            </span>
          )}
        </div>
      </div>

      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        <SafeImage
          src={r.images?.[0]}
          alt=""
          width={64}
          height={64}
          className="h-full w-full object-cover"
          loading="lazy"
          fallback={
            <span
              className="text-xl font-bold opacity-40"
              style={{ color: "var(--cs-accent-text)" }}
            >
              {r.title.charAt(0)}
            </span>
          }
        />
      </div>
    </Link>
  );
};
