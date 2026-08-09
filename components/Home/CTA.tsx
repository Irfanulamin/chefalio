"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";

const ASSURANCES = ["Free to browse", "No subscription", "Cancel nothing"];

export const CTA = () => {
  const reduce = useReducedMotion();

  return (
    <section
      className="surface-base px-5 pb-24 md:px-8 md:pb-32"
    >
      <Reveal distance={28}>
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] px-6 py-16 text-center md:px-16 md:py-24"
          style={{
            background:
              "linear-gradient(165deg, color-mix(in oklab, var(--primary) 82%, transparent), color-mix(in oklab, var(--accent) 96%, transparent))",
            boxShadow: "var(--cs-shadow-float)",
          }}
        >
          {/* Light falling from the top edge, so the slab reads as a lit
              surface rather than a flat fill. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,255,255,0.42), transparent 65%)",
            }}
          />

          <div className="relative">
            <h2
              className="type-title mx-auto max-w-2xl"
              style={{ color: "#12200a" }}
            >
              Your next good dinner is already here
            </h2>

            <p
              className="type-body-lg mx-auto mt-5 max-w-lg"
              style={{ color: "rgba(18,32,10,0.75)" }}
            >
              Browse thousands of chef-tested recipes for free. Pay only for the
              cookbooks you want to keep.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={SPRING.snappy}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register"
                  className="type-subheading group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 transition-shadow duration-200 hover:shadow-xl sm:w-auto"
                  style={{
                    backgroundColor: "#12200a",
                    color: "#eaffc7",
                    boxShadow: "0 8px 24px -10px rgba(18,32,10,0.6)",
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
                  className="type-subheading inline-flex h-12 w-full items-center justify-center rounded-full px-7 transition-colors duration-200 sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.55)",
                    color: "#12200a",
                    border: "1px solid rgba(255,255,255,0.7)",
                  }}
                >
                  Apply as a chef
                </Link>
              </motion.div>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {ASSURANCES.map((item) => (
                <li
                  key={item}
                  className="type-caption flex items-center gap-1.5"
                  style={{ color: "rgba(18,32,10,0.72)" }}
                >
                  <CheckCircleIcon size={14} weight="fill" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CTA;
