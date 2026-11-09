"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import PageFlip from "@/components/kokonutui/page-flip";
import { SPRING } from "@/lib/motion";

/**
 * The featured book as a real page-turner (Kokonut UI's page flip): drag or
 * tap a corner, or use the arrows and ← → keys. A slow-turning burst sits
 * behind the book.
 *
 * The sticker sits on the closed cover. As soon as a page starts to turn it
 * slides out to the open book's top corner, clear of the pages, and slides
 * back when the book closes again.
 *
 * The pages are built on the server and passed in.
 */
export function CookbookFlip({
  pages,
  label,
  backdrop,
  sticker,
}: {
  pages: ReactNode[];
  label: string;
  backdrop?: ReactNode;
  sticker?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [spread, setSpread] = useState(0);
  const open = spread > 0;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {backdrop && (
        <div className="pointer-events-none absolute inset-x-0 top-0 grid aspect-[3/2] place-items-center">
          {backdrop}
        </div>
      )}

      <PageFlip
        pages={pages}
        label={label}
        onTurnStart={setSpread}
        onSpreadChange={setSpread}
      />

      {sticker && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-10"
          initial={false}
          animate={
            open
              ? { right: "-4%", top: "-9%", rotate: 14 }
              : { right: "18%", top: "-4%", rotate: 0 }
          }
          transition={reduce ? { duration: 0 } : SPRING.default}
        >
          {sticker}
        </motion.div>
      )}
    </div>
  );
}

export default CookbookFlip;
