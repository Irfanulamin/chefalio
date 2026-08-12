"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * A stat tile is a chart with the plot removed — a single number doing the
 * job a whole panel would otherwise do. It follows the same rules: the
 * figure is the only thing with weight, the label and the caption recede,
 * and nothing here wears a series colour, because a number that is its own
 * legend doesn't need one.
 *
 * The value uses proportional figures, not tabular. Tabular figures exist to
 * align columns; a standalone headline number just reads worse with the
 * extra gaps around the 1s.
 */
export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  className,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ElementType;
  /** Optional hairline of series colour, for the tile that anchors a chart
   *  further down the page. Used sparingly — at most one tile per row. */
  accent?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative rounded-xl p-4 overflow-hidden", className)}
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-2)",
      }}
    >
      {accent && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: accent }}
        />
      )}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className="text-xs font-medium truncate"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          {label}
        </span>
        {Icon && <Icon size={14} style={{ color: "var(--cs-text-tertiary)" }} />}
      </div>
      <p
        className="text-[1.6rem] font-semibold leading-none tracking-[-0.02em]"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs truncate" style={{ color: "var(--cs-text-tertiary)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function StatTileSkeleton() {
  return (
    <div
      className="rounded-xl p-4 space-y-2.5"
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-2)",
      }}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3.5 w-3.5 rounded-sm" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
