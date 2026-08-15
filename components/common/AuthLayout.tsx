"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  AUTH_PANELS,
  cld,
  type AuthPanel,
} from "@/components/Home/imagery";
import { Header } from "@/components/common/Header";

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
}

/**
 * The shell every auth screen sits in.
 *
 * One bounded card rather than a full-height split screen: the photo used
 * to run the full viewport height as its own column, which made a short
 * form (forgot-password, one field) sit next to a wall of photograph. The
 * two now share a single card at a fixed max-width — photo on the left,
 * form on the right, both the same height as whichever is taller — so the
 * page reads as one composed object floating on the light field instead of
 * two independent panels racing each other to the edges of the window.
 *
 * The chrome above the card is the same fixed `Header` the marketing site
 * uses, not a stripped-down one-link bar. A one-off "Back to site" link
 * meant the theme toggle only existed off the auth screens — the same
 * navbar carries it everywhere else. `main` picks up the top padding the
 * header's `fixed` positioning takes out of flow, the same amount the
 * legal pages already clear it by.
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  panel = AUTH_PANELS.login,
}: AuthLayoutProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="auth-field min-h-svh">
      <Header />

      <main className="flex min-h-svh items-center justify-center px-5 pb-14 pt-28 md:px-8 md:pt-32">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduce
              ? { duration: 0.2 }
              : { type: "spring", bounce: 0, duration: 0.5 }
          }
          /* `overflow-hidden` on this element is what clips both children
             to the card's own corner radius — neither the photo half nor
             the form half needs to know its own radius. */
          className="material grid w-full overflow-hidden rounded-2xl lg:max-w-4xl lg:grid-cols-2 xl:max-w-5xl"
        >
          {/* Photo half — kept first in the DOM so the form and its
              heading are what a screen reader or a crawler meets first;
              `lg:order-1` is what actually puts it on the left visually. */}
          <div
            className="relative order-2 hidden min-h-[520px] lg:order-1 lg:block"
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
              src={cld(panel.id, { w: 900, h: 1100 })}
              alt={panel.alt}
              fill
              priority
              sizes="(min-width: 1024px) 32vw, 0px"
              className={`object-cover transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />

            {/* Flat neutral scrim, dark-to-transparent — just enough to
                carry the white headline over whatever the photo is doing
                underneath it. No brand tint: a name/time/rating chip and a
                lime-mixed gradient here read as decoration borrowed from a
                stock auth template, not as something that belongs to this
                specific photo. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.24) 45%, transparent 75%)",
              }}
            />

            <div className="absolute inset-x-0 bottom-0 p-8">
              <h2
                className="text-2xl font-bold text-white"
                style={{ letterSpacing: "-0.03em", lineHeight: 1.14 }}
              >
                Cook from the pros.
                <br />
                Sell what you cook.
              </h2>

              <p
                className="type-caption mt-3"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                Browsing is free. Cookbooks are a one-off price set by the
                chef who wrote them, and they stay in your library for good.
              </p>

              <p
                className="type-micro mt-5"
                style={{ color: "rgba(255,255,255,0.62)" }}
              >
                Pictured: {panel.name}, by {panel.chef}
              </p>
            </div>
          </div>

          {/* Form half */}
          <div className="order-1 flex flex-col justify-center p-6 md:p-8 lg:order-2 lg:p-10">
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

            <div className="mt-6">{children}</div>

            {footer && (
              <div
                className="type-caption mt-6 text-center"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                {footer}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
