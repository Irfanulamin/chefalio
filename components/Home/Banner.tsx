"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowArcLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  cubicBezier,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export const Banner = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const floatY = useMotionValue(0);
  const floatRotate = useMotionValue(0);

  useAnimationFrame((t) => {
    floatY.set(Math.sin(t / 1600) * 14);
    floatRotate.set(Math.sin(t / 2400) * 2.5);
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const slideUp = {
    hidden: { y: 40, opacity: 0, filter: "blur(6px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: cubicBezier(0.22, 1, 0.36, 1) },
    },
  };

  const slideLeft = {
    hidden: { x: -60, opacity: 0, filter: "blur(8px)" },
    visible: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.75, ease: cubicBezier(0.22, 1, 0.36, 1) },
    },
  };

  return (
    <motion.section
      id="banner"
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="relative pt-2 md:pt-8 pb-10 md:pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#E6F3B8,#fff_66%)] dark:bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#C8E17A,#000_66%)] overflow-hidden h-[calc(100dvh-80px)] flex items-center"
    >
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/5 blur-2xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <div className="container mx-auto px-4 md:px-8 xl:px-8">
        <div className="md:flex items-between justify-between gap-12">
          <motion.div
            className="md:w-120 lg:w-180 xl:w-220"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={slideUp} className="mb-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                New recipes every day
              </span>
            </motion.div>

            <motion.h1
              variants={slideLeft}
              className="text-xl md:text-2xl lg:text-3xl xl:text-5xl font-bold tracking-tighter bg-linear-to-b dark:from-white from-black to-primary bg-clip-text text-transparent"
            >
              PRECISION IN EVERY RECIPE. CONFIDENCE IN EVERY DISH.
            </motion.h1>

            <motion.p
              variants={slideUp}
              className="text-base lg:text-xl text-muted-foreground dark:text-white/80 tracking-tight mt-6"
            >
              Join our community of food lovers and explore a world of delicious
              recipes. Whether you&apos;re a seasoned chef or just starting out,
              Chefalio has something for everyone! Discover new flavors, share
              your own creations, and connect with fellow food enthusiasts. From
              quick weeknight meals to gourmet feasts, your next favorite recipe
              is just a click away!
            </motion.p>

            <motion.div
              variants={slideUp}
              className="mt-6 flex items-center gap-4"
            >
              <Link href="/recipes" className="inline-flex items-center gap-2">
                <Button className="group" size="lg">
                  Get Started
                  <motion.span
                    className="inline-flex"
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRightIcon size={18} />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>
            <motion.div
              variants={slideUp}
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1776520734/profile_pictures/dinswstuu3n8kywxcyik.jpg",
                  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778681/profile_pictures/nhsmxspcuf66rmg5xlsv.jpg",
                  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778506/profile_pictures/xkc4ykbvoxgjlqbobyxa.jpg",
                  "https://res.cloudinary.com/djgwnvlrb/image/upload/v1775778337/profile_pictures/wbdbvjrzxwuee9p2vt7x.jpg",
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.08, duration: 0.4 }}
                  >
                    <Image
                      src={src}
                      alt="Chef"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover grayscale rounded-full"
                    />
                  </motion.div>
                ))}
              </div>
              <motion.p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">100+</span>{" "}
                chefs already cooking
              </motion.p>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.9,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="hidden md:block"
          >
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-105 isolate">
                {/* Backdrop glow */}
                <div
                  aria-hidden
                  className="absolute -inset-8 rounded-[40px] opacity-60 dark:opacity-40 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(156,201,59,0.2) 0%, transparent 70%)",
                  }}
                />

                {/* Skeleton card — furthest back */}
                <motion.div
                  initial={{ opacity: 0, rotate: 2, x: 4, y: 6 }}
                  animate={{ opacity: 0.7, rotate: 8, x: 18, y: 14 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 rounded-2xl bg-[#E8E6D8] dark:bg-[#141508] border border-[#DDDCC8] dark:border-[#1A1C10]"
                  style={{ zIndex: -2 }}
                >
                  <div className="p-5 flex flex-col gap-3 opacity-35">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full bg-[#C4C2B2] dark:bg-[#2A2D1F]"
                        />
                      ))}
                    </div>
                    <div className="h-44 rounded-xl bg-[#C4C2B2] dark:bg-[#2A2D1F]" />
                    <div className="h-4 w-3/4 rounded-full bg-[#C4C2B2] dark:bg-[#2A2D1F]" />
                    <div className="h-3 w-1/3 rounded-full bg-[#C4C2B2] dark:bg-[#2A2D1F]" />
                    <div className="grid grid-cols-3 gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="h-2 w-8 rounded-full bg-[#C4C2B2] dark:bg-[#2A2D1F]" />
                          <div className="h-4 w-10 rounded-full bg-[#C4C2B2] dark:bg-[#2A2D1F]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Skeleton card — closer */}
                <motion.div
                  initial={{ opacity: 0, rotate: 0, x: 2, y: 4 }}
                  animate={{ opacity: 1, rotate: 4, x: 10, y: 8 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 rounded-2xl bg-[#F0EEE3] dark:bg-[#1A1C12] border border-[#E0DECC] dark:border-[#1F2117]"
                  style={{ zIndex: -1 }}
                >
                  <div className="p-5 flex flex-col gap-3 opacity-60">
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full bg-[#D4D2C2] dark:bg-[#2A2D1F]"
                        />
                      ))}
                    </div>
                    <div className="h-44 rounded-xl bg-[#D4D2C2] dark:bg-[#2A2D1F] animate-pulse" />
                    <div className="h-4 w-3/4 rounded-full bg-[#D4D2C2] dark:bg-[#2A2D1F] animate-pulse" />
                    <div className="h-3 w-1/3 rounded-full bg-[#D4D2C2] dark:bg-[#2A2D1F] animate-pulse" />
                    <div className="grid grid-cols-3 gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className="h-2 w-8 rounded-full bg-[#D4D2C2] dark:bg-[#2A2D1F] animate-pulse" />
                          <div className="h-4 w-10 rounded-full bg-[#D4D2C2] dark:bg-[#2A2D1F] animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge — top */}
                <motion.div
                  className="absolute -top-3 -left-4 z-20 px-3 py-2 rounded-xl bg-white dark:bg-[#13140E] border border-[#E8E6DA] dark:border-[#1F2117] flex items-center gap-2"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    y: {
                      delay: 0.9,
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      delay: 0.9,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                >
                  <span className="text-sm">🔥</span>
                  <div>
                    <div className="text-[10px] font-semibold text-[#15170E] dark:text-[#F0EFE4] leading-tight">
                      Trending
                    </div>
                    <div className="text-[9px] text-[#888B76] dark:text-[#6A6D5A] leading-tight">
                      2.4k saves
                    </div>
                  </div>
                </motion.div>

                {/* Main card — rotates + floats */}
                <motion.div
                  className="relative z-10 rounded-2xl overflow-hidden bg-white dark:bg-[#13140E] border border-[#E8E6DA] dark:border-[#1F2117]"
                  style={{
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06), 0 24px 48px rgba(90,122,31,0.08)",
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 1, -0.5, 0],
                  }}
                  transition={{
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    rotate: {
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 pt-5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E8E6DA] dark:bg-[#2A2D1F]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E8E6DA] dark:bg-[#2A2D1F]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E8E6DA] dark:bg-[#2A2D1F]" />
                      </div>
                    </div>
                    <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#888B76] dark:text-[#6A6D5A]">
                      Today&apos;s Pick
                    </span>
                  </div>

                  {/* Hero image */}
                  <div className="mx-5 mt-4 h-44 rounded-xl relative overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #5A7A1F 0%, #7AA02C 40%, #C8E050 100%)",
                      }}
                    />
                    <svg
                      className="absolute inset-0 w-full h-full opacity-30"
                      viewBox="0 0 200 100"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      <path
                        d="M20 80 Q40 50 60 70 T100 60 T140 75 T180 65"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                      />
                      <path
                        d="M10 90 Q30 70 50 85 T90 80 T130 90 T170 85"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                        opacity="0.6"
                      />
                    </svg>
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                      <span className="text-[10px]">🌿</span>
                      <span className="text-[10px] font-semibold text-[#15170E] uppercase tracking-wide">
                        Mediterranean
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[#15170E] dark:text-[#F0EFE4]">
                      Herb-Crusted Salmon Roulade
                    </h3>
                    <p className="text-[13px] text-[#888B76] dark:text-[#6A6D5A] mt-1">
                      by Chef Marco Rivera
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-3 pb-4 border-b border-[#EFEDE2] dark:border-[#191A12]">
                      {[
                        { label: "Prep", value: "20m" },
                        { label: "Cook", value: "35m" },
                        { label: "Serves", value: "4" },
                      ].map((s) => (
                        <div key={s.label}>
                          <div className="text-[10px] uppercase tracking-widest text-[#888B76] dark:text-[#6A6D5A] font-medium">
                            {s.label}
                          </div>
                          <div className="text-[15px] font-semibold text-[#15170E] dark:text-[#F0EFE4] mt-0.5">
                            {s.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] uppercase tracking-widest text-[#888B76] dark:text-[#6A6D5A] font-medium">
                          Recipe completion
                        </span>
                        <span className="text-[11px] font-semibold text-[#5A7A1F] dark:text-[#9CC93B]">
                          90%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#EFEDE2] dark:bg-[#191A12] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-linear-to-r from-[#5A7A1F] to-[#9CC93B]"
                          initial={{ width: "0%" }}
                          animate={{ width: "90%" }}
                          transition={{
                            delay: 1.1,
                            duration: 1.4,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px]">
                        <span className="text-[#C8A820]">★</span>
                        <span className="font-semibold text-[#15170E] dark:text-[#F0EFE4]">
                          4.97
                        </span>
                        <span className="text-[#888B76] dark:text-[#6A6D5A]">
                          · 482 reviews
                        </span>
                      </div>
                      <div className="text-[12px] font-medium text-[#5A7A1F] dark:text-[#9CC93B] inline-flex items-center gap-1">
                        View recipe <ArrowArcLeftIcon size={11} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating pill — top right, lil floating thing */}
                <motion.div
                  className="absolute -top-5 right-4 z-20 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -6, 0],
                  }}
                  transition={{
                    opacity: { delay: 1.4, duration: 0.4, ease: "easeOut" },
                    scale: {
                      delay: 1.4,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    y: {
                      delay: 1.4,
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-semibold text-primary tracking-wide">
                    Trending
                  </span>
                </motion.div>

                {/* Floating badge — bottom */}
                <motion.div
                  className="absolute -bottom-3 -right-4 z-20 px-3 py-2 rounded-xl bg-white dark:bg-[#13140E] border border-[#E8E6DA] dark:border-[#1F2117] flex items-center gap-2"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    y: {
                      delay: 1.2,
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    opacity: {
                      delay: 1.2,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #5A7A1F, #9CC93B)",
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-[#15170E] dark:text-[#F0EFE4] leading-tight">
                      Saved
                    </div>
                    <div className="text-[9px] text-[#888B76] dark:text-[#6A6D5A] leading-tight">
                      Added to library
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
