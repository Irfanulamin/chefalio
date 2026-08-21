"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PlusIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { SPRING, POP, POP_TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The studio's form vocabulary.
 *
 * The chef forms were one tall `<fieldset>` divided by hairlines, with each
 * control styled inline at the point of use. That produced a page you read
 * top to bottom with no sense of where one decision ended and the next
 * began, and controls that disagreed with each other — three different
 * focus treatments, a `focusRingColor` property that doesn't exist in CSS,
 * `hover:bg-red-50` destructive states that stayed pale pink on a dark card,
 * and a difficulty selector painted in traffic-light green/amber/red.
 *
 * What's here follows a few rules from Apple's interface guidance, applied
 * rather than decorated:
 *
 * - **Feedback on pointer-down.** Every control here presses on `:active`,
 *   not on click. Waiting for touch-up to acknowledge a tap is the single
 *   most reliable way to make an interface feel dead.
 * - **Springs, not tweens, for anything the user acts on.** A spring
 *   animates from wherever the value currently sits, so a chip being
 *   removed while another is arriving doesn't fight.
 * - **Grouping is the explanation.** Related fields sit in one card with
 *   air around it; proximity does the work a paragraph of helper text was
 *   doing.
 * - **Reduced motion drops travel, not feedback.** Every animated piece
 *   below has a non-vestibular equivalent.
 */

/* ── Section ──────────────────────────────────────────────────────────── */

export function FormSection({
  title,
  hint,
  action,
  error,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  error?: string | false;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl p-4 sm:p-5"
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-2)",
      }}
    >
      <header className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          {/* Tracking is size-specific: this is small text, so it opens up
              slightly rather than inheriting a heading's negative value. */}
          <h3
            className="text-[11px] font-semibold uppercase tracking-[0.06em]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            {title}
          </h3>
          {hint && (
            <p className="text-xs mt-1" style={{ color: "var(--cs-text-tertiary)" }}>
              {hint}
            </p>
          )}
          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={SPRING.snappy}
                className="text-xs mt-1 overflow-hidden"
                style={{ color: "var(--cs-danger-fg)" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

/** The "Add" affordance a repeating section carries in its header. */
export function AddButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 h-7 px-2.5 shrink-0 text-xs font-medium rounded-lg transition-[background-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none"
      style={{ color: "var(--cs-accent-text)" }}
    >
      <PlusIcon size={12} weight="bold" />
      {label}
    </button>
  );
}

/* ── Text controls ────────────────────────────────────────────────────── */

/* `min-w-0` is load-bearing, not defensive. An `<input>` carries an
   intrinsic width from its `size` attribute (~20 characters), and a flex
   item's `min-width` defaults to `auto` — so an input in a flex row refuses
   to shrink below ~11rem no matter what `w-full` says, and pushes its row
   wider than the container instead. That is what sent the ingredient rows
   and the tag field out through the side of the edit sheet on a phone. */
const fieldBase =
  "w-full min-w-0 text-sm rounded-[10px] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--cs-text-tertiary)] focus:border-[var(--cs-accent)] focus:shadow-[0_0_0_3px_var(--cs-focus-ring)] disabled:opacity-50";

const fieldStyle: React.CSSProperties = {
  border: "1px solid var(--cs-border-default)",
  backgroundColor: "var(--cs-surface-1)",
  color: "var(--cs-text-primary)",
};

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={cn(fieldBase, "h-9 px-3", className)} style={fieldStyle} />
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(fieldBase, "px-3 py-2 resize-none leading-relaxed", className)}
      style={fieldStyle}
    />
  );
}

/** A labelled row. The label sits directly above its control, because a
 *  control you need a legend to interpret has a mapping problem. */
export function LabelledField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

/* ── Segmented control ────────────────────────────────────────────────── */

