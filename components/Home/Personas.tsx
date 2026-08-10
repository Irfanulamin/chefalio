"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CheckIcon,
  ChefHatIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  StarIcon,
  TrendUpIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { cld, COOKBOOKS, DISHES } from "./imagery";
import { Reveal } from "./shared/Reveal";
import { SectionHeading } from "./shared/SectionHeading";

/**
 * "Who it's for" used to be a swipeable tab carousel: three panels on a
 * draggable track, one visible at a time, auto-advancing every 3.5 seconds
 * unless you hovered it, with velocity projection and rubberbanding at the
 * ends. Several hundred lines of gesture machinery.
 *
 * It answered the wrong question. A visitor reading this section is asking
 * "which of these is me?" — and that is a comparison, so hiding two thirds
 * of the answer behind a control is the one thing the layout must not do.
 * Worse, the autoplay meant the panel could change while it was being read.
 *
 * All three are now on the page at once, side by side, which is both the
 * simpler component and the better answer. The gesture code is gone rather
 * than hidden behind a breakpoint.
 */

type PersonaId = "cooks" | "chefs" | "admins";

const PERSONAS: {
  id: PersonaId;
  tab: string;
  icon: React.ElementType;
  headline: string;
  body: string;
  points: string[];
  cta: { label: string; href: string };
}[] = [
  {
    id: "cooks",
    tab: "Home cooks",
    icon: MagnifyingGlassIcon,
    headline: "Find the dish, not a wall of blog posts",
    body: "Filter by what is actually in your kitchen and how much time you have. Save what works, buy the cookbooks worth owning.",
    points: [
      "Filter by ingredient, cuisine, diet, time, and difficulty",
      "Save recipes and purchased cookbooks to one library",
      "Buy individual cookbooks, no subscription required",
    ],
    cta: { label: "Browse recipes", href: "/recipes" },
  },
  {
    id: "chefs",
    tab: "Chefs",
    icon: ChefHatIcon,
    headline: "Publish your work and get paid for it",
    body: "Upload recipes, group them into cookbooks, and sell straight to the people cooking them. You keep the audience.",
    points: [
      "Publish recipes with full instructions and imagery",
      "Bundle recipes into cookbooks and price them yourself",
      "Track views, likes, saves, and orders as they land",
    ],
    cta: { label: "Apply as a chef", href: "/apply-chef" },
  },
  {
    id: "admins",
    tab: "Admins",
    icon: ShieldCheckIcon,
    headline: "See the whole platform in one view",
    body: "Review chef applications, watch revenue and engagement move, and keep the catalogue healthy without guesswork.",
    points: [
      "Review and approve incoming chef applications",
      "Track users, revenue, and recipe engagement over time",
      "Manage users, roles, cookbooks, and orders",
    ],
    cta: { label: "See the platform", href: "/chefs" },
  },
];

const CARD: React.CSSProperties = {
  backgroundColor: "var(--cs-surface-1)",
  border: "1px solid var(--cs-border-subtle)",
};

// ─── Panel visuals ───────────────────────────────────────────────────────────

