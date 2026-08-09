"use client";

import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  /** Short, specific — name the section for what's in it. */
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
};

/**
 * Every section opens the same way. Consistency here is what lets someone
 * scan the page: same place, same shape, same weight jump between the
 * eyebrow, the title, and the sentence under it.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "start",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow && (
        <Reveal distance={12}>
          <span
            className="type-label inline-block"
            style={{ color: "var(--cs-accent-text)" }}
          >
            {eyebrow}
          </span>
        </Reveal>
      )}

      <Reveal delay={eyebrow ? 0.05 : 0}>
        <h2
          className="type-title mt-3"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {title}
        </h2>
      </Reveal>

      {lede && (
        <Reveal delay={0.1}>
          <p
            className="type-body-lg mt-4"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export default SectionHeading;
