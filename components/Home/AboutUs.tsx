"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ChefHatIcon } from "@phosphor-icons/react/dist/ssr";
import { EASE } from "./motion";

/* Figures below are the platform's published stats. Update them here when they change. */
const STATS = [
  { number: "120+", label: "Recipes shared" },
  { number: "40+", label: "Countries" },
  { number: "20+", label: "Pro chefs" },
  { number: "4.8", label: "Average rating" },
];

function StatCard({
  number,
  label,
  delay,
}: {
  number: string;
  label: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 18 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className="flex flex-col items-center justify-center rounded-2xl px-6 py-7 text-center"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      <span
        className="text-3xl font-bold tracking-tight tabular-nums md:text-4xl"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {number}
      </span>
      <span
        className="mt-1.5 text-xs font-medium uppercase tracking-[0.12em]"
        style={{ color: "var(--cs-text-tertiary)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export const AboutUs = () => {
  const missionRef = useRef(null);
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: "var(--cs-surface-2)" }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 0.08} />
          ))}
        </div>

        <div ref={missionRef} className="mt-20 grid items-center gap-12 md:mt-28 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={missionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative hidden h-90 md:block"
          >
            <div
              className="absolute inset-0 flex flex-col justify-between rounded-3xl p-8"
              style={{
                backgroundColor: "var(--cs-surface-2)",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <ChefHatIcon
                weight="duotone"
                size={28}
                style={{ color: "var(--cs-accent-text)" }}
              />

              <div>
                <p
                  className="text-2xl font-semibold leading-snug"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  &ldquo;The best meals begin with{" "}
                  <span style={{ color: "var(--cs-accent-text)" }}>curiosity</span> and end
                  with <span style={{ color: "var(--cs-accent-text)" }}>connection</span>.&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span
                    className="h-9 w-9 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--cs-accent-muted)" }}
                  >
                    <Image
                      src="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530583/about-us_mrtdt2.png"
                      width={36}
                      height={36}
                      alt=""
                      className="h-9 w-9 object-cover"
                    />
                  </span>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      Sofia Anderson
                    </p>
                    <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
                      Co-founder and Head Chef
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={missionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <h2
              className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Built to close the gap between{" "}
              <span style={{ color: "var(--cs-accent-text)" }}>
                professional kitchens and home cooks
              </span>
            </h2>

            <p
              className="mt-5 text-base leading-relaxed"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              Most recipes online are written to rank, not to cook from. Chefalio
              works the other way round. Every recipe belongs to a chef you can
              trace, every cookbook is something they chose to put their name on.
            </p>

            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              That means chefs get paid for the work, and cooks get instructions
              that hold up on a weeknight.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
