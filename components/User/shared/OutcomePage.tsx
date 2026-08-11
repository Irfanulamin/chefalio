import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/lib/recipe-display";

type Action = { label: string; href: string };

type OutcomePageProps = {
  tone: Extract<Tone, "success" | "warning" | "danger">;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  /** Label / value pairs. The first is highlighted in the tone colour. */
  facts: { label: string; value: string }[];
  primary: Action;
  secondary?: Action;
};

/**
 * The end of a payment flow — succeeded, or cancelled.
 *
 * The two pages were 95% the same markup with different hex literals
 * (`#f0fdf4`/`#22c55e` on one, `#fef9c3`/`#a16207` on the other), both
 * of which were light-mode greens and ambers that stayed light in dark
 * mode. One component, tone as a parameter.
 *
 * Both outcomes lead somewhere. A dead end after a payment — success or
 * not — is the moment a user most needs to know what happens next.
 */
export function OutcomePage({
  tone,
  icon,
  eyebrow,
  title,
  description,
  facts,
  primary,
  secondary,
}: OutcomePageProps) {
  return (
    <div className="app-root flex min-h-[70vh] items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div
          aria-hidden
          className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `var(--cs-${tone}-bg)`,
            border: `1px solid var(--cs-${tone}-edge)`,
            color: `var(--cs-${tone}-fg)`,
          }}
        >
          {icon}
        </div>

        <p className="ui-label mb-2" style={{ color: `var(--cs-${tone}-fg)` }}>
          {eyebrow}
        </p>
        <h1 className="ui-title mb-3" style={{ color: "var(--cs-text-primary)" }}>
          {title}
        </h1>
        <p className="ui-body mb-8" style={{ color: "var(--cs-text-secondary)" }}>
          {description}
        </p>

        <dl className="ui-card mb-7 p-4 text-left">
          {facts.map(({ label, value }, i) => (
            <div
              key={label}
              className="flex items-center justify-between py-2"
              style={
                i < facts.length - 1
                  ? { borderBottom: "1px solid var(--cs-border-subtle)" }
                  : undefined
              }
            >
              <dt className="ui-caption" style={{ color: "var(--cs-text-tertiary)" }}>
                {label}
              </dt>
              <dd
                className="ui-caption flex items-center gap-1.5 font-semibold"
                style={{
                  color: i === 0 ? `var(--cs-${tone}-fg)` : "var(--cs-text-primary)",
                }}
              >
                {i === 0 && (
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: `var(--cs-${tone}-fg)` }}
                  />
                )}
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-2.5">
          <Link
            href={primary.href}
            className="focus-ring block rounded-xl px-6 py-3 text-center text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {primary.label}
          </Link>
          {secondary && (
            <Link
              href={secondary.href}
              className="focus-ring block rounded-xl px-6 py-2.5 text-center text-sm font-medium transition-colors duration-150"
              style={{
                border: "1px solid var(--cs-border-default)",
                color: "var(--cs-text-secondary)",
              }}
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutcomePage;
