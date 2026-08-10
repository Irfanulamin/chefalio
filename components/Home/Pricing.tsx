"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckIcon, InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";
import { SectionHeading } from "./shared/SectionHeading";

/**
 * Chefalio does not sell seats, so this is not a tier ladder — it is the
 * three ways money does or doesn't change hands. Saying that plainly beats
 * inventing Basic/Pro/Enterprise for a marketplace that has none.
 */
const PLANS: {
  id: string;
  name: string;
  price: string;
  unit?: string;
  tagline: string;
  points: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}[] = [
  {
    id: "cook",
    name: "Cook",
    price: "Free",
    tagline: "Everything you need to find dinner and actually make it.",
    points: [
      "Browse the full recipe catalogue",
      "Filter by ingredient, diet, time, difficulty",
      "Save unlimited recipes to your library",
      "Follow the chefs whose food you like",
    ],
    cta: { label: "Create free account", href: "/register" },
  },
  {
    id: "cookbooks",
    name: "Cookbooks",
    price: "$18",
    unit: "and up, per book",
    tagline: "Buy the ones worth owning. Once, not monthly.",
    points: [
      "Everything in Cook",
      "One-time purchase, no subscription",
      "Purchased cookbooks stay in your library",
      "Chef sets the price, you see it up front",
    ],
    cta: { label: "Browse cookbooks", href: "/cookbooks" },
    featured: true,
  },
  {
    id: "chef",
    name: "Chef",
    price: "Free",
    unit: "to publish",
    tagline: "Publish your work, price it yourself, get paid weekly.",
    points: [
      "Publish recipes and bundle them into cookbooks",
      "Set your own price on everything you sell",
      "Views, likes, saves, and orders per recipe",
      "Weekly payouts once your application is approved",
    ],
    cta: { label: "Apply as a chef", href: "/apply-chef" },
  },
];

export const Pricing = () => {
  const reduce = useReducedMotion();

  return (
    <section
      id="pricing"
      className="surface-base relative py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Free to cook from. Pay only for what you keep."
          lede="There is no subscription anywhere on Chefalio — not for cooks, not for chefs."
          align="center"
        />

        {/* `items-start` sized every column to its own content, so three
            cards with four bullets each came out short and uneven. They
            stretch to a common height now, with a floor under them so the
            price has room to breathe above the list. */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.06} distance={22} className="h-full">
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={SPRING.snappy}
                className={`relative flex h-full flex-col rounded-3xl p-8 lg:min-h-[33rem] ${
                  plan.featured ? "lg:-mt-4 lg:pb-10 lg:pt-10" : ""
                }`}
                style={
                  plan.featured
                    ? {
                        backgroundColor: "var(--cs-surface-1)",
                        border:
                          "1.5px solid color-mix(in oklab, var(--primary) 55%, transparent)",
                        boxShadow: "var(--cs-shadow-float)",
                      }
                    : {
                        backgroundColor: "var(--cs-surface-2)",
                        border: "1px solid var(--cs-border-subtle)",
                      }
                }
              >
                {plan.featured && (
                  <span
                    className="type-micro absolute -top-3 left-7 rounded-full px-2.5 py-1 font-bold"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      boxShadow:
                        "0 4px 14px -6px color-mix(in oklab, var(--primary) 90%, transparent)",
                    }}
                  >
                    MOST POPULAR
                  </span>
                )}

                <h3
                  className="type-label"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="text-4xl font-bold tabular-nums"
                    style={{
                      color: "var(--cs-text-primary)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  {plan.unit && (
                    <span
                      className="type-caption"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      {plan.unit}
                    </span>
                  )}
                </div>

                <p
                  className="type-caption mt-3"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  {plan.tagline}
                </p>

                <ul className="mt-8 flex-1 space-y-4">
                  {plan.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span
                        className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                        style={{
                          backgroundColor: plan.featured
                            ? "var(--primary)"
                            : "var(--cs-accent-muted)",
                        }}
                      >
                        <CheckIcon
                          size={9}
                          weight="bold"
                          style={{
                            color: plan.featured
                              ? "var(--primary-foreground)"
                              : "var(--cs-accent-text)",
                          }}
                        />
                      </span>
                      <span
                        className="type-caption"
                        style={{ color: "var(--cs-text-secondary)" }}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.div
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={SPRING.snappy}
                  className="mt-8"
                >
                  <Link
                    href={plan.cta.href}
                    className="type-subheading inline-flex h-11 w-full items-center justify-center rounded-full transition-opacity duration-150 hover:opacity-90"
                    style={
                      plan.featured
                        ? {
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                          }
                        : {
                            backgroundColor: "transparent",
                            color: "var(--cs-text-primary)",
                            border: "1px solid var(--cs-border-default)",
                          }
                    }
                  >
                    {plan.cta.label}
                  </Link>
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} distance={12}>
          <p
            className="type-caption mt-10 flex items-center justify-center gap-2 text-center"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <InfoIcon size={14} />
            Checkout is handled by a payment provider. Card details never touch
            our servers.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Pricing;
