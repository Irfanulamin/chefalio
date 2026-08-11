"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { SPRING } from "@/lib/motion";

export type Segment<T extends string> = {
  id: T;
  label: string;
  Icon?: React.ElementType;
};

type SegmentedTabsProps<T extends string> = {
  segments: readonly Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Names the group for screen readers, e.g. "Activity sections". */
  label: string;
};

/**
 * The segmented control used by Activity and by a chef's profile.
 *
 * Both screens had grown their own copy — same idea, subtly different
 * padding, radius and shadow — which is the "same control, two
 * appearances" problem that makes an app feel assembled rather than
 * designed.
 *
 * The selected pill is a single shared element moved by `layoutId`
 * rather than a background that switches off one button and on another.
 * That is the difference between the selection *travelling* to where you
 * tapped and it teleporting: the motion is what tells you these tabs are
 * one track with one selection, and it is interruptible, so tapping
 * three tabs quickly redirects the pill from wherever it currently is
 * instead of queueing three animations.
 */
export function SegmentedTabs<T extends string>({
  segments,
  value,
  onChange,
  label,
}: SegmentedTabsProps<T>) {
  const reduce = useReducedMotion();
  const layoutId = useId();

  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl p-1"
      style={{
        backgroundColor: "var(--cs-surface-3)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      {segments.map(({ id, label: segmentLabel, Icon }) => {
        const selected = value === id;

        return (
          <button
            key={id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className="focus-ring relative flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-150"
            style={{
              color: selected ? "var(--cs-text-primary)" : "var(--cs-text-secondary)",
            }}
          >
            {selected && (
              <motion.span
                layoutId={reduce ? undefined : layoutId}
                aria-hidden
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: "var(--cs-surface-1)",
                  border: "1px solid var(--cs-border-subtle)",
                  boxShadow: "var(--cs-shadow-chip)",
                }}
                transition={SPRING.snappy}
              />
            )}

            {/* Above the pill, which is absolutely positioned behind it. */}
            <span className="relative z-10 flex items-center gap-2">
              {Icon && (
                <Icon
                  size={16}
                  weight={selected ? "fill" : "regular"}
                  style={selected ? { color: "var(--cs-accent-text)" } : undefined}
                />
              )}
              <span className="ui-subheading whitespace-nowrap">{segmentLabel}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedTabs;
