"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { crossFade, SPRING, VIEWPORT } from "../motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Seconds. Keep small — a long queue of delays reads as a loading page. */
  delay?: number;
  /** Travel distance in px. Reduced motion drops it to zero. */
  distance?: number;
  as?: "div" | "section" | "li" | "span";
  style?: React.CSSProperties;
};

/**
 * One entrance for the whole page, so sections share a rhythm instead of
 * each inventing their own.
 *
 * Under `prefers-reduced-motion` this becomes a plain cross-fade: the
 * setting asks us to drop the travel, not the feedback that something
 * new arrived.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 20,
  as = "div",
  style,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  const variants: Variants = reduce
    ? crossFade
    : {
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ...SPRING.soft, delay },
        },
      };

  return (
    <Tag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
