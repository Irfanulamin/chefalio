"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WarningIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * The one destructive confirmation in the studio.
 *
 * Deletion already went through an AlertDialog, but a fresh one was
 * constructed inside every row's action cell — a hundred recipes meant a
 * hundred dialog subtrees mounted behind a hundred triggers, all identical
 * except for a title. This is a single controlled instance the page opens
 * with the target row.
 *
 * The styling matters as much as the structure: the old confirm button was
 * `bg-red-500 hover:bg-red-600` with `hover:bg-red-50` on the trigger. Those
 * are light-mode literals — in dark mode a pale red-50 wash lit up behind
 * the trash icon on a near-black row. It now draws from the danger triplet,
 * which is restated per theme.
 *
 * Apple's guidance is that confirmation is for the genuinely irreversible;
 * this qualifies, and it earns its interruption by naming the exact thing
 * being destroyed rather than asking "are you sure?".
 */
export function DeleteDialog({
  open,
  onOpenChange,
  /** What kind of thing — "recipe", "cookbook". Lowercase. */
  kind,
  name,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: string;
  name: string | undefined;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="rounded-2xl sm:max-w-md"
        style={{
          backgroundColor: "var(--cs-surface-1)",
          border: "1px solid var(--cs-border-subtle)",
        }}
      >
        <AlertDialogHeader>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full mb-1"
            style={{
              backgroundColor: "var(--cs-danger-bg)",
              border: "1px solid var(--cs-danger-edge)",
            }}
          >
            <WarningIcon size={17} weight="fill" style={{ color: "var(--cs-danger-fg)" }} />
          </div>
          <AlertDialogTitle
            className="text-base font-semibold tracking-[-0.01em]"
            style={{ color: "var(--cs-text-primary)" }}
          >
            Delete this {kind}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
            <span className="font-medium" style={{ color: "var(--cs-text-primary)" }}>
              {name ?? `This ${kind}`}
            </span>{" "}
            will be permanently removed. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="rounded-lg h-9 mt-0"
            style={{
              border: "1px solid var(--cs-border-default)",
              backgroundColor: "var(--cs-surface-2)",
              color: "var(--cs-text-primary)",
            }}
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              // Keep the dialog up while the request is in flight, so the
              // button can say "Deleting…" instead of the row vanishing from
              // under a modal that already closed.
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="rounded-lg h-9 text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "var(--cv-critical)" }}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
