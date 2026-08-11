"use client";

import { Recipe } from "@/types/recipes.type";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, POP, POP_TRANSITION, SPRING } from "@/lib/motion";

/**
 * A step you can tick off while cooking.
 *
 * This was a `<div onClick>`, so the one genuinely interactive thing on
 * the page — the checklist you work through with wet hands, or with a
 * keyboard because your hands are busy — could not be reached by
 * anything except a mouse. It's a real button with `aria-pressed` now.
 *
 * The completion tick reuses the landing page's `--cs-check-*` tokens
 * and its one-frame pop, so "this is done" is expressed the same way in
 * both halves of the product. The colours are status tokens rather than
 * the previous `#22c55e` / `#f0fdf4` / `#bbf7d0` literals, which were
 * light-mode greens that stayed mint-on-mint in dark mode.
 */
function StepCard({
  step,
  instruction,
  done,
  total,
  onToggle,
}: {
  step: number;
  instruction: string;
  done: boolean;
  total: number;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      className="focus-ring relative w-full select-none overflow-hidden rounded-xl text-left transition-colors duration-200"
      style={{
        backgroundColor: done ? "var(--cs-success-bg)" : "var(--cs-surface-2)",
        border: `1px solid ${done ? "var(--cs-success-edge)" : "var(--cs-border-subtle)"}`,
      }}
    >
      <span
        aria-hidden
        className="absolute bottom-0 left-0 top-0 w-0.5 transition-colors duration-200"
        style={{
          backgroundColor: done ? "var(--cs-success-fg)" : "var(--cs-border-default)",
        }}
      />

      <span className="block py-4 pl-5 pr-4">
        <span className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <motion.span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              animate={reduce ? undefined : { scale: done ? POP : 1 }}
              transition={{ ...SPRING.snappy, scale: POP_TRANSITION }}
              style={{
                backgroundColor: done ? "var(--cs-check-fill)" : "transparent",
                border: `2px solid ${
                  done ? "var(--cs-check-edge)" : "var(--cs-border-default)"
                }`,
                color: done ? "var(--cs-check-mark)" : "var(--cs-text-primary)",
              }}
            >
              {done ? <CheckIcon weight="bold" size={12} /> : step}
            </motion.span>
            <span
              className="ui-label"
              style={{
                color: done ? "var(--cs-success-fg)" : "var(--cs-text-tertiary)",
              }}
            >
              Step {step}
            </span>
          </span>

          <span
            className="ui-micro ui-numeric rounded-md px-2 py-0.5 font-semibold"
            style={{
              backgroundColor: done ? "transparent" : "var(--cs-surface-3)",
              color: done ? "var(--cs-success-fg)" : "var(--cs-text-secondary)",
            }}
          >
            {step}/{total}
          </span>
        </span>

        <span
          className="ui-body block transition-colors duration-200"
          style={{
            color: done ? "var(--cs-text-tertiary)" : "var(--cs-text-primary)",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {instruction}
        </span>

        <span
          className="ui-micro mt-3 block font-medium"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          {done ? "Tap to undo" : "Tap to complete"}
        </span>
      </span>
    </button>
  );
}

export function Instructions({
  progress,
  allDone,
  recipe,
  completedSteps,
  toggleStep,
}: {
  progress: number;
  allDone: boolean;
  recipe: Recipe;
  completedSteps: Set<number>;
  toggleStep: (step: number) => void;
}) {
  const reduce = useReducedMotion();
  const total = recipe.instructions.length;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
          Instructions
        </h2>

        <span
          className="ui-caption ui-numeric rounded-lg px-2.5 py-1 font-semibold"
          style={{
            backgroundColor: allDone ? "var(--cs-success-bg)" : "var(--cs-surface-2)",
            border: `1px solid ${
              allDone ? "var(--cs-success-edge)" : "var(--cs-border-subtle)"
            }`,
            color: allDone ? "var(--cs-success-fg)" : "var(--cs-text-secondary)",
          }}
        >
          {completedSteps.size}/{total} done
        </span>
      </div>

      {/* Spring-driven, so ticking several steps quickly retargets from
          wherever the bar currently is instead of queueing tweens. */}
      <div
        className="mb-4 flex items-center gap-3"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Cooking progress"
      >
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: allDone
                ? "var(--cs-success-fg)"
                : "var(--primary)",
              transformOrigin: "left",
            }}
            initial={false}
            animate={{ scaleX: progress / 100 }}
            transition={reduce ? { duration: 0 } : SPRING.default}
          />
        </div>
        <span
          className="ui-caption ui-numeric w-9 text-right font-bold"
          style={{
            color: allDone ? "var(--cs-success-fg)" : "var(--cs-text-tertiary)",
          }}
        >
          {progress}%
        </span>
      </div>

      {allDone && (
        <motion.p
          className="ui-subheading mb-4 rounded-xl px-4 py-3"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: EASE }}
          style={{
            backgroundColor: "var(--cs-success-bg)",
            border: "1px solid var(--cs-success-edge)",
            color: "var(--cs-success-fg)",
          }}
        >
          Every step done — enjoy your meal.
        </motion.p>
      )}

      <ol className="flex flex-col gap-2.5">
        {recipe.instructions.map(({ step, instruction, _id }) => (
          <li key={_id}>
            <StepCard
              step={step}
              instruction={instruction}
              done={completedSteps.has(step)}
              total={total}
              onToggle={() => toggleStep(step)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
