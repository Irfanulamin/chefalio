import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/common/Header";

/**
 * The shared shell for full-page terminal states: the 404 and the runtime
 * error boundary. Same look as the auth screens: the site header, then a
 * plain column on the landing page's warm paper. No card, no decoration.
 */
export function StatusPage({
  eyebrow,
  title,
  description,
  actions,
}: {
  /** Short label above the headline: "404", "Something went wrong". */
  eyebrow: string;
  title: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <div className="landing min-h-svh">
      <Header />

      <main className="flex min-h-svh justify-center px-4 pb-16 pt-32 md:pt-40">
        <div className="w-full max-w-sm">
          <p className="type-caption font-semibold" style={{ color: "var(--ink-soft)" }}>
            {eyebrow}
          </p>
          <h1
            className="mt-2 font-bold"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
            }}
          >
            {title}
          </h1>
          <p className="type-body mt-2" style={{ color: "var(--ink-soft)" }}>
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3">{actions}</div>
        </div>
      </main>
    </div>
  );
}

const BASE =
  "landing-focus type-subheading inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150";
const PRIMARY = `${BASE} bg-(--primary) text-(--primary-foreground) hover:bg-[color-mix(in_oklab,var(--primary)_88%,var(--ink))]`;
const SECONDARY = `${BASE} border border-(--rule) bg-[#FFFDF8] text-(--ink) hover:border-(--ink-soft)`;

/** Filled pill: the one promoted action. */
export function StatusPrimaryAction({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={PRIMARY}>
      {children}
    </Link>
  );
}

/** Outlined pill: same shape, no fill. */
export function StatusSecondaryAction({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link {...props} className={SECONDARY}>
      {children}
    </Link>
  );
}

/** The same two looks as a real `<button>`, for actions that aren't a URL
 *  (`router.back()`, a `reset()` retry). */
export function StatusButtonAction({
  variant = "secondary",
  ...props
}: React.ComponentProps<"button"> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      type="button"
      {...props}
      className={variant === "primary" ? PRIMARY : SECONDARY}
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
