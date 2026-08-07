import { cubicBezier } from "framer-motion";

/** Shared easing used across every landing section. */
export const EASE = cubicBezier(0.22, 1, 0.36, 1);

/** Tuple form, for the places framer accepts a raw bezier array. */
export const EASE_ARRAY = [0.22, 1, 0.36, 1] as const;

export const stagger = (staggerChildren = 0.08, delayChildren = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const slideUp = {
  hidden: { y: 40, opacity: 0, filter: "blur(6px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

export const slideLeft = {
  hidden: { x: -60, opacity: 0, filter: "blur(8px)" },
  visible: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: EASE },
  },
};

/** Standard viewport config so every section triggers at the same point. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
