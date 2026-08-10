"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookmarkSimpleIcon,
  BookOpenIcon,
  ChartLineUpIcon,
  ChefHatIcon,
  CheckCircleIcon,
  ClockIcon,
  CompassIcon,
  CurrencyDollarIcon,
  LockSimpleIcon,
  MagnifyingGlassIcon,
  SlidersHorizontalIcon,
  StarIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { cld, DISHES } from "./imagery";

/**
 * The hero's product shot.
 *
 * This replaced a chef/admin dashboard toggle. Two panels behind a switch in
 * a hero is a demo, not a promise — it asked the visitor to operate something
 * before they knew what it was, and swapping panels resized the page under
 * their pointer. What's left is one surface showing the thing the headline
 * claims: chef-tested recipes you can filter down to tonight's dinner, with
 * the earning side of the marketplace floating alongside as depth rather
 * than as a second mode.
 *
 * No charts, no data hooks — sample content only, and everything animates on
 * transform and opacity.
 */

const NAV = [
  { label: "Discover", icon: CompassIcon, active: true },
  { label: "Cookbooks", icon: BookOpenIcon },
  { label: "Saved", icon: BookmarkSimpleIcon },
  { label: "Chefs", icon: ChefHatIcon },
  { label: "Analytics", icon: ChartLineUpIcon },
];

const FILTERS = [
  { label: "Under 30 min", on: true },
  { label: "Vegetarian", on: true },
  { label: "One pan", on: true },
  { label: "No oven", on: false },
  { label: "Beginner", on: false },
];

/** Six real dishes, saved-state hand-set so the grid isn't uniform. */
const SAVED = new Set([0, 3]);
const RECIPES = DISHES.slice(0, 6).map((d, i) => ({
  ...d,
  saved: SAVED.has(i),
}));

