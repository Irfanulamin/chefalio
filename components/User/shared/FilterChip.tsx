"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, SPRING } from "@/lib/motion";

/**
 * A chip is small and already carries a colour change, so the landing
 * page's 1.18 pop would read as a jolt here. This is the same gesture at
 * chip scale: enough to confirm the tap landed, not enough to notice as
 * an animation.
 */
const CHIP_POP = [1, 1.06, 1];

type FilterChipProps = {
  children: ReactNode;
  active: boolean;
  onToggle: () => void;
  /** Rendered after the label — the removable active-filter chips use an ✕. */
  trailing?: ReactNode;
  disabled?: boolean;
  className?: string;
};

/**
 * The app's one filter control: difficulty, tags, author, everything.
 *
 * The difficulty chips used to be colour-coded even when unselected —
 * emerald for beginner, amber for intermediate, rose for advance — so a
 * row of three unpicked filters read like a traffic light, and the one
 * you had actually chosen had nothing distinctive left to say. Colour
 * now means *selected* and nothing else, which is the only way a glance
 * at a filter bar can answer "what am I filtered by".
 *
 * The visual states live in `.ui-chip` so a non-interactive tag pill
 * renders identically to an interactive one.
 */
export function FilterChip({
  children,
  active,
  onToggle,
  trailing,
  disabled = false,
  className = "",
}: FilterChipProps) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      data-active={active}
      aria-pressed={active}
      className={`ui-chip ${className}`}
      animate={reduce ? undefined : { scale: active ? CHIP_POP : 1 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.96 }}
      transition={{
        ...SPRING.snappy,
        scale: { duration: 0.24, times: [0, 0.45, 1], ease: EASE },
      }}
    >
      {children}
      {trailing}
    </motion.button>
  );
}

export default FilterChip;