/**
 * One selection out of a few, with the indicator sliding between options
 * rather than cutting.
 *
 * `layoutId` is what makes that continuous: the highlight is a single
 * element that Framer re-parents to the newly selected segment, so the
 * motion starts from wherever the highlight currently is. Tap two segments
 * quickly and the second press redirects the highlight mid-flight instead
 * of queueing behind the first.
 *
 * Replaces a difficulty picker that filled the selected option with solid
 * green, amber or red. Difficulty is an ordered scale, not a severity —
 * "advanced" is an achievement, and painting it in the danger colour said
 * the opposite.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: { value: T; label: string; dot?: string }[];
  value: T;
  onChange: (value: T) => void;
  name: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className="inline-flex p-0.5 rounded-xl w-full sm:w-auto"
      style={{ backgroundColor: "var(--cs-surface-3)" }}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            /* `min-w-0` + `truncate` on the label: `flex-1` sets the
               basis to 0 but leaves `min-width: auto`, so three segments
               whose labels total more than the row ("Beginner",
               "Intermediate", "Advanced") would overflow rather than
               divide the space. Narrow padding on phones buys most of
               what's needed; the truncation is the floor. */
            className="relative flex-1 sm:flex-initial min-w-0 inline-flex items-center justify-center gap-1.5 h-8 px-2.5 sm:px-3.5 text-xs font-medium rounded-[10px] transition-transform duration-100 active:scale-[0.97]"
            style={{ color: selected ? "var(--cs-text-primary)" : "var(--cs-text-secondary)" }}
          >
            {selected && (
              <motion.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 rounded-[10px]"
                style={{
                  backgroundColor: "var(--cs-surface-1)",
                  boxShadow: "var(--cs-shadow-chip)",
                }}
                transition={reduceMotion ? { duration: 0 } : SPRING.snappy}
              />
            )}
            {opt.dot && (
              <span
                aria-hidden
                className="relative h-1.5 w-1.5 rounded-[2px] shrink-0"
                style={{ backgroundColor: opt.dot }}
              />
            )}
            <span className="relative truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Chips ────────────────────────────────────────────────────────────── */

/**
 * A selected tag.
 *
 * It pops on arrival — the one-frame overshoot that says "this landed" —
 * and leaves by scaling down in place rather than vanishing. Exit along the
 * same path as entry is the rule; a chip that grows in and then blinks out
 * reads as two unrelated events.
 */
export function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      layout
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
      animate={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, scale: POP }
      }
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
      transition={reduceMotion ? { duration: 0.15 } : { ...SPRING.snappy, scale: POP_TRANSITION }}
      className="inline-flex items-center gap-1 h-7 pl-2.5 pr-1 text-xs font-medium rounded-lg"
      style={{
        backgroundColor: "var(--cs-accent-muted)",
        color: "var(--cs-accent-text)",
      }}
    >
      #{label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-md transition-[background-color,transform] duration-150 hover:bg-[var(--cs-active)] active:scale-90"
      >
        <XIcon size={10} weight="bold" />
      </button>
    </motion.span>
  );
}

/** An unselected suggestion — a chip you can press to add. */
export function SuggestionChip({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center h-7 px-2.5 text-xs rounded-lg transition-[background-color,border-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-[0.96] disabled:opacity-30 disabled:pointer-events-none"
      style={{
        border: "1px solid var(--cs-border-default)",
        color: "var(--cs-text-secondary)",
      }}
    >
      #{label}
    </button>
  );
}

/* ── Destructive icon button ──────────────────────────────────────────── */

/**
 * Remove-a-row. The hover state comes from the danger triplet rather than
 * `hover:bg-red-50`, which was a light-mode literal glowing pale pink off a
 * dark card.
 */
export function RemoveButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 hover:text-[var(--cs-danger-fg)] hover:bg-[var(--cs-danger-bg)] active:scale-90",
        className,
      )}
      style={{ color: "var(--cs-text-tertiary)" }}
    >
      <XIcon size={13} weight="bold" />
    </button>
  );
}

/* ── Counter ──────────────────────────────────────────────────────────── */

/** "2 of 3" style progress, used where a field has a required count. */
export function FieldCounter({
  current,
  total,
  complete,
  invalid,
}: {
  current: number;
  total: number;
  complete?: boolean;
  invalid?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs tabular-nums"
      style={{
        color: invalid
          ? "var(--cs-danger-fg)"
          : complete
            ? "var(--cs-accent-text)"
            : "var(--cs-text-tertiary)",
      }}
    >
      <span className="flex gap-0.5" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <motion.span
            key={i}
            className="h-1 w-4 rounded-full"
            animate={{
              backgroundColor:
                i < current
                  ? invalid
                    ? "var(--cs-danger-fg)"
                    : "var(--cs-accent)"
                  : "var(--cs-surface-3)",
            }}
            transition={SPRING.snappy}
          />
        ))}
      </span>
      {current} of {total}
    </span>
  );
}
