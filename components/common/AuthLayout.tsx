"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  StarIcon,
} from "@phosphor-icons/react/dist/ssr";

interface AuthLayoutProps {
  /** Page heading. Say what this screen does, plainly. */
  title: string;
  subtitle?: React.ReactNode;
  /** Small mark above the title, matching the section eyebrows on the landing page. */
  icon?: React.ElementType;
  /** The form itself. Sits inside the card. */
  children: React.ReactNode;
  /** Small print under the card — the way out to the other auth screen. */
  footer?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  /** Wider card for longer forms (register). */
  wide?: boolean;
}

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530582/login_wcwztq.png";

const ASIDE_POINTS = [
  "Thousands of chef-tested recipes",
  "Cookbooks you own, not rent",
  "Publish and sell your own work",
];

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
  icon: Icon,
  children,
  footer,
  imageSrc = DEFAULT_IMAGE,
  imageAlt = "Chefalio",
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
            {Icon && (
              <span
                className="mb-5 grid h-11 w-11 place-items-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(145deg, color-mix(in oklab, var(--primary) 92%, white), color-mix(in oklab, var(--secondary) 55%, var(--primary)))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 16px -8px color-mix(in oklab, var(--primary) 90%, transparent)",
                }}
              >
                <Icon size={20} weight="fill" style={{ color: "#12200a" }} />
              </span>
            )}

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
          src={imageSrc}
          alt={imageAlt}
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

        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <div className="flex items-center gap-1 pb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                size={14}
                weight="fill"
                style={{ color: "var(--primary)" }}
              />
            ))}
            <span
              className="type-caption ml-2"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              4.8 / 5 from home cooks in 40 countries
            </span>
          </div>

          <h2
            className="text-3xl font-bold text-white"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.12 }}
          >
            Cook from the pros.
            <br />
            Sell what you cook.
          </h2>

          <ul className="mt-6 space-y-2.5">
            {ASIDE_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5">
                <CheckCircleIcon
                  size={16}
                  weight="fill"
                  style={{ color: "var(--primary)" }}
                />
                <span
                  className="type-caption"
                  style={{ color: "rgba(255,255,255,0.88)" }}
                >
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
