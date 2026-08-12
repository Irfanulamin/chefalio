"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The studio's card. Every panel on the dashboard and analytics pages was
 * previously an inline `rounded-xl p-5` div with the same four style
 * properties copy-pasted onto it — twelve times on the dashboard alone. One
 * component means one place to change the surface, and it means a panel can
 * own its own loading and empty states instead of the page gating on all of
 * them at once.
 */

export function Panel({
  className,
  flush = false,
  children,
}: {
  className?: string;
  /** Drop the padding — for panels whose content runs edge to edge (tables). */
  flush?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn("rounded-xl", flush ? "overflow-hidden" : "p-5", className)}
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-2)",
      }}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  sub,
  value,
  action,
  className,
}: {
  title: string;
  sub?: string;
  /** The panel's headline figure, set right. Reads as the answer the chart
   *  below is evidence for. */
  value?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-5", className)}>
      <div className="min-w-0">
        <h3
          className="text-sm font-semibold tracking-[-0.006em]"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {title}
        </h3>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
            {sub}
          </p>
        )}
      </div>
      {value !== undefined ? (
        <span
          className="text-sm font-semibold tabular-nums shrink-0"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {value}
        </span>
      ) : (
        action
      )}
    </div>
  );
}

/**
 * Empty is a state, not an absence. A blank panel reads as broken; a panel
 * that says what would go here and how to make it appear reads as ready.
 */
export function PanelEmpty({
  message,
  hint,
  height = 168,
}: {
  message: string;
  hint?: React.ReactNode;
  height?: number;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1.5 text-center px-4"
      style={{ height }}
    >
      <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
        {message}
      </p>
      {hint && (
        <div className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/**
 * A panel that is still loading keeps its own frame and header, so the page
 * doesn't reflow when the data lands — only the plot area swaps. This is the
 * whole reason the studio no longer blanks itself while four requests are in
 * flight: layout is known before data is.
 */
export function PanelSkeleton({
  height = 168,
  header = true,
}: {
  height?: number;
  header?: boolean;
}) {
  return (
    <Panel>
      {header && (
        <div className="mb-5 space-y-1.5">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      )}
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </Panel>
  );
}
