/**
 * Decorative shapes for the landing page: scalloped badges, starbursts,
 * sparkles and a squiggle. All are hidden from assistive tech, and their
 * motion (`.landing-spin`, `.landing-bob`) stops under reduced motion.
 *
 * Paths are computed once at module load, so server and client agree.
 */

import type { CSSProperties, ReactNode } from "react";

const r2 = (n: number) => Math.round(n * 100) / 100;

/** A circle with `n` rounded bumps around its edge, like a seal or sticker. */
function scallopPath(n: number, r: number, depth: number, cx = 60, cy = 60) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2;
    const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
    const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    const c = [cx + (r + depth * 2) * Math.cos(am), cy + (r + depth * 2) * Math.sin(am)];
    if (i === 0) d += `M${r2(p0[0])} ${r2(p0[1])}`;
    d += ` Q${r2(c[0])} ${r2(c[1])} ${r2(p1[0])} ${r2(p1[1])}`;
  }
  return `${d}Z`;
}

/** A pointed star with `n` points. */
function starPath(n: number, outer: number, inner: number, cx = 60, cy = 60) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? outer : inner;
    pts.push(`${r2(cx + rad * Math.cos(a))} ${r2(cy + rad * Math.sin(a))}`);
  }
  return `M${pts.join(" L")}Z`;
}

const SCALLOP = scallopPath(16, 50, 3.5);
const BURST = starPath(14, 58, 44);
const STAR = starPath(8, 58, 30);
const SPARKLE =
  "M60 4 C64 42 78 56 116 60 C78 64 64 78 60 116 C56 78 42 64 4 60 C42 56 56 42 60 4Z";

type ShapeProps = {
  className?: string;
  style?: CSSProperties;
  color?: string;
};

export function Burst({ className = "", style, color = "var(--butter)" }: ShapeProps) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className} style={style}>
      <path d={BURST} fill={color} strokeLinejoin="round" />
    </svg>
  );
}

export function Star({ className = "", style, color = "var(--tomato)" }: ShapeProps) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className} style={style}>
      <path d={STAR} fill={color} />
    </svg>
  );
}

export function Sparkle({ className = "", style, color = "var(--ink)" }: ShapeProps) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={className} style={style}>
      <path d={SPARKLE} fill={color} />
    </svg>
  );
}

export function Squiggle({ className = "", style, color = "var(--tomato)" }: ShapeProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      className={className}
      style={style}
    >
      <path
        d="M2 12 C18 2 30 2 42 10 S66 18 80 10 S104 2 118 10 S142 18 156 10 S182 2 198 10"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * A scalloped sticker with text running round its edge. The ring turns
 * slowly; whatever sits in the middle stays upright.
 */
export function SpinBadge({
  id,
  text,
  center,
  className = "",
  style,
  fill = "var(--landing-accent)",
  ink = "var(--ink)",
  spin = "landing-spin",
}: {
  /** Unique per page: it names the circular text path. */
  id: string;
  text: string;
  center?: ReactNode;
  className?: string;
  style?: CSSProperties;
  fill?: string;
  ink?: string;
  spin?: string;
}) {
  const ring = 2 * Math.PI * 38;
  return (
    <div aria-hidden className={`relative aspect-square ${className}`} style={style}>
      <svg viewBox="0 0 120 120" className={`absolute inset-0 h-full w-full ${spin}`}>
        <path d={SCALLOP} fill={fill} />
        <path
          id={id}
          d="M22 60 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0"
          fill="none"
        />
        <text
          fill={ink}
          fontSize="9"
          fontWeight="700"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href={`#${id}`} textLength={r2(ring - 3)} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      {center && (
        <div className="absolute inset-0 grid place-items-center" style={{ color: ink }}>
          {center}
        </div>
      )}
    </div>
  );
}

/** A still scalloped sticker with a short label in the middle. */
export function Seal({
  children,
  className = "",
  style,
  fill = "var(--butter)",
  ink = "var(--ink)",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  fill?: string;
  ink?: string;
}) {
  return (
    <div className={`relative grid aspect-square place-items-center ${className}`} style={style}>
      <svg aria-hidden viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <path d={SCALLOP} fill={fill} />
      </svg>
      <span
        className="relative px-2 text-center text-[0.75rem] font-bold leading-none"
        style={{ color: ink, letterSpacing: "-0.01em" }}
      >
        {children}
      </span>
    </div>
  );
}
