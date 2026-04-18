"use client";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useAnimationFrame,
  cubicBezier,
  useMotionTemplate,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export const Banner = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Star floats up as user scrolls down
  const starX = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const starOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);
  const starScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  // Ambient floating animation values
  const floatY = useMotionValue(0);
  const floatYSpring = useSpring(floatY, { stiffness: 60, damping: 12 });
  const floatRotate = useMotionValue(0);

  useAnimationFrame((t) => {
    floatY.set(Math.sin(t / 1600) * 14);
    floatRotate.set(Math.sin(t / 2400) * 2.5);
  });

  const textBlur = useTransform(scrollYProgress, [0, 0.5], [0, 12]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Text stagger container
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
      className="relative pt-2 md:pt-8 pb-10 md:pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#E6F3B8,#fff_66%)] dark:bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#C8E17A,#000_66%)] overflow-hidden"
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

      <div className="container mx-auto px-4">
        <div className="md:flex items-center">
          <motion.div
            className="md:w-280"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              filter: useMotionTemplate`blur(${textBlur}px)`,
              opacity: textOpacity,
            }}
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
              className="text-5xl font-bold tracking-tighter bg-linear-to-b dark:from-white from-black to-primary bg-clip-text text-transparent"
            >
              PRECISION IN EVERY RECIPE. CONFIDENCE IN EVERY DISH.
            </motion.h1>

            <motion.p
              variants={slideUp}
              className="text-xl text-muted-foreground dark:text-white/80 tracking-tight mt-6"
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
            </motion.div>
            <motion.div
              variants={slideUp}
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[
                  "https://i.ibb.co.com/Vwj1n8p/Prescription-Blue-Light-Glasses-Frames-Women-Men-or-Non-Prescription-Lenses-anti-reflective-Blue-Lig.jpg",
                  "https://i.ibb.co.com/ZNXLKLB/Hailey-Baldwin-Bolon-Eyewear-2017-Campaign.jpg",
                  "https://i.ibb.co.com/YQfnzrJ/y2k-Sunglasses.jpg",
                  "https://i.ibb.co.com/nDBT9Nd/Ray-Ban-Glasses.jpg",
                ].map((src, i) => (
                  <motion.div
                    key={i}
                    className="w-7 h-7 rounded-full overflow-hidden border-2 border-background ring-1 ring-primary/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.08, duration: 0.4 }}
                  >
                    <Image
                      src={src}
                      alt="Chef"
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
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
            className=" mt-20 md:mt-0 md:h-162.5 relative"
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.9,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ x: starX, opacity: starOpacity, scale: starScale }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-75 -z-10"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.7, 0.85, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              style={{
                y: floatYSpring,
                rotate: floatRotate,
              }}
            >
              <Image
                src="https://res.cloudinary.com/djgwnvlrb/image/upload/v1776530591/star_k1pqyi.png"
                alt="Banner Image"
                width={500}
                height={500}
                className="blur-[1.5px] hover:blur-[3px] transition-all ease-in delay-300"
              />
            </motion.div>
            <motion.div
              className="absolute top-10 right-10 w-3 h-3 rounded-full bg-primary shadow-lg shadow-accent hover:blur-sm transition-all"
              animate={{
                x: [0, 12, 0, -12, 0],
                y: [0, -12, 0, 12, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 left-8 w-2 h-2 rounded-full bg-primary/60  hover:blur-sm transition-all"
              animate={{
                x: [0, -8, 0, 8, 0],
                y: [0, 10, 0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
