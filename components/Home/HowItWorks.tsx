"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  BookOpenIcon,
  CheckIcon,
  ClockIcon,
  CookingPotIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { POP, POP_TRANSITION, SPRING } from "./motion";
import { SectionHeading } from "./shared/SectionHeading";
import { useStaged } from "./shared/useStaged";
import { cld, COOKBOOKS, DISHES } from "./imagery";

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

/**
 * Long enough to outlast the crossfade between two step visuals, so the
 * outgoing panel resets after it is out of sight rather than visibly playing
 * itself backwards on the way out.
 */
const RESET_HOLD = 500;

// ─── Step visuals ────────────────────────────────────────────────────────────

const QUERY = "lamb, under 80 min";
const RESULTS = [DISHES[1], DISHES[6], DISHES[9]];

/**
 * Step 1 — the query types itself and the results land under it one at a
 * time, which is what "search" looks like when it is happening rather than
 * when it is finished.
 */
function DiscoverVisual({ active }: { active: boolean }) {
  const { count: typed, reduce } = useStaged(active, QUERY.length, {
    start: 180,
    step: 42,
    jitter: 26,
    resetDelay: RESET_HOLD,
  });
  const { count: shown } = useStaged(active, RESULTS.length, {
    start: 180 + QUERY.length * 42 + 220,
    step: 170,
    resetDelay: RESET_HOLD,
  });

  return (
    <div className="space-y-2.5">
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5"
        style={INSET}
      >
        <MagnifyingGlassIcon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
        {/* Reserve the full string so the row never reflows mid-type. */}
        <span className="relative min-w-0 flex-1">
          <span className="type-caption invisible" aria-hidden>
            {QUERY}
          </span>
          <span
            className="type-caption absolute inset-0 truncate"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {QUERY.slice(0, typed)}
            <motion.span
              aria-hidden
              className="ml-0.5 inline-block h-3.5 w-px align-middle"
              style={{ backgroundColor: "var(--cs-accent-text)" }}
              animate={
                reduce || typed >= QUERY.length
                  ? { opacity: 0 }
                  : { opacity: [1, 1, 0, 0] }
              }
              transition={
                typed < QUERY.length
                  ? { duration: 0.9, repeat: Infinity, ease: "linear" }
                  : { duration: 0.3, delay: 0.3 }
              }
            />
          </span>
        </span>
      </div>

      {RESULTS.map((r, i) => (
        <motion.div
          key={r.id}
          className="flex items-center gap-3 rounded-xl p-2.5"
          style={INSET}
          initial={false}
          animate={{
            opacity: i < shown ? 1 : 0,
            y: reduce ? 0 : i < shown ? 0 : 10,
          }}
          transition={SPRING.default}
        >
          <div
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg"
            style={{ backgroundColor: "var(--cs-surface-3)" }}
          >
            <Image
              src={cld(r.id, { w: 80, h: 80 })}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="type-caption truncate font-medium"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {r.name}
            </p>
            <p className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
              {r.time} · {r.chef}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const COOK_STEPS = [
  "Sear the chicken, 6 min a side",
  "Bloom the spices in ghee",
  "Add tomatoes, simmer 18 min",
  "Finish with ginger and chilli",
];

/**
 * Step 2 — the method ticks itself off, which is the one thing a recipe
 * card can show that a photograph of the finished dish cannot.
 */
function CookVisual({ active }: { active: boolean }) {
  const { count, reduce } = useStaged(active, COOK_STEPS.length, {
    start: 320,
    step: 520,
    resetDelay: RESET_HOLD,
  });

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

      {COOK_STEPS.map((text, i) => {
        const done = i < count;
        const current = i === count;
        return (
          <div
            key={text}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={INSET}
          >
            <motion.span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-bold"
              initial={false}
              animate={{
                backgroundColor: done
                  ? "var(--cs-check-fill)"
                  : "var(--cs-surface-2)",
                borderColor: done
                  ? "var(--cs-check-edge)"
                  : "var(--cs-border-default)",
                scale: reduce || !done ? 1 : POP,
              }}
              transition={{ ...SPRING.snappy, scale: POP_TRANSITION }}
              style={{ borderWidth: 1, borderStyle: "solid" }}
            >
              {done ? (
                <CheckIcon
                  size={9}
                  weight="bold"
                  style={{ color: "var(--cs-check-mark)" }}
                />
              ) : (
                <span style={{ color: "var(--cs-text-tertiary)" }}>{i + 1}</span>
              )}
            </motion.span>
            <motion.span
              className="type-caption truncate"
              initial={false}
              animate={{
                color: done
                  ? "var(--cs-text-tertiary)"
                  : "var(--cs-text-primary)",
              }}
              transition={SPRING.snappy}
              style={{ textDecoration: done ? "line-through" : "none" }}
            >
              {text}
            </motion.span>
            {/* The clock marks the step being worked on right now, so it
                travels down the list instead of sitting on a fixed row. */}
            {current && (
              <motion.span
                className="ml-auto shrink-0"
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={SPRING.snappy}
              >
                <ClockIcon size={13} style={{ color: "var(--cs-accent-text)" }} />
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}

const BOOK_RECIPES = [DISHES[0].name, DISHES[3].name, DISHES[7].name];

/** Step 3 — recipes drop into the cookbook one at a time. */
function PublishRows({ active }: { active: boolean }) {
  const { count, reduce } = useStaged(active, BOOK_RECIPES.length, {
    start: 420,
    step: 380,
    resetDelay: RESET_HOLD,
  });

  return (
    <>
      {BOOK_RECIPES.map((r, i) => {
        const added = i < count;
        return (
          <motion.div
            key={r}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={INSET}
            initial={false}
            animate={{
              opacity: added ? 1 : 0.35,
              y: reduce ? 0 : added ? 0 : 8,
            }}
            transition={SPRING.default}
          >
            <motion.span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
              initial={false}
              animate={{
                backgroundColor: added
                  ? "var(--cs-accent-muted)"
                  : "var(--cs-surface-2)",
                scale: reduce || !added ? 1 : POP,
              }}
              transition={{ ...SPRING.snappy, scale: POP_TRANSITION }}
            >
              <CheckIcon
                size={9}
                weight="bold"
                style={{
                  color: added
                    ? "var(--cs-accent-text)"
                    : "var(--cs-text-tertiary)",
                }}
              />
            </motion.span>
            <span
              className="type-caption truncate"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {r}
            </span>
            <motion.span
              className="type-micro ml-auto"
              style={{ color: "var(--cs-text-tertiary)" }}
              initial={false}
              animate={{ opacity: added ? 1 : 0 }}
              transition={SPRING.snappy}
            >
              Added
            </motion.span>
          </motion.div>
        );
      })}
    </>
  );
}

function StepVisual({ index, active }: { index: number; active: boolean }) {
  if (index === 0) {
    return <DiscoverVisual active={active} />;
  }

  if (index === 1) {
    return <CookVisual active={active} />;
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
            {COOKBOOKS[0].title}
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
        <PublishRows active={active} />
      </div>
    );
  }

  return <EarnVisual active={active} />;
}

const BARS = [38, 52, 44, 68, 82, 100];
const PAYOUT = 1284;

/**
 * Step 4 — the payout counts up and the weeks grow in, so the number reads
 * as something that accumulated rather than a figure that was always there.
 */
function EarnVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const [paid, setPaid] = useState(reduce ? PAYOUT : 0);
  /** Mirrors `paid` without reading state in the effect, so re-entering
   *  mid-count resumes from where the number actually is. */
  const paidRef = useRef(reduce ? PAYOUT : 0);

  // Always animates toward the target — including back down to zero on the
  // way out — so nothing sets state synchronously during the effect.
  useEffect(() => {
    if (reduce) return;
    const controls = animate(paidRef.current, active ? PAYOUT : 0, {
      duration: active ? 0.9 : 0.25,
      // Counting back down is a reset, not an animation — hold it until the
      // panel has faded so it happens off screen.
      delay: active ? 0.3 : RESET_HOLD / 1000,
      ease: "easeOut",
      onUpdate: (v) => {
        paidRef.current = v;
        setPaid(v);
      },
    });
    return () => controls.stop();
  }, [active, reduce]);

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
          {paid.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
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
          {BARS.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 origin-bottom rounded-t"
              style={{
                height: `${h}%`,
                backgroundColor:
                  i === 5
                    ? "var(--primary)"
                    : "color-mix(in oklab, var(--primary) 35%, transparent)",
              }}
              initial={false}
              /* scaleY rather than height: it stays on the compositor, so
                 six bars growing at once cost one layer transform each
                 instead of six layout passes. */
              animate={{ scaleY: reduce ? 1 : active ? 1 : 0.05 }}
              transition={{
                ...SPRING.default,
                delay: active ? i * 0.06 : RESET_HOLD / 1000,
              }}
            />
          ))}
        </div>
      </div>

      {[
        { name: COOKBOOKS[0].title, value: "$624" },
        { name: COOKBOOKS[1].title, value: "$416" },
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
  runVisual,
}: {
  step: (typeof STEPS)[number];
  index: number;
  isActive: boolean;
  /** Whether this step's demo should be playing right now. */
  runVisual: boolean;
}) {
  const Icon = step.icon;

  return (
    // Each step owns close to a full screen of scrolling. The demo on the
    // left takes a couple of seconds to play out, and at the old 62svh a
    // normal scroll swept past the punchline before it landed — the whole
    // point of the sticky column is that you get to watch one finish before
    // the next arrives.
    <div className="flex flex-col lg:min-h-[92svh] lg:py-10">
      <motion.div
        animate={{ opacity: isActive ? 1 : 0.45 }}
        transition={SPRING.default}
        // flex-1 so the icon column stretches the whole step, which is what
        // lets the trail actually reach the next marker instead of stopping
        // at the bottom of the paragraph.
        className="flex flex-1 gap-4"
      >
        <div className="flex flex-col items-center">
          {/* Same rule as `.brand-tile`: the marker is furniture, so the
              active state is carried by a tinted surface and a coloured
              glyph rather than a solid lime slab with a black icon on it. */}
          <motion.span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            animate={{
              backgroundColor: isActive
                ? "var(--cs-accent-muted)"
                : "var(--cs-surface-1)",
              borderColor: isActive
                ? "color-mix(in oklab, var(--primary) 40%, transparent)"
                : "var(--cs-border-default)",
            }}
            transition={SPRING.default}
            style={{ borderWidth: 1, borderStyle: "solid" }}
          >
            <Icon
              size={19}
              weight={isActive ? "fill" : "regular"}
              style={{
                color: isActive
                  ? "var(--cs-accent-text)"
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
            {/* Same rule as the sticky column: this one runs when its own
                step is the current one and the section is on screen, not
                from mount. */}
            <StepVisual index={index} active={runVisual} />
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
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  /**
   * Which step owns the sticky panel: whichever one's midpoint is nearest
   * the middle of the viewport.
   *
   * This used to be an `IntersectionObserver` band per step — a step became
   * active by *crossing* a 10% strip. Crossings can be missed. Flick the
   * wheel, drag the scrollbar, or hit a hash link and a step can pass
   * through the strip entirely between two observer callbacks, so the event
   * never fires and the panel sits on the wrong visual until you scroll back
   * through it. It was intermittent precisely because it depended on scroll
   * *speed* rather than scroll *position*.
   *
   * Nearest-to-centre is a pure function of where the page currently is, so
   * there is no event to miss: however you arrive at an offset, the answer
   * is the same, and every step between here and there is skipped rather
   * than half-applied.
   */
  const pickActive = useCallback(() => {
    const el = stepsRef.current;
    if (!el) return;

    const middle = window.innerHeight / 2;
    let nearest = 0;
    let shortest = Infinity;

    Array.from(el.children).forEach((child, i) => {
      const box = (child as HTMLElement).getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - middle);
      if (distance < shortest) {
        shortest = distance;
        nearest = i;
      }
    });

    setActive((current) => (current === nearest ? current : nearest));
  }, []);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", pickActive);

  // Also settle on the right step for wherever the page already is — a
  // reload partway down, or a `#how-it-works` link, produces no scroll event
  // at all.
  // On the next frame rather than in the effect body: the measurement needs
  // a laid-out DOM anyway, and reading it synchronously here would set state
  // during the effect and cascade a second render.
  useEffect(() => {
    const frame = requestAnimationFrame(pickActive);
    window.addEventListener("resize", pickActive);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", pickActive);
    };
  }, [pickActive]);

  /**
   * Step 1 is active from mount, and the sticky column mounts all four
   * visuals at once — so the query used to type itself out on page load,
   * three screens above where anyone could see it. Arriving at the section
   * meant arriving after the demo had finished, which is exactly what makes
   * a live sequence read as a flat screenshot.
   *
   * Nothing runs until the section is genuinely on screen.
   */
  const onScreen = useInView(sectionRef, { amount: 0.2 });

  return (
    <section
      ref={sectionRef}
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
          {/* The panel used to pin at `top-28`, which parked it against the
              header for the whole scroll while the steps ran past it lower
              down — you had to look up and away from what you were reading.
              The sticky box is now exactly one viewport tall with the panel
              centred inside it, so the visual sits level with the step it
              belongs to. */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-svh flex-col justify-center">
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
                    <StepVisual index={i} active={onScreen && i === active} />
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

          {/* Children are measured positionally by `pickActive`, so this
              element's direct children must stay one-per-step. */}
          <div ref={stepsRef}>
            {STEPS.map((step, i) => (
              <Step
                key={step.title}
                step={step}
                index={i}
                isActive={i === active}
                runVisual={onScreen && i === active}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
