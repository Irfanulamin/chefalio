import { cubicBezier, type Transition } from "framer-motion";

/**
 * The landing page's motion vocabulary.
 *
 * Apple describes a spring with two designer-facing numbers rather than the
 * physics triplet: **damping ratio** (how much it overshoots — 1.0 settles
 * without bounce) and **response** (how quickly it reaches the target, in
 * seconds — not a duration, since a spring has none). Framer Motion's
 * `bounce` + `duration` spring maps onto that almost 1:1, so `spring()`
 * below is the translation layer and every transition on this page goes
 * through it.
 *
 * Springs, not tweens, because a spring animates from wherever the value
 * currently sits. That is what makes an in-flight animation grabbable and
 * reversible instead of something the user has to wait out.
 */
export const spring = (response = 0.4, damping = 1): Transition => ({
  type: "spring",
  bounce: Math.max(0, 1 - damping),
  duration: response,
});

export const SPRING = {
  /** House default. Critically damped — graceful, never distracting. */
  default: spring(0.4, 1),
  /** Presses, chips, icon nudges. Fast enough to feel like contact. */
  snappy: spring(0.26, 1),
  /** Only after a gesture carried momentum: a flick, a throw, a release. */
  momentum: spring(0.4, 0.8),
  /** Sheets, drawers, panels that slide. */
  sheet: spring(0.3, 0.8),
  /** Large surfaces settling — slower response, still no overshoot. */
  soft: spring(0.6, 1),
} satisfies Record<string, Transition>;

/**
 * Reversible transitions should mirror their easing so the return path
 * traces the outbound one. Kept for the few places that genuinely want a
 * fixed curve (looping ambient motion, gradients) rather than a spring.
 */
export const EASE = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_REVERSE = cubicBezier(0.64, 0, 0.78, 0);
export const EASE_ARRAY = [0.22, 1, 0.36, 1] as const;

/**
 * The one-frame pop something makes when it completes — a step ticking off, a
 * filter landing on a chip.
 *
 * It has to be a tween. A spring solves for a single target and can only
 * interpolate two keyframes, so handing it `[1, 1.18, 1]` throws; out and back
 * in one gesture is a shape, not a destination. Apply it per-value so the
 * colours animating alongside it keep their spring:
 *
 *     transition={{ ...SPRING.snappy, scale: POP_TRANSITION }}
 */
export const POP = [1, 1.18, 1];

export const POP_TRANSITION: Transition = {
  duration: 0.3,
  times: [0, 0.42, 1],
  ease: EASE,
};

/* ── Reveal variants ─────────────────────────────────────────────────────
   Entrances are spring-driven and short-travel. Nothing here overshoots:
   an element that simply arrived on screen was not thrown by anyone, and
   bounce without a preceding gesture reads as decoration. */

export const stagger = (staggerChildren = 0.06, delayChildren = 0.04) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: SPRING.default },
};

export const slideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SPRING.soft },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: SPRING.default },
};

/**
 * Glass arrives as a material, not as a fading rectangle: it resolves into
 * place rather than switching on.
 *
 * This used to animate `filter: blur(12px) → 0` as well. Every element in
 * the hero uses this variant, so a first paint ran five simultaneous blur
 * animations — each one re-rasterising its subtree every frame — at the
 * exact moment the browser is busiest. Opacity, scale and a short rise are
 * compositor-only, read the same, and cost nothing.
 */
export const materialize = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING.soft,
  },
};

/** Reduced-motion equivalent: same states, no travel. */
export const crossFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "linear" as const } },
};

/**
 * Every section triggers at the same point, so the page has one rhythm.
 *
 * The threshold is deliberately low. A tall block can struggle to get 25% of
 * itself on screen, and anyone landing mid-page from a `#hash` link would
 * then be staring at content that is still at opacity 0 — an entrance
 * animation must never be the reason something is invisible.
 */
export const VIEWPORT = {
  once: true,
  amount: 0.05,
  margin: "0px 0px -5% 0px",
} as const;

/* ── Gesture physics ─────────────────────────────────────────────────── */

/**
 * Where a flick is *going*, not where the finger left off. This is the
 * exponential-decay projection from Apple's fluid-interfaces sample code —
 * the same curve scroll deceleration uses — and it is what makes a small
 * flick throw an element a long way.
 *
 * @param velocity px/s at release
 * @param decelerationRate 0.998 for normal scroll feel, 0.99 for snappier
 */
export const project = (velocity: number, decelerationRate = 0.998) =>
  ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);

/**
 * Soft boundary. The further past the edge the drag goes, the less the
 * element follows — real things slow before they stop, and a hard stop
 * reads as a frozen interface rather than a finished one.
 */
export const rubberband = (
  overshoot: number,
  dimension: number,
  constant = 0.55,
) =>
  (overshoot * dimension * constant) /
  (dimension + constant * Math.abs(overshoot));
