"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { EASE, VIEWPORT } from "./motion";

export const CTA = () => {
  return (
    <section className="px-4 pb-20 md:px-8 md:pb-28" style={{ backgroundColor: "var(--cs-surface-2)" }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-6 py-16 text-center md:px-16 md:py-24"
        style={{
          backgroundColor: "var(--accent)",
          border: "1px solid color-mix(in oklab, var(--primary) 30%, transparent)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
          }}
        />

        <div className="relative">
          <h2
            className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tighter md:text-5xl"
            style={{ color: "var(--accent-foreground)" }}
          >
            Your next good dinner is already here
          </h2>
          <p
            className="mx-auto mt-4 max-w-lg text-base leading-relaxed md:text-lg"
            style={{ color: "color-mix(in oklab, var(--accent-foreground) 72%, transparent)" }}
          >
            Free to browse. Pay only for the cookbooks you want to keep.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="group">
                Get started
                <ArrowRightIcon
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Button>
            </Link>
            <Link href="/apply-chef">
              <Button size="lg" variant="outline">
                Apply as a chef
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