function CooksVisual() {
  return (
    <div className="space-y-2.5">
      <div
        className="flex items-center gap-2 rounded-2xl px-3.5 py-3"
        style={{ ...CARD, borderColor: "var(--cs-border-default)" }}
      >
        <MagnifyingGlassIcon size={15} style={{ color: "var(--cs-accent-text)" }} />
        <span className="type-caption" style={{ color: "var(--cs-text-primary)" }}>
          chicken · under 40 min
        </span>
        <span
          className="type-micro ml-auto rounded-full px-2 py-0.5 font-bold"
          style={{
            backgroundColor: "var(--cs-accent-muted)",
            color: "var(--cs-accent-text)",
          }}
        >
          68
        </span>
      </div>

      {DISHES.slice(0, 3).map((r, i) => (
        <div key={r.name} className="flex items-center gap-3 rounded-2xl p-2.5" style={CARD}>
          <div
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
            style={{ backgroundColor: "var(--cs-surface-3)" }}
          >
            <Image
              src={cld(r.id, { w: 96, h: 96 })}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="type-caption truncate font-semibold"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {r.name}
            </p>
            <div className="mt-1 flex items-center gap-2.5">
              <span
                className="type-micro inline-flex items-center gap-1"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                <ClockIcon size={10} /> {r.time}
              </span>
              <span
                className="type-micro inline-flex items-center gap-1"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                <StarIcon size={10} weight="fill" style={{ color: "var(--cs-accent-text)" }} />
                {r.rating}
              </span>
            </div>
          </div>
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
            style={{
              backgroundColor:
                i === 0 ? "var(--cs-accent-muted)" : "var(--cs-surface-2)",
              border:
                i === 0
                  ? "1px solid color-mix(in oklab, var(--primary) 40%, transparent)"
                  : "1px solid var(--cs-border-subtle)",
            }}
          >
            <BookmarkSimpleIcon
              size={13}
              weight={i === 0 ? "fill" : "regular"}
              style={{
                color:
                  i === 0 ? "var(--cs-accent-text)" : "var(--cs-text-tertiary)",
              }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

function ChefsVisual() {
  return (
    <div className="space-y-2.5">
      <div
        className="rounded-2xl p-4"
        style={{
          background:
            "linear-gradient(150deg, color-mix(in oklab, var(--primary) 72%, transparent), color-mix(in oklab, var(--accent) 92%, transparent))",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="type-micro font-semibold" style={{ color: "#12200a" }}>
            Paid out this month
          </span>
          <span
            className="type-micro inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.55)", color: "#12200a" }}
          >
            <TrendUpIcon size={9} weight="bold" /> 24%
          </span>
        </div>
        <p
          className="mt-1.5 text-3xl font-bold tabular-nums"
          style={{ color: "#12200a", letterSpacing: "-0.035em" }}
        >
          $1,284
        </p>
      </div>

      {COOKBOOKS.map((row, i) => {
        const sold = [78, 54, 0][i];
        const price = sold === 0 ? "Draft" : row.price;
        return (
          <div key={row.title} className="rounded-2xl px-3.5 py-3" style={CARD}>
            <div className="flex items-center gap-3">
              <div
                className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              >
                <Image
                  src={cld(row.cover, { w: 72, h: 72 })}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="type-caption truncate font-semibold"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {row.title}
                </p>
                <p className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
                  {row.recipes}
                </p>
              </div>
              <span
                className="type-caption shrink-0 font-bold tabular-nums"
                style={{
                  color: sold
                    ? "var(--cs-accent-text)"
                    : "var(--cs-text-tertiary)",
                }}
              >
                {price}
              </span>
            </div>
            <div
              className="mt-2.5 h-1.5 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--cs-surface-3)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${sold}%`,
                  backgroundColor: "var(--primary)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdminsVisual() {
  return (
    <div className="space-y-2.5">
      {[
        { name: "Amara Osei", meta: "Applied 2 days ago · Accra" },
        { name: "Yuki Tanaka", meta: "Applied 4 days ago · Osaka" },
      ].map((a) => (
        <div key={a.name} className="flex items-center gap-3 rounded-2xl px-3.5 py-3" style={CARD}>
          <span
            className="type-caption grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold"
            style={{
              backgroundColor: "var(--cs-accent-muted)",
              color: "var(--cs-accent-text)",
            }}
          >
            {a.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="type-caption truncate font-semibold"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {a.name}
            </p>
            <p className="type-micro truncate" style={{ color: "var(--cs-text-tertiary)" }}>
              {a.meta}
            </p>
          </div>
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
            style={{
              backgroundColor: "var(--cs-surface-2)",
              border: "1px solid var(--cs-border-subtle)",
            }}
          >
            <XIcon size={11} weight="bold" style={{ color: "var(--cs-text-tertiary)" }} />
          </span>
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
            style={{
              backgroundColor: "var(--cs-check-fill)",
              border: "1px solid var(--cs-check-edge)",
            }}
          >
            <CheckIcon
              size={11}
              weight="bold"
              style={{ color: "var(--cs-check-mark)" }}
            />
          </span>
        </div>
      ))}

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Users", value: "12,480", delta: "+412", icon: UsersThreeIcon },
          { label: "Revenue", value: "$52.9k", delta: "+24%", icon: CurrencyDollarIcon },
          { label: "Saves", value: "3,148", delta: "+18%", icon: BookmarkSimpleIcon },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl p-3" style={CARD}>
              <span
                className="grid h-7 w-7 place-items-center rounded-lg"
                style={{ backgroundColor: "var(--cs-accent-muted)" }}
              >
                <Icon size={13} weight="fill" style={{ color: "var(--cs-accent-text)" }} />
              </span>
              <p
                className="type-caption mt-2.5 font-bold tabular-nums"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {s.value}
              </p>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
                  {s.label}
                </span>
                <span
                  className="type-micro font-bold"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  {s.delta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex h-16 items-end gap-1.5 rounded-2xl px-3.5 py-3"
        style={CARD}
      >
        {[42, 58, 48, 72, 64, 88, 100].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${h}%`,
              backgroundColor:
                i === 6
                  ? "var(--primary)"
                  : "color-mix(in oklab, var(--primary) 32%, transparent)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const VISUALS: Record<PersonaId, () => React.JSX.Element> = {
  cooks: CooksVisual,
  chefs: ChefsVisual,
  admins: AdminsVisual,
};

// ─── Section ─────────────────────────────────────────────────────────────────

export const Personas = () => {
  const reduce = useReducedMotion();

  return (
    <section id="personas" className="surface-raised py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Who it's for"
          title="One platform, three jobs to do"
          lede="Chefalio is the same product seen from three sides. All three are below — find yours."
        />

        {/* One band per audience rather than three columns.

            As columns, the three cards were the same height but their
            contents were not — the visuals run three rows, four rows and six
            blocks — so each card carried a different slab of dead space above
            its button and the row read as broken. Height is only a problem
            when things are forced to share it; given a band each, the three
            size themselves and the visuals get roughly half the page instead
            of a third of it. */}
        <div className="mt-14 flex flex-col">
          {PERSONAS.map((persona, i) => {
            const Icon = persona.icon;
            const Visual = VISUALS[persona.id];
            const flipped = i % 2 === 1;

            return (
              <Reveal key={persona.id} distance={22}>
                <div
                  className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16"
                  style={
                    i === 0
                      ? undefined
                      : { borderTop: "1px solid var(--cs-border-subtle)" }
                  }
                >
                  <div className={flipped ? "lg:order-2" : undefined}>
                    <div className="flex items-center gap-3">
                      <span className="brand-tile grid h-10 w-10 shrink-0 place-items-center rounded-2xl">
                        <Icon size={19} weight="fill" />
                      </span>
                      <span
                        className="type-label"
                        style={{ color: "var(--cs-accent-text)" }}
                      >
                        {persona.tab}
                      </span>
                    </div>

                    <h3
                      className="type-heading mt-5"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {persona.headline}
                    </h3>
                    <p
                      className="type-body mt-3 max-w-md"
                      style={{ color: "var(--cs-text-secondary)" }}
                    >
                      {persona.body}
                    </p>

                    <ul className="mt-7 space-y-3">
                      {persona.points.map((point) => (
                        <li key={point} className="flex gap-2.5">
                          <span
                            className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                            style={{
                              backgroundColor: "var(--cs-check-fill)",
                              border: "1px solid var(--cs-check-edge)",
                            }}
                          >
                            <CheckIcon
                              size={9}
                              weight="bold"
                              style={{ color: "var(--cs-check-mark)" }}
                            />
                          </span>
                          <span
                            className="type-caption"
                            style={{ color: "var(--cs-text-secondary)" }}
                          >
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <motion.div
                      whileTap={reduce ? undefined : { scale: 0.97 }}
                      transition={SPRING.snappy}
                      className="mt-8 w-fit"
                    >
                      <Link
                        href={persona.cta.href}
                        className="type-subheading group inline-flex h-11 items-center gap-2 rounded-full px-5"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }}
                      >
                        {persona.cta.label}
                        <ArrowRightIcon
                          size={15}
                          weight="bold"
                          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                        />
                      </Link>
                    </motion.div>
                  </div>

                  {/* The visual sits on a recessed ground so it reads as a
                      piece of the product rather than more page. */}
                  <motion.div
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={SPRING.snappy}
                    className={`rounded-3xl p-4 md:p-5 ${
                      flipped ? "lg:order-1" : ""
                    }`}
                    style={{
                      backgroundColor: "var(--cs-surface-3)",
                      border: "1px solid var(--cs-border-subtle)",
                      boxShadow: "var(--cs-shadow-card)",
                    }}
                  >
                    <Visual />
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Personas;
