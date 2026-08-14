"use client";

import type { Recipe, RecipeStats } from "@/types/recipes.type";
import { useToggleLove, useToggleSave } from "@/hooks/useRecipe";
import { difficultyDisplay, initialsOf } from "@/lib/recipe-display";
import { EASE, SPRING } from "@/lib/motion";
import { BookmarkSimpleIcon, HeartIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "framer-motion";
import { SafeImage } from "@/components/common/SafeImage";
import Link from "next/link";
import { memo, useCallback } from "react";

/**
 * The moment a toggle commits. Small enough that a grid of twelve cards
 * doesn't jump, big enough to confirm the tap landed on the icon you
 * aimed at.
 */
const TOGGLE_POP = [1, 1.22, 1];

type ToggleProps = {
  active: boolean;
  count: number;
  onToggle: (e: React.MouseEvent) => void;
  label: string;
  activeColor: string;
  Icon: React.ElementType;
};

/**
 * Love and save are the same control with a different glyph, and both
 * were previously plain buttons with no pressed state exposed to
 * assistive tech and no feedback beyond a colour swap.
 */
function StatToggle({
  active,
  count,
  onToggle,
  label,
  activeColor,
  Icon,
}: ToggleProps) {
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={label}
      className="above-stretched-link focus-ring -m-1 flex items-center gap-1.5 rounded-lg p-1 transition-colors duration-150"
      style={{ color: active ? activeColor : "var(--cs-text-tertiary)" }}
    >
      <motion.span
        className="flex"
        animate={reduce ? undefined : { scale: active ? TOGGLE_POP : 1 }}
        transition={{ duration: 0.3, times: [0, 0.42, 1], ease: EASE }}
      >
        <Icon weight={active ? "fill" : "regular"} className="h-4 w-4" />
      </motion.span>
      <span className="ui-micro ui-numeric font-semibold">
        {count.toLocaleString()}
      </span>
    </button>
  );
}

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
    const reduce = useReducedMotion();

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

    const diff = difficultyDisplay(recipe.difficulty);

    /* `authorId` is a populated join, and the join can come back empty: if
       the chef's account is deleted the recipe survives with a dangling
       reference, and Mongoose populates `null`. This used to read
       `recipe.authorId.fullName` directly, so one deleted chef threw a
       TypeError that took down the entire grid — every other recipe on the
       page included. A missing author is a missing byline, not a broken
       page. */
    const author = recipe.authorId ?? null;
    const initials = initialsOf(author?.fullName ?? "");

    return (
      <motion.article
        className="ui-card ui-card-interactive group relative flex w-full flex-col overflow-hidden"
        whileTap={reduce ? undefined : { scale: 0.995 }}
        transition={SPRING.snappy}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4/3", backgroundColor: "var(--cs-surface-3)" }}
        >
          <SafeImage
            src={recipe.images?.[0]}
            alt=""
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            fallback={
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--cs-accent-muted), var(--cs-surface-3))",
                }}
              >
                <span
                  className="text-4xl font-bold opacity-40"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  {recipe.title.charAt(0)}
                </span>
              </div>
            }
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {/* Sits above the card-wide link so it can navigate somewhere
              else — a card is one destination, but the chef's name has
              always been a second one. */}
          <Link
            href={`${chefPath}/${recipe.authorId.username}`}
            className="above-stretched-link focus-ring flex w-fit items-center gap-2 rounded-md"
          >
            <SafeImage
              src={recipe.authorId.profile_url}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="h-5 w-5 rounded-full object-cover"
              fallback={
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                  style={{
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent-text)",
                  }}
                >
                  {initials}
                </span>
              }
            />
            <span
              className="ui-micro max-w-[140px] truncate font-medium capitalize transition-colors duration-150 hover:underline"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {recipe.authorId.fullName}
            </span>
          </Link>

          <h3 className="ui-subheading">
            <Link
              href={`${recipePath}/${recipe._id}`}
              className="stretched-link focus-ring line-clamp-2 rounded-md transition-colors duration-150 group-hover:text-[color:var(--cs-accent-text)]"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {recipe.title}
            </Link>
          </h3>

          {recipe.description && (
            <p
              className="ui-caption line-clamp-2"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {recipe.description}
            </p>
          )}

          {/* Difficulty reads as a fact about the recipe, not a shouty
             sticker — a dot the size of a punctuation mark plus the word,
             sized and weighted to sit level with the tags beside it
             rather than announcing itself as a separate colored pill. */}
          <ul className="flex flex-wrap items-center gap-1.5">
            <li
              className="ui-micro flex items-center gap-1.5 font-medium"
              style={{ color: `var(--cs-${diff.tone}-fg)` }}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--cs-${diff.tone}-fg)` }}
              />
              {diff.label}
            </li>
            {recipe.tags.slice(0, 2).map((tag) => (
              <li
                key={tag}
                className="ui-micro rounded-full px-2 py-0.5 capitalize"
                style={{
                  backgroundColor: "var(--cs-surface-3)",
                  color: "var(--cs-text-secondary)",
                }}
              >
                {tag}
              </li>
            ))}
          </ul>

          <div
            className="mt-auto flex items-center gap-4 pt-3"
            style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
          >
            <StatToggle
              active={Boolean(stats?.isLoved)}
              count={recipe.lovedCount}
              onToggle={handleLoveToggle}
              label={stats?.isLoved ? "Remove from favourites" : "Add to favourites"}
              activeColor="var(--cs-love)"
              Icon={HeartIcon}
            />
            <StatToggle
              active={Boolean(stats?.isSaved)}
              count={recipe.savedCount}
              onToggle={handleSaveToggle}
              label={stats?.isSaved ? "Remove from saved" : "Save recipe"}
              activeColor="var(--cs-text-primary)"
              Icon={BookmarkSimpleIcon}
            />
          </div>
        </div>
      </motion.article>
    );
  },
);

RecipeCard.displayName = "RecipeCard";
