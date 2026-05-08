import { Recipe } from "@/types/recipes.type";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

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
  const [{ x, scale }, api] = useSpring(() => ({ x: 0, scale: 1 }));

  const bind = useDrag(
    ({ active, movement: [mx], velocity: [vx], last }) => {
      api.start({
        x: active ? mx : 0,
        scale: active ? 0.97 : 1,
        immediate: (key) => key === "x" && active,
        config: { tension: 300, friction: 26 },
      });
      if (last && (mx > 60 || vx > 0.5)) {
        onToggle();
        api.start({ x: 0, scale: 1 });
      }
    },
    { axis: "x", filterTaps: true },
  );

  return (
    <animated.div
      {...bind()}
      onClick={onToggle}
      style={{ x, scale, touchAction: "pan-y" }}
      className={`group relative rounded-xl overflow-hidden select-none cursor-pointer transition-all duration-300
        ${
          done
            ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60"
            : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 hover:shadow-sm"
        }`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-500
          ${done ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600"}`}
      />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 flex items-center justify-center font-bold text-base
                transition-all duration-300 border-2 rounded-full
                ${
                  done
                    ? "bg-emerald-500 border-emerald-400 text-white scale-110"
                    : "border-zinc-300 dark:border-zinc-600 text-foreground group-hover:border-zinc-400 dark:group-hover:border-zinc-500"
                }`}
            >
              {done ? (
                <CheckIcon weight="bold" size={12} />
              ) : (
                <span className="text-xs">{step}</span>
              )}
            </div>
            <span
              className={`font-semibold text-sm uppercase tracking-widest transition-colors duration-300
                ${done ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-500 dark:group-hover:text-zinc-400"}`}
            >
              Step {step}
            </span>
          </div>

          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md transition-colors
              ${
                done
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              }`}
          >
            {step}/{total}
          </span>
        </div>

        <p
          className={`text-sm leading-relaxed transition-all duration-300
            ${
              done
                ? "line-through text-zinc-400 dark:text-zinc-600"
                : "text-foreground"
            }`}
        >
          {instruction}
        </p>

        <p
          className={`text-xs font-medium mt-3 transition-colors
            ${
              done
                ? "text-emerald-400/70"
                : "text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400 dark:group-hover:text-zinc-600"
            }`}
        >
          {done ? "← Tap to undo" : "→ Swipe right or tap to complete"}
        </p>
      </div>
    </animated.div>
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
  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground tracking-tight">
          Instructions
        </h2>

        <span
          className={`text-sm font-medium px-2.5 py-1 rounded-lg border transition-colors
            ${
              allDone
                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
                : "text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            }`}
        >
          {completedSteps.size}/{recipe.instructions.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out
              ${allDone ? "bg-emerald-400" : "bg-emerald-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <span
          className={`text-sm font-bold tabular-nums w-9 text-right transition-colors
            ${allDone ? "text-emerald-500" : "text-zinc-400 dark:text-zinc-500"}`}
        >
          {progress}%
        </span>
      </div>

      {allDone && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            All done! Enjoy your meal.
          </p>
        </div>
      )}

      {!allDone && (
        <p className="text-xs text-zinc-300 dark:text-zinc-700 font-medium mb-4 select-none tracking-wide">
          Swipe right or tap each step to complete
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {recipe.instructions.map(({ step, instruction, _id }) => (
          <StepCard
            key={_id}
            step={step}
            instruction={instruction}
            done={completedSteps.has(step)}
            total={recipe.instructions.length}
            onToggle={() => toggleStep(step)}
          />
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
