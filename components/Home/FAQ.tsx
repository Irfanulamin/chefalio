"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  ChatCircleDotsIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";

const QnA = [
  {
    question: "Does it cost anything to browse recipes?",
    answer:
      "No. Creating an account and browsing the full recipe catalogue is free. You only pay when you decide to buy a cookbook.",
  },
  {
    question: "How does buying a cookbook work?",
    answer:
      "Pick a cookbook, pay once, and it lands in your library straight away. There is no subscription and no recurring charge. Purchased cookbooks stay in your account, so you can come back to them whenever you cook.",
  },
  {
    question: "How do I become a chef on Chefalio?",
    answer:
      "Sign up as a normal user, then submit a chef application from your account. Our team reviews it and, once approved, your chef dashboard unlocks so you can publish recipes and build cookbooks.",
  },
  {
    question: "What do chefs earn from a cookbook?",
    answer:
      "Chefs set their own price on every cookbook they publish. Orders and earnings appear in the chef dashboard as they come in, alongside views, likes, and saves for each recipe.",
  },
  {
    question: "Where do my saved recipes and cookbooks live?",
    answer:
      "Everything sits in one library on your account. Recipes you save and cookbooks you have bought appear side by side, so you are not hunting across the site mid-cook.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      className="surface-base py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal distance={16}>
            <span
              className="type-label"
              style={{ color: "var(--cs-accent-text)" }}
            >
              FAQ
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              className="type-title mt-3"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Questions, answered plainly
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            {/* A dead end is the one thing a FAQ must not be — so it ends
                with somewhere to go. */}
            <Link
              href="/#about"
              className="mt-7 flex items-start gap-3 rounded-2xl p-4 transition-colors duration-150"
              style={{
                backgroundColor: "var(--cs-surface-1)",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: "var(--cs-accent-muted)" }}
              >
                <ChatCircleDotsIcon
                  size={17}
                  weight="fill"
                  style={{ color: "var(--cs-accent-text)" }}
                />
              </span>
              <div>
                <p
                  className="type-caption font-semibold"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  Still stuck on something?
                </p>
                <p
                  className="type-micro mt-1"
                  style={{ color: "var(--cs-text-secondary)" }}
                >
                  Contact support and a real person will get back to you.
                </p>
              </div>
            </Link>
          </Reveal>
        </div>

        <div className="flex flex-col gap-2.5">
          {QnA.map((qa, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={qa.question} delay={i * 0.05} distance={16}>
                <motion.div
                  className="overflow-hidden rounded-2xl"
                  animate={{
                    backgroundColor: isOpen
                      ? "var(--cs-surface-1)"
                      : "var(--cs-surface-3)",
                  }}
                  transition={SPRING.default}
                  style={{
                    border: `1px solid ${
                      isOpen
                        ? "var(--cs-border-default)"
                        : "var(--cs-border-subtle)"
                    }`,
                    boxShadow: isOpen ? "var(--cs-shadow-card)" : "none",
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    whileTap={reduce ? undefined : { scale: 0.995 }}
                    transition={SPRING.snappy}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <span
                      className="type-subheading"
                      style={{
                        color: isOpen
                          ? "var(--cs-text-primary)"
                          : "var(--cs-text-secondary)",
                      }}
                    >
                      {qa.question}
                    </span>

                    {/* The plus rotates into a cross and back along the same
                        45°, so opening and closing trace one path. */}
                    <motion.span
                      animate={{
                        rotate: isOpen ? 45 : 0,
                        backgroundColor: isOpen
                          ? "var(--primary)"
                          : "transparent",
                      }}
                      transition={SPRING.default}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                      style={{ border: "1px solid var(--cs-border-default)" }}
                    >
                      <PlusIcon
                        size={12}
                        weight="bold"
                        style={{
                          color: isOpen
                            ? "var(--primary-foreground)"
                            : "var(--cs-text-secondary)",
                        }}
                      />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0.15 } : SPRING.sheet}
                        className="overflow-hidden"
                      >
                        <p
                          className="type-caption px-5 pb-5"
                          style={{ color: "var(--cs-text-secondary)" }}
                        >
                          {qa.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
