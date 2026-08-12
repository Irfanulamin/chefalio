import React from "react";

interface GridLoaderProps {
  minHeight?: string;
  label?: string;
  className?: string;
}

/**
 * The app's route-level "waiting" state.
 *
 * This was a 3×3 grid of brand-lime squares, each pulsing on its own delay
 * with a lime glow around it. Three things were wrong with it. Its
 * `box-shadow` used `hsl(var(--primary) / …)`, but `--primary` is a hex
 * literal, so the glow never resolved in either theme. It painted saturated
 * lime blocks on a white page while every other surface in the product is a
 * quiet neutral — it read as a different product's loading screen. And nine
 * elements animating `transform`, `opacity` *and* `box-shadow` together is
 * three simultaneous raster invalidations per cell, at exactly the moment
 * the browser is busiest doing the thing you're waiting for.
 *
 * What replaces it is the least interesting thing that still communicates
 * "working": one hairline track with a sweep running through it. It uses the
 * surface ramp, so it belongs to whichever theme is active; the accent
 * appears once, in the sweep, which is the only part that means anything.
 * Waiting is not a moment that wants personality.
 */
export function GridLoader({
  minHeight = "60vh",
  label,
  className,
}: GridLoaderProps) {
  return (
    <div
      className={className}
      style={{ minHeight }}
      role="status"
      aria-live="polite"
      aria-label={label ?? "Loading"}
    >
      <div
        className="flex flex-col items-center justify-center gap-3.5 h-full"
        style={{ minHeight }}
      >
        <div
          className="sl-track"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
          aria-hidden
        >
          <span className="sl-sweep" />
        </div>

        {label && (
          <span
            className="text-xs tracking-[0.01em]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            {label}
          </span>
        )}
      </div>

      <style>{`
        .sl-track {
          position: relative;
          width: 132px;
          height: 2px;
          border-radius: 999px;
          overflow: hidden;
        }
        .sl-sweep {
          position: absolute;
          inset-block: 0;
          left: 0;
          width: 42%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            transparent,
            var(--cs-accent),
            transparent
          );
          animation: sl-sweep 1.15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
        @keyframes sl-sweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(338%); }
        }
        /* Reduced motion asks us to drop travel, not feedback. The track
           holds a steady partial fill so the state is still legible. */
        @media (prefers-reduced-motion: reduce) {
          .sl-sweep {
            animation: none;
            transform: none;
            width: 100%;
            background: var(--cs-accent);
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  );
}

export default GridLoader;
