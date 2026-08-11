"use client";

import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import { forwardRef } from "react";

type LoadMoreSentinelProps = {
  loading: boolean;
  /** True once there is nothing left to fetch and something was shown. */
  done?: boolean;
  /** Plural noun for the end-of-list line, e.g. "recipes". */
  label?: string;
};

/**
 * The bottom of an infinite list: the intersection target, the loading
 * indicator, and the end-of-list line.
 *
 * All four list pages had the first two inline and none had the third,
 * so scrolling to the bottom of a finite list just… stopped, with no way
 * to tell "that's everything" from "the next page failed to load". That
 * ambiguity is the standard failure of infinite scroll and it costs one
 * line of text to fix.
 *
 * `aria-live="polite"` because a page that grows under the user without
 * announcing itself is invisible to a screen reader.
 */
export const LoadMoreSentinel = forwardRef<HTMLDivElement, LoadMoreSentinelProps>(
  function LoadMoreSentinel({ loading, done = false, label = "items" }, ref) {
    return (
      <>
        <div ref={ref} className="h-4" aria-hidden />
        <div className="flex justify-center py-6" aria-live="polite">
          {loading && (
            <span
              className="ui-caption flex items-center gap-2"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              <CircleNotchIcon size={16} className="animate-spin" aria-hidden />
              Loading more {label}…
            </span>
          )}
          {!loading && done && (
            <span className="ui-caption" style={{ color: "var(--cs-text-tertiary)" }}>
              That&rsquo;s all the {label}.
            </span>
          )}
        </div>
      </>
    );
  },
);

export default LoadMoreSentinel;
