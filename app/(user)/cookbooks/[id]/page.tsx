import { redirect } from "next/navigation";

/**
 * Cookbooks no longer have a separate detail page.
 *
 * It was a second product page: the same cover, blurb, author and price
 * the checkout screen already shows, with a "Buy now" whose only job was
 * to send you one click further on. Two screens describing one thing, and
 * the first of them existed purely to be left.
 *
 * This stays as a redirect rather than being deleted outright because the
 * old address is already out in the world — in notifications, in browser
 * history, in anything anyone shared. Deleting the route would turn every
 * one of those into a 404; redirecting retires the page without breaking
 * the links to it.
 */
export default async function CookbookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/purchase-cookbook/${id}`);
}
