import Link from "next/link";
import type { ElementType, ReactNode } from "react";

/**
 * The shared shell for full-page terminal states — 404, the runtime error
 * boundary, anything else that replaces the whole screen with "here's what
 * happened, here's the way out."
 *
 * Deliberately not the marketing `Header`: that component is fixed and
 * stays transparent until the page scrolls past 24px, which a short,
 * centered status screen never does — it would sit permanently invisible,
 * leaving a blank strip above content that isn't actually centered in the
 * remaining space. This is a plain static bar instead, so what you see is
 * what's there from the first paint.
 */
export function StatusPage({
  eyebrow,
  icon: Icon,
  title,
  description,
  actions,
}: {
  /** Short label above the headline — "404", "Something went wrong". */
  eyebrow: string;
  /** Omit to let the eyebrow + headline carry the screen on their own,
      rather than reaching for a generic icon-in-a-tile by default. */
  icon?: ElementType;
  title: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <div className="auth-field flex min-h-svh flex-col">
      <header className="flex shrink-0 items-center px-5 py-5 md:px-8">
        <Link
          href="/"
          className="select-none text-xl font-extrabold"
          style={{ color: "var(--cs-accent-text)", letterSpacing: "-0.03em" }}
        >
          Chefalio
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-20">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          {Icon && (
            <div
              className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
              style={{
                backgroundImage:
                  "linear-gradient(160deg, var(--cs-accent-muted), var(--cs-surface-2))",
                border: "1px solid var(--cs-border-subtle)",
              }}
            >
              <Icon size={34} weight="duotone" style={{ color: "var(--cs-accent-text)" }} />
            </div>
          )}

          <span
            className="type-title"
            style={{ color: "var(--cs-accent-text)", letterSpacing: "-0.03em" }}
          >
            {eyebrow}
          </span>
          <h1
            className="type-heading mt-3"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {title}
          </h1>
          <p className="type-body mt-2" style={{ color: "var(--cs-text-secondary)" }}>
            {description}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            {actions}
          </div>
        </div>
      </main>
    </div>
  );
}

/** Filled pill — the one promoted action. */
export function StatusPrimaryAction({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
      style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
    >
      {children}
    </Link>
  );
}

/** Outlined pill — same shape, no fill. */
export function StatusSecondaryAction({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-150 hover:bg-(--cs-hover)"
      style={{ color: "var(--cs-text-primary)", border: "1px solid var(--cs-border-default)" }}
    >
      {children}
    </Link>
  );
}

/** Same two pill looks as the Link actions, but a real `<button>` — for an
 *  action that isn't a URL (`router.back()`, a `reset()` retry) and so
 *  can't honestly be a `Link`. */
export function StatusButtonAction({
  variant = "secondary",
  ...props
}: React.ComponentProps<"button"> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-[opacity,background-color] duration-150 hover:opacity-90 hover:bg-(--cs-hover)"
      style={
        variant === "primary"
          ? { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }
          : { color: "var(--cs-text-primary)", border: "1px solid var(--cs-border-default)" }
      }
    />
  );
}

/** Where "home" means for whoever's looking at this screen — a chef's home
 *  is the studio, an admin's is the console, everyone else's is /recipes,
 *  and a guest's is the marketing page. */
export function useHomeHref(profile: { role?: string } | undefined) {
  switch (profile?.role) {
    case "chef":
      return "/chef/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "user":
      return "/recipes";
    default:
      return "/";
  }
}
