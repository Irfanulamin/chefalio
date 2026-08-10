import Link from "next/link";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";

/**
 * The shell for the policy documents.
 *
 * Privacy and Terms were two copies of the same page, written before the type
 * scale existed: `text-4xl font-extrabold` where the rest of the site says
 * `type-title`, `text-xl font-bold` for every section head, and body copy at
 * whatever the browser default happened to be. Two files meant two places to
 * fix anything, and they had already drifted apart in small ways.
 *
 * Legal pages are a utility surface, not a brand one. Nobody arrives to be
 * impressed — they arrive with a question ("what happens to my card
 * details?") and need to find the paragraph that answers it. So the work here
 * is findability and readability: one index that lists every section, a
 * measured line length, and headings you can link someone directly to.
 */

export type LegalSection = {
  /** Anchor target. Stable — these get pasted into support replies. */
  id: string;
  heading: string;
  body: React.ReactNode;
};

/**
 * `list-disc list-inside` sets the marker inside the text flow, so the second
 * line of any wrapped bullet tucks under the dot instead of under the words.
 * Half these bullets wrap. This hangs the marker properly instead.
 */
export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="mt-4 space-y-3">{children}</ul>;
}

export function LegalItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-2.5 h-1 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: "var(--cs-accent-text)" }}
      />
      <span className="type-body" style={{ color: "var(--cs-text-secondary)" }}>
        {children}
      </span>
    </li>
  );
}

/** Inline link. See the note on `--cs-accent-text` below. */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
      /**
       * `--cs-accent` is the raw brand lime, and globals.css says outright
       * that it fails contrast on white — which is exactly what both pages
       * used for their only links. `--cs-accent-text` is the deepened olive
       * that exists for this.
       */
      style={{ color: "var(--cs-accent-text)" }}
    >
      {children}
    </a>
  );
}

export function LegalPage({
  title,
  summary,
  updated,
  sections,
}: {
  title: string;
  /** One plain sentence on what this document is, before the legal register. */
  summary: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="surface-base">
      <Header />

      {/* pt clears the fixed header, which no longer occupies flow space. */}
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <div className="max-w-2xl">
          <span className="type-label" style={{ color: "var(--cs-accent-text)" }}>
            Legal
          </span>
          <h1
            className="type-title mt-3"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {title}
          </h1>
          <p
            className="type-body-lg mt-4"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {summary}
          </p>
          <p
            className="type-micro mt-5"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            Last updated {updated}
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
          {/* Six sections of legal prose with no index is a scroll hunt. The
              rail is the same sticky pattern the FAQ uses, so the site has one
              way of handling a long column beside a short one. */}
          <nav
            aria-label={`${title} sections`}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p
              className="type-micro font-semibold tracking-wide uppercase"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              On this page
            </p>
            <ul className="mt-4 space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="type-caption block rounded-lg py-1.5 transition-colors hover:opacity-70"
                    style={{ color: "var(--cs-text-secondary)" }}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                // Anchored headings land under a fixed header, so they need
                // somewhere to land that is not behind it.
                className="scroll-mt-28 py-8 first:pt-0"
                style={
                  i === 0
                    ? undefined
                    : { borderTop: "1px solid var(--cs-border-subtle)" }
                }
              >
                <h2
                  className="type-heading"
                  style={{ color: "var(--cs-text-primary)" }}
                >
                  {section.heading}
                </h2>
                <div className="mt-4 max-w-2xl">{section.body}</div>
              </section>
            ))}

            <div
              className="mt-4 rounded-2xl p-5"
              style={{
                backgroundColor: "var(--cs-surface-2)",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <p
                className="type-caption"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                These pages sit alongside each other — the{" "}
                <Link
                  href="/privacy"
                  className="underline decoration-1 underline-offset-2"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  Privacy Policy
                </Link>{" "}
                and the{" "}
                <Link
                  href="/terms"
                  className="underline decoration-1 underline-offset-2"
                  style={{ color: "var(--cs-accent-text)" }}
                >
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LegalPage;
