"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { SPRING } from "./motion";
import { Reveal } from "./shared/Reveal";
import { cld, SCENES } from "./imagery";

const ASSURANCES = ["Free to browse", "No subscription", "Cancel nothing"];

export const CTA = () => {
  const reduce = useReducedMotion();

  return (
    <section
      className="surface-base px-5 pb-24 md:px-8 md:pb-32"
    >
      <Reveal distance={28}>
        <div
          className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem]"
          style={{
            // Under the photograph, so the panel is still dark — and the white
            // type on it still legible — if the image is slow or never lands.
            backgroundColor: "#0b0f07",
            boxShadow: "var(--cs-shadow-float)",
          }}
        >
          {/* The last thing on the page is the thing being sold. A plate
              under a spotlight closes better than a colour field does. */}
          <Image
            src={cld(SCENES.closing, { w: 1600, h: 1000 })}
            alt="Sauce being poured over seared duck breast and a potato fondant, steam still rising, shot under a single light."
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="-z-10 object-cover"
          />

          {/* The plate is the brightest thing in the frame and the headline
              sits on top of it, so the veil is heavy and lifts at the edges —
              enough to read white type anywhere in the panel while the food
              still comes through as texture rather than wallpaper. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 78% 70% at 50% 52%, rgba(6,9,4,0.9), rgba(6,9,4,0.74) 68%, rgba(6,9,4,0.66) 100%)",
            }}
          />

          <div className="relative px-6 py-16 text-center md:px-16 md:py-24">
            <h2
              className="type-title mx-auto max-w-2xl"
              style={{ color: "#ffffff", textWrap: "balance" }}
            >
              Your next good dinner is already here
            </h2>

            <p
              className="type-body-lg mx-auto mt-5 max-w-lg"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              Browse thousands of chef-tested recipes for free. Pay only for the
              cookbooks you want to keep.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={SPRING.snappy}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/sign-up"
                  className="type-subheading group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 transition-shadow duration-200 hover:shadow-xl sm:w-auto"
                  style={{
                    backgroundColor: "var(--cs-accent)",
                    color: "#12200a",
                    boxShadow: "0 10px 30px -12px rgba(167,209,41,0.7)",
                  }}
                >
                  Start cooking free
                  <ArrowRightIcon
                    size={16}
                    weight="bold"
                    className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  />
                </Link>
              </motion.div>

              <motion.div
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={SPRING.snappy}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/apply-chef"
                  className="type-subheading inline-flex h-12 w-full items-center justify-center rounded-full px-7 transition-colors duration-200 sm:w-auto"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.28)",
                    backdropFilter: "blur(10px) saturate(140%)",
                    WebkitBackdropFilter: "blur(10px) saturate(140%)",
                  }}
                >
                  Apply as a chef
                </Link>
              </motion.div>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {ASSURANCES.map((item) => (
                <li
                  key={item}
                  className="type-caption flex items-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  <CheckCircleIcon size={14} weight="fill" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CTA;