export function HeroVisual() {
  const reduce = useReducedMotion();

  /** Cards resolve in sequence, so the grid reads as filling rather than
   *  appearing all at once. Short and shallow — this is scenery. */
  const card = (i: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { ...SPRING.default, delay: 0.5 + i * 0.05 },
        };

  return (
    <div className="relative h-full">
      {/* The window fills whatever height the hero has left and dissolves at
          its bottom edge — the cut is what says there's more page below,
          without anything actually overflowing the fold. The fade is scoped
          to this wrapper alone, so the floating layers below it are siblings
          and can overhang without being clipped. */}
      <div
        className="h-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to bottom, #000 70%, rgba(0,0,0,0.35) 89%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 70%, rgba(0,0,0,0.35) 89%, transparent)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
      <div
        className="relative w-full overflow-hidden rounded-3xl"
        style={{
          border: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-1)",
          boxShadow: "var(--cs-shadow-float)",
        }}
      >
        {/* Window chrome — a translucent bar the content passes under, not
            an opaque strip bolted on top. */}
        <div
          className="material relative z-10 flex items-center gap-3 rounded-none px-3.5 py-2.5"
          style={{ borderWidth: "0 0 1px 0" }}
        >
          <div className="flex shrink-0 gap-1.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span
                key={c}
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: c, opacity: 0.85 }}
              />
            ))}
          </div>

          <div
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1"
            style={{
              backgroundColor: "var(--cs-surface-3)",
              border: "1px solid var(--cs-border-subtle)",
            }}
          >
            <LockSimpleIcon
              size={10}
              weight="fill"
              style={{ color: "var(--cs-text-tertiary)" }}
            />
            <span
              className="truncate text-[10px]"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              chefalio.xyz/recipes
            </span>
          </div>

          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9px] font-bold"
            style={{
              backgroundColor: "var(--cs-accent-muted)",
              color: "var(--cs-accent-text)",
            }}
          >
            SA
          </span>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className="hidden w-44 shrink-0 flex-col gap-0.5 p-3 sm:flex"
            style={{ borderRight: "1px solid var(--cs-border-subtle)" }}
          >
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
                  style={{
                    backgroundColor: item.active
                      ? "var(--cs-accent-muted)"
                      : "transparent",
                  }}
                >
                  <Icon
                    size={14}
                    weight={item.active ? "fill" : "regular"}
                    style={{
                      color: item.active
                        ? "var(--cs-accent-text)"
                        : "var(--cs-text-tertiary)",
                    }}
                  />
                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color: item.active
                        ? "var(--cs-text-primary)"
                        : "var(--cs-text-secondary)",
                    }}
                  >
                    {item.label}
                  </span>
                </span>
              );
            })}
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1 p-3.5 sm:p-4">
            <div className="flex items-center gap-2">
              <div
                className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2"
                style={{
                  backgroundColor: "var(--cs-surface-2)",
                  border: "1px solid var(--cs-border-default)",
                }}
              >
                <MagnifyingGlassIcon
                  size={13}
                  style={{ color: "var(--cs-accent-text)" }}
                />
                <span
                  className="truncate text-[11px]"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  chicken, under 40 minutes
                </span>
                <span
                  className="ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent-text)",
                  }}
                >
                  68
                </span>
              </div>
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                style={{
                  backgroundColor: "var(--cs-surface-2)",
                  border: "1px solid var(--cs-border-subtle)",
                }}
              >
                <SlidersHorizontalIcon
                  size={13}
                  style={{ color: "var(--cs-text-secondary)" }}
                />
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {FILTERS.map((f) => (
                <span
                  key={f.label}
                  className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                  style={
                    f.on
                      ? {
                          backgroundColor: "var(--cs-accent-muted)",
                          color: "var(--cs-accent-text)",
                          border:
                            "1px solid color-mix(in oklab, var(--primary) 40%, transparent)",
                        }
                      : {
                          backgroundColor: "var(--cs-surface-2)",
                          color: "var(--cs-text-tertiary)",
                          border: "1px solid var(--cs-border-subtle)",
                        }
                  }
                >
                  {f.label}
                </span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3">
              {RECIPES.map((r, i) => (
                <motion.div
                  key={r.name}
                  {...card(i)}
                  className="overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: "var(--cs-surface-2)",
                    border: "1px solid var(--cs-border-subtle)",
                  }}
                >
                  <div
                    className="relative h-16"
                    style={{ backgroundColor: "var(--cs-surface-3)" }}
                  >
                    <Image
                      src={cld(r.id, { w: 320, h: 200 })}
                      alt=""
                      fill
                      sizes="180px"
                      className="object-cover"
                      priority={i < 3}
                    />
                    <span
                      className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full"
                      style={{
                        backgroundColor: r.saved
                          ? "var(--primary)"
                          : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <BookmarkSimpleIcon
                        size={9}
                        weight={r.saved ? "fill" : "regular"}
                        style={{ color: "#12200a" }}
                      />
                    </span>
                  </div>

                  <div className="p-2">
                    <p
                      className="truncate text-[10px] font-semibold"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {r.name}
                    </p>
                    <p
                      className="mt-0.5 truncate text-[9px]"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      {r.chef}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-0.5 text-[9px]"
                        style={{ color: "var(--cs-text-tertiary)" }}
                      >
                        <ClockIcon size={9} /> {r.time}
                      </span>
                      <span
                        className="inline-flex items-center gap-0.5 text-[9px]"
                        style={{ color: "var(--cs-text-tertiary)" }}
                      >
                        <StarIcon
                          size={9}
                          weight="fill"
                          style={{ color: "var(--cs-accent-text)" }}
                        />
                        {r.rating}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Floating layers. Depth comes from surfaces sitting at different
          heights above the window, not from a second interactive mode. */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.94 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={reduce ? { duration: 0.2 } : { ...SPRING.default, delay: 0.85 }}
        className="material-thick absolute -right-3 top-16 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 md:flex lg:-right-8"
      >
        <CheckCircleIcon
          size={18}
          weight="fill"
          style={{ color: "var(--cs-accent-text)" }}
        />
        <div>
          <p className="vibrant text-[11px]" style={{ fontWeight: 600 }}>
            Saved to your library
          </p>
          <p
            className="text-[10px]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            {RECIPES[0].name}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.94 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={reduce ? { duration: 0.2 } : { ...SPRING.default, delay: 1 }}
        className="material-thick absolute -left-3 top-40 hidden rounded-2xl px-3.5 py-3 md:block lg:-left-8"
      >
        <div className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-lg"
            style={{ backgroundColor: "var(--cs-accent-muted)" }}
          >
            <CurrencyDollarIcon
              size={13}
              weight="fill"
              style={{ color: "var(--cs-accent-text)" }}
            />
          </span>
          <div>
            <p
              className="text-[10px]"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              Payout this week
            </p>
            <p className="vibrant text-sm tabular-nums" style={{ fontWeight: 700 }}>
              $1,284
            </p>
          </div>
          <span
            className="ml-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
            style={{
              backgroundColor: "var(--cs-accent-muted)",
              color: "var(--cs-accent-text)",
            }}
          >
            <TrendUpIcon size={8} weight="bold" /> 24%
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroVisual;
