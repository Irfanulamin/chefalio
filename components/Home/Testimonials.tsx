"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { QuotesIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";
import { SectionHeading } from "./shared/SectionHeading";

const AVATARS = [
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1776520734/profile_pictures/dinswstuu3n8kywxcyik.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778681/profile_pictures/nhsmxspcuf66rmg5xlsv.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778506/profile_pictures/xkc4ykbvoxgjlqbobyxa.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778337/profile_pictures/wbdbvjrzxwuee9p2vt7x.jpg",
];

const FEATURED = {
  quote:
    "I had four cookbooks sitting in a folder for two years because self-publishing meant becoming a marketer. I uploaded the first one on a Sunday and it sold eleven copies before I finished service on Monday.",
  name: "Marco Rivera",
  role: "Head chef · Lisbon",
  avatar: AVATARS[0],
  metric: { value: "$8,240", label: "earned in 6 months" },
};

const QUOTES = [
  {
    quote:
      "The filters are the whole thing for me. I type in what is actually in the fridge and forty minutes, and I get food, not an essay about someone's grandmother.",
    name: "Amara Osei",
    role: "Home cook · Accra",
    avatar: AVATARS[1],
  },
  {
    quote:
      "Every recipe traces back to a chef with a name and a kitchen. That is the part I trust. Nothing here was written to rank on a search engine.",
    name: "Yuki Tanaka",
    role: "Home cook · Osaka",
    avatar: AVATARS[2],
  },
  {
    quote:
      "I set my own price, I can see which recipes people actually save, and the payout lands the same week. It is the first platform that felt built for the person cooking.",
    name: "Lina Ferrari",
    role: "Pastry chef · Bologna",
    avatar: AVATARS[3],
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
              instead of three equal cards of the same length. */}
          <Reveal className="lg:col-span-1" distance={22}>
            <motion.figure
              whileHover={reduce ? undefined : { y: -4 }}
              transition={SPRING.snappy}
              className="flex h-full flex-col justify-between rounded-3xl p-7"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in oklab, var(--primary) 78%, transparent), color-mix(in oklab, var(--accent) 95%, transparent))",
                boxShadow: "var(--cs-shadow-card)",
              }}
            >
              <div>
                <QuotesIcon size={26} weight="fill" style={{ color: "#12200a", opacity: 0.4 }} />
                <blockquote
                  className="type-body mt-4 font-medium"
                  style={{ color: "#12200a" }}
                >
                  {FEATURED.quote}
                </blockquote>
              </div>

              <div className="mt-7">
                <div
                  className="material-thick mb-5 flex items-baseline gap-2 rounded-2xl px-3.5 py-2.5"
                >
                  <span
                    className="text-xl font-bold tabular-nums"
                    style={{
                      color: "var(--cs-text-primary)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {FEATURED.metric.value}
                  </span>
                  <span
                    className="type-micro"
                    style={{ color: "var(--cs-text-secondary)" }}
                  >
                    {FEATURED.metric.label}
                  </span>
                </div>

                <figcaption className="flex items-center gap-3">
                  <Image
                    src={FEATURED.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    style={{ border: "2px solid rgba(255,255,255,0.5)" }}
                  />
                  <div>
                    <p
                      className="type-caption font-semibold"
                      style={{ color: "#12200a" }}
                    >
                      {FEATURED.name}
                    </p>
                    <p
                      className="type-micro"
                      style={{ color: "rgba(18,32,10,0.68)" }}
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
                key={q.name}
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
                      src={q.avatar}
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
                        {q.name}
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
