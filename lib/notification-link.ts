import type { AppNotification } from "@/types/notification.type";

/**
 * Where a notification goes when you press it.
 *
 * Notifications carried a `targetId` from the day they were introduced but
 * nothing ever read it, so the tray announced things you then had to go
 * and find by hand.
 *
 * A `discount` notification is about the catalogue rather than one book,
 * so it lands on the list. Anything whose target has been deleted returns
 * `null` and is rendered as plain text — the backend removes those on
 * delete, but a client holding a stale copy must not offer a link to a
 * page that will 404.
 */
export function notificationHref(n: AppNotification): string | null {
  switch (n.type) {
    case "new_recipe":
      return n.targetId ? `/recipes/${n.targetId}` : null;
    /* Cookbooks have no detail page — the checkout screen *is* the
       product page, carrying the cover, blurb, author and price. */
    case "new_cookbook":
      return n.targetId ? `/purchase-cookbook/${n.targetId}` : null;
    case "discount":
      return "/cookbooks";
    default:
      return null;
  }
}
