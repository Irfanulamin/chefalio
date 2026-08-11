/**
 * Display rules for recipe data, in one place.
 *
 * The difficulty ramp was previously redeclared in four files — the card,
 * the list page's filter styles, the detail page and the image carousel —
 * each with its own hex literals. They had already drifted (the filter
 * chips used a different green from the badge), and every one of them was
 * a light-mode literal that stayed light-mode in dark mode.
 */

export const DIFFICULTIES = ["beginner", "intermediate", "advance"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

/**
 * A three-step ramp is the convention every recipe site uses, and
 * familiarity is worth more than novelty on a label people read at a
 * glance. The tones come from the status tokens, so both themes are
 * handled by construction.
 */
const DIFFICULTY_DISPLAY: Record<Difficulty, { label: string; tone: Tone }> = {
  beginner: { label: "Easy", tone: "success" },
  intermediate: { label: "Medium", tone: "warning" },
  advance: { label: "Hard", tone: "danger" },
};

export function difficultyDisplay(difficulty: string): {
  label: string;
  tone: Tone;
} {
  return (
    DIFFICULTY_DISPLAY[difficulty as Difficulty] ?? {
      label: difficulty || "Unrated",
      tone: "neutral",
    }
  );
}

/** Order and payment states, mapped onto the same status vocabulary. */
export function orderTone(status: string): Tone {
  const s = status.toLowerCase();
  if (["paid", "completed", "succeeded", "success", "approved"].includes(s)) {
    return "success";
  }
  if (["pending", "processing", "unpaid"].includes(s)) return "warning";
  if (["failed", "cancelled", "canceled", "refunded", "rejected"].includes(s)) {
    return "danger";
  }
  return "neutral";
}

/** Up to two letters, for an avatar with no image behind it. */
export function initialsOf(name: string): string {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Cookbook pricing. `discount` is a percentage, and the discounted figure
 * was being recomputed inline in five components — two of which rounded
 * differently, so the same cookbook could show $17.99 in the grid and
 * $18.00 at checkout.
 */
export function cookbookPrice(price: number, discount = 0): {
  current: string;
  original: string | null;
  isFree: boolean;
  discountPct: number;
} {
  const pct = discount > 0 ? discount : 0;
  const current = pct > 0 ? price * (1 - pct / 100) : price;

  return {
    current: current === 0 ? "Free" : `$${current.toFixed(2)}`,
    original: pct > 0 ? `$${price.toFixed(2)}` : null,
    isFree: current === 0,
    discountPct: pct,
  };
}
