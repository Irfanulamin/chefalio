"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  BookOpenIcon,
  CheckIcon,
  ClockIcon,
  CookingPotIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { SectionHeading } from "./shared/SectionHeading";

const STEPS = [
  {
    icon: MagnifyingGlassIcon,
    title: "Discover",
    body: "Search by ingredient, cuisine, diet, or time. Every result belongs to a chef whose work you can trace back to a real kitchen.",
  },
  {
    icon: CookingPotIcon,
    title: "Cook",
    body: "Full instructions with prep time and difficulty called out before you start, not buried three scrolls down. Save the ones that land.",
  },
  {
    icon: BookOpenIcon,
    title: "Publish",
    body: "Approved chefs upload recipes and bundle them into cookbooks, priced however they want. No gatekeeper taking the pen.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Earn",
    body: "Cookbooks sell directly to the people cooking from them. Orders and payouts land in your dashboard the same week.",
  },
];

const INSET: React.CSSProperties = {
  backgroundColor: "var(--cs-surface-1)",
  border: "1px solid var(--cs-border-subtle)",
};

// ─── Step visuals ────────────────────────────────────────────────────────────

function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="space-y-2.5">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={INSET}
        >
          <MagnifyingGlassIcon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
          <span className="type-caption" style={{ color: "var(--cs-text-primary)" }}>
            aubergine, under 40 min
          </span>
        </div>
        {["Miso-glazed aubergine", "Smoky baba ganoush", "Aubergine katsu"].map(
          (r, i) => (
            <div
              key={r}
              className="flex items-center gap-3 rounded-xl p-2.5"
              style={INSET}
            >
              <div
                className="h-10 w-10 shrink-0 rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--primary) 50%, transparent), color-mix(in oklab, var(--accent) 85%, transparent))",
                }}
              />
              <div className="min-w-0 flex-1">
                <p
                  className="type-caption truncate font-medium"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {r}
                </p>
                <p className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
                  {28 + i * 4} min · Beginner
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="space-y-2.5">
        <div className="flex gap-2">
          {[
            { label: "Prep", value: "10 min" },
            { label: "Cook", value: "22 min" },
            { label: "Level", value: "Easy" },
          ].map((m) => (
            <div key={m.label} className="flex-1 rounded-xl p-2.5" style={INSET}>
              <p className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
                {m.label}
              </p>
              <p
                className="type-caption mt-0.5 font-semibold"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {m.value}
              </p>
            </div>
          ))}
        </div>
        {[
          { text: "Salt the aubergine, rest 10 min", done: true },
          { text: "Whisk miso, mirin, sesame", done: true },
          { text: "Grill cut-side down, 8 min", done: false },
          { text: "Glaze and finish under heat", done: false },
        ].map((s, i) => (
          <div key={s.text} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5" style={INSET}>
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold"
              style={{
                backgroundColor: s.done ? "var(--primary)" : "var(--cs-surface-2)",
                color: s.done ? "var(--primary-foreground)" : "var(--cs-text-tertiary)",
                border: s.done ? "none" : "1px solid var(--cs-border-default)",
              }}
            >
              {s.done ? <CheckIcon size={9} weight="bold" /> : i + 1}
            </span>
            <span
              className="type-caption truncate"
              style={{
                color: s.done ? "var(--cs-text-tertiary)" : "var(--cs-text-primary)",
                textDecoration: s.done ? "line-through" : "none",
              }}
            >
              {s.text}
            </span>
            {i === 2 && (
              <ClockIcon
                size={13}
                className="ml-auto shrink-0"
                style={{ color: "var(--cs-accent-text)" }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="space-y-2.5">
        <div className="rounded-xl p-3" style={INSET}>
          <p className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
            Cookbook title
          </p>
          <p
            className="type-subheading mt-1"
            style={{ color: "var(--cs-text-primary)" }}
          >
            Weeknight Italian
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className="type-micro rounded-full px-2 py-1 font-semibold"
              style={{
                backgroundColor: "var(--cs-accent-muted)",
                color: "var(--cs-accent-text)",
              }}
            >
              12 recipes
            </span>
            <span
              className="type-micro rounded-full px-2 py-1 font-semibold"
              style={{
                backgroundColor: "var(--cs-surface-2)",
                color: "var(--cs-text-secondary)",
              }}
            >
              Your price · $24
            </span>
          </div>
        </div>
        {["Cacio e pepe, properly", "30-minute ragù", "Pantry puttanesca"].map((r) => (
          <div
            key={r}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={INSET}
          >
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
              style={{ backgroundColor: "var(--cs-accent-muted)" }}
            >
              <CheckIcon size={9} weight="bold" style={{ color: "var(--cs-accent-text)" }} />
            </span>
            <span className="type-caption truncate" style={{ color: "var(--cs-text-primary)" }}>
              {r}
            </span>
            <span className="type-micro ml-auto" style={{ color: "var(--cs-text-tertiary)" }}>
              Added
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div
        className="rounded-xl p-4"
        style={{
          background:
            "linear-gradient(150deg, color-mix(in oklab, var(--primary) 70%, transparent), color-mix(in oklab, var(--accent) 90%, transparent))",
        }}
      >
        <p className="type-micro font-semibold" style={{ color: "#12200a" }}>
          Payout · this week
        </p>
        <p
          className="mt-1 text-3xl font-bold tabular-nums"
          style={{ color: "#12200a", letterSpacing: "-0.035em" }}
        >
          $1,284.00
        </p>
        <p className="type-micro mt-1" style={{ color: "rgba(18,32,10,0.7)" }}>
          52 cookbooks sold · 4 titles
        </p>
      </div>

      <div className="rounded-xl p-3" style={INSET}>
        <div className="flex items-center justify-between">
          <p className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
            Last 6 weeks
          </p>
          <span
            className="type-micro inline-flex items-center gap-0.5 font-bold"
            style={{ color: "var(--cs-accent-text)" }}
          >
            <TrendUpIcon size={10} weight="bold" /> 24%
          </span>
        </div>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {[38, 52, 44, 68, 82, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${h}%`,
                backgroundColor:
                  i === 5 ? "var(--primary)" : "color-mix(in oklab, var(--primary) 35%, transparent)",
              }}
            />
          ))}
        </div>
      </div>

      {[
        { name: "Weeknight Italian", value: "$624" },
        { name: "Fermentation Basics", value: "$416" },
      ].map((row) => (
        <div
          key={row.name}
          className="flex items-center justify-between rounded-xl px-3 py-2.5"
          style={INSET}
        >
          <span className="type-caption truncate" style={{ color: "var(--cs-text-primary)" }}>
            {row.name}
          </span>
          <span
            className="type-caption font-semibold tabular-nums"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Step ────────────────────────────────────────────────────────────────────

function Step({
  step,
  index,
  isActive,
  onEnter,
}: {
  step: (typeof STEPS)[number];
  index: number;
  isActive: boolean;
  onEnter: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A band across the middle of the viewport: whichever step is sitting in
  // it owns the visual on the left.
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const Icon = step.icon;

  useEffect(() => {
    if (inView) onEnter(index);
  }, [inView, index, onEnter]);

  return (
    <div ref={ref} className="flex flex-col lg:min-h-[62svh] lg:py-10">
      <motion.div
        animate={{ opacity: isActive ? 1 : 0.45 }}
        transition={SPRING.default}
        // flex-1 so the icon column stretches the whole step, which is what
        // lets the trail actually reach the next marker instead of stopping
        // at the bottom of the paragraph.
        className="flex flex-1 gap-4"
      >
        <div className="flex flex-col items-center">
          <motion.span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            animate={{
              backgroundColor: isActive
                ? "var(--primary)"
                : "var(--cs-surface-1)",
            }}
            transition={SPRING.default}
            style={{ border: "1px solid var(--cs-border-default)" }}
          >
            <Icon
              size={19}
              weight={isActive ? "fill" : "regular"}
              style={{
                color: isActive
                  ? "var(--primary-foreground)"
                  : "var(--cs-text-tertiary)",
              }}
            />
          </motion.span>
          {/* The trail runs under every step, including the last. On the
              final one it fades out instead of stopping dead — the sequence
              ends, it doesn't get cut off. */}
          <span
            aria-hidden
            className={index === STEPS.length - 1 ? "mt-2 h-16 w-px" : "mt-2 w-px flex-1"}
            style={{
              background:
                index === STEPS.length - 1
                  ? "linear-gradient(to bottom, var(--cs-border-default), transparent)"
                  : "var(--cs-border-default)",
              minHeight: 40,
            }}
          />
        </div>

        <div className="pb-10 lg:pb-0">
          <span
            className="type-label"
            style={{ color: "var(--cs-accent-text)" }}
          >
            Step {index + 1}
          </span>
          <h3
            className="type-heading mt-2"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {step.title}
          </h3>
          <p
            className="type-body mt-3 max-w-md"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {step.body}
          </p>

          {/* Mobile has no room for a sticky column, so the visual travels
              with its own step instead. */}
          <div
            className="mt-6 rounded-3xl p-4 lg:hidden"
            style={{
              backgroundColor: "var(--cs-surface-3)",
              border: "1px solid var(--cs-border-subtle)",
            }}
          >
            <StepVisual index={index} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export const HowItWorks = () => {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section
      id="how-it-works"
      className="surface-base relative py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From a weeknight recipe to a living"
          lede="The same platform, followed all the way through — from the search box to the payout."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Sticky visual. All four are mounted in one grid cell, so the
              frame's height is fixed at the tallest and nothing reflows as
              you scroll from step to step. */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div
                className="grid rounded-3xl p-5"
                style={{
                  backgroundColor: "var(--cs-surface-3)",
                  border: "1px solid var(--cs-border-subtle)",
                  boxShadow: "var(--cs-shadow-card)",
                  gridTemplateAreas: '"stack"',
                }}
              >
                {STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    aria-hidden={i !== active}
                    inert={i !== active}
                    style={{ gridArea: "stack" }}
                    initial={false}
                    animate={{
                      opacity: i === active ? 1 : 0,
                      // Steps are ordered, so an inactive one waits just
                      // off the axis it will arrive along.
                      y: reduce ? 0 : i === active ? 0 : i < active ? -14 : 14,
                    }}
                    transition={SPRING.default}
                    className={i === active ? "" : "pointer-events-none"}
                  >
                    <StepVisual index={i} />
                  </motion.div>
                ))}
              </div>

              {/* Progress pips — where am I, how much is left. */}
              <div className="mt-5 flex items-center justify-center gap-2">
                {STEPS.map((s, i) => (
                  <motion.span
                    key={s.title}
                    className="h-1.5 rounded-full"
                    initial={false}
                    animate={{
                      width: i === active ? 26 : 6,
                      backgroundColor:
                        i === active
                          ? "var(--primary)"
                          : "var(--cs-border-default)",
                    }}
                    transition={SPRING.default}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            {STEPS.map((step, i) => (
              <Step
                key={step.title}
                step={step}
                index={i}
                isActive={i === active}
                onEnter={setActive}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
