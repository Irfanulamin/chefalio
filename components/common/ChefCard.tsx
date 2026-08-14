"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SafeImage } from "@/components/common/SafeImage";
import { BookOpenIcon, ForkKnifeIcon, UsersIcon } from "@phosphor-icons/react/dist/ssr";
import type { Chef } from "@/types/chef.type";
import { initialsOf } from "@/lib/recipe-display";
import { SPRING } from "@/lib/motion";

type ChefCardProps = {
  chef: Chef;
  /** `compact` is the "other chefs" rail; `default` is the Chefs index. */
  size?: "default" | "compact";
};

/**
 * One chef tile, at two sizes.
 *
 * A short brand-tinted cover with the avatar breaking its bottom edge
 * gives the tile a top, the way a real profile card has one, and the
 * stats read as a row of small filled chips rather than a bare
 * definition list that only shows up when the numbers exist.
 *
 * Following happens on the chef's own profile page, not here — a grid of
 * cards is for browsing, and a button that fires a mutation on every tap
 * doesn't belong in a list you're scanning quickly. Followed status still
 * shows, but as the avatar's ring rather than a label: a badge that only
 * exists on some cards makes the row it's in taller than its neighbours
 * and becomes the thing your eye catches on while scanning, not the chef.
 * A ring costs no layout — every card is exactly as tall as it would be
 * without the feature.
 *
 * Hover/focus colours are plain CSS rather than `onMouseEnter` DOM
 * mutation, so keyboard focus gets the same treatment as a pointer hover
 * and nothing can get stuck mid-transition.
 */
export function ChefCard({ chef, size = "default" }: ChefCardProps) {
  const reduce = useReducedMotion();
  const initials = initialsOf(chef.fullName);
  const compact = size === "compact";
  const avatar = compact ? 56 : 76;
  const cover = compact ? 40 : 56;

  const stats = [
    chef.recipeCount !== undefined
      ? { key: "recipes", icon: ForkKnifeIcon, value: chef.recipeCount, label: "Recipes" }
      : null,
    chef.cookbookCount !== undefined
      ? { key: "cookbooks", icon: BookOpenIcon, value: chef.cookbookCount, label: "Cookbooks" }
      : null,
    chef.followerCount !== undefined
      ? { key: "followers", icon: UsersIcon, value: chef.followerCount, label: "Followers" }
      : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <motion.article
      className="ui-card ui-card-interactive group relative flex flex-col items-center overflow-hidden text-center"
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={SPRING.snappy}
    >
      {/* A brand-tinted horizon rather than a real photo — every chef gets
         one, so the card never depends on data that might be missing. */}
      <div
        aria-hidden
        className="w-full shrink-0"
        style={{
          height: cover,
          background:
            "linear-gradient(135deg, var(--cs-accent-muted), var(--cs-surface-3))",
        }}
      />

      <div
        className={`flex w-full flex-col items-center ${compact ? "gap-2 px-4 pb-4" : "gap-3 px-5 pb-5"}`}
        style={{ marginTop: -(avatar / 2) }}
      >
        <div
          className="relative shrink-0 overflow-hidden rounded-full"
          title={chef.isFollowing ? "You follow this chef" : undefined}
          style={{
            width: avatar,
            height: avatar,
            // Followed status rides the avatar's own ring instead of a
            // label elsewhere on the card — it adds no height, so it can
            // never be the thing that makes a followed card taller or
            // shorter than the unfollowed one right next to it in the grid.
            border: chef.isFollowing
              ? "3px solid var(--primary)"
              : "3px solid var(--cs-surface-2)",
            backgroundColor: "var(--cs-surface-2)",
          }}
        >
          <SafeImage
            src={chef.profile_url}
            alt=""
            fill
            sizes={`${avatar}px`}
            loading="lazy"
            className="object-cover"
            fallback={
              <span
                className="flex h-full w-full items-center justify-center font-bold"
                style={{
                  backgroundColor: "var(--cs-accent-muted)",
                  color: "var(--cs-accent-text)",
                  fontSize: compact ? "1rem" : "1.25rem",
                }}
              >
                {initials}
              </span>
            }
          />
        </div>

        <div className="w-full min-w-0">
          <h3 className="ui-subheading">
            <Link
              href={`/chefs/${chef.username}`}
              className="stretched-link focus-ring line-clamp-1 rounded-md transition-colors duration-150 group-hover:text-[color:var(--cs-accent-text)]"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {chef.fullName}
            </Link>
          </h3>
          <p
            className="ui-micro mt-0.5 line-clamp-1"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            @{chef.username}
          </p>
        </div>

        {stats.length > 0 && (
          <dl className="flex items-center gap-2">
            {stats.map((s) => (
              <div
                key={s.key}
                className="flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              >
                <dt className="flex items-center" style={{ color: "var(--cs-text-tertiary)" }}>
                  <s.icon size={11} aria-hidden />
                  <span className="sr-only">{s.label}</span>
                </dt>
                <dd
                  className="ui-micro ui-numeric font-semibold"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </motion.article>
  );
}

export default ChefCard;
