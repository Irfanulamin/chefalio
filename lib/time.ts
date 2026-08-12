/**
 * Relative timestamps, in one place.
 *
 * The notification tray and the right rail both render "3h ago" against
 * the same data, and a second copy of this would be a second place for
 * the thresholds to drift.
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();

  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;

  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;

  return `${Math.floor(h / 24)}d ago`;
}
