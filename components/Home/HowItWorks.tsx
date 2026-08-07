"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  BookOpenIcon,
  CookingPotIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react/dist/ssr";
import { EASE, VIEWPORT } from "./motion";

const STEPS = [
  {
    icon: MagnifyingGlassIcon,
    title: "Discover",
    body: "Search by ingredient, cuisine, diet, or time. Every recipe comes from a chef whose work you can trace.",
  },
  {
    icon: CookingPotIcon,
    title: "Cook",
    body: "Follow full instructions with prep times and difficulty called out up front. Save the ones that land.",
  },
  {
    icon: BookOpenIcon,
    title: "Publish",
    body: "Approved chefs upload recipes and bundle them into cookbooks with their own pricing.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Earn",
    body: "Cookbooks sell directly to the people cooking from them. Orders and payouts land in your dashboard.",
  },
];

export const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section
      id="how-it-works"
      className="relative py-20 md:py-28"
      style={{ backgroundColor: "var(--cs-surface-2)" }}
    >
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl text-3xl font-bold tracking-tighter md:text-5xl"
          style={{ color: "var(--cs-text-primary)" }}
        >
          How a recipe becomes a living
        </motion.h2>

        <div ref={ref} className="relative mt-14 pl-12 md:pl-20">
          {/* Track */}
          <div
            aria-hidden
            className="absolute left-[19px] top-2 bottom-2 w-px md:left-[27px]"
            style={{ backgroundColor: "var(--cs-border-subtle)" }}
          />
          {/* Fill, driven by scroll position through the section */}
          <motion.div
            aria-hidden
            className="absolute left-[19px] top-2 bottom-2 w-px origin-top md:left-[27px]"
            style={{ scaleY, backgroundColor: "var(--primary)" }}
          />

          <ol className="space-y-12 md:space-y-16">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
                  className="relative"
                >
                  <span
                    className="absolute -left-12 grid h-10 w-10 place-items-center rounded-full md:-left-20 md:h-14 md:w-14"
                    style={{
                      backgroundColor: "var(--cs-surface-1)",
                      border: "1px solid var(--cs-border-default)",
                    }}
                  >
                    <Icon
                      size={18}
                      weight="duotone"
                      style={{ color: "var(--cs-accent-text)" }}
                    />
                  </span>
                  <h3
                    className="text-xl font-semibold tracking-tight md:text-2xl"
                    style={{ color: "var(--cs-text-primary)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-2 max-w-lg text-base leading-relaxed"
                    style={{ color: "var(--cs-text-secondary)" }}
                  >
                    {step.body}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
