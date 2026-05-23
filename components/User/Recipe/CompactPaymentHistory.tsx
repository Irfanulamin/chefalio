"use client";

import {
  BookOpenIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  HashStraightIcon,
  MapPinIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

export interface BillingAddress {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Purchase {
  _id: string;
  cookbookId: string;
  buyerId: string;
  cookbookTitle: string;
  chefId: string;
  cookbookImage?: string;
  price: number;
  stripeSessionId?: string;
  paymentStatus: "paid" | "pending" | "failed";
  billingAddress?: BillingAddress;
  receiptEmail?: string;
  createdAt: string;
  updatedAt?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
  },
  paid: {
    label: "Paid",
    className:
      "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-950/40 dark:text-green-300 dark:ring-green-900",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900",
  },
  refunded: {
    label: "Refunded",
    className:
      "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:ring-purple-900",
  },
  shipped: {
    label: "Shipped",
    className:
      "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900",
  },
  delivered: {
    label: "Delivered",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
  },
} as const;

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function getRelativeTime(iso: string): string {
  const now = new Date();
  const past = new Date(iso);
  const diff = now.getTime() - past.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const CompactPurchaseCardSkeleton = () => {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 animate-pulse"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        borderBottom: "1px solid var(--cs-border-subtle)",
      }}
    >
      <div
        className="shrink-0 w-16 h-16 rounded-lg"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-40 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
          <div className="h-4 w-12 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
        </div>
        <div className="h-3 w-28 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
        <div className="flex gap-3">
          <div className="h-3 w-16 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
          <div className="h-3 w-20 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
        </div>
      </div>
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

export const CompactPurchaseCard = ({ purchase }: { purchase: Purchase }) => {
  const status =
    statusConfig[purchase.paymentStatus as keyof typeof statusConfig];
  const initials = getInitials(purchase.billingAddress?.name);
  const shortId = purchase._id.slice(-8).toUpperCase();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 transition-opacity duration-150 hover:opacity-90"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        borderBottom: "1px solid var(--cs-border-subtle)",
      }}
    >
      {/* Thumbnail */}
      <div
        className="shrink-0 w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        {purchase.cookbookImage ? (
          <Image
            src={purchase.cookbookImage}
            alt={purchase.cookbookTitle ?? "Cookbook image"}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <BookOpenIcon
            className="w-5 h-5"
            style={{ color: "var(--cs-text-tertiary)" }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {/* Title + Status badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {purchase.cookbookTitle ?? "Untitled Cookbook"}
          </p>
          {status && (
            <span
              className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap ${status.className}`}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Buyer */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold shrink-0"
            style={{
              backgroundColor: "var(--cs-surface-3)",
              color: "var(--cs-text-secondary)",
            }}
          >
            {initials.charAt(0)}
          </span>
          <span
            className="text-xs truncate capitalize"
            style={{ color: "var(--cs-text-secondary)" }}
          >
            {purchase.billingAddress?.name ?? "Unknown buyer"}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1 text-[11px]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <CurrencyDollarIcon className="w-3.5 h-3.5" style={{ color: "var(--cs-accent)" }} />
            {formatPrice(purchase.price)}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[11px]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <HashStraightIcon className="w-3.5 h-3.5" />
            {shortId}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[11px]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            {formatDate(purchase.createdAt)} · {getRelativeTime(purchase.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
