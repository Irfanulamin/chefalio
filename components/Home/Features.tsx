"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  BookmarkSimpleIcon,
  ChartLineUpIcon,
  FunnelIcon,
  LockKeyIcon,
  ShoppingBagIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import { EASE } from "./motion";

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: "var(--cs-surface-1)",
  border: "1px solid var(--cs-border-subtle)",
};

function Cell({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={cardAnim}
      className={`group relative overflow-hidden rounded-2xl p-6 ${className}`}
      style={CARD_STYLE}
    >
      {children}
    </motion.div>
  );
}

function CellText({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <>
      <Icon
        size={22}
        weight="duotone"
        style={{ color: "var(--cs-accent-text)" }}
        className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
      />
      <h3
        className="mt-4 text-lg font-semibold tracking-tight"
        style={{ color: "var(--cs-text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-sm leading-relaxed"
        style={{ color: "var(--cs-text-secondary)" }}
      >
        {body}
      </p>
    </>
  );
}

export const Features = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px -100px 0px" });

  return (
    <section
      id="features"
      className="py-20 md:py-28"
      style={{ backgroundColor: "var(--cs-surface-2)" }}
    >
      <motion.div
        ref={ref}
        className="mx-auto max-w-7xl px-4 md:px-8"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.h2
          variants={cardAnim}
          className="max-w-2xl text-3xl font-bold tracking-tighter md:text-5xl"
          style={{ color: "var(--cs-text-primary)" }}
        >
          Everything the platform actually does
        </motion.h2>

        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
          }}
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3"
        >
          {/* Search + filters, the widest cell, carries a live chip visual */}
          <Cell className="md:col-span-2">
            <CellText
              icon={FunnelIcon}
              title="Search that respects your kitchen"
              body="Filter by ingredient, cuisine, dietary preference, cooking time, and difficulty. Find the dish you can actually make tonight."
            />
            <div className="mt-5 flex flex-wrap gap-1.5">
              {["Under 30 min", "Vegetarian", "One pan", "No oven", "Beginner", "Gluten free"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      color: "var(--cs-text-secondary)",
                      backgroundColor: "var(--cs-surface-2)",
                      border: "1px solid var(--cs-border-subtle)",
                    }}
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </Cell>

          {/* Marketplace, tall cell with a brand gradient panel */}
          <Cell className="md:row-span-2">
            <CellText
              icon={StorefrontIcon}
              title="A real cookbook marketplace"
              body="Chefs bundle recipes into cookbooks and set their own price. You buy the ones you want and keep them for good."
            />
            <div
              className="relative mt-6 h-44 overflow-hidden rounded-xl md:h-64"
              style={{
                background:
                  "linear-gradient(150deg, color-mix(in oklab, var(--primary) 70%, transparent), color-mix(in oklab, var(--accent) 90%, transparent))",
              }}
            >
              <div className="absolute inset-x-5 bottom-5 space-y-2">
                {[
                  { name: "Weeknight Italian", price: "$24" },
                  { name: "Fermentation Basics", price: "$32" },
                ].map((b) => (
                  <div
                    key={b.name}
                    className="flex items-center justify-between rounded-lg px-3 py-2 backdrop-blur-sm"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--cs-surface-1) 88%, transparent)",
                      border: "1px solid var(--cs-border-subtle)",
                    }}
                  >
                    <span
                      className="truncate text-[11px] font-medium"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {b.name}
                    </span>
                    <span
                      className="text-[11px] font-semibold tabular-nums"
                      style={{ color: "var(--cs-text-primary)" }}
                    >
                      {b.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Cell>

          {/* Publishing, with a real product photo */}
          <Cell>
            <CellText
              icon={ShoppingBagIcon}
              title="Publish and price your own work"
              body="Upload recipes, group them into a cookbook, and sell straight to the people cooking from it."
            />
            <div className="mt-5 flex justify-end">
              <Image
                src="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530583/about-us_mrtdt2.png"
                alt=""
                width={96}
                height={96}
                className="h-20 w-20 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              />
            </div>
          </Cell>

          {/* Analytics, with a sparkline */}
          <Cell>
            <CellText
              icon={ChartLineUpIcon}
              title="Know what is working"
              body="Views, likes, saves, and orders per recipe, so you can see which dishes earn."
            />
            <svg
              viewBox="0 0 200 48"
              className="mt-5 h-12 w-full"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="feature-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 40 L28 34 L56 37 L84 24 L112 27 L140 14 L168 18 L200 6 L200 48 L0 48 Z"
                fill="url(#feature-spark)"
              />
              <path
                d="M0 40 L28 34 L56 37 L84 24 L112 27 L140 14 L168 18 L200 6"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Cell>

          {/* Library */}
          <Cell>
            <CellText
              icon={BookmarkSimpleIcon}
              title="One library for everything"
              body="Saved recipes and purchased cookbooks live in the same place, ready whenever you cook."
            />
          </Cell>

          {/* Trust, folds the four old security entries into one honest cell */}
          <Cell className="md:col-span-2">
            <CellText
              icon={LockKeyIcon}
              title="Secure by default"
              body="Accounts use hashed passwords and tokens held in HTTPOnly cookies. Checkout is handled by a payment provider, so card details never touch our servers."
            />
          </Cell>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Features;
