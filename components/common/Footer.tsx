"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  explore: [
    { label: "Recipes", href: "/recipes" },
    { label: "Cookbooks", href: "/cookbooks" },
    { label: "Chefs", href: "/chefs" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const Footer = () => {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        borderTop: "1px solid var(--cs-border-subtle)",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight select-none w-fit"
              style={{ color: "var(--cs-accent)" }}
            >
              Chefalio
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--cs-text-secondary)" }}>
              Discover recipes, cookbooks, and talented chefs from around the world.
            </p>
          </div>

          {/* Explore links */}
          <div className="flex flex-col gap-3">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              Explore
            </h3>
            <nav className="flex flex-col gap-2">
              {FOOTER_LINKS.explore.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors duration-150 w-fit"
                  style={{ color: "var(--cs-text-secondary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-secondary)")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal links */}
          <div className="flex flex-col gap-3">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              Legal
            </h3>
            <nav className="flex flex-col gap-2">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm transition-colors duration-150 w-fit"
                  style={{ color: "var(--cs-text-secondary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--cs-text-secondary)")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Copyright row */}
        <div
          className="mt-10 pt-6 text-xs text-center"
          style={{
            borderTop: "1px solid var(--cs-border-subtle)",
            color: "var(--cs-text-tertiary)",
          }}
        >
          © {new Date().getFullYear()} Chefalio. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
