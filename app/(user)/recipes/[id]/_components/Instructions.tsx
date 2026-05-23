import { Recipe } from "@/types/recipes.type";
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
  return (
    <div
      onClick={onToggle}
      className="relative rounded-xl overflow-hidden select-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
      style={
        done
          ? { backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }
          : {
              backgroundColor: "var(--cs-surface-2)",
              border: "1px solid var(--cs-border-subtle)",
            }
      }
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: done ? "#22c55e" : "var(--cs-border-default)" }}
      />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center font-bold text-base rounded-full transition-all duration-200 border-2"
              style={
                done
                  ? { backgroundColor: "#22c55e", borderColor: "#22c55e", color: "#fff" }
                  : {
                      borderColor: "var(--cs-border-default)",
                      color: "var(--cs-text-primary)",
                    }
              }
            >
              {done ? (
                <CheckIcon weight="bold" size={12} />
              ) : (
                <span className="text-xs">{step}</span>
              )}
            </div>
            <span
              className="font-semibold text-sm uppercase tracking-widest"
              style={{ color: done ? "#22c55e" : "var(--cs-text-tertiary)" }}
            >
              Step {step}
            </span>
          </div>

          <span
            className="text-xs font-medium px-2 py-0.5 rounded-md"
            style={
              done
                ? { backgroundColor: "#dcfce7", color: "#15803d" }
                : {
                    backgroundColor: "var(--cs-surface-3)",
                    color: "var(--cs-text-secondary)",
                  }
            }
          >
            {step}/{total}
          </span>
        </div>

        <p
          className="text-sm leading-relaxed transition-all duration-200"
          style={{
            color: done ? "var(--cs-text-tertiary)" : "var(--cs-text-primary)",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {instruction}
        </p>

        <p
          className="text-xs font-medium mt-3"
          style={{ color: done ? "#86efac" : "var(--cs-text-tertiary)" }}
        >
          {done ? "Tap to undo" : "Tap to complete"}
        </p>
      </div>
    </div>
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
        <h2
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Instructions
        </h2>

        <span
          className="text-sm font-medium px-2.5 py-1 rounded-lg"
          style={
            allDone
              ? { backgroundColor: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }
              : {
                  backgroundColor: "var(--cs-surface-2)",
                  border: "1px solid var(--cs-border-subtle)",
                  color: "var(--cs-text-secondary)",
                }
          }
        >
          {completedSteps.size}/{recipe.instructions.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: "#22c55e",
            }}
          />
        </div>
        <span
          className="text-sm font-bold tabular-nums w-9 text-right"
          style={{ color: allDone ? "#22c55e" : "var(--cs-text-tertiary)" }}
        >
          {progress}%
        </span>
      </div>

      {allDone && (
        <div
          className="mb-4 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}
        >
          <p className="text-sm font-bold" style={{ color: "#15803d" }}>
            All done! Enjoy your meal. 🎉
          </p>
        </div>
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
    </section>
  );
}
