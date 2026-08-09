"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChefHatIcon, SealCheckIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";

/**
 * The platform's numbers used to live here as a four-card row. They now sit
 * in the social-proof band directly under the hero, where a visitor is
 * actually asking "is this real?" — so this section does one job: say what
 * Chefalio is for.
 */

const PRINCIPLES = [
  {
    title: "Written to cook from",
    body: "Not to rank. Prep time, difficulty, and the whole ingredient list are visible before you commit to the dish.",
  },
  {
    title: "Attributed to a person",
    body: "Every recipe belongs to a named chef with a profile and a body of work you can read back through.",
  },
  {
    title: "Paid for properly",
    body: "Chefs price their own cookbooks and keep the audience. The platform doesn't sit between them and the people cooking.",
  },
];

export const AboutUs = () => {
  const reduce = useReducedMotion();

  return (
    <section
      id="about"
      className="surface-raised overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Quote card */}
          <Reveal distance={26}>
            <motion.div
              whileHover={reduce ? undefined : { y: -4 }}
              transition={SPRING.snappy}
              className="relative overflow-hidden rounded-3xl p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(155deg, color-mix(in oklab, var(--primary) 72%, transparent), color-mix(in oklab, var(--accent) 94%, transparent))",
                boxShadow: "var(--cs-shadow-float)",
              }}
            >
              <ChefHatIcon size={30} weight="fill" style={{ color: "#12200a", opacity: 0.5 }} />

              <p
                className="mt-8 text-2xl font-semibold md:text-[1.75rem]"
                style={{
                  color: "#12200a",
                  lineHeight: 1.25,
                  letterSpacing: "-0.025em",
                }}
              >
                &ldquo;The best meals begin with curiosity and end with
                connection.&rdquo;
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span
                  className="h-11 w-11 overflow-hidden rounded-full"
                  style={{ border: "2px solid rgba(255,255,255,0.5)" }}
                >
                  <Image
                    src="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530583/about-us_mrtdt2.png"
                    width={44}
                    height={44}
                    alt=""
                    className="h-11 w-11 object-cover"
                  />
                </span>
                <div>
                  <p
                    className="type-caption font-semibold"
                    style={{ color: "#12200a" }}
                  >
                    Sofia Anderson
                  </p>
                  <p
                    className="type-micro"
                    style={{ color: "rgba(18,32,10,0.68)" }}
                  >
                    Co-founder and Head Chef
                  </p>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Mission */}
          <div>
            <Reveal distance={16}>
              <span
                className="type-label"
                style={{ color: "var(--cs-accent-text)" }}
              >
                Why we built it
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                className="type-title mt-3"
                style={{ color: "var(--cs-text-primary)" }}
              >
                Closing the gap between{" "}
                <span style={{ color: "var(--cs-accent-text)" }}>
                  professional kitchens
                </span>{" "}
                and home cooks
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p
                className="type-body-lg mt-5"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                Most recipes online are written to rank, not to cook from.
                Chefalio works the other way round.
              </p>
            </Reveal>

            <ul className="mt-9 space-y-6">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.title} delay={0.15 + i * 0.06} as="li" distance={16}>
                  <div className="flex gap-3.5">
                    <SealCheckIcon
                      size={20}
                      weight="fill"
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--cs-accent-text)" }}
                    />
                    <div>
                      <h3
                        className="type-subheading"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="type-caption mt-1.5"
                        style={{ color: "var(--cs-text-secondary)" }}
                      >
                        {p.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
