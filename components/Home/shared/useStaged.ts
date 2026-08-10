"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Deterministic pseudo-random in [-1, 1), keyed on the step index.
 *
 * Deliberately not `Math.random()`: the wobble has to be identical every
 * replay, or the same demo watched twice types at two different rhythms and
 * the section stops feeling like a fixed piece of choreography.
 */
const wobble = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

type StagedOptions = {
  /** Delay before the first step, in ms. */
  start?: number;
  /** Gap between steps, in ms. */
  step?: number;
  /**
   * How long to wait after `run` goes false before resetting to 0.
   *
   * A panel that deactivates is usually mid-crossfade, and resetting on the
   * same frame plays the whole sequence backwards through the fade — ticks
   * un-ticking, a query un-typing. Hold past the transition and the reset
   * happens out of sight, so the next arrival still starts from nothing.
   */
  resetDelay?: number;
  /**
   * Random spread applied to each step, in ms. For the typewriter: a fixed
   * gap per character is a metronome, and nobody types like one.
   */
  jitter?: number;
};

/**
 * Counts 0 → `total` in even steps while `run` is true, and resets to 0 when
 * it goes false — so a sequence replays every time its panel comes back
 * rather than sitting there already spent.
 *
 * The landing page uses this for the small "watch it work" demos: a query
 * typing itself, filters landing one by one, a recipe's steps ticking off.
 * They are all the same idea, so they share one timer and one cadence
 * instead of each section inventing its own.
 *
 * `run` should mean "on screen now", not "mounted". These demos are the
 * argument the section is making, and one that finished while it was three
 * screens below the fold is just a screenshot by the time it is read.
 *
 * Under `prefers-reduced-motion` it jumps straight to the finished state.
 * The setting asks for no travel; it does not ask to be shown less.
 */
export function useStaged(
  run: boolean,
  total: number,
  { start = 320, step = 170, resetDelay = 0, jitter = 0 }: StagedOptions = {},
) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) {
      setCount(total);
      return;
    }

    if (!run) {
      if (!resetDelay) {
        setCount(0);
        return;
      }
      const t = window.setTimeout(() => setCount(0), resetDelay);
      return () => window.clearTimeout(t);
    }

    const timers: number[] = [];
    for (let n = 1; n <= total; n++) {
      const at = start + n * step + (jitter ? wobble(n) * jitter : 0);
      timers.push(window.setTimeout(() => setCount(n), Math.max(0, at)));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [run, reduce, total, start, step, resetDelay, jitter]);

  return { count, reduce };
}

export default useStaged;
