import { cn } from "@/lib/utils";

/**
 * `bg-muted` was wrong here: `--muted` is a dark olive brand colour
 * (#3E432E) in light mode, not a neutral fill, so every skeleton painted
 * as a near-black block on a white page. That is very likely why three
 * grids had each hand-rolled their own placeholder out of
 * `--cs-surface-3` instead of using this component — the shared one
 * looked broken, so nobody used it.
 *
 * It now draws from the surface ramp, one step up from the card it sits
 * in, which is what a placeholder should be: present, quiet, obviously
 * not content.
 */
function Skeleton({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md", className)}
      style={{ backgroundColor: "var(--cs-surface-3)", ...style }}
      {...props}
    />
  );
}

export { Skeleton };
