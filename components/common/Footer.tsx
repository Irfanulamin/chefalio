import Link from "next/link";

/**
 * One compact row, shared by the landing page and the legal pages.
 *
 * Guests can only reach `/`, the auth screens and the legal pages, so every
 * link goes to one of those or to a landing section (`/#cookbook`,
 * `/#for-chefs`, `/#faq`). App routes like `/recipes` are left out because
 * they'd only bounce a guest to sign-in.
 */
const LINKS = [
  { label: "Cookbooks", href: "/#cookbook" },
  { label: "For chefs", href: "/#for-chefs" },
  { label: "FAQ", href: "/#faq" },
  { label: "Sign in", href: "/sign-in" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
] as const;

export const Footer = () => {
  return (
    <footer
      className="w-full"
      style={{ borderTop: "1px solid var(--rule, var(--cs-border-subtle))" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <Link
          href="/"
          className="focus-ring w-fit select-none rounded-sm text-xl font-extrabold"
          style={{ color: "var(--cs-accent-text)", letterSpacing: "-0.03em" }}
        >
          Chefalio
        </Link>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-1 gap-y-1 md:justify-center"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="type-caption focus-ring inline-flex min-h-11 items-center rounded-sm px-2 underline-offset-4 hover:underline"
              style={{ color: "var(--ink-soft, var(--cs-text-secondary))" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p
          className="type-caption"
          style={{ color: "var(--ink-soft, var(--cs-text-tertiary))" }}
        >
          © {new Date().getFullYear()} Chefalio
        </p>
      </div>
    </footer>
  );
};

export default Footer;
