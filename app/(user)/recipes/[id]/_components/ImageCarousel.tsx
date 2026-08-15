"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const AUTOPLAY_INTERVAL_MS = 400;

export function ImageCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const hasMany = images.length > 1;

  /**
   * Scrolls the strip itself rather than calling `scrollIntoView` on the
   * slide.
   *
   * `scrollIntoView` walks *every* scrollable ancestor, so tapping a
   * thumbnail could nudge the page vertically as a side effect of moving
   * the carousel horizontally. Driving the container moves exactly one
   * axis of exactly one element.
   *
   * Smooth scrolling is a fixed-duration browser animation — the one kind
   * of motion reduced-motion asks us to drop. The jump still lands on the
   * same photo, it just doesn't travel there.
   */
  const scrollToImage = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) return;

      const clamped = Math.max(0, Math.min(index, images.length - 1));
      setActiveIndex(clamped);
      container.scrollTo({
        left: clamped * container.clientWidth,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [images.length, reduce],
  );

  /* The strip is a real focusable region: arrows step through it, Home and
     End jump to the ends. Native scroll-snap already carries the platform's
     own momentum, rubber-banding and trackpad handling for pointer input —
     this is the half of the interaction a keyboard was missing. */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasMany) return;

    const step: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: images.length - 1,
    };

    if (e.key in step) {
      e.preventDefault();
      scrollToImage(step[e.key]);
    }
  };

  /* Loops back to the first photo after the last rather than stopping —
     the same "advances until interrupted" behavior as native OS photo
     widgets. Pauses on hover/focus so it never fights a reader who's
     actually looking at a specific photo, and sits out entirely under
     reduced motion, where a continuously-advancing carousel is exactly the
     kind of looping motion that preference exists to remove. */
  useEffect(() => {
    if (!hasMany || reduce || paused) return;

    const id = setInterval(() => {
      scrollToImage((activeIndex + 1) % images.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(id);
  }, [hasMany, reduce, paused, activeIndex, images.length, scrollToImage]);

  return (
    <div className="mb-8">
      <div
        className="ui-card overflow-hidden"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Native scroll-snap rather than a JS carousel: it keeps the
            platform's own momentum, rubber-banding at the ends and
            trackpad handling, which no reimplementation gets right. */}
        <div
          ref={scrollRef}
          role="region"
          aria-label={`${title}, ${images.length} photo${images.length === 1 ? "" : "s"}`}
          aria-roledescription="carousel"
          tabIndex={hasMany ? 0 : -1}
          onKeyDown={handleKeyDown}
          className="focus-ring relative flex overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            aspectRatio: "4/3",
          }}
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            setActiveIndex(idx);
          }}
        >
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={i}
                className="relative h-full w-full shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <Image
                  src={img}
                  alt={`${title}, photo ${i + 1} of ${images.length}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            ))
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: "var(--cs-surface-3)" }}
            >
              <span
                className="text-5xl font-bold opacity-20"
                style={{ color: "var(--cs-accent-text)" }}
              >
                {title.charAt(0)}
              </span>
            </div>
          )}

          {hasMany && (
            <span
              className="material-thick ui-micro ui-numeric absolute right-3 top-3 z-10 rounded-lg px-2.5 py-1 font-bold"
              style={{ color: "var(--cs-text-primary)" }}
              aria-hidden
            >
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Arrowing through the strip is silent to a screen reader without
            this — the counter above it is decorative. */}
        {hasMany && (
          <span aria-live="polite" className="sr-only">
            Photo {activeIndex + 1} of {images.length}
          </span>
        )}

        {hasMany && (
          <div
            className="flex gap-2 overflow-x-auto p-3 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollbarWidth: "none",
              borderTop: "1px solid var(--cs-border-subtle)",
            }}
          >
            {images.map((img, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => scrollToImage(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={isActive}
                  /* Selection is a ring drawn *inside* the thumbnail via
                     box-shadow, not an `outline` — outline is what
                     `.focus-ring` uses, and the two were overwriting each
                     other, so a focused thumbnail and a selected one were
                     indistinguishable. */
                  className="focus-ring relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-[opacity,box-shadow] duration-150 active:scale-95"
                  style={{
                    opacity: isActive ? 1 : 0.55,
                    boxShadow: isActive
                      ? "inset 0 0 0 2px var(--cs-accent-text)"
                      : "inset 0 0 0 2px transparent",
                  }}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
