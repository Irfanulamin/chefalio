"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Brand-tinted light beams for the hero.
 *
 * Deliberately CSS/gradient based rather than WebGL: Chefalio ships both a
 * white light theme and a near-black dark theme, and volumetric WebGL ray
 * effects only read against dark backgrounds. These beams derive their colour
 * from the `--primary` token, so they hold up in both modes.
 *
 * Animates transform and opacity only. Collapses to a static wash under
 * prefers-reduced-motion.
 */

const BEAMS = [
  { left: "8%", width: 180, rotate: -14, delay: 0, duration: 11, opacity: 0.5 },
  { left: "24%", width: 110, rotate: -8, delay: 1.6, duration: 14, opacity: 0.35 },
  { left: "44%", width: 240, rotate: -2, delay: 0.8, duration: 12, opacity: 0.6 },
  { left: "63%", width: 130, rotate: 6, delay: 2.4, duration: 15, opacity: 0.4 },
  { left: "80%", width: 200, rotate: 12, delay: 1.2, duration: 13, opacity: 0.45 },
];

export function Beams() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Beam shafts, anchored above the viewport and fanning downward */}
      <div className="absolute inset-x-0 -top-1/3 h-[150%]">
        {BEAMS.map((beam) => (
          <motion.span
            key={beam.left}
            className="absolute top-0 h-full origin-top"
            style={{
              left: beam.left,
              width: beam.width,
              rotate: `${beam.rotate}deg`,
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--primary) 55%, transparent), transparent 72%)",
              filter: "blur(44px)",
            }}
            initial={{ opacity: beam.opacity * 0.6, scaleY: 0.94 }}
            animate={
              reduce
                ? { opacity: beam.opacity * 0.7 }
                : {
                    opacity: [beam.opacity * 0.55, beam.opacity, beam.opacity * 0.55],
                    scaleY: [0.94, 1.04, 0.94],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: beam.duration,
                    delay: beam.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </div>

      {/* Grid, faded out toward the edges so it never reads as a border */}
      <div
        className="absolute inset-0 opacity-[0.6] dark:opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--cs-border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--cs-border-subtle) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 20%, transparent 75%)",
        }}
      />

      {/* Warm ground glow, keeps the lime from reading cold on white */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "radial-gradient(ellipse 90% 100% at 50% 100%, color-mix(in oklab, var(--accent) 70%, transparent), transparent 70%)",
        }}
      />

      {/* Top fade so the header sits on clean surface */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, var(--cs-surface-1), transparent)",
        }}
      />
    </div>
  );
}

export default Beams;
