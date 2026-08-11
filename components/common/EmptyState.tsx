import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

/**
 * Empty is a state, not an error.
 *
 * The rule these follow: an empty state should teach the interface. "No
 * recipes found" tells someone what they can already see; what they need
 * is why it's empty and the one action that changes it — which is why
 * `description` and `action` do the real work here and the callers were
 * updated to say something specific.
 *
 * The icon is decorative and marked as such: it repeats the title, and a
 * screen reader announcing "fork and knife, no recipes found" is noise.
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <div
        aria-hidden
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{
          backgroundColor: "var(--cs-surface-2)",
          border: "1px solid var(--cs-border-subtle)",
          color: "var(--cs-accent-text)",
        }}
      >
        {icon}
      </div>

      <h3 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
        {title}
      </h3>

      <p
        className="ui-body mt-1.5 max-w-sm"
        style={{ color: "var(--cs-text-secondary)" }}
      >
        {description}
      </p>

      {action && (
        <Link
          href={action.href}
          className="focus-ring mt-5 rounded-full px-5 py-2 text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
