import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface AuthenticatedFooterProps {
  links?: NavLink[];
}

export const AuthenticatedFooter = ({ links = [] }: AuthenticatedFooterProps) => {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        borderTop: "1px solid var(--cs-border-subtle)",
      }}
    >
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight select-none"
          style={{ color: "var(--cs-accent)" }}
        >
          Chefalio
        </Link>

        {/* Dynamic Links */}
        {links.length > 0 && (
          <nav className="flex items-center gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: "var(--cs-text-secondary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--cs-text-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--cs-text-secondary)")
                }
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <p className="text-xs whitespace-nowrap" style={{ color: "var(--cs-text-tertiary)" }}>
          © {new Date().getFullYear()} Chefalio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default AuthenticatedFooter;
