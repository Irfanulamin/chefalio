"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SunIcon, MoonIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "@/lib/motion";

/**
 * Theme switch.
 *
 * The previous one was a 52×28 pill painted in hardcoded dark-olive hexes —
 * `#111a05` track, `#1a2e05` when active, a `#2a3a0a` border — none of
 * which came from the theme system it exists to control. In light mode that
 * put a near-black olive capsule in a white toolbar, next to a 32px icon
 * button and a 32px avatar, wearing a permanent 3px lime glow that read as
 * a stuck focus ring.
 *
 * Three real problems underneath the styling:
 *
 * **It showed the wrong icon.** In dark mode the knob showed a sun. A
 * control can show either its current state or the state it will switch to,
 * but it has to pick one, and a switch — a thing whose whole job is
 * displaying state — must show the current one. It now shows the moon in
 * dark and the sun in light.
 *
 * **It disappeared before hydration.** `if (!mounted) return null` meant the
 * toolbar rendered one control short and then reflowed when the button
 * appeared, nudging everything beside it. It now reserves its exact size
 * from the first paint.
 *
 * **The knob travelled on a `cubic-bezier(0.34, 1.42, 0.64, 1)` tween** —
 * a fixed-duration curve with overshoot baked in, which can't be
 * interrupted. Flip it twice quickly and the second flip waited out the
 * first. It's a spring now, so a rapid second press redirects the knob from
 * wherever it currently is. The slight bounce stays, because a switch being
 * thrown is a momentum gesture and overshoot is what sells it.
 */

const TRACK_W = 46;
const TRACK_H = 26;
const KNOB = 20;
const INSET = 3;

export const ToggleThemeButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  /* `resolvedTheme` rather than `theme`: the old code treated anything that
     wasn't the string "light" as dark, so a user on "system" during a light
     OS session got a switch insisting it was dark. */
  const isDark = mounted && resolvedTheme === "dark";

  if (!mounted) {
    return (
      <span
        aria-hidden
        style={{ width: TRACK_W, height: TRACK_H }}
        className="inline-block shrink-0 rounded-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="focus-ring relative shrink-0 rounded-full transition-[background-color,border-color,transform] duration-200 active:scale-[0.94]"
      style={{
        width: TRACK_W,
        height: TRACK_H,
        padding: 0,
        cursor: "pointer",
        // A recessed track, the same one the segmented controls use, so the
        // switch belongs to the same control family as everything else in
        // the chrome.
        backgroundColor: isDark ? "var(--cs-accent-muted)" : "var(--cs-surface-3)",
        border: `1px solid ${isDark ? "rgba(167,209,41,0.35)" : "var(--cs-border-subtle)"}`,
      }}
    >
      <motion.span
        animate={{ x: isDark ? TRACK_W - KNOB - INSET * 2 - 2 : 0 }}
        initial={false}
        transition={reduceMotion ? { duration: 0 } : SPRING.momentum}
        className="absolute flex items-center justify-center rounded-full"
        style={{
          top: INSET - 1,
          left: INSET,
          width: KNOB,
          height: KNOB,
          backgroundColor: "var(--cs-surface-1)",
          boxShadow: "var(--cs-shadow-chip)",
        }}
      >
        {/* The two glyphs cross-fade and counter-rotate in place. Both are
            mounted, so neither has to be created mid-animation. */}
        <span
          className="absolute flex transition-[opacity,transform] duration-200"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "scale(0.5) rotate(-45deg)" : "scale(1) rotate(0deg)",
          }}
        >
          <SunIcon size={12} weight="fill" style={{ color: "var(--cs-text-secondary)" }} />
        </span>
        <span
          className="absolute flex transition-[opacity,transform] duration-200"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(45deg)",
          }}
        >
          <MoonIcon size={12} weight="fill" style={{ color: "var(--cs-accent-text)" }} />
        </span>
      </motion.span>
    </button>
  );
};
