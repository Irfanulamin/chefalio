import React from "react";

interface GridLoaderProps {
  minHeight?: string;
  label?: string;
  className?: string;
}

const DELAYS = [0, 0.1, 0.2, 0.1, 0.2, 0.3, 0.2, 0.3, 0.4];

// Tailwind opacity modifiers — works regardless of how --primary is defined
const CELL_CLASSES = [
  "bg-primary",
  "bg-primary/60",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary/50",
  "bg-primary/80",
  "bg-primary/45",
  "bg-primary/65",
  "bg-primary/75",
];

export function GridLoader({
  minHeight = "60vh",
  label,
  className,
}: GridLoaderProps) {
  return (
    <div
      className={className}
      style={{ minHeight }}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <div
        className="flex flex-col items-center justify-center gap-4 h-full"
        style={{ minHeight }}
      >
        <div className="grid grid-cols-3 rounded-xl gap-1 w-13 h-13">
          {CELL_CLASSES.map((cls, i) => (
            <span
              key={i}
              className={`block ${cls} gl-cell`}
              style={{ animationDelay: `${DELAYS[i]}s` }}
            />
          ))}
        </div>

        {label && (
          <span className="text-xs tracking-widest text-muted-foreground uppercase">
            {label}
          </span>
        )}
      </div>

      <style>{`
        @keyframes glloader {
          0%   {
            opacity: .15;
            transform: scale(.65);
            box-shadow: 0 0 0px 0px hsl(var(--primary) / 0);
          }
          30%  {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 8px 3px hsl(var(--primary) / 0.55);
          }
          65%  {
            opacity: .45;
            transform: scale(.85);
            box-shadow: 0 0 4px 1px hsl(var(--primary) / 0.2);
          }
          100% {
            opacity: .15;
            transform: scale(.65);
            box-shadow: 0 0 0px 0px hsl(var(--primary) / 0);
          }
        }
        .gl-cell {
          animation: glloader 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform, opacity, box-shadow;
          border-radius: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .gl-cell { animation: none; opacity: .6; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}

export default GridLoader;
