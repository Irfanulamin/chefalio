"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  BookmarkSimpleIcon,
  ChartLineUpIcon,
  CheckIcon,
  ChefHatIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { EASE, VIEWPORT } from "./motion";

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

function PanelVisual({ id }: { id: PersonaId }) {
  const chipStyle = {
    color: "var(--cs-text-secondary)",
    backgroundColor: "var(--cs-surface-1)",
    border: "1px solid var(--cs-border-subtle)",
  };

  if (id === "cooks") {
    return (
      <div className="space-y-3">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5"
          style={{
            backgroundColor: "var(--cs-surface-1)",
            border: "1px solid var(--cs-border-default)",
          }}
        >
          <MagnifyingGlassIcon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
          <span className="text-xs" style={{ color: "var(--cs-text-secondary)" }}>
            30 minutes, no oven, vegetarian
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Under 30 min", "Vegetarian", "One pan", "Beginner", "Mediterranean"].map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={chipStyle}
            >
              <FunnelIcon size={9} />
              {f}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {["Charred corn orzo", "Miso butter beans", "Green shakshuka"].map((r) => (
            <div
              key={r}
              className="rounded-lg p-2.5"
              style={{
                backgroundColor: "var(--cs-surface-1)",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <div
                className="mb-2 h-10 rounded"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--primary) 45%, transparent), color-mix(in oklab, var(--accent) 80%, transparent))",
                }}
              />
              <p
                className="text-[10px] font-medium leading-tight"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {r}
              </p>
              <span
                className="mt-1 inline-flex items-center gap-1 text-[9px]"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                <BookmarkSimpleIcon size={8} /> Saved
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === "chefs") {
    return (
      <div className="space-y-2.5">
        {[
          { label: "Weeknight Italian", meta: "12 recipes", state: "Published", value: "$24" },
          { label: "Fermentation Basics", meta: "9 recipes", state: "Published", value: "$32" },
          { label: "Knife Skills Vol. 2", meta: "6 recipes", state: "Draft", value: "Not set" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            style={{
              backgroundColor: "var(--cs-surface-1)",
              border: "1px solid var(--cs-border-subtle)",
            }}
          >
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs font-medium"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {row.label}
              </p>
              <p className="text-[10px]" style={{ color: "var(--cs-text-tertiary)" }}>
                {row.meta}
              </p>
            </div>
            <span
              className={row.state === "Published" ? "badge-success" : "badge-muted"}
              style={{ fontSize: 9 }}
            >
              {row.state}
            </span>
            <span
              className="w-14 text-right text-xs font-semibold tabular-nums"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {row.value}
            </span>
          </div>
        ))}
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2.5"
          style={{
            backgroundColor: "var(--cs-accent-muted)",
            border: "1px solid color-mix(in oklab, var(--primary) 30%, transparent)",
          }}
        >
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium"
            style={{ color: "var(--cs-accent-text)" }}
          >
            <CurrencyDollarIcon size={12} weight="bold" /> Paid out this month
          </span>
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: "var(--cs-accent-text)" }}
          >
            $1,284
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {[
        { name: "Amara Osei", meta: "Applied 2 days ago", state: "Pending" },
        { name: "Yuki Tanaka", meta: "Applied 4 days ago", state: "Pending" },
      ].map((a) => (
        <div
          key={a.name}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{
            backgroundColor: "var(--cs-surface-1)",
            border: "1px solid var(--cs-border-subtle)",
          }}
        >
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold"
            style={{
              backgroundColor: "var(--cs-accent-muted)",
              color: "var(--cs-accent-text)",
            }}
          >
            {a.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium" style={{ color: "var(--cs-text-primary)" }}>
              {a.name}
            </p>
            <p className="text-[10px]" style={{ color: "var(--cs-text-tertiary)" }}>
              {a.meta}
            </p>
          </div>
          <span className="badge-warning" style={{ fontSize: 9 }}>
            {a.state}
          </span>
          <span
            className="grid h-6 w-6 place-items-center rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <CheckIcon size={11} weight="bold" style={{ color: "var(--primary-foreground)" }} />
          </span>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { label: "Users", value: "12,480", icon: UsersThreeIcon },
          { label: "Revenue", value: "$52.9k", icon: CurrencyDollarIcon },
          { label: "Engagement", value: "+24%", icon: ChartLineUpIcon },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-lg p-2.5"
              style={{
                backgroundColor: "var(--cs-surface-1)",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <Icon size={12} style={{ color: "var(--cs-text-tertiary)" }} />
              <p
                className="mt-1.5 text-sm font-semibold tabular-nums"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {s.value}
              </p>
              <p className="text-[9px]" style={{ color: "var(--cs-text-tertiary)" }}>
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Personas = () => {
  const [active, setActive] = useState<PersonaId>("cooks");
  const persona = PERSONAS.find((p) => p.id === active)!;

  return (
    <section
      id="personas"
      className="relative py-20 md:py-28"
      style={{ backgroundColor: "var(--cs-surface-2)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl text-3xl font-bold tracking-tighter md:text-5xl"
          style={{ color: "var(--cs-text-primary)" }}
        >
          One platform, three jobs to do
        </motion.h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-14">
          {/* Tab rail */}
          <div
            className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
            role="tablist"
            aria-label="Who Chefalio is for"
          >
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isActive = p.id === active;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(p.id)}
                  className="relative shrink-0 cursor-pointer rounded-xl px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 lg:w-full"
                >
                  {isActive && (
                    <motion.span
                      layoutId="persona-active"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        backgroundColor: "var(--cs-surface-1)",
                        border: "1px solid var(--cs-border-default)",
                      }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Icon
                      size={16}
                      weight={isActive ? "fill" : "regular"}
                      style={{
                        color: isActive
                          ? "var(--cs-accent-text)"
                          : "var(--cs-text-tertiary)",
                      }}
                    />
                    <span
                      className="text-sm font-semibold whitespace-nowrap"
                      style={{
                        color: isActive
                          ? "var(--cs-text-primary)"
                          : "var(--cs-text-secondary)",
                      }}
                    >
                      {p.tab}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              role="tabpanel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="grid gap-8 md:grid-cols-2 md:items-center"
            >
              <div>
                <h3
                  className="text-2xl font-bold tracking-tight md:text-3xl"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {persona.headline}
                </h3>
                <p
                  className="mt-3 text-base leading-relaxed"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  {persona.body}
                </p>
                <ul className="mt-6 space-y-3">
                  {persona.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span
                        className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                        style={{ backgroundColor: "var(--cs-accent-muted)" }}
                      >
                        <CheckIcon
                          size={9}
                          weight="bold"
                          style={{ color: "var(--cs-accent-text)" }}
                        />
                      </span>
                      <span className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={persona.cta.href}
                  className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  {persona.cta.label}
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>

              <div
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: "var(--cs-surface-3)",
                  border: "1px solid var(--cs-border-subtle)",
                }}
              >
                <PanelVisual id={active} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Personas;
