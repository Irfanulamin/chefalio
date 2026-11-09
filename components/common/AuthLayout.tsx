"use client";

import { Header } from "@/components/common/Header";

interface AuthLayoutProps {
  /** Page heading. Say what this screen does, plainly. */
  title: string;
  subtitle?: React.ReactNode;
  /** The form itself. */
  children: React.ReactNode;
  /** Small print under the form: the way out to another auth screen. */
  footer?: React.ReactNode;
  /** Anything that belongs below the footer, like the demo accounts. */
  aside?: React.ReactNode;
}

/**
 * The shell every auth screen sits in: a plain form centred on the landing
 * page's warm paper, under the same header. No card, no decoration.
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  aside,
}: AuthLayoutProps) {
  return (
    <div className="landing min-h-svh">
      <Header />

      <main className="flex min-h-svh justify-center px-4 pb-16 pt-32 md:pt-40">
        <div className="w-full max-w-sm">
          <h1
            className="font-bold"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <div className="type-body mt-2" style={{ color: "var(--ink-soft)" }}>
              {subtitle}
            </div>
          )}

          <div className="mt-8">{children}</div>

          {footer && (
            <div className="type-caption mt-8" style={{ color: "var(--ink-soft)" }}>
              {footer}
            </div>
          )}

          {aside && <div className="mt-10">{aside}</div>}
        </div>
      </main>
    </div>
  );
}
