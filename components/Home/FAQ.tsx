"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { EASE, VIEWPORT } from "./motion";

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

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      className="px-4 py-20 md:px-8 md:py-28"
      style={{ backgroundColor: "var(--cs-surface-2)" }}
    >
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <h2
            className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl"
            style={{ color: "var(--cs-text-primary)" }}
          >
            Questions, answered plainly
          </h2>
          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            Still stuck on something? Contact support and a real person will get
            back to you.
          </p>
        </motion.div>

        <div className="flex flex-col gap-2.5">
          {QnA.map((qa, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={qa.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                className="overflow-hidden rounded-2xl transition-colors duration-300"
                style={{
                  backgroundColor: isOpen ? "var(--cs-surface-1)" : "transparent",
                  border: `1px solid ${
                    isOpen ? "var(--cs-border-default)" : "var(--cs-border-subtle)"
                  }`,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <span
                    className="text-[15px] font-medium leading-snug"
                    style={{
                      color: isOpen
                        ? "var(--cs-text-primary)"
                        : "var(--cs-text-secondary)",
                    }}
                  >
                    {qa.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
                    style={{ border: "1px solid var(--cs-border-default)" }}
                  >
                    <PlusIcon
                      size={12}
                      weight="bold"
                      style={{ color: "var(--cs-text-secondary)" }}
                    />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-5 text-sm leading-[1.75]"
                        style={{ color: "var(--cs-text-secondary)" }}
                      >
                        {qa.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
