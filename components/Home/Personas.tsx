"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import {
  ArrowRightIcon,
  BookmarkSimpleIcon,
  CheckIcon,
  ChefHatIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HandSwipeRightIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  StarIcon,
  TrendUpIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { project, rubberband, SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";
import { SectionHeading } from "./shared/SectionHeading";

type PersonaId = "cooks" | "chefs" | "admins";

const PERSONAS: {
  id: PersonaId;
  tab: string;
  blurb: string;
  icon: React.ElementType;
  headline: string;
  body: string;
  points: string[];
  cta: { label: string; href: string };
}[] = [
  {
    id: "cooks",
    tab: "Home cooks",
    blurb: "Find dinner, fast",
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
    blurb: "Publish and get paid",
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
    blurb: "Run the platform",
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

/** Movement required before we commit to "this is a drag". */
const HYSTERESIS = 10;
/** Only the tail of the pointer history matters for release velocity. */
const VELOCITY_WINDOW_MS = 100;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

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
          chickpeas · 30 min · no oven
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

      {[
        { name: "Charred corn orzo", time: "26 min", rating: "4.9", saved: true },
        { name: "Miso butter beans", time: "18 min", rating: "4.8", saved: false },
        { name: "Green shakshuka", time: "24 min", rating: "4.7", saved: false },
      ].map((r) => (
        <div key={r.name} className="flex items-center gap-3 rounded-2xl p-2.5" style={CARD}>
          <div
            className="h-12 w-12 shrink-0 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, transparent), color-mix(in oklab, var(--accent) 88%, transparent))",
            }}
          />
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
              backgroundColor: r.saved ? "var(--primary)" : "var(--cs-surface-2)",
              border: r.saved ? "none" : "1px solid var(--cs-border-subtle)",
            }}
          >
            <BookmarkSimpleIcon
              size={13}
              weight={r.saved ? "fill" : "regular"}
              style={{
                color: r.saved
                  ? "var(--primary-foreground)"
                  : "var(--cs-text-tertiary)",
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

      {[
        { label: "Weeknight Italian", meta: "12 recipes", price: "$24", sold: 78 },
        { label: "Fermentation Basics", meta: "9 recipes", price: "$32", sold: 54 },
        { label: "Knife Skills Vol. 2", meta: "6 recipes", price: "Draft", sold: 0 },
      ].map((row) => (
        <div key={row.label} className="rounded-2xl px-3.5 py-3" style={CARD}>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p
                className="type-caption truncate font-semibold"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {row.label}
              </p>
              <p className="type-micro" style={{ color: "var(--cs-text-tertiary)" }}>
                {row.meta}
              </p>
            </div>
            <span
              className="type-caption shrink-0 font-bold tabular-nums"
              style={{
                color: row.sold
                  ? "var(--cs-accent-text)"
                  : "var(--cs-text-tertiary)",
              }}
            >
              {row.price}
            </span>
          </div>
          <div
            className="mt-2.5 h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--cs-surface-3)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${row.sold}%`,
                backgroundColor: "var(--primary)",
              }}
            />
          </div>
        </div>
      ))}
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
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full type-caption font-bold"
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
            style={{ backgroundColor: "var(--primary)" }}
          >
            <CheckIcon
              size={11}
              weight="bold"
              style={{ color: "var(--primary-foreground)" }}
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

// ─── Tab ─────────────────────────────────────────────────────────────────────

/**
 * The highlight behind a tab is driven by the drag position, not by the
 * selected index — so while a finger is mid-swipe the rail cross-fades
 * continuously with it instead of snapping once the gesture ends. Feedback
 * belongs *during* the interaction, not only at the end of it.
 */
function PersonaTab({
  persona,
  index,
  progress,
  isActive,
  onSelect,
  onKeyDown,
}: {
  persona: (typeof PERSONAS)[number];
  index: number;
  progress: MotionValue<number>;
  isActive: boolean;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const Icon = persona.icon;
  const highlight = useTransform(
    progress,
    [index - 1, index, index + 1],
    [0, 1, 0],
    { clamp: true },
  );

  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      whileTap={{ scale: 0.98 }}
      transition={SPRING.snappy}
      className="relative w-full shrink-0 cursor-pointer rounded-2xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      style={{
        // All three read as cards; the highlight above only says which one
        // is selected. Without a resting surface the unselected two look
        // like text floating on the page.
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-2xl"
        style={{
          opacity: highlight,
          backgroundColor: "var(--cs-surface-1)",
          border: "1px solid var(--cs-border-default)",
          boxShadow: "var(--cs-shadow-card)",
        }}
      />

      <span className="relative z-10 flex items-start gap-3">
        <motion.span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          initial={false}
          animate={{
            backgroundColor: isActive
              ? "var(--primary)"
              : "var(--cs-accent-muted)",
          }}
          transition={SPRING.default}
        >
          <Icon
            size={17}
            weight="fill"
            style={{
              color: isActive
                ? "var(--primary-foreground)"
                : "var(--cs-accent-text)",
            }}
          />
        </motion.span>

        <span className="min-w-0">
          <span
            className="type-subheading block whitespace-nowrap"
            style={{
              color: isActive
                ? "var(--cs-text-primary)"
                : "var(--cs-text-secondary)",
            }}
          >
            {persona.tab}
          </span>
          <span
            className="type-micro block whitespace-nowrap"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            {persona.blurb}
          </span>
        </span>
      </span>
    </motion.button>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export const Personas = () => {
  const [active, setActive] = useState(0);
  const [width, setWidth] = useState(0);
  const reduce = useReducedMotion();

  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const running = useRef<AnimationPlaybackControls | null>(null);

  // Pointer bookkeeping for the drag.
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0, value: 0 });
  const samples = useRef<{ t: number; x: number }[]>([]);
  const committed = useRef(false);

  /** Which panel the track is currently sitting on, as a float. */
  const progress = useTransform(x, (v) => (width > 0 ? -v / width : 0));

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A resize is a layout change, not an interaction — re-seat without motion.
  useEffect(() => {
    running.current?.stop();
    x.set(-active * width);
    // Only on width changes; `active` moves through goTo, which animates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  /**
   * Settle onto a panel. Velocity is handed to the spring so the animation
   * picks up exactly where the finger left off — no seam between the drag and
   * the motion that follows it. Bounce only comes along when a gesture
   * actually carried momentum; a tab click gets the critically damped
   * default, because nothing was thrown.
   */
  const goTo = useCallback(
    (index: number, velocity = 0) => {
      const next = clamp(index, 0, PERSONAS.length - 1);
      setActive(next);
      running.current?.stop();

      if (reduce) {
        x.set(-next * width);
        return;
      }

      running.current = animate(x, -next * width, {
        ...(velocity !== 0 ? SPRING.momentum : SPRING.default),
        velocity,
      });
    },
    [reduce, width, x],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Grab the in-flight animation rather than waiting it out. Because the
    // spring animates the motion value itself, stopping mid-flight leaves x
    // exactly where it is on screen.
    running.current?.stop();
    dragging.current = true;
    committed.current = false;
    origin.current = { x: e.clientX, y: e.clientY, value: x.get() };
    samples.current = [{ t: performance.now(), x: e.clientX }];
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || width === 0) return;

    samples.current.push({ t: performance.now(), x: e.clientX });
    if (samples.current.length > 12) samples.current.shift();

    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;

    if (!committed.current) {
      if (Math.abs(dx) < HYSTERESIS && Math.abs(dy) < HYSTERESIS) return;
      // Vertical intent belongs to the page. `touch-action: pan-y` lets the
      // browser take those; this covers the mouse case.
      if (Math.abs(dy) > Math.abs(dx)) {
        dragging.current = false;
        return;
      }
      committed.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    // Track the finger 1:1 from where it was grabbed, resisting past the ends
    // instead of stopping dead — a hard stop reads as frozen.
    const min = -(PERSONAS.length - 1) * width;
    let next = origin.current.value + dx;
    if (next > 0) next = rubberband(next, width);
    else if (next < min) next = min - rubberband(min - next, width);

    x.set(next);
  };

  const endDrag = (clientX: number) => {
    if (!dragging.current) return;
    dragging.current = false;

    if (!committed.current || width === 0) return;
    committed.current = false;

    // Velocity from the tail of the pointer history, not the last event — a
    // single frame's delta is noise.
    const now = performance.now();
    const recent = samples.current.filter((s) => now - s.t <= VELOCITY_WINDOW_MS);
    const first = recent[0] ?? samples.current[0];
    const elapsed = (now - first.t) / 1000;
    const velocity = elapsed > 0 ? (clientX - first.x) / elapsed : 0;

    // Snap to where the flick is *going*, not to where the finger stopped.
    const projected = x.get() + project(velocity);
    goTo(Math.round(-projected / width), velocity);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <section id="personas" className="surface-base relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Who it's for"
          title="One platform, three jobs to do"
          lede="Chefalio is the same product seen from three sides. Pick a side — or swipe through them."
        />

        {/* Rail. Horizontal on every size: three cards read as a choice,
            where a vertical list reads as navigation. */}
        <Reveal distance={16} className="mt-12">
          <div
            className="grid gap-2.5 sm:grid-cols-3"
            role="tablist"
            aria-label="Who Chefalio is for"
          >
            {PERSONAS.map((p, i) => (
              <PersonaTab
                key={p.id}
                persona={p}
                index={i}
                progress={progress}
                isActive={i === active}
                onSelect={() => goTo(i)}
                onKeyDown={onKeyDown}
              />
            ))}
          </div>
        </Reveal>

        {/* Viewport. Every panel stays mounted so a swipe reveals real content
            underneath the finger, and so an in-flight settle can be grabbed
            and thrown back the other way. */}
        <div
          ref={viewportRef}
          className="mt-8 overflow-hidden"
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => endDrag(e.clientX)}
          onPointerCancel={(e) => endDrag(e.clientX)}
        >
          <motion.div
            className="flex cursor-grab items-stretch active:cursor-grabbing"
            style={{ x, willChange: "transform" }}
          >
            {PERSONAS.map((persona, i) => {
              const Visual = VISUALS[persona.id];
              return (
                <div
                  key={persona.id}
                  role="tabpanel"
                  aria-hidden={i !== active}
                  className="w-full shrink-0 grow-0 basis-full"
                >
                  <div
                    className="grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:items-center md:gap-12 md:p-10"
                    style={{
                      backgroundColor: "var(--cs-surface-2)",
                      border: "1px solid var(--cs-border-subtle)",
                    }}
                  >
                    <div>
                      <h3
                        className="type-heading"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {persona.headline}
                      </h3>
                      <p
                        className="type-body mt-3"
                        style={{ color: "var(--cs-text-secondary)" }}
                      >
                        {persona.body}
                      </p>

                      <ul className="mt-6 space-y-3">
                        {persona.points.map((point) => (
                          <li key={point} className="flex gap-2.5">
                            <span
                              className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                              style={{ backgroundColor: "var(--primary)" }}
                            >
                              <CheckIcon
                                size={9}
                                weight="bold"
                                style={{ color: "var(--primary-foreground)" }}
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

                      <Link
                        href={persona.cta.href}
                        tabIndex={i === active ? 0 : -1}
                        draggable={false}
                        className="type-subheading group mt-8 inline-flex h-11 items-center gap-2 rounded-full px-5"
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
                    </div>

                    <div
                      className="rounded-3xl p-4"
                      style={{
                        backgroundColor: "var(--cs-surface-3)",
                        border: "1px solid var(--cs-border-subtle)",
                      }}
                    >
                      <Visual />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Where am I, how much is left — and a nudge that this is draggable. */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            {PERSONAS.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                aria-label={`Show ${p.tab}`}
                onClick={() => goTo(i)}
                className="h-1.5 cursor-pointer rounded-full"
                initial={false}
                animate={{
                  width: i === active ? 26 : 6,
                  backgroundColor:
                    i === active ? "var(--primary)" : "var(--cs-border-default)",
                }}
                transition={SPRING.default}
              />
            ))}
          </div>
          <span
            className="type-micro inline-flex items-center gap-1.5"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <HandSwipeRightIcon size={13} />
            Drag to compare
          </span>
        </div>
      </div>
    </section>
  );
};

export default Personas;
