"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Editing happens in a sheet, not on a route.
 *
 * Recipes and cookbooks used to edit at `/chef/recipes/[id]/edit`. That meant
 * every edit was a full navigation away from the table, a fresh mount, a
 * fresh fetch of `my-recipes` just to `.find()` one row out of it, and a
 * route that could only render the "not found" state if you deep-linked to
 * it. Coming back landed you at the top of an unfiltered, unsorted list.
 *
 * A sheet keeps the table underneath — its scroll position, its filters, its
 * search — so editing reads as a detour rather than a departure. The row you
 * came from is still visible behind the panel, which is the point.
 *
 * Structurally this is three fixed regions: a header that doesn't scroll, a
 * scrolling body, and a footer pinned to the bottom. The form inside the
 * body is long, and a Save button you have to scroll to find is a Save
 * button people miss.
 */
/**
 * Holds the form back until the panel has finished sliding.
 *
 * A recipe form is a TanStack form instance, an image dropzone, a tag
 * picker and a repeating instruction list — several hundred nodes and a
 * pile of hook setup. Building all of that on the same frame the sheet
 * starts moving is what made the open stutter: the slide itself is
 * compositor-only and cheap, but it was queued behind a long main-thread
 * task and simply couldn't get its frames in.
 *
 * Two paints ~200ms apart read as a panel arriving and then filling, which
 * is a normal thing for an interface to do. A slide that drops half its
 * frames is not.
 *
 * This lives in its own component so it mounts and unmounts with the
 * sheet's content — that's what resets it between openings, rather than an
 * effect writing state back on close.
 */
function DeferredContent({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  if (ready) return <>{children}</>;

  return (
    <div className="space-y-3" aria-hidden>
      <Skeleton className="h-9 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-9 w-2/3 rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
}

export function EditSheet({
  open,
  onOpenChange,
  title,
  description,
  formId,
  isSubmitting,
  submitLabel = "Save changes",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** The `<form id>` the footer's submit button drives. */
  formId: string;
  isSubmitting: boolean;
  submitLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        /* The base Sheet caps at `sm:max-w-sm` (24rem), which is a
           notifications panel, not an editor — a recipe form has a
           two-column ingredient list and a dropzone in it. The cap widens
           with the viewport instead of sitting at one narrow value: roomy
           on a laptop, genuinely comfortable on a large display, and still
           short of full-width so the table stays visible behind it.

           `!w-full` rather than `w-full`, because the base sets its width
           under a variant (`data-[side=right]:w-3/4`) and Tailwind emits
           variant utilities after bare ones — a plain `w-full` loses the
           cascade, and `twMerge` won't drop the base class either, since
           the two carry different modifiers. Below `sm` there is no
           `max-w` to rein it back in, so the panel was rendering at 75% of
           a phone screen: ~290px, of which ~250px was usable. That is what
           pushed the difficulty segments, the ingredient rows and the tag
           field out past its edge. */
        className="studio-sheet !w-full gap-0 p-0 sm:!max-w-xl lg:!max-w-3xl xl:!max-w-4xl"
        style={{ backgroundColor: "var(--cs-surface-1)" }}
        onInteractOutside={(e) => {
          // A half-finished recipe is expensive to retype. Clicking the
          // scrim is far too easy to do by accident for something that
          // discards work, so dismissal is deliberate: the close button or
          // Escape.
          if (isSubmitting) e.preventDefault();
        }}
      >
        <SheetHeader
          /* Sides are set individually rather than through `px-*`: the
             close button is absolutely positioned in this corner, so the
             right gutter has to hold at every width — an `sm:px-5` would
             win over a `pr-14` and put the description back underneath it.
             The description is the record's own title, which is arbitrary
             text, so it wraps and breaks rather than widening the panel. */
          className="shrink-0 py-4 pl-4 pr-14 sm:pl-5"
          style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
        >
          <SheetTitle className="ui-subheading text-foreground">{title}</SheetTitle>
          {description && (
            <SheetDescription
              className="ui-caption break-words"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* `min-w-0`: this is a flex child, and without it a stubborn row
            inside the form would set the panel's width instead of being
            made to fit inside it. */}
        <div className="scroll-panel min-w-0 flex-1 px-4 py-4 sm:px-5">
          <DeferredContent>{children}</DeferredContent>
        </div>

        <div
          className="flex items-center justify-end gap-2 px-4 py-3 shrink-0 sm:px-5"
          style={{
            borderTop: "1px solid var(--cs-border-subtle)",
            backgroundColor: "var(--cs-surface-2)",
            // On a phone with a home indicator the sheet runs to the
            // physical bottom edge, which would otherwise put Save right
            // under the gesture bar.
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          }}
        >
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-lg text-sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="h-9 rounded-lg text-sm px-5"
          >
            {isSubmitting ? "Saving…" : submitLabel}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
