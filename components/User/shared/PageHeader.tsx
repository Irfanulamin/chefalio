import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  /** One sentence. Say what's on the page, not what the product is. */
  lede?: ReactNode;
  /** Primary action or filter summary, right-aligned on wide viewports. */
  actions?: ReactNode;
  /** Counts, totals — sits under the lede in the label style. */
  meta?: ReactNode;
};

/**
 * Every page in the app opens the same way, for the same reason the
 * landing page's `SectionHeading` exists: consistency is what lets
 * someone scan. Same place, same shape, same weight jump from title to
 * the sentence under it.
 *
 * It answers the first two wayfinding questions — *where am I* and
 * *what's here* — which is why the lede is not optional decoration. It
 * is also why there is no entrance animation on it: the answer to "where
 * am I" should be legible on the first painted frame, not after 400ms.
 */
export function PageHeader({ title, lede, actions, meta }: PageHeaderProps) {
  return (
    <div
      className="flex flex-col gap-4 pb-5 mb-6 sm:flex-row sm:items-end sm:justify-between"
      style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
    >
      <div className="min-w-0">
        <h1 className="ui-title" style={{ color: "var(--cs-text-primary)" }}>
          {title}
        </h1>
        {lede && (
          <p
            className="ui-body mt-1 max-w-prose"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {lede}
          </p>
        )}
        {meta && (
          <p
            className="ui-caption ui-numeric mt-2"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            {meta}
          </p>
        )}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader;
