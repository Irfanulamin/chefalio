"use client";

import Link from "next/link";
import { ChatCircleDotsIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./shared/Reveal";

/**
 * This section used to be an accordion: five identical rounded cards, each
 * with a plus that rotated into a cross. That control is the single most
 * templated thing a landing page can ship — and it was hiding every answer
 * behind a click under a heading that promises them "plainly". A visitor
 * with a question had to guess which of five closed rows contained it.
 *
 * So there is no accordion. Every answer is on the page, and each one leads
 * with the one-line version — which is what "plainly" actually means, and
 * what gives the list its typographic rhythm: a short bold line to scan, a
 * longer one underneath only if you want it.
 *
 * `who` tags each question with the side of the marketplace asking it,
 * matching the two personas the page has already introduced by this point.
 */
const QnA = [
  {
    who: "Cooking",
    question: "Does it cost anything to browse recipes?",
    short: "No. Browsing is free, permanently.",
    detail:
      "Creating an account and reading the full recipe catalogue costs nothing. You only pay when you decide to buy a cookbook.",
  },
  {
    who: "Cooking",
    question: "How does buying a cookbook work?",
    short: "One payment, and it is yours to keep.",
    detail:
      "Pick a cookbook, pay once, and it lands in your library straight away. No subscription, no recurring charge — purchased cookbooks stay in your account whether or not you keep using the site.",
  },
  {
    who: "Cooking",
    question: "Where do my saved recipes and cookbooks live?",
    short: "One library, on your account.",
    detail:
      "Recipes you save and cookbooks you have bought sit side by side in the same place, so you are not hunting across the site mid-cook.",
  },
  {
    who: "Selling",
    question: "How do I become a chef on Chefalio?",
    short: "Apply from your account; a person reviews it.",
    detail:
      "Sign up as a normal user, then submit a chef application. Once it is approved your chef dashboard unlocks, and you can publish recipes and build them into cookbooks.",
  },
  {
    who: "Selling",
    question: "What do chefs earn from a cookbook?",
    short: "You set the price and keep the audience.",
    detail:
      "Chefs price every cookbook they publish. Orders and earnings appear in the dashboard as they come in, alongside views, likes, and saves for each recipe.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="surface-base py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,330px)_1fr] lg:gap-16">
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
              className="mt-7 flex items-start gap-3 rounded-2xl p-4 transition-colors duration-150 hover:brightness-[0.98]"
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

        {/* Hairline-separated rows rather than five floating cards. The
            questions are a single list of related things, and a rule between
            them says that better than five drop shadows do. */}
        <dl className="flex flex-col">
          {QnA.map((qa, i) => (
            <Reveal key={qa.question} delay={i * 0.04} distance={16}>
              <div
                className="grid gap-x-6 gap-y-2 py-7 sm:grid-cols-[88px_1fr]"
                style={
                  i === 0
                    ? undefined
                    : { borderTop: "1px solid var(--cs-border-subtle)" }
                }
              >
                <span
                  className="type-micro pt-0.5 font-semibold tracking-wide uppercase"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  {qa.who}
                </span>

                <div className="min-w-0">
                  <dt
                    className="type-subheading"
                    style={{ color: "var(--cs-text-primary)" }}
                  >
                    {qa.question}
                  </dt>

                  {/* The answer, then the footnote. Someone skimming gets
                      what they came for off the bold line alone. */}
                  <dd className="mt-2.5">
                    <p
                      className="type-body font-semibold"
                      style={{ color: "var(--cs-accent-text)" }}
                    >
                      {qa.short}
                    </p>
                    <p
                      className="type-caption mt-1.5"
                      style={{ color: "var(--cs-text-secondary)" }}
                    >
                      {qa.detail}
                    </p>
                  </dd>
                </div>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FAQ;
