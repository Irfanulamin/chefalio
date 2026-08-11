"use client";

import type { ReactNode } from "react";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/components/common/EmptyState";

type AsyncSectionProps = {
  loading: boolean;
  error: unknown;
  isEmpty: boolean;
  /** Placeholder rows shown on first load only. */
  skeleton: ReactNode;
  empty: {
    icon: ReactNode;
    title: string;
    description: string;
    action?: { label: string; href: string };
  };
  /** Completes the sentence "We couldn't load …". */
  errorSubject: string;
  children: ReactNode;
};

/**
 * The loading / error / empty / content shell shared by the Activity
 * sections.
 *
 * All three had their own copy of all four states — around 120 lines of
 * near-identical markup — which is how they ended up with three
 * different empty-state icons treatments and two different corner radii.
 *
 * One behavioural fix comes with it: the callers gated their skeletons on
 * `isLoading || isFetching`, so every background refetch tore the list
 * out and replaced it with placeholders. React Query refetches on window
 * focus by default, which meant alt-tabbing back to the page made your
 * saved recipes vanish and reappear. Skeletons are for the first load,
 * when there is genuinely nothing to show.
 */
export function AsyncSection({
  loading,
  error,
  isEmpty,
  skeleton,
  empty,
  errorSubject,
  children,
}: AsyncSectionProps) {
  if (loading) {
    return (
      <section
        className="ui-card overflow-hidden"
        aria-busy="true"
        aria-label={`Loading ${errorSubject}`}
      >
        {skeleton}
      </section>
    );
  }

  if (error) {
    return (
      <section className="ui-card px-8 py-12 text-center" role="alert">
        <div
          aria-hidden
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--cs-danger-bg)",
            color: "var(--cs-danger-fg)",
          }}
        >
          <WarningCircleIcon size={22} />
        </div>
        <h3 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
          Couldn&rsquo;t load {errorSubject}
        </h3>
        <p
          className="ui-body mx-auto mt-1.5 max-w-sm"
          style={{ color: "var(--cs-text-secondary)" }}
        >
          The request didn&rsquo;t come back. Refresh the page to try again — nothing
          you&rsquo;ve saved has been lost.
        </p>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="ui-card">
        <EmptyState {...empty} />
      </section>
    );
  }

  return <section className="ui-card overflow-hidden">{children}</section>;
}

export default AsyncSection;
