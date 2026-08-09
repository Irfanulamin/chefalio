"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";
import { SPRING } from "../motion";

type PressableProps = Omit<
  ComponentProps<typeof motion.button>,
  "whileTap" | "whileHover"
> & {
  /** How far the surface gives under a press. Bigger surfaces move less. */
  scale?: number;
  /** Small surfaces (chips, icon buttons) can afford to lift on hover. */
  lift?: boolean;
  as?: "button" | "div" | "a";
};

/**
 * A surface that acknowledges contact.
 *
 * Framer's `whileTap` fires on pointer-*down*, which is the whole point:
 * feedback that waits for the click has already missed the moment the
 * user was looking for it. The spring back is interruptible, so a press
 * cancelled by dragging away resolves from wherever the scale currently
 * sits rather than snapping.
 */
export function Pressable({
  children,
  scale = 0.97,
  lift = false,
  as = "button",
  ...props
}: PressableProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.button;

  return (
    <Tag
      {...props}
      whileTap={reduce ? undefined : { scale }}
      whileHover={reduce || !lift ? undefined : { y: -2 }}
      transition={SPRING.snappy}
    >
      {children}
    </Tag>
  );
}

export default Pressable;
