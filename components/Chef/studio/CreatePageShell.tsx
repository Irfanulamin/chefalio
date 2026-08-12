"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

/**
 * The frame around a "create" page.
 *
 * Editing an existing record happens in a sheet, because you arrived from a
 * row and you're going back to it. Creating one gets a page, because you're
 * not coming back from anywhere — there's no context worth preserving
 * behind a panel. The two should still feel like the same editor, and this
 * is what makes them: same card rhythm, same pinned footer, same submit.
 *
 * Two things it fixes about the old create pages.
 *
 * They ran at `max-w-7xl` — an 80rem measure for a single column of form
 * fields, so a title input stretched most of a desktop display and the eye
 * had to travel the width of the screen between a label and its own error
 * text. Forms are read one field at a time; this caps at a measure you can
 * actually scan.
 *
 * And the submit button sat at the very end of the scroll. On a recipe —
 * three images, a tag picker and an open-ended list of steps — "Publish"
 * was a destination you had to travel to. It's now pinned, in the same
 * translucent material the sheet's footer uses, so the action is available
 * from wherever you happen to be in the form.
 */
export function CreatePageShell({
  title,
  description,
  backHref,
  backLabel,
  formId,
  isSubmitting,
  submitLabel,
  children,
}: {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  /** The `<form id>` the pinned footer submits. */
  formId: string;
  isSubmitting: boolean;
  submitLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 h-8 -ml-2 px-2 rounded-lg text-sm transition-[background-color,transform] duration-150 hover:bg-[var(--cs-hover)] active:scale-[0.98]"
        style={{ color: "var(--cs-text-tertiary)" }}
      >
        <ArrowLeftIcon size={14} weight="bold" />
        {backLabel}
      </Link>

      <header className="mt-3 mb-5">
        {/* Large text takes negative tracking; the body line below it
            doesn't. One letter-spacing value for both would be wrong for
            one of them. */}
        <h1
          className="text-2xl font-semibold tracking-[-0.022em]"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--cs-text-secondary)" }}>
          {description}
        </p>
      </header>

      {children}

      {/* Pinned action bar. It clears the sidebar on desktop and spans the
          viewport on phones, and it's translucent so the form visibly
          continues underneath rather than being cut off by a solid strip. */}
      <div
        className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-end gap-2 px-4 md:px-6 py-3"
        style={{
          backgroundColor: "var(--cs-material-regular)",
          backdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
          WebkitBackdropFilter: "blur(var(--cs-material-blur)) saturate(180%)",
          borderTop: "1px solid var(--cs-border-subtle)",
        }}
      >
        <Link href={backHref}>
          <Button type="button" variant="outline" className="h-9 rounded-lg text-sm">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          form={formId}
          disabled={isSubmitting}
          className="h-9 rounded-lg text-sm px-5"
        >
          {isSubmitting ? "Publishing…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
