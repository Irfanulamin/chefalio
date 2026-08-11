"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SafeImage } from "@/components/common/SafeImage";
import { BookOpenIcon, ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr";
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
 * The previous version set its hover colours by mutating
 * `e.currentTarget.style` in `onMouseEnter`/`onMouseLeave`. That runs
 * React state through the DOM behind React's back, never fires for a
 * keyboard user, and leaves the button stuck in its hover colours if the
 * pointer leaves during a re-render. It's CSS now, so focus and hover
 * behave the same and neither can get stuck.
 */
export function ChefCard({ chef, size = "default" }: ChefCardProps) {
  const reduce = useReducedMotion();
  const initials = initialsOf(chef.fullName);
  const compact = size === "compact";
  const avatar = compact ? 56 : 80;

  const hasCounts =
    !compact && (chef.recipeCount !== undefined || chef.cookbookCount !== undefined);

  return (
    <motion.article
      className={`ui-card ui-card-interactive group relative flex flex-col items-center text-center ${
        compact ? "gap-2 p-4" : "gap-3 p-5"
      }`}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={SPRING.snappy}
    >
      <div
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{
          width: avatar,
          height: avatar,
          border: "1px solid var(--cs-border-subtle)",
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
            href={`/chefs/${chef._id}`}
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

      {hasCounts && (
        <dl
          className="flex w-full items-center justify-center gap-4 pt-2"
          style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
        >
          {chef.recipeCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <dt className="flex items-center" style={{ color: "var(--cs-text-tertiary)" }}>
                <ForkKnifeIcon size={12} aria-hidden />
                <span className="sr-only">Recipes</span>
              </dt>
              <dd
                className="ui-micro ui-numeric font-semibold"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                {chef.recipeCount}
              </dd>
            </div>
          )}
          {chef.cookbookCount !== undefined && (
            <div className="flex items-center gap-1.5">
              <dt className="flex items-center" style={{ color: "var(--cs-text-tertiary)" }}>
                <BookOpenIcon size={12} aria-hidden />
                <span className="sr-only">Cookbooks</span>
              </dt>
              <dd
                className="ui-micro ui-numeric font-semibold"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                {chef.cookbookCount}
              </dd>
            </div>
          )}
        </dl>
      )}
    </motion.article>
  );
}

export default ChefCard;
