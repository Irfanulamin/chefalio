"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  BookmarkSimpleIcon,
  ChartLineUpIcon,
  CheckIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  StorefrontIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { POP, POP_TRANSITION, SPRING, VIEWPORT } from "./motion";
import { SectionHeading } from "./shared/SectionHeading";
import { useStaged } from "./shared/useStaged";
import { CHEFS, cld, COOKBOOKS, DISHES } from "./imagery";

const cell = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: SPRING.default },
};

/**
 * Icons sit on a lit tile rather than floating loose on the card. The tile
 * gives them a defined edge and a consistent optical weight across cells,
 * which a bare glyph never has.
 */
function IconTile({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <span className="brand-tile grid h-10 w-10 shrink-0 place-items-center rounded-2xl">
      <Icon size={19} weight="fill" />
    </span>
  );
}

function Cell({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={cell}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.995 }}
      transition={SPRING.snappy}
      className={`group relative flex flex-col overflow-hidden rounded-3xl p-6 ${className}`}
      style={{
        backgroundColor: "var(--cs-surface-1)",
        border: "1px solid var(--cs-border-subtle)",
        boxShadow: "var(--cs-shadow-card)",
      }}
    >
      {children}
    </motion.div>
  );
}

function CellText({
  icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <>
      <IconTile icon={icon} />
      <h3
        className="type-subheading mt-4"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="type-caption mt-2"
        style={{ color: "var(--cs-text-secondary)" }}
      >
        {body}
      </p>
    </>
  );
}

const SURFACE_INSET: React.CSSProperties = {
  backgroundColor: "var(--cs-surface-2)",
  border: "1px solid var(--cs-border-subtle)",
};

// ─── Publish demo ────────────────────────────────────────────────────────────

const RECIPE_STEPS = [
  "Toast the spices",
  "Add chicken + stock",
  "Simmer 18 minutes",
  "Finish with ginger",
];

/**
 * The cell says you can publish a recipe, so it writes one: each step ticks
 * off in order, the way it would if someone were actually working through
 * the form.
 */
function PublishDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, margin: "0px 0px -10% 0px" });
  const { count, reduce } = useStaged(inView, RECIPE_STEPS.length, {
    start: 380,
    step: 400,
  });

  return (
    <div
      ref={ref}
      className="mt-5 flex-1 space-y-1.5 rounded-2xl p-3"
      style={SURFACE_INSET}
    >
      {RECIPE_STEPS.map((text, i) => {
        const done = i < count;
        return (
          <div key={text} className="flex items-center gap-2">
            <motion.span
              className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[8px] font-bold"
              initial={false}
              animate={{
                backgroundColor: done
                  ? "var(--cs-check-fill)"
                  : "var(--cs-surface-1)",
                borderColor: done
                  ? "var(--cs-check-edge)"
                  : "var(--cs-border-default)",
                // A single tick of overshoot on the frame it lands, so the
                // check reads as a press rather than a colour swap.
                scale: reduce || !done ? 1 : POP,
              }}
              transition={{ ...SPRING.snappy, scale: POP_TRANSITION }}
              style={{ borderWidth: 1, borderStyle: "solid" }}
            >
              {done ? (
                <CheckIcon
                  size={8}
                  weight="bold"
                  style={{ color: "var(--cs-check-mark)" }}
                />
              ) : (
                <span style={{ color: "var(--cs-text-tertiary)" }}>{i + 1}</span>
              )}
            </motion.span>
            <motion.span
              className="type-micro truncate"
              initial={false}
              animate={{
                color: done
                  ? "var(--cs-text-secondary)"
                  : "var(--cs-text-tertiary)",
              }}
              transition={SPRING.snappy}
            >
              {text}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Search demo ─────────────────────────────────────────────────────────────

const QUERY = "chicken, under 40 minutes";

const CHIPS = [
  { label: "Under 30 min", on: true },
  { label: "Vegetarian", on: true },
  { label: "One pan", on: true },
  { label: "No oven", on: false },
  { label: "Beginner", on: false },
  { label: "Gluten free", on: false },
];

const ON_CHIPS = CHIPS.filter((c) => c.on).length;

/** Rough per-character typing cadence, plus a little jitter at the commas. */
const CHAR_MS = 46;
const START_MS = 320;
const CHIP_MS = 170;

/**
 * The cell claims the search is worth using, so it demonstrates one instead
 * of describing one: the query types itself in, the filters land one after
 * another, and the result count settles last — the order a person would
 * actually do it in.
 *
 * It runs on entering view and resets on leaving, so scrolling back gets the
 * demo again rather than a spent one. Reduced motion skips straight to the
 * finished state; the point is the end result, not the performance.
 */
function SearchDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const [typed, setTyped] = useState(0);
  const [lit, setLit] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) {
      setTyped(QUERY.length);
      setLit(ON_CHIPS);
      setCount(68);
      return;
    }

    if (!inView) {
      setTyped(0);
      setLit(0);
      setCount(0);
      return;
    }

    const timers: number[] = [];
    for (let i = 1; i <= QUERY.length; i++) {
      timers.push(
        window.setTimeout(() => setTyped(i), START_MS + i * CHAR_MS),
      );
    }

    const typedAt = START_MS + QUERY.length * CHAR_MS + 240;
    for (let n = 1; n <= ON_CHIPS; n++) {
      timers.push(window.setTimeout(() => setLit(n), typedAt + n * CHIP_MS));
    }

    const settledAt = typedAt + ON_CHIPS * CHIP_MS + 140;
    const controls = { current: null as ReturnType<typeof animate> | null };
    timers.push(
      window.setTimeout(() => {
        controls.current = animate(0, 68, {
          duration: 0.5,
          ease: "easeOut",
          onUpdate: (v) => setCount(Math.round(v)),
        });
      }, settledAt),
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      controls.current?.stop();
    };
  }, [inView, reduce]);

  const typing = typed < QUERY.length;
  let onSeen = 0;

  return (
    <div ref={ref} className="mt-5 rounded-2xl p-3" style={SURFACE_INSET}>
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{
          backgroundColor: "var(--cs-surface-1)",
          border: "1px solid var(--cs-border-default)",
        }}
      >
        <MagnifyingGlassIcon
          size={13}
          style={{ color: "var(--cs-text-tertiary)" }}
        />

        {/* The full string is in the DOM for assistive tech and for layout;
            only the visible slice is painted, so the row never reflows as
            characters arrive. */}
        <span className="relative min-w-0 flex-1">
          <span className="type-caption invisible" aria-hidden>
            {QUERY}
          </span>
          <span
            className="type-caption absolute inset-0 truncate"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {QUERY.slice(0, typed)}
            {/* Caret blinks while typing, then holds steady and fades. */}
            <motion.span
              aria-hidden
              className="ml-0.5 inline-block h-3.5 w-px align-middle"
              style={{ backgroundColor: "var(--cs-accent-text)" }}
              animate={
                reduce
                  ? { opacity: 0 }
                  : typing
                    ? { opacity: [1, 1, 0, 0] }
                    : { opacity: 0 }
              }
              transition={
                typing
                  ? { duration: 0.9, repeat: Infinity, ease: "linear" }
                  : { duration: 0.35, delay: 0.4 }
              }
            />
          </span>
        </span>

        <motion.span
          className="type-micro ml-auto shrink-0 rounded-full px-2 py-0.5 font-semibold tabular-nums"
          style={{
            backgroundColor: "var(--cs-accent-muted)",
            color: "var(--cs-accent-text)",
          }}
          initial={false}
          animate={{ opacity: count > 0 ? 1 : 0.35 }}
          transition={SPRING.default}
        >
          {count} results
        </motion.span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {CHIPS.map((chip) => {
          const active = chip.on && onSeen++ < lit;
          return (
            <motion.span
              key={chip.label}
              className="type-micro inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium"
              initial={false}
              animate={{
                backgroundColor: active
                  ? "var(--cs-accent-muted)"
                  : "var(--cs-surface-1)",
                color: active
                  ? "var(--cs-accent-text)"
                  : "var(--cs-text-tertiary)",
                borderColor: active
                  ? "color-mix(in oklab, var(--primary) 40%, transparent)"
                  : "var(--cs-border-subtle)",
                // A small pop on the frame it lands, not a permanent scale.
                scale: active ? 1 : 0.98,
              }}
              transition={SPRING.snappy}
              style={{ borderWidth: 1, borderStyle: "solid" }}
            >
              <motion.span
                className="grid place-items-center overflow-hidden"
                initial={false}
                animate={{ width: active ? 9 : 0, opacity: active ? 1 : 0 }}
                transition={SPRING.snappy}
              >
                <CheckIcon size={9} weight="bold" />
              </motion.span>
              {chip.label}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

export const Features = () => {
  const reduce = useReducedMotion();

  return (
    <section
      id="features"
      className="surface-raised py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Capabilities"
          title="Everything the platform actually does"
          lede="No feature list padding. This is the product."
        />

        {/* whileInView + a shared viewport config, same as every other
            section. An imperative useInView gate here could leave the whole
            grid stuck at opacity 0 if it never fired.

            Rows size to their content. `grid-rows-3` made every row an equal
            1fr, which stretched short cells — the trust strip worst of all —
            to the height of the tallest row and left a slab of empty card
            sitting under the copy. */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto]"
        >
          {/* ── Search — a working-looking query, not a description of one ── */}
          <Cell className="md:col-span-2">
            <CellText
              icon={SlidersHorizontalIcon}
              title="Search that respects your kitchen"
              body="Filter by ingredient, cuisine, dietary preference, cooking time, and difficulty. Find the dish you can actually make tonight."
            />

            <SearchDemo />
          </Cell>

          {/* ── Marketplace — a shelf of cookbooks, fanned ─────────────────── */}
          <Cell className="md:row-span-2">
            <CellText
              icon={StorefrontIcon}
              title="A real cookbook marketplace"
              body="Chefs bundle recipes into cookbooks and set their own price. You buy the ones you want and keep them for good."
            />

            {/* The shelf sits on a dark, neutral ground rather than a green
                one: the covers are photographs now, and they only read as
                distinct objects if the surface behind them isn't competing
                with them for colour. */}
            <div
              className="relative mt-6 flex-1 overflow-hidden rounded-2xl"
              style={{
                minHeight: 200,
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 25%, #2c3327, #171b14)",
              }}
            >
              {/* Covers fan out from a single stack. Rotation is small and
                  the lift is on hover only — a shelf, not a carousel. */}
              <div className="absolute inset-0 flex items-center justify-center">
                {COOKBOOKS.map((book, i) => (
                  <motion.div
                    key={book.title}
                    className="absolute flex h-32 w-24 flex-col justify-end overflow-hidden rounded-xl"
                    style={{
                      backgroundColor: "var(--cs-surface-1)",
                      border: "1px solid var(--cs-border-subtle)",
                      boxShadow: "var(--cs-shadow-float)",
                      zIndex: i === 1 ? 3 : 1,
                    }}
                    initial={false}
                    /* Spread wide enough that the middle cover clears the
                       titles either side of it — at ±58 it sat on top of
                       them. */
                    animate={{
                      x: [-72, 0, 72][i],
                      rotate: reduce ? 0 : [-9, 0, 9][i],
                      scale: i === 1 ? 1 : 0.94,
                    }}
                    whileHover={reduce ? undefined : { y: -8, rotate: 0 }}
                    transition={SPRING.default}
                  >
                    <Image
                      src={cld(book.cover, { w: 200, h: 260 })}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    {/* The title has to stay legible over whatever the crop
                        lands on, so it gets its own gradient rather than
                        relying on the photograph being dark at the bottom. */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/3"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(12,16,9,0.92), rgba(12,16,9,0.55) 45%, transparent)",
                      }}
                    />
                    <div className="relative p-2.5">
                      <p
                        className="type-micro font-semibold leading-tight text-white"
                      >
                        {book.title}
                      </p>
                      <p
                        className="type-micro mt-0.5 font-bold tabular-nums"
                        style={{ color: "var(--primary)" }}
                      >
                        {book.price}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="material-thick absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl px-3 py-2">
                <span className="type-micro vibrant" style={{ fontWeight: 600 }}>
                  One-time purchase
                </span>
                <span
                  className="type-micro font-bold"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  Yours forever
                </span>
              </div>
            </div>
          </Cell>

          {/* ── Publishing — the editor, mid-recipe ────────────────────────── */}
          <Cell>
            <CellText
              icon={NotePencilIcon}
              title="Publish and price your own work"
              body="Upload recipes, group them into a cookbook, and sell straight to the people cooking from it."
            />

            <PublishDemo />
          </Cell>

          {/* ── Analytics — the number first, the shape underneath ─────────── */}
          <Cell>
            <CellText
              icon={ChartLineUpIcon}
              title="Know what is working"
              body="Views, likes, saves, and orders per recipe, so you can see which dishes earn."
            />

            <div className="mt-5 rounded-2xl p-3" style={SURFACE_INSET}>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{
                    color: "var(--cs-text-primary)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  3,148
                </span>
                <span
                  className="type-micro inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-bold"
                  style={{
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent-text)",
                  }}
                >
                  <TrendUpIcon size={9} weight="bold" />
                  18%
                </span>
              </div>
              <p
                className="type-micro mt-0.5"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                Saves this month
              </p>

              <svg
                viewBox="0 0 200 44"
                className="mt-2 h-11 w-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="feature-spark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 36 L28 31 L56 34 L84 21 L112 24 L140 12 L168 16 L200 5 L200 44 L0 44 Z"
                  fill="url(#feature-spark)"
                />
                <path
                  d="M0 36 L28 31 L56 34 L84 21 L112 24 L140 12 L168 16 L200 5"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* A total and a trend line say the number moved. They don't say
                which dish moved it — which is the only part a chef can act
                on, so the cell shows the breakdown it claims to give. */}
            <div className="mt-2.5 flex-1 space-y-1.5">
              {[
                { dish: DISHES[0], saves: "412", delta: "+24%" },
                { dish: DISHES[3], saves: "288", delta: "+11%" },
                { dish: DISHES[5], saves: "196", delta: "+8%" },
              ].map(({ dish, saves, delta }) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-2.5 rounded-xl p-2"
                  style={SURFACE_INSET}
                >
                  <div
                    className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md"
                    style={{ backgroundColor: "var(--cs-surface-3)" }}
                  >
                    <Image
                      src={cld(dish.id, { w: 56, h: 56 })}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                  <p
                    className="type-micro min-w-0 flex-1 truncate font-medium"
                    style={{ color: "var(--cs-text-primary)" }}
                  >
                    {dish.name}
                  </p>
                  <span
                    className="type-micro tabular-nums"
                    style={{ color: "var(--cs-text-tertiary)" }}
                  >
                    {saves}
                  </span>
                  <span
                    className="type-micro font-bold tabular-nums"
                    style={{ color: "var(--cs-accent-text)" }}
                  >
                    {delta}
                  </span>
                </div>
              ))}
            </div>
          </Cell>

          {/* ── Chefs — the bylines, with faces on them ────────────────────── */}
          <Cell>
            <CellText
              icon={SealCheckIcon}
              title="Every recipe has an author"
              body="Chefs apply, get verified, and keep their name on the work. No anonymous content farm."
            />

            <div className="mt-5 flex-1 space-y-1.5">
              {CHEFS.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2.5 rounded-xl p-2"
                  style={SURFACE_INSET}
                >
                  <Image
                    src={cld(c.avatar, { w: 64, h: 64 })}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="type-micro flex items-center gap-1 font-semibold"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      <span className="truncate">{c.name}</span>
                      <SealCheckIcon
                        size={11}
                        weight="fill"
                        className="shrink-0"
                        style={{ color: "var(--cs-accent-text)" }}
                      />
                    </p>
                    <p
                      className="type-micro truncate"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      {c.focus} · {c.kitchen}
                    </p>
                  </div>
                  <span
                    className="type-micro shrink-0 tabular-nums"
                    style={{ color: "var(--cs-text-tertiary)" }}
                  >
                    {c.recipes}
                  </span>
                </div>
              ))}
            </div>
          </Cell>

          {/* ── Library — the shelf you own ────────────────────────────────── */}
          <Cell className="md:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <IconTile icon={BookmarkSimpleIcon} />
                <h3
                  className="type-subheading mt-4"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  One library for everything
                </h3>
                <p
                  className="type-caption mt-2 max-w-sm"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  Saved recipes and purchased cookbooks live in the same place —
                  and the cookbooks stay yours whether or not you keep using the
                  site.
                </p>
              </div>

              {/* What a library actually looks like from the inside: counts,
                  not adjectives. */}
              <div className="flex gap-2.5">
                {[
                  { value: "128", label: "Saved" },
                  { value: "6", label: "Cookbooks" },
                  { value: "14", label: "Collections" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl px-3.5 py-2.5 text-center"
                    style={SURFACE_INSET}
                  >
                    <p
                      className="text-lg font-bold tabular-nums"
                      style={{
                        color: "var(--cs-text-primary)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="type-micro mt-0.5"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* The whole shelf rather than a corner of it — twelve actual
                thumbnails say "your library" in a way eight tinted squares
                never did. */}
            <div className="mt-5 grid flex-1 grid-cols-6 gap-1.5">
              {DISHES.map((d) => (
                <div
                  key={d.id}
                  className="relative aspect-square overflow-hidden rounded-lg"
                  style={{ backgroundColor: "var(--cs-surface-3)" }}
                  title={d.name}
                >
                  <Image
                    src={cld(d.id, { w: 120, h: 120 })}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 96px, 15vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Cell>

          {/* ── Trust — the claims, each one specific ──────────────────────── */}
          <Cell className="md:col-span-3">
            <div className="flex items-start gap-4">
              <IconTile icon={LockKeyIcon} />
              <div className="min-w-0">
                <h3
                  className="type-subheading"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  Secure by default
                </h3>
                <p
                  className="type-caption mt-2"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  Accounts use hashed passwords and tokens held in HTTPOnly
                  cookies. Checkout is handled by a payment provider, so card
                  details never touch our servers.
                </p>
              </div>
            </div>

            {/* A single row of chips left the bottom half of the card empty,
                so each claim now says what it actually means — substance
                rather than padding. Full width, so the four sit in one row
                and the strip closes the grid instead of ending it mid-line. */}
            <div className="mt-5 grid flex-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  claim: "HTTPOnly session cookies",
                  detail: "Tokens are never readable from page JavaScript.",
                },
                {
                  claim: "Hashed passwords",
                  detail: "Salted and hashed at rest — never stored in plain text.",
                },
                {
                  claim: "PCI-compliant checkout",
                  detail: "Card details go straight to the payment provider.",
                },
                {
                  claim: "Role-based access",
                  detail: "Cooks, chefs, and admins each see only their own tools.",
                },
              ].map((item) => (
                <div
                  key={item.claim}
                  className="flex items-start gap-2.5 rounded-2xl p-3"
                  style={SURFACE_INSET}
                >
                  <ShieldCheckIcon
                    size={14}
                    weight="fill"
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--cs-accent-text)" }}
                  />
                  <div className="min-w-0">
                    <p
                      className="type-micro font-semibold"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {item.claim}
                    </p>
                    <p
                      className="type-micro mt-0.5"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Cell>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
