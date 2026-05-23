"use client";
import Image from "next/image";
import { useState, useRef } from "react";

const DIFF: Record<string, { label: string; bg: string; color: string }> = {
  beginner: { label: "Easy", bg: "#dcfce7", color: "#15803d" },
  intermediate: { label: "Medium", bg: "#fef9c3", color: "#a16207" },
  advance: { label: "Hard", bg: "#fee2e2", color: "#b91c1c" },
};

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
  const diff = DIFF[difficulty] ?? DIFF.advance;

  const scrollToImage = (index: number) => {
    setActiveIndex(index);
    const container = scrollRef.current;
    if (!container) return;
    const slide = container.children[index] as HTMLElement;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <div className="mb-8">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--cs-surface-3)",
          border: "1px solid var(--cs-border-subtle)",
        }}
      >
        {/* Main image area — CSS scroll snap */}
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
            const slideW = el.clientWidth;
            const idx = Math.round(el.scrollLeft / slideW);
            setActiveIndex(idx);
          }}
        >
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={i}
                className="relative shrink-0 w-full h-full"
                style={{ scrollSnapAlign: "start" }}
              >
                <Image
                  src={img}
                  alt={`${title} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "var(--cs-surface-3)" }}
            >
              <span
                className="text-5xl font-bold opacity-20"
                style={{ color: "var(--cs-accent)" }}
              >
                {title.charAt(0)}
              </span>
            </div>
          )}

          {/* Difficulty badge */}
          <span
            className="absolute top-3 left-3 z-10 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: diff.bg, color: diff.color }}
          >
            {diff.label}
          </span>

          {/* Image counter */}
          {images.length > 1 && (
            <span className="absolute top-3 right-3 z-10 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/30 text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div
            className="flex gap-2 p-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => scrollToImage(i)}
                className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-150"
                style={{
                  opacity: activeIndex === i ? 1 : 0.5,
                  outline:
                    activeIndex === i
                      ? "2px solid var(--cs-accent)"
                      : "2px solid transparent",
                  outlineOffset: "1px",
                }}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
