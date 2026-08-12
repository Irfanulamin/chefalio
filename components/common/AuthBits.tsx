"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

/**
 * The pieces every auth screen repeats. Having them here is what keeps the
 * five screens actually consistent rather than five near-copies that drift.
 */

const SPRING = { type: "spring", bounce: 0, duration: 0.26 } as const;

/** Feedback comes in kinds — say which one this is, and look like it. */
export type NoticeTone = "info" | "success" | "warning" | "error";

const TONES: Record<
  NoticeTone,
  { icon: React.ElementType; bg: string; border: string; text: string }
> = {
  info: {
    icon: InfoIcon,
    bg: "var(--cs-surface-2)",
    border: "var(--cs-border-default)",
    text: "var(--cs-text-secondary)",
  },
  success: {
    icon: CheckCircleIcon,
    bg: "var(--cs-accent-muted)",
    border: "color-mix(in oklab, var(--primary) 40%, transparent)",
    text: "var(--cs-accent-text)",
  },
  /* These were hardcoded amber and red literals — `#a16207` on
     `rgba(234,179,8,0.12)`. Both are light-mode values, so in dark mode an
     "email not verified" notice glowed as a pale sticker on a near-black
     card. The status triplets are defined per theme, so this is correct in
     both by construction. */
  warning: {
    icon: WarningCircleIcon,
    bg: "var(--cs-warning-bg)",
    border: "var(--cs-warning-edge)",
    text: "var(--cs-warning-fg)",
  },
  error: {
    icon: WarningCircleIcon,
    bg: "var(--cs-danger-bg)",
    border: "var(--cs-danger-edge)",
    text: "var(--cs-danger-fg)",
  },
};

export function AuthNotice({
  tone = "info",
  children,
}: {
  tone?: NoticeTone;
  children: React.ReactNode;
}) {
  const t = TONES[tone];
  const Icon = t.icon;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="flex items-start gap-2.5 rounded-2xl px-4 py-3"
      style={{
        backgroundColor: t.bg,
        border: `1px solid ${t.border}`,
      }}
    >
      <Icon
        size={16}
        weight="fill"
        className="mt-0.5 shrink-0"
        style={{ color: t.text }}
      />
      <div className="type-caption min-w-0 flex-1" style={{ color: t.text }}>
        {children}
      </div>
    </div>
  );
}

/** A labelled rule, for the seam between a form and its OAuth alternative. */
export function AuthDivider({ label }: { label: string }) {
  /* Two rules either side of the label rather than one rule with an opaque
     chip sitting on top of it. The chip was painted `--cs-surface-1` to
     mask the line behind it, but the auth card is a *translucent* material
     — so it showed up as a solid light block floating in the middle of the
     glass instead of disappearing into it. */
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden>
      <span
        className="h-px flex-1"
        style={{ backgroundColor: "var(--cs-border-subtle)" }}
      />
      <span
        className="type-micro font-semibold uppercase"
        style={{ color: "var(--cs-text-tertiary)", letterSpacing: "0.1em" }}
      >
        {label}
      </span>
      <span
        className="h-px flex-1"
        style={{ backgroundColor: "var(--cs-border-subtle)" }}
      />
    </div>
  );
}

/**
 * The primary action. Presses on pointer-down, and states plainly what it is
 * doing while it is busy rather than going quiet.
 */
export function AuthSubmit({
  children,
  pending,
  pendingLabel,
  disabled,
  type = "submit",
  onClick,
}: {
  children: React.ReactNode;
  pending?: boolean;
  pendingLabel?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  const reduce = useReducedMotion();
  const isDisabled = disabled || pending;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={reduce || isDisabled ? undefined : { scale: 0.98 }}
      transition={SPRING}
      className="type-subheading inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full transition-opacity duration-150 disabled:pointer-events-none disabled:opacity-55"
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
        boxShadow:
          "0 6px 20px -10px color-mix(in oklab, var(--primary) 85%, transparent)",
      }}
    >
      {pending && (
        <span
          aria-hidden
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {pending ? (pendingLabel ?? "Working…") : children}
    </motion.button>
  );
}

/** The secondary action: same shape, no fill. */
export function AuthSecondary({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "submit" | "button";
}) {
  const reduce = useReducedMotion();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={reduce || disabled ? undefined : { scale: 0.98 }}
      transition={SPRING}
      className="type-subheading inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full transition-colors duration-150 disabled:pointer-events-none disabled:opacity-55"
      style={{
        color: "var(--cs-text-primary)",
        border: "1px solid var(--cs-border-default)",
      }}
    >
      {children}
    </motion.button>
  );
}

/** Inline text link, used for the way out of each screen. */
export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="font-semibold transition-opacity duration-150 hover:opacity-70"
      style={{ color: "var(--cs-accent-text)" }}
    >
      {children}
    </a>
  );
}

/**
 * The terminal state screens (check your email, verified, link expired) all
 * have the same shape: a mark, a headline, a sentence, then what to do next.
 */
/**
 * A terminal state: mail sent, address verified, link expired.
 *
 * The big rounded icon tile that used to sit on top is gone. Tone still has
 * to survive its removal, though — an expired link and a confirmed address
 * cannot look identical — so it moves onto a short worded label above the
 * title. That was the more accessible carrier anyway: colour and glyph alone
 * never told a screen reader which of the two had happened.
 */
export function AuthResult({
  tone = "success",
  label,
  title,
  children,
  actions,
}: {
  tone?: "success" | "error";
  /** Overrides the default wording for the state. */
  label?: string;
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const success = tone === "success";

  return (
    <div className="flex flex-col items-center gap-5 py-2 text-center">
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce
            ? { duration: 0.2 }
            : { type: "spring", bounce: 0, duration: 0.45 }
        }
      >
        <span
          className="type-label"
          style={{
            color: success ? "var(--cs-accent-text)" : "var(--cs-danger-fg)",
          }}
        >
          {label ?? (success ? "Done" : "Something went wrong")}
        </span>

        <h2
          className="type-heading mt-2"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {title}
        </h2>
        {children && (
          <div
            className="type-caption mx-auto mt-2 max-w-xs"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {children}
          </div>
        )}
      </motion.div>

      {actions && <div className="w-full space-y-3 pt-1">{actions}</div>}
    </div>
  );
}
