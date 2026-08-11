"use client";

import {
  BookOpenIcon,
  CalendarIcon,
  HashStraightIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/User/shared/StatusPill";
import { orderTone } from "@/lib/recipe-display";

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

/**
 * Order status used to be a sixth colour system: Tailwind ring utilities
 * across amber / green / red / purple / blue / emerald, with hand-written
 * dark variants for each. Two of those six (emerald "Delivered" and green
 * "Paid") were indistinguishable in practice, and none of them matched
 * the status colours anywhere else in the app. They all route through the
 * shared status tokens now.
 */
const STATUS_LABEL: Record<string, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
  shipped: "Shipped",
  delivered: "Delivered",
};

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
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}

export const CompactPurchaseCardSkeleton = () => {
  return (
    <div className="ui-row flex items-center gap-4 px-4 py-3">
      <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-12 rounded-lg" />
        </div>
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
};

export const CompactPurchaseCard = ({ purchase }: { purchase: Purchase }) => {
  const label = STATUS_LABEL[purchase.paymentStatus] ?? purchase.paymentStatus;
  const shortId = purchase._id.slice(-8).toUpperCase();

  return (
    <article className="ui-row flex items-center gap-3 px-4 py-3">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{ backgroundColor: "var(--cs-surface-3)" }}
      >
        {purchase.cookbookImage ? (
          <Image
            src={purchase.cookbookImage}
            alt=""
            width={64}
            height={64}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <BookOpenIcon
            className="h-5 w-5"
            style={{ color: "var(--cs-text-tertiary)" }}
            aria-hidden
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className="ui-subheading truncate"
            style={{ color: "var(--cs-text-primary)" }}
          >
            {purchase.cookbookTitle ?? "Untitled cookbook"}
          </h3>
          <StatusPill tone={orderTone(purchase.paymentStatus)}>{label}</StatusPill>
        </div>

        {/* The price is what someone scans an order list for, so it gets
            the primary text colour and the other metadata recedes. */}
        <p
          className="ui-subheading ui-numeric"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {formatPrice(purchase.price)}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className="ui-micro ui-numeric inline-flex items-center gap-1"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <HashStraightIcon className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">Order reference </span>
            {shortId}
          </span>
          <span
            className="ui-micro inline-flex items-center gap-1"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <CalendarIcon className="h-3.5 w-3.5" aria-hidden />
            <time dateTime={purchase.createdAt}>
              {formatDate(purchase.createdAt)}
            </time>
            <span aria-hidden>· {getRelativeTime(purchase.createdAt)}</span>
          </span>
        </div>
      </div>
    </article>
  );
};
