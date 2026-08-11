"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { difficultyDisplay } from "@/lib/recipe-display";
import { StatusPill } from "@/components/User/shared/StatusPill";

export function ImageCarousel({
  images,
  title,
  difficulty,
}: {
  images: string[];
  title: string;
  difficulty: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const diff = difficultyDisplay(difficulty);

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    const container = scrollRef.current;
    if (!container) return;
    const slide = container.children[index] as HTMLElement;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <div className="mb-8">
      <div className="ui-card overflow-hidden">
        {/* Native scroll-snap rather than a JS carousel: it keeps the
            platform's own momentum, rubber-banding at the ends and
            trackpad handling, which no reimplementation gets right. */}
        <div
          ref={scrollRef}
          className="relative flex overflow-x-auto"
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

          <StatusPill tone={diff.tone} overMedia className="absolute left-3 top-3 z-10">
            {diff.label}
          </StatusPill>

          {images.length > 1 && (
            <span
              className="material-thick ui-micro ui-numeric absolute right-3 top-3 z-10 rounded-lg px-2.5 py-1 font-bold"
              style={{ color: "var(--cs-text-primary)" }}
              aria-hidden
            >
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div
            className="flex gap-2 overflow-x-auto p-3"
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
                  className="focus-ring relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all duration-150"
                  style={{
                    opacity: isActive ? 1 : 0.55,
                    outline: isActive
                      ? "2px solid var(--cs-accent-text)"
                      : "2px solid transparent",
                    outlineOffset: "1px",
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
