import { Skeleton } from "@/components/ui/skeleton";

type Variant = "recipe" | "cookbook" | "chef";

const MEDIA_RATIO: Record<Exclude<Variant, "chef">, string> = {
  recipe: "4/3",
  cookbook: "3/4",
};

/**
 * Loading placeholders that match the card they stand in for.
 *
 * Three of the four grids were drawing their own, and two of them used
 * flat `--cs-surface-3` blocks with no pulse — so a slow connection was
 * indistinguishable from a grid of empty cards, which is the one thing a
 * skeleton exists to prevent. All of them route through the real
 * `Skeleton` now.
 *
 * The shapes deliberately mirror the true layout (same aspect ratio,
 * same line count, same footer rule). A skeleton whose proportions don't
 * match causes a visible reflow the moment data lands, which reads as
 * the page breaking rather than loading.
 */
export function CardSkeleton({ variant }: { variant: Variant }) {
  if (variant === "chef") {
    return (
      <div className="ui-card flex flex-col items-center gap-3 p-5">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div
          className="flex w-full justify-center gap-4 pt-2"
          style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
        >
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="ui-card flex flex-col overflow-hidden">
      <Skeleton
        className="w-full rounded-none"
        style={{ aspectRatio: MEDIA_RATIO[variant] }}
      />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        {variant === "recipe" && (
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

/** `count` placeholders, for dropping straight into a grid. */
export function CardSkeletonGrid({
  variant,
  count = 8,
}: {
  variant: Variant;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} variant={variant} />
      ))}
    </>
  );
}

export default CardSkeleton;
