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
 * The one destructive-confirmation pattern for the whole product — chef
 * studio and the admin console both delete recipes, cookbooks, and users
 * through this, not five near-identical `AlertDialog`s each hand-rolled per
 * table with their own hover colours.
 *
 * A single controlled instance the page opens with the target row, rather
 * than a dialog mounted inside every action cell — a hundred rows meant a
 * hundred dialog subtrees otherwise.
 *
 * The styling matters as much as the structure: the confirm button used to
 * be `bg-red-500 hover:bg-red-600` with `hover:bg-red-50` on the trigger
 * elsewhere in the app. Those are light-mode literals — in dark mode a pale
 * red-50 wash lit up behind the trash icon on a near-black row. It draws
 * from the danger triplet and `--cv-critical` instead, both restated per
 * theme.
 *
 * Apple's guidance is that confirmation is for the genuinely irreversible;
 * this qualifies, and it earns its interruption by naming the exact thing
 * being destroyed rather than asking "are you sure?".
 */
export function DeleteDialog({
  open,
  onOpenChange,
  /** What kind of thing — "recipe", "cookbook", "user". Lowercase. */
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
          <AlertDialogTitle className="ui-subheading text-foreground">
            Delete this {kind}?
          </AlertDialogTitle>
          <AlertDialogDescription className="ui-caption" style={{ color: "var(--cs-text-secondary)" }}>
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
