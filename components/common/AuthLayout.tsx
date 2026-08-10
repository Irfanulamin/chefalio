"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeftIcon,
  ClockIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  AUTH_PANELS,
  cld,
  type AuthPanel,
} from "@/components/Home/imagery";

interface AuthLayoutProps {
  /** Page heading. Say what this screen does, plainly. */
  title: string;
  subtitle?: React.ReactNode;
  /** The form itself. Sits inside the card. */
  children: React.ReactNode;
  /** Small print under the card — the way out to the other auth screen. */
  footer?: React.ReactNode;
  /**
   * The brand panel. One object rather than a src and a caption that can
   * disagree — see `AUTH_PANELS`.
   */
  panel?: AuthPanel;
  /** Wider card for longer forms (register). */
  wide?: boolean;
}

/**
 * The shell every auth screen sits in.
 *
 * Auth used to be a bare form on a flat white page next to a photo with a
 * dark scrim — a different product from the one the visitor just came from.
 * It now carries the landing page's language: the same light field, the same
 * translucent card material, the same type scale and the same press
 * feedback, so signing in reads as the next step rather than a handoff.
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  panel = AUTH_PANELS.login,
  wide = false,
}: AuthLayoutProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="flex min-h-svh">
      {/* Form side */}
      <div className="auth-field relative flex flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between px-5 py-5 md:px-8">
          <Link
            href="/"
            className="select-none text-xl font-extrabold"
            style={{
              color: "var(--cs-accent-text)",
              letterSpacing: "-0.03em",
            }}
          >
            Chefalio
          </Link>

          <motion.div
            whileTap={reduce ? undefined : { scale: 0.96 }}
            transition={{ type: "spring", bounce: 0, duration: 0.26 }}
          >
            <Link
              href="/"
              className="type-caption inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors duration-150"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              <ArrowLeftIcon size={13} weight="bold" />
              Back to site
            </Link>
          </motion.div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 pb-14 pt-4 md:px-8">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? { duration: 0.2 }
                : { type: "spring", bounce: 0, duration: 0.5 }
            }
            className={`w-full ${wide ? "max-w-lg" : "max-w-md"}`}
          >
            <h1
              className="type-heading"
              style={{ color: "var(--cs-text-primary)" }}
            >
              {title}
            </h1>

            {subtitle && (
              <div
                className="type-body mt-2"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                {subtitle}
              </div>
            )}

            {/* The card is a material: the light field passes underneath it,
                which is what keeps the form attached to the page. */}
            <div className="material mt-7 rounded-3xl p-6 md:p-8">
              {children}
            </div>

            {footer && (
              <div
                className="type-caption mt-6 text-center"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Brand side */}
      <aside
        className="relative hidden w-[42%] max-w-2xl shrink-0 overflow-hidden lg:block"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        {!imgLoaded && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, transparent), var(--cs-surface-3))",
            }}
          />
        )}
        <Image
          src={cld(panel.id, { w: 1200, h: 1600 })}
          alt={panel.alt}
          fill
          priority
          sizes="42vw"
          className={`object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(true)}
        />

        {/* Brand-tinted scrim rather than flat black, so the panel belongs to
            Chefalio and not to a stock photo. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(18,32,10,0.88) 0%, rgba(18,32,10,0.45) 45%, color-mix(in oklab, var(--primary) 18%, transparent) 100%)",
          }}
        />

        {/* A row of five decorative stars and three adjectives ("Thousands of
            chef-tested recipes") is the stock half of every split-screen auth
            page, and none of it was checkable. The panel now credits the
            photograph instead: this is a real recipe on the platform, by a
            named chef, and saying so is worth more than the claim was. */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div
            className="type-caption inline-flex w-fit items-center gap-2.5 rounded-full px-3.5 py-2"
            style={{
              backgroundColor: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(10px) saturate(140%)",
              WebkitBackdropFilter: "blur(10px) saturate(140%)",
              color: "#ffffff",
            }}
          >
            <span className="font-semibold">{panel.name}</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>·</span>
            <span
              className="inline-flex items-center gap-1"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              <ClockIcon size={12} weight="bold" />
              {panel.time}
            </span>
            <span
              className="inline-flex items-center gap-1"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              <StarIcon
                size={12}
                weight="fill"
                style={{ color: "var(--primary)" }}
              />
              {panel.rating}
            </span>
          </div>

          <div>
            <h2
              className="text-3xl font-bold text-white"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.12 }}
            >
              Cook from the pros.
              <br />
              Sell what you cook.
            </h2>

            <p
              className="type-body mt-4 max-w-sm"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              Browsing is free. Cookbooks are a one-off price set by the chef
              who wrote them, and they stay in your library for good.
            </p>

            <p
              className="type-micro mt-6"
              style={{ color: "rgba(255,255,255,0.62)" }}
            >
              Pictured: {panel.name}, by {panel.chef}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
