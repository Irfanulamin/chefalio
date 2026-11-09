import { Star } from "./Doodles";

/**
 * Four questions, always open. With only four short answers, an accordion
 * would just hide text behind clicks.
 */
const QUESTIONS = [
  {
    q: "Are recipes free?",
    a: "Yes. Create a free account to read and save recipes and follow chefs. You only pay if you buy a printed cookbook.",
  },
  {
    q: "Are cookbooks printed?",
    a: "Yes. Every cookbook is a physical book, shipped to you by the chef who wrote it.",
  },
  {
    q: "Where can I track my order?",
    a: "Under Activity in your account. Each order shows as paid, shipped, then delivered.",
  },
  {
    q: "How do I become a chef?",
    a: "Create an account, then apply from it. We verify your ID and review your application.",
  },
] as const;

export function FAQ() {
  return (
    <section
      id="faq"
      className="mx-auto grid max-w-6xl gap-8 px-4 pb-20 md:px-8 md:pb-28 lg:grid-cols-12 lg:gap-14"
    >
      <div className="lg:col-span-4">
        <h2 className="display-2 flex items-center gap-3">
          Questions
          <Star className="landing-spin-reverse h-8 w-8 shrink-0 md:h-10 md:w-10" />
        </h2>
      </div>

      <dl className="lg:col-span-8" style={{ borderTop: "1px solid var(--rule)" }}>
        {QUESTIONS.map((item) => (
          <div
            key={item.q}
            className="py-6"
            style={{ borderBottom: "1px solid var(--rule)" }}
          >
            <dt className="type-subheading">{item.q}</dt>
            <dd
              className="type-body mt-2 max-w-[60ch]"
              style={{ color: "var(--ink-soft)" }}
            >
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default FAQ;
