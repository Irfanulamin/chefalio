"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { QuotesIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";
import { SectionHeading } from "./shared/SectionHeading";
import { chefByName, cld } from "./imagery";

/**
 * The same four people who author the dishes elsewhere on the page.
 *
 * Two of them used to be captioned "Home cook" here while `DISHES`
 * simultaneously credited them as the chef behind a recipe, and the chef
 * roster in the features grid now puts that side by side. `DISHES` is the
 * backbone the rest of the page reads from, so the captions follow it.
 */
const FEATURED = {
  quote:
    "I had four cookbooks sitting in a folder for two years because self-publishing meant becoming a marketer. I uploaded the first one on a Sunday and it sold eleven copies before I finished service on Monday.",
  chef: chefByName("Marco Rivera"),
  role: "Head chef · Lisbon",
  metric: { value: "$8,240", label: "earned in 6 months" },
};

const QUOTES = [
  {
    quote:
      "The filters are the whole thing for me. Off shift I type in what is actually in the fridge and forty minutes, and I get food, not an essay about someone's grandmother.",
    chef: chefByName("Amara Osei"),
    role: "Chef · Accra",
  },
  {
    quote:
      "My name sits on every recipe I put up, and so does everyone else's. That is the part I trust. Nothing here was written to rank on a search engine.",
    chef: chefByName("Yuki Tanaka"),
    role: "Chef · Osaka",
  },
  {
    quote:
      "I set my own price, I can see which recipes people actually save, and the payout lands the same week. It is the first platform that felt built for the person cooking.",
    chef: chefByName("Lina Ferrari"),
    role: "Pastry chef · Bologna",
  },
];

function Stars() {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          size={12}
          weight="fill"
          style={{ color: "var(--cs-accent-text)" }}
        />
      ))}
    </span>
  );
}

export const Testimonials = () => {
  const reduce = useReducedMotion();

  return (
    <section
      id="testimonials"
      className="surface-raised py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="The people already cooking and selling here"
          align="center"
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* Featured — one voice given the room to say something real,
              instead of three equal cards of the same length.

              Ink rather than the accent green it used to be: this is the third
              full panel on the page and they were all the same colour, which
              flattened the whole scroll into one hue. Dark gives the anchor
              quote its weight and puts the green back to work as an accent —
              on the number, which is the part worth looking at. */}
          <Reveal className="lg:col-span-1" distance={22}>
            <motion.figure
              whileHover={reduce ? undefined : { y: -4 }}
              transition={SPRING.snappy}
              className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7"
              style={{
                backgroundColor: "#141a0e",
                boxShadow: "var(--cs-shadow-float)",
              }}
            >
              {/* Light falling from the top edge, so the panel reads as a lit
                  surface rather than a flat fill. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,209,41,0.16), transparent 70%)",
                }}
              />

              <div>
                <QuotesIcon
                  size={26}
                  weight="fill"
                  style={{ color: "var(--cs-accent)", opacity: 0.75 }}
                />
                <blockquote
                  className="type-body mt-4 font-medium"
                  style={{ color: "rgba(255,255,255,0.94)" }}
                >
                  {FEATURED.quote}
                </blockquote>
              </div>

              <div className="mt-7">
                <div
                  className="mb-5 flex items-baseline gap-2 rounded-2xl px-3.5 py-2.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <span
                    className="text-xl font-bold tabular-nums"
                    style={{
                      color: "var(--cs-accent)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {FEATURED.metric.value}
                  </span>
                  <span
                    className="type-micro"
                    style={{ color: "rgba(255,255,255,0.66)" }}
                  >
                    {FEATURED.metric.label}
                  </span>
                </div>

                <figcaption className="flex items-center gap-3">
                  <Image
                    src={cld(FEATURED.chef.avatar, { w: 80, h: 80 })}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    style={{ border: "2px solid rgba(255,255,255,0.28)" }}
                  />
                  <div>
                    <p
                      className="type-caption font-semibold"
                      style={{ color: "#ffffff" }}
                    >
                      {FEATURED.chef.name}
                    </p>
                    <p
                      className="type-micro"
                      style={{ color: "rgba(255,255,255,0.68)" }}
                    >
                      {FEATURED.role}
                    </p>
                  </div>
                </figcaption>
              </div>
            </motion.figure>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
            {QUOTES.map((q, i) => (
              <Reveal
                key={q.chef.name}
                delay={0.05 + i * 0.05}
                distance={22}
                className={i === 2 ? "sm:col-span-2" : ""}
              >
                <motion.figure
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={SPRING.snappy}
                  className="flex h-full flex-col justify-between rounded-3xl p-6"
                  style={{
                    backgroundColor: "var(--cs-surface-1)",
                    border: "1px solid var(--cs-border-subtle)",
                    boxShadow: "var(--cs-shadow-card)",
                  }}
                >
                  <div>
                    <Stars />
                    <blockquote
                      className="type-caption mt-3.5"
                      style={{ color: "var(--cs-text-secondary)" }}
                    >
                      {q.quote}
                    </blockquote>
                  </div>

                  <figcaption className="mt-6 flex items-center gap-3">
                    <Image
                      src={cld(q.chef.avatar, { w: 68, h: 68 })}
                      alt=""
                      width={34}
                      height={34}
                      className="h-[34px] w-[34px] rounded-full object-cover"
                    />
                    <div>
                      <p
                        className="type-caption font-semibold"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {q.chef.name}
                      </p>
                      <p
                        className="type-micro"
                        style={{ color: "var(--cs-text-tertiary)" }}
                      >
                        {q.role}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
