"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ComponentProps } from "react";
import { SPRING } from "@/lib/motion";

const MotionLink = motion.create(Link);

type PressProps = Omit<
  ComponentProps<typeof motion.button>,
  "whileTap" | "whileHover"
> & {
  /** How far the surface gives under a press. Bigger surfaces move less. */
  scale?: number;
  as?: "button" | "div" | "span";
};

/**
 * A surface that acknowledges contact — the app's counterpart to the
 * landing page's `Pressable`, driven by the same spring.
 *
 * Framer's `whileTap` fires on pointer-*down*, which is the whole point:
 * feedback that waits for the click has already missed the moment the
 * user was looking for it. The spring back is interruptible, so a press
 * cancelled by dragging away resolves from wherever the scale currently
 * sits rather than snapping.
 *
 * Note there is no `lift` here, unlike on the landing page. Hover lift in
 * the app is the card's job (`.ui-card-interactive`), so it stays
 * consistent across every tile whether or not it happens to be wrapped in
 * a press.
 */
export function Press({
  children,
  scale = 0.98,
  as = "button",
  ...props
}: PressProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.button;

  return (
    <Tag {...props} whileTap={reduce ? undefined : { scale }} transition={SPRING.snappy}>
      {children}
    </Tag>
  );
}

type PressLinkProps = Omit<
  ComponentProps<typeof MotionLink>,
  "whileTap" | "whileHover"
> & {
  scale?: number;
};

/** The same contact feedback, for anything that navigates. */
export function PressLink({ children, scale = 0.98, ...props }: PressLinkProps) {
  const reduce = useReducedMotion();

  return (
    <MotionLink
      {...props}
      whileTap={reduce ? undefined : { scale }}
      transition={SPRING.snappy}
    >
      {children}
    </MotionLink>
  );
}

export default Press;
