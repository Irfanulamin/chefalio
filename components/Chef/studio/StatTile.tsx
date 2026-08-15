"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/Admin/AdminUI";

/**
 * A stat tile is a chart with the plot removed — a single number doing the
 * job a whole panel would otherwise do. It follows the same rules: the
 * figure is the only thing with weight, the label and the caption recede.
 *
 * The value uses proportional figures, not tabular. Tabular figures exist to
 * align columns; a standalone headline number just reads worse with the
 * extra gaps around the 1s.
 *
 * The icon chip is the same pattern admin's `StatCard` uses — a tinted tile
 * rather than a bare glyph — but built from `accent` (this studio's own
 * per-measure colour, from `viz.ts`) instead of admin's separate `Tone`
 * enum. Two colour systems that both mean "this stat's identity colour"
 * would just be two ways to say the same thing; deriving the chip from the
 * colour already passed in keeps the one that's already consistent within
 * the studio (revenue is the same blue on every page) instead of bolting on
 * a second, competing one.
 */
export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  index = 0,
  className,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ElementType;
  /** This stat's identity colour — drives both the top hairline and the
   *  icon chip. Omit for a stat with no measure colour of its own. */
  accent?: string;
  index?: number;
  className?: string;
}) {
  return (
    <Reveal delay={index * 0.04} className={className}>
      <div className="ui-card relative overflow-hidden p-4">
        {accent && (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px"
            style={{ backgroundColor: accent }}
          />
        )}
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span
            className="ui-caption truncate font-medium"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {label}
          </span>
          {Icon && (
            <div
              className="flex shrink-0 items-center justify-center rounded-lg"
              style={{
                width: 24,
                height: 24,
                backgroundColor: accent
                  ? `color-mix(in oklab, ${accent} 16%, transparent)`
                  : "var(--cs-surface-3)",
                color: accent ?? "var(--cs-text-tertiary)",
              }}
            >
              <Icon size={12} weight={accent ? "fill" : "regular"} />
            </div>
          )}
        </div>
        <p
          className="ui-numeric text-[1.6rem] font-semibold leading-none tracking-[-0.02em]"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="ui-micro mt-1.5 truncate" style={{ color: "var(--cs-text-tertiary)" }}>
            {sub}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export function StatTileSkeleton() {
  return (
    <div className="ui-card space-y-2.5 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3.5 w-3.5 rounded-sm" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
