"use client";

import Image from "next/image";
import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import { Reveal } from "./shared/Reveal";

const CHEF_AVATARS = [
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1776520734/profile_pictures/dinswstuu3n8kywxcyik.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778681/profile_pictures/nhsmxspcuf66rmg5xlsv.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778506/profile_pictures/xkc4ykbvoxgjlqbobyxa.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778337/profile_pictures/wbdbvjrzxwuee9p2vt7x.jpg",
];

/* Platform figures. Update them here when they change. */
const STATS = [
  { number: "120+", label: "Recipes published" },
  { number: "20+", label: "Professional chefs" },
  { number: "40+", label: "Countries" },
  { number: "4.8", label: "Average rating" },
];

const CUISINES = [
  "Mediterranean",
  "Japanese",
  "Levantine",
  "Sichuan",
  "Nordic",
  "Oaxacan",
  "Bengali",
  "Basque",
  "Thai",
  "Georgian",
  "Peruvian",
  "Sicilian",
];

export const SocialProof = () => {
  return (
    <section
      className="surface-raised relative py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal
          distance={14}
          className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-5"
        >
          <div className="flex -space-x-2.5">
            {CHEF_AVATARS.map((src, i) => (
              <span
                key={src}
                className="relative h-10 w-10 overflow-hidden rounded-full"
                style={{
                  border: "2px solid var(--cs-surface-2)",
                  boxShadow: "var(--cs-shadow-chip)",
                  zIndex: CHEF_AVATARS.length - i,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1 md:flex-row md:gap-3">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  size={13}
                  weight="fill"
                  style={{ color: "var(--cs-accent-text)" }}
                />
              ))}
            </span>
            <p
              className="type-caption"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              Rated{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--cs-text-primary)" }}
              >
                4.8 / 5
              </span>{" "}
              by home cooks in 40 countries
            </p>
          </div>
        </Reveal>

        {/* Numbers, given room to be read rather than buried in prose. */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.05}
              distance={16}
              className="text-center"
            >
              <p
                className="text-3xl font-bold tabular-nums md:text-4xl"
                style={{
                  color: "var(--cs-text-primary)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                }}
              >
                {s.number}
              </p>
              <p
                className="type-caption mt-1.5"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <p
          className="type-label mb-5 text-center"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          Cuisines on the platform
        </p>

        {/* Faded with a transparency mask, not a coloured overlay. The band
            is translucent over the page's light field, so any solid gradient
            painted on top would be a slightly wrong colour and read as a
            smear. A mask dissolves the chips themselves and is correct
            against whatever happens to be behind them. */}
        <Marquee
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
          }}
        >
          <MarqueeContent speed={26} pauseOnHover>
            {CUISINES.map((cuisine) => (
              <MarqueeItem key={cuisine} className="mx-1.5">
                <span
                  className="type-caption inline-flex items-center rounded-full px-4 py-2 font-medium whitespace-nowrap"
                  style={{
                    backgroundColor: "var(--cs-surface-1)",
                    border: "1px solid var(--cs-border-subtle)",
                    color: "var(--cs-text-secondary)",
                    boxShadow: "var(--cs-shadow-chip)",
                  }}
                >
                  {cuisine}
                </span>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>
    </section>
  );
};

export default SocialProof;
