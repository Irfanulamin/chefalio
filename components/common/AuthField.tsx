/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useId, useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * The auth form's input.
 *
 * The five auth screens were built out of the generic `FormField`, which
 * renders the shadcn `Input`: a 48px box with a small radius, a
 * `border-input` hairline and error text in raw `text-red-500`. Dropped
 * into a `rounded-3xl` translucent card above a pill-shaped submit button,
 * it read as a component borrowed from somewhere else — different radius,
 * different border language, different red.
 *
 * This is the same control drawn in the auth screen's own vocabulary: the
 * card's radius family, the `--cs-*` tokens both themes already define,
 * and the focus treatment used everywhere else in the product.
 *
 * It also fixes two things the generic field got wrong here:
 *
 * - **Password reveal is a real button.** It was styled with `onMouseEnter`
 *   handlers writing inline colours, so it had no keyboard hover state and
 *   no focus ring at all.
 * - **Errors are announced.** `aria-describedby` ties the message to the
 *   input and `role="alert"` speaks it, instead of leaving a red sentence
 *   that only sighted users ever learn about.
 */
export function AuthField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
}: {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  const [reveal, setReveal] = useState(false);
  const reactId = useId();

  const isPassword = type === "password";
  const inputType = isPassword ? (reveal ? "text" : "password") : type;

  const id = `${reactId}-${name}`;
  const errorId = `${id}-error`;

  return (
    <form.Field name={name}>
      {(field: any) => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
        const messages: string[] = (field.state.meta.errors ?? []).map((e: any) =>
          typeof e === "string" ? e : (e?.message ?? String(e)),
        );

        return (
          <div className="space-y-1.5">
            <label
              htmlFor={id}
              className="type-caption block font-medium"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              {label}
            </label>

            <div className="relative">
              <input
                id={id}
                name={name}
                type={inputType}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
                className={[
                  "h-12 w-full rounded-2xl text-[0.9375rem] outline-none",
                  "transition-[border-color,box-shadow,background-color] duration-150",
                  "placeholder:text-[var(--cs-text-tertiary)]",
                  "focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--cs-focus-ring)]",
                  isPassword ? "pl-4 pr-12" : "px-4",
                ].join(" ")}
                style={{
                  border: `1px solid ${
                    invalid ? "var(--cs-danger-fg)" : "var(--cs-border-default)"
                  }`,
                  backgroundColor: "var(--cs-surface-1)",
                  color: "var(--cs-text-primary)",
                }}
              />

              {isPassword && (
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  aria-label={reveal ? "Hide password" : "Show password"}
                  aria-pressed={reveal}
                  className="focus-ring absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl transition-colors duration-150 hover:bg-[var(--cs-hover)]"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  {reveal ? <EyeSlashIcon size={17} /> : <EyeIcon size={17} />}
                </button>
              )}
            </div>

            {invalid && messages.length > 0 && (
              <p
                id={errorId}
                role="alert"
                className="type-micro flex items-start gap-1.5"
                style={{ color: "var(--cs-danger-fg)" }}
              >
                <WarningCircleIcon
                  size={13}
                  weight="fill"
                  className="mt-px shrink-0"
                  aria-hidden
                />
                {messages.join(", ")}
              </p>
            )}
          </div>
        );
      }}
    </form.Field>
  );
}

export default AuthField;
