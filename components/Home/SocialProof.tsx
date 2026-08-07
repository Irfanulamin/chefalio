"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/kibo-ui/marquee";
import { EASE, VIEWPORT } from "./motion";

const CHEF_AVATARS = [
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1776520734/profile_pictures/dinswstuu3n8kywxcyik.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778681/profile_pictures/nhsmxspcuf66rmg5xlsv.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778506/profile_pictures/xkc4ykbvoxgjlqbobyxa.jpg",
  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778337/profile_pictures/wbdbvjrzxwuee9p2vt7x.jpg",
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
      className="relative py-12 md:py-16"
      style={{ backgroundColor: "var(--cs-surface-2)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE }}
        className="mx-auto mb-10 flex max-w-7xl flex-col items-center gap-4 px-4 md:flex-row md:justify-center md:gap-6 md:px-8"
      >
        <div className="flex -space-x-2.5">
          {CHEF_AVATARS.map((src, i) => (
            <span
              key={src}
              className="relative h-10 w-10 overflow-hidden rounded-full"
              style={{ border: "2px solid var(--cs-surface-1)", zIndex: CHEF_AVATARS.length - i }}
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
        <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
          <span className="font-semibold" style={{ color: "var(--cs-text-primary)" }}>
            20+ professional chefs
          </span>{" "}
          publishing across 40 countries
        </p>
      </motion.div>

      <Marquee>
        <MarqueeFade side="left" style={{ background: "linear-gradient(to right, var(--cs-surface-1), transparent)" }} />
        <MarqueeFade side="right" style={{ background: "linear-gradient(to left, var(--cs-surface-1), transparent)" }} />
        <MarqueeContent speed={28} pauseOnHover>
          {CUISINES.map((cuisine) => (
            <MarqueeItem key={cuisine} className="mx-1.5">
              <span
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap"
                style={{
                  color: "var(--cs-text-secondary)",
                  backgroundColor: "var(--cs-surface-2)",
                  border: "1px solid var(--cs-border-subtle)",
                }}
              >
                {cuisine}
              </span>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </section>
  );
};

export default SocialProof;
