"use client";

import { CHROME } from "./viz";

/**
 * Shared chart furniture.
 *
 * Recharts' default tooltip is a white box with a black border and a
 * bullet-point list of `dataKey: value` — it ignores the theme entirely, so
 * every chart in the studio had passed it a `contentStyle` object, and those
 * objects had drifted apart. One tooltip component instead: it reads as the
 * same floating material the rest of the app uses, and it puts the number
 * first because the number is what the pointer is asking about.
 */

export type TooltipEntry = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

export function ChartTooltip({
  active,
  payload,
  label,
  format,
  hideName,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  /** Per-series value formatting — currency, counts, whatever the axis uses. */
  format?: (value: number, entry: TooltipEntry) => string;
  /** Single-series charts already say what they are in the panel title. */
  hideName?: boolean;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg px-3 py-2 min-w-28"
      style={{
        backgroundColor: "var(--cs-material-thick)",
        backdropFilter: "blur(var(--cs-material-blur))",
        WebkitBackdropFilter: "blur(var(--cs-material-blur))",
        border: "1px solid var(--cs-material-edge)",
        boxShadow: "var(--cs-shadow-float)",
      }}
    >
      {label !== undefined && (
        <p
          className="text-[11px] font-medium mb-1.5"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, i) => {
          const raw = typeof entry.value === "number" ? entry.value : Number(entry.value ?? 0);
          return (
            <div key={i} className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-[2px] shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              {!hideName && entry.name && (
                <span className="text-[11px] flex-1" style={{ color: "var(--cs-text-secondary)" }}>
                  {entry.name}
                </span>
              )}
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {format ? format(raw, entry) : raw.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A legend is mandatory for two or more series — identity must never rest on
 * colour alone. Placed above the plot rather than below it, so the reader
 * knows what the marks mean before they look at them.
 */
export function ChartLegend({
  items,
  className,
}: {
  items: { label: string; color: string }[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className ?? ""}`}>
      {items.map(({ label, color }) => (
        <li key={label} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="h-2 w-2 rounded-[2px] shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[11px]" style={{ color: "var(--cs-text-secondary)" }}>
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The soft vertical wash under an area series. Recharts wants a gradient in
 * `<defs>` with a document-unique id, which is exactly the kind of detail
 * that gets copy-pasted and then collides — two charts sharing `id="grad"`
 * on one page silently paint the same colour.
 */
export function AreaGradient({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="var(--cv-fill-strong)" />
        <stop offset="100%" stopColor={color} stopOpacity="var(--cv-fill-soft)" />
      </linearGradient>
    </defs>
  );
}

/** Recharts axis/grid defaults, spread into the elements themselves. */
export const axisProps = {
  tick: { fontSize: 11, fill: CHROME.label },
  tickLine: false,
  axisLine: false,
} as const;

export const gridProps = {
  stroke: CHROME.grid,
  strokeDasharray: "2 4",
} as const;
