"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookmarkSimpleIcon,
  ChartLineUpIcon,
  CheckIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  StorefrontIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING, VIEWPORT } from "./motion";
import { SectionHeading } from "./shared/SectionHeading";

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
    <span
      className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl"
      style={{
        background:
          "linear-gradient(145deg, color-mix(in oklab, var(--primary) 92%, white), color-mix(in oklab, var(--secondary) 55%, var(--primary)))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 16px -8px color-mix(in oklab, var(--primary) 90%, transparent)",
      }}
    >
      <Icon size={19} weight="fill" style={{ color: "#12200a" }} />
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
            grid stuck at opacity 0 if it never fired. */}
        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3"
        >
          {/* ── Search — a working-looking query, not a description of one ── */}
          <Cell className="md:col-span-2">
            <CellText
              icon={SlidersHorizontalIcon}
              title="Search that respects your kitchen"
              body="Filter by ingredient, cuisine, dietary preference, cooking time, and difficulty. Find the dish you can actually make tonight."
            />

            <div className="mt-5 rounded-2xl p-3" style={SURFACE_INSET}>
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
                <span
                  className="type-caption"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  chickpeas, 30 minutes, no oven
                </span>
                <span
                  aria-hidden
                  className="ml-0.5 inline-block h-3.5 w-px"
                  style={{ backgroundColor: "var(--cs-accent-text)" }}
                />
                <span
                  className="type-micro ml-auto shrink-0 rounded-full px-2 py-0.5 font-semibold"
                  style={{
                    backgroundColor: "var(--cs-accent-muted)",
                    color: "var(--cs-accent-text)",
                  }}
                >
                  68 results
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {[
                  { label: "Under 30 min", on: true },
                  { label: "Vegetarian", on: true },
                  { label: "One pan", on: true },
                  { label: "No oven", on: false },
                  { label: "Beginner", on: false },
                  { label: "Gluten free", on: false },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className="type-micro inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition-colors duration-200"
                    style={
                      chip.on
                        ? {
                            backgroundColor: "var(--cs-accent-muted)",
                            color: "var(--cs-accent-text)",
                            border:
                              "1px solid color-mix(in oklab, var(--primary) 40%, transparent)",
                          }
                        : {
                            backgroundColor: "var(--cs-surface-1)",
                            color: "var(--cs-text-tertiary)",
                            border: "1px solid var(--cs-border-subtle)",
                          }
                    }
                  >
                    {chip.on && <CheckIcon size={9} weight="bold" />}
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </Cell>

          {/* ── Marketplace — a shelf of cookbooks, fanned ─────────────────── */}
          <Cell className="md:row-span-2">
            <CellText
              icon={StorefrontIcon}
              title="A real cookbook marketplace"
              body="Chefs bundle recipes into cookbooks and set their own price. You buy the ones you want and keep them for good."
            />

            <div
              className="relative mt-6 flex-1 overflow-hidden rounded-2xl"
              style={{
                minHeight: 200,
                background:
                  "linear-gradient(155deg, color-mix(in oklab, var(--primary) 65%, transparent), color-mix(in oklab, var(--accent) 92%, transparent))",
              }}
            >
              {/* Covers fan out from a single stack. Rotation is small and
                  the lift is on hover only — a shelf, not a carousel. */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[
                  { title: "Weeknight Italian", price: "$24", x: -58, r: -9 },
                  { title: "Fermentation", price: "$32", x: 0, r: 0 },
                  { title: "Knife Skills", price: "$18", x: 58, r: 9 },
                ].map((book, i) => (
                  <motion.div
                    key={book.title}
                    className="absolute flex h-32 w-24 flex-col justify-end rounded-xl p-2.5"
                    style={{
                      backgroundColor: "var(--cs-surface-1)",
                      border: "1px solid var(--cs-border-subtle)",
                      boxShadow: "var(--cs-shadow-float)",
                      zIndex: i === 1 ? 3 : 1,
                    }}
                    initial={false}
                    animate={{ x: book.x, rotate: reduce ? 0 : book.r }}
                    whileHover={reduce ? undefined : { y: -8, rotate: 0 }}
                    transition={SPRING.default}
                  >
                    <div
                      className="absolute inset-x-2.5 top-2.5 h-14 rounded-md"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, transparent), color-mix(in oklab, var(--accent) 85%, transparent))",
                      }}
                    />
                    <p
                      className="type-micro font-semibold leading-tight"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {book.title}
                    </p>
                    <p
                      className="type-micro mt-0.5 font-bold tabular-nums"
                      style={{ color: "var(--cs-accent-text)" }}
                    >
                      {book.price}
                    </p>
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

            <div className="mt-5 space-y-1.5 rounded-2xl p-3" style={SURFACE_INSET}>
              {[
                { step: "1", text: "Toast the spices", done: true },
                { step: "2", text: "Add chickpeas + stock", done: true },
                { step: "3", text: "Simmer 18 minutes", done: false },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-2">
                  <span
                    className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[8px] font-bold"
                    style={{
                      backgroundColor: s.done
                        ? "var(--primary)"
                        : "var(--cs-surface-1)",
                      color: s.done
                        ? "var(--primary-foreground)"
                        : "var(--cs-text-tertiary)",
                      border: s.done
                        ? "none"
                        : "1px solid var(--cs-border-default)",
                    }}
                  >
                    {s.done ? <CheckIcon size={8} weight="bold" /> : s.step}
                  </span>
                  <span
                    className="type-micro truncate"
                    style={{
                      color: s.done
                        ? "var(--cs-text-secondary)"
                        : "var(--cs-text-tertiary)",
                    }}
                  >
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
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
          </Cell>

          {/* ── Library — the shelf you own ────────────────────────────────── */}
          <Cell>
            <CellText
              icon={BookmarkSimpleIcon}
              title="One library for everything"
              body="Saved recipes and purchased cookbooks live in the same place."
            />

            <div className="mt-5 grid grid-cols-4 gap-1.5">
              {[
                "Orzo",
                "Shakshuka",
                "Miso beans",
                "Focaccia",
                "Congee",
                "Tagine",
                "Laksa",
                "Kimchi",
              ].map((r, i) => (
                <div
                  key={r}
                  className="aspect-square rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in oklab, var(--primary) 45%, transparent), color-mix(in oklab, var(--accent) 80%, transparent))",
                    opacity: 1 - i * 0.085,
                  }}
                  title={r}
                />
              ))}
            </div>
          </Cell>

          {/* ── Trust — the claims, each one specific ──────────────────────── */}
          <Cell className="md:col-span-2">
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

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "HTTPOnly session cookies",
                "Hashed passwords",
                "PCI-compliant checkout",
                "Role-based access",
              ].map((claim) => (
                <span
                  key={claim}
                  className="type-micro inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium"
                  style={{
                    backgroundColor: "var(--cs-surface-2)",
                    border: "1px solid var(--cs-border-subtle)",
                    color: "var(--cs-text-secondary)",
                  }}
                >
                  <ShieldCheckIcon
                    size={11}
                    weight="fill"
                    style={{ color: "var(--cs-accent-text)" }}
                  />
                  {claim}
                </span>
              ))}
            </div>
          </Cell>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
