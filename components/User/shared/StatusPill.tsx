import type { ReactNode } from "react";
import type { Tone } from "@/lib/recipe-display";

type StatusPillProps = {
  children: ReactNode;
  tone?: Tone;
  /**
   * Set when the pill sits on top of a photo. It then carries its own
   * blurred material, because it can't borrow contrast from a card
   * surface that isn't behind it.
   */
  overMedia?: boolean;
  className?: string;
};

/**
 * Difficulty, order state, validation — one pill, driven by the status
 * tokens so it is legible in both themes without either theme being
 * special-cased at the call site.
 */
export function StatusPill({
  children,
  tone = "neutral",
  overMedia = false,
  className = "",
}: StatusPillProps) {
  return (
    <span
      className={`ui-status ${className}`}
      data-tone={tone}
      data-over-media={overMedia || undefined}
    >
      {children}
    </span>
  );
}

export default StatusPill;
