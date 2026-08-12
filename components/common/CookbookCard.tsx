"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SafeImage } from "@/components/common/SafeImage";
import type { Cookbook } from "@/types/cookbook.type";
import { cookbookPrice, initialsOf } from "@/lib/recipe-display";
import { SPRING } from "@/lib/motion";
import { StatusPill } from "@/components/User/shared/StatusPill";

type CookbookCardProps = {
  cookbook: Cookbook;
  /** Adds the buy action in the footer. Off on browse-only surfaces. */
  showBuy?: boolean;
  /** Hidden when the card already sits under that chef's own heading. */
  showAuthor?: boolean;
};

/**
 * One cookbook tile for the whole app.
 *
 * There were three of these — this file, an inline copy in the cookbooks
 * list page, and a third inside the chef profile — with three different
 * price treatments and two different rounding rules, so the same book
 * could show a different price in the grid than at checkout.
 *
 * The hover "Preview" overlay is gone. It only ever appeared on a mouse,
 * so on a phone the cover had no affordance at all; and it covered the
 * artwork, which on a cookbook *is* the product. The whole card is the
 * link now, which is a bigger target and works on every input.
 */
export function CookbookCard({
  cookbook,
  showBuy = false,
  showAuthor = true,
}: CookbookCardProps) {
  const reduce = useReducedMotion();
  const price = cookbookPrice(cookbook.price, cookbook.discount ?? 0);
  const initials = initialsOf(cookbook.authorId?.fullName ?? "");

  return (
    <motion.article
      className="ui-card ui-card-interactive group relative flex flex-col overflow-hidden"
      whileTap={reduce ? undefined : { scale: 0.995 }}
      transition={SPRING.snappy}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "3/4", backgroundColor: "var(--cs-surface-3)" }}
      >
        <SafeImage
          src={cookbook.cookbook_image}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
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
                className="text-5xl font-bold opacity-40"
                style={{ color: "var(--cs-accent-text)" }}
              >
                {cookbook.title.charAt(0)}
              </span>
            </div>
          }
        />

        {price.discountPct > 0 && (
          <StatusPill tone="success" overMedia className="absolute left-2.5 top-2.5">
            −{price.discountPct}%
          </StatusPill>
        )}

        {/* The price is the one thing that has to survive any cover art,
            so it carries its own material rather than trusting the
            photograph underneath it. */}
        <span
          className="material-thick ui-numeric absolute bottom-2.5 right-2.5 flex items-baseline gap-1.5 rounded-lg px-2.5 py-1"
          style={{ color: "var(--cs-text-primary)" }}
        >
          <span className="text-sm font-bold">{price.current}</span>
          {price.original && (
            <span
              className="ui-micro line-through"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              {price.original}
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {showAuthor && cookbook.authorId && (
          <Link
            href={`/chefs/${cookbook.authorId._id}`}
            className="above-stretched-link focus-ring flex w-fit items-center gap-2 rounded-md"
          >
            <SafeImage
              src={cookbook.authorId.profile_url}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="h-5 w-5 shrink-0 rounded-full object-cover"
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
              className="ui-micro max-w-[140px] truncate font-medium transition-colors hover:underline"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {cookbook.authorId.fullName}
            </span>
          </Link>
        )}

        <h3 className="ui-subheading">
          <Link
            href={`/purchase-cookbook/${cookbook._id}`}
            className="stretched-link focus-ring line-clamp-2 rounded-md transition-colors duration-150 group-hover:text-[color:var(--cs-accent-text)]"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {cookbook.title}
          </Link>
        </h3>

        {cookbook.description && (
          <p
            className="ui-caption line-clamp-2"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {cookbook.description}
          </p>
        )}

        {showBuy && (
          <div
            className="mt-auto pt-3"
            style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
          >
            {/* Presses on contact rather than on release. The card itself
                already scales under `whileTap`; without its own state this
                button would be the one thing on the tile that didn't
                acknowledge the finger. */}
            <Link
              href={`/purchase-cookbook/${cookbook._id}`}
              className="above-stretched-link focus-ring block w-full rounded-xl py-2 text-center text-sm font-semibold transition-[background-color,opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97] active:duration-[90ms] motion-reduce:active:scale-100"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {price.isFree ? "Get for free" : "Buy now"}
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default CookbookCard;
