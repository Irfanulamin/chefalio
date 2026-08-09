"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRightIcon,
  InstagramLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

const COLUMNS: {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    heading: "Explore",
    links: [
      { label: "Recipes", href: "/recipes" },
      { label: "Cookbooks", href: "/cookbooks" },
      { label: "Chefs", href: "/chefs" },
    ],
  },
  {
    heading: "For chefs",
    links: [
      { label: "Apply as a chef", href: "/apply-chef" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "FAQ", href: "/#faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogoIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeLogoIcon },
  { label: "X", href: "https://x.com", icon: XLogoIcon },
];

export const Footer = () => {
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        borderTop: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* A single warm wash so the page closes on the brand rather than
          stopping dead on a grey slab. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 100%, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="w-fit select-none text-2xl font-extrabold"
              style={{
                color: "var(--cs-accent-text)",
                letterSpacing: "-0.03em",
              }}
            >
              Chefalio
            </Link>
            <p
              className="type-body mt-4"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              Chef-tested recipes and cookbooks worth owning, from the people
              who actually cook them for a living.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.26 }}
                    className="grid h-9 w-9 place-items-center rounded-full"
                    style={{
                      backgroundColor: "var(--cs-surface-1)",
                      border: "1px solid var(--cs-border-subtle)",
                      color: "var(--cs-text-secondary)",
                    }}
                  >
                    <Icon size={16} weight="fill" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3
                  className="type-label"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  {col.heading}
                </h3>
                <nav className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="type-caption group inline-flex w-fit items-center gap-1 transition-colors duration-150"
                      style={{ color: "var(--cs-text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--cs-text-primary)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          "var(--cs-text-secondary)")
                      }
                    >
                      {link.label}
                      <ArrowUpRightIcon
                        size={11}
                        className="opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-60"
                      />
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 pt-7 sm:flex-row"
          style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
        >
          <p
            className="type-caption"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            © {new Date().getFullYear()} Chefalio. All rights reserved.
          </p>
          <p
            className="type-caption flex items-center gap-2"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#34d399" }}
            />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
