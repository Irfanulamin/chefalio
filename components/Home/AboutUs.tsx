"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChefHatIcon, SealCheckIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";
import { cld, SCENES } from "./imagery";

/**
 * The platform's numbers used to live here as a four-card row. They now sit
 * in the social-proof band directly under the hero, where a visitor is
 * actually asking "is this real?" — so this section does one job: say what
 * Chefalio is for.
 *
 * The quote panel was an accent-green gradient with the kitchen photograph
 * shrunk to a 44px avatar beside it. That is backwards: the photograph is the
 * argument — a real pass, real knives, someone's hands — and the gradient was
 * only ever filling space. So the photo is now the panel, and the avatar is
 * gone rather than repeating the same image at two sizes.
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
          {/* Quote panel — the photograph is the panel. */}
          <Reveal distance={26}>
            <motion.figure
              whileHover={reduce ? undefined : { y: -4 }}
              transition={SPRING.snappy}
              className="group relative isolate overflow-hidden rounded-3xl"
              style={{ boxShadow: "var(--cs-shadow-float)" }}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={cld(SCENES.kitchen, { w: 1000, h: 1250 })}
                  alt="A chef scattering herbs by hand over the last element of a plate, knives still lying on the pass beside it."
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className={
                    reduce
                      ? "object-cover"
                      : "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  }
                />
              </div>

              {/* Enough scrim to set type on, and no more — the pass, the
                  knives and the plate all stay legible through it. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,10,6,0.94) 4%, rgba(8,10,6,0.72) 34%, rgba(8,10,6,0.16) 62%, rgba(8,10,6,0.04) 100%)",
                }}
              />

              <figcaption className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <ChefHatIcon
                  size={28}
                  weight="fill"
                  style={{ color: "var(--cs-accent)" }}
                />

                <blockquote
                  className="mt-5 text-2xl font-semibold md:text-[1.75rem]"
                  style={{
                    color: "#ffffff",
                    lineHeight: 1.25,
                    letterSpacing: "-0.025em",
                    textWrap: "balance",
                  }}
                >
                  &ldquo;The best meals begin with curiosity and end with
                  connection.&rdquo;
                </blockquote>

                <div className="mt-6">
                  <p
                    className="type-caption font-semibold"
                    style={{ color: "#ffffff" }}
                  >
                    Sofia Anderson
                  </p>
                  <p
                    className="type-micro"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                  >
                    Co-founder and Head Chef
                  </p>
                </div>
              </figcaption>
            </motion.figure>
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
