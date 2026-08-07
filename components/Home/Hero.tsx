"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Beams } from "./Beams";
import { DashboardPreview } from "./DashboardPreview";
import { EASE, stagger, slideUp } from "./motion";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const previewY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const previewScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.96]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate overflow-hidden pt-14 pb-16 md:pt-24 md:pb-24"
      style={{ backgroundColor: "var(--cs-surface-1)" }}
    >
      <Beams />

      <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
        <motion.div
          variants={stagger(0.1, 0.05)}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={slideUp}>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{
                color: "var(--cs-accent-text)",
                backgroundColor: "var(--cs-accent-muted)",
                border: "1px solid color-mix(in oklab, var(--primary) 35%, transparent)",
              }}
            >
              Recipes, cookbooks, and chefs in one place
            </span>
          </motion.div>

          <motion.h1
            variants={slideUp}
            className="mt-6 text-4xl font-bold leading-[1.08] tracking-tighter md:text-6xl"
            style={{ color: "var(--cs-text-primary)" }}
          >
            Cook from the pros.
            <br />
            <span style={{ color: "var(--cs-accent-text)" }}>Sell what you cook.</span>
          </motion.h1>

          <motion.p
            variants={slideUp}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            Thousands of chef-tested recipes, cookbooks you actually own, and the
            tools chefs use to publish and get paid.
          </motion.p>

          <motion.div
            variants={slideUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/register">
              <Button size="lg" className="group">
                Get started
                <ArrowRightIcon
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Button>
            </Link>
            <Link href="/recipes">
              <Button size="lg" variant="outline">
                Browse recipes
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: previewY, scale: previewScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="mx-auto mt-14 w-full max-w-5xl md:mt-20"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
