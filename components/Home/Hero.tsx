"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  PlayCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Beams } from "./Beams";
import { HeroVisual } from "./HeroVisual";
import { materialize, SPRING, stagger } from "./motion";

/** Small, factual, and checkable — the three things a visitor wants to know
 *  before they decide whether the buttons are worth pressing. */
const ASSURANCES = [
  "Free to browse",
  "No subscription",
  "Chef-tested recipes",
];

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /**
   * Scroll *is* the gesture, so these track it 1:1 — no spring smoothing in
   * the path, which would put lag between the finger and the pixels. The
   * preview recedes as you scroll past: pushed back and dimmed, the way a
   * layer that has handed off focus should behave.
   */
  const previewY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -64]);
  const previewScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduce ? 1 : 0.95],
  );
  const previewOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, reduce ? 1 : 0.55],
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="surface-base relative isolate flex h-svh min-h-[680px] flex-col overflow-hidden pb-0 pt-20 md:pt-24"
    >
      <Beams />

      {/* The hero is exactly one screen. The copy takes the height it needs
          and the product shot takes whatever is left — so nothing overflows
          the fold and nothing has to be scrolled to be understood. */}
      <div className="relative mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-5 md:px-8">
        <motion.div
          variants={stagger(0.06, 0.02)}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-3xl shrink-0 text-center"
        >
          {/* Announcement. One live thing worth knowing, linked — not a
              slogan dressed up as a badge. */}
          <motion.div variants={materialize}>
            <Link
              href="/chefs"
              className="material-thin group inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5"
            >
              <span
                className="type-micro rounded-full px-2 py-0.5 font-semibold"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                New
              </span>
              <span
                className="type-caption vibrant-secondary"
                style={{ fontWeight: 500 }}
              >
                Chef payouts now land weekly
              </span>
              <ArrowRightIcon
                size={12}
                weight="bold"
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                style={{ color: "var(--cs-text-tertiary)" }}
              />
            </Link>
          </motion.div>

          <motion.h1
            variants={materialize}
            className="type-display mt-7"
            style={{ color: "var(--cs-text-primary)" }}
          >
            Cook from the pros.
            <br />
            <span style={{ color: "var(--cs-accent-text)" }}>
              Sell what you cook.
            </span>
          </motion.h1>

          <motion.p
            variants={materialize}
            className="type-body-lg mx-auto mt-6 max-w-xl"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            The marketplace for chef-tested recipes and cookbooks. Browse
            thousands for free, and publish, price, and sell your own.
          </motion.p>

          <motion.div
            variants={materialize}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.div
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={SPRING.snappy}
              className="w-full sm:w-auto"
            >
              <Link
                href="/sign-up"
                className="type-subheading group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 transition-shadow duration-200 hover:shadow-lg sm:w-auto"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "0 6px 20px -8px color-mix(in oklab, var(--primary) 80%, transparent)",
                }}
              >
                Start cooking free
                <ArrowRightIcon
                  size={16}
                  weight="bold"
                  className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>

            <motion.div
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={SPRING.snappy}
              className="w-full sm:w-auto"
            >
              <Link
                href="/apply-chef"
                className="type-subheading material-thin inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 sm:w-auto"
                style={{ color: "var(--cs-text-primary)" }}
              >
                <PlayCircleIcon size={17} weight="fill" style={{ color: "var(--cs-accent-text)" }} />
                Sell as a chef
              </Link>
            </motion.div>
          </motion.div>

          <motion.ul
            variants={materialize}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {ASSURANCES.map((item) => (
              <li
                key={item}
                className="type-caption flex items-center gap-1.5"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                <CheckCircleIcon
                  size={14}
                  weight="fill"
                  style={{ color: "var(--cs-accent-text)" }}
                />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* The product shot is the largest surface on the page, so it arrives
            as a material — blur and scale resolving together — rather than
            fading in as a flat rectangle. */}
        <motion.div
          style={{
            y: previewY,
            scale: previewScale,
            opacity: previewOpacity,
            transformOrigin: "top center",
          }}
          className="mx-auto mt-8 min-h-0 w-full max-w-5xl flex-1 px-0 md:mt-10 lg:px-10"
        >
          {/* Scroll transforms live on the wrapper and the entrance lives
              here, so the two never fight over the same transform. */}
          <motion.div
            className="h-full"
            /* This used to animate `filter: blur(14px) → 0` across the
               largest surface on the page. Blur is not compositor-cheap:
               every frame re-blurs the whole subtree, which on a low-end GPU
               turns the one animation the visitor is guaranteed to see into
               the one that drops frames. Opacity and transform get the same
               "resolving into place" read for free. */
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 48, scale: 0.97 }
            }
            animate={
              reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
            }
            transition={reduce ? { duration: 0.2 } : { ...SPRING.soft, delay: 0.22 }}
            style={{ transformOrigin: "top center" }}
          >
            <HeroVisual />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
