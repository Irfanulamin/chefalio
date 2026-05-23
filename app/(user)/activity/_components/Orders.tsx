"use client";

import { PackageIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { usePurchaseHistory } from "@/hooks/useCookbook";
import {
  CompactPurchaseCard,
  CompactPurchaseCardSkeleton,
} from "@/components/User/Recipe/CompactPaymentHistory";

export default function OrdersSection() {
  const { purchaseHistory, isLoading, isFetching, error } = usePurchaseHistory();

  if (isLoading || isFetching) {
    return (
      <section>
        <div
          className="rounded-2xl overflow-hidden divide-y"
          style={{ border: "1px solid var(--cs-border-subtle)" }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <CompactPurchaseCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{
            border: "1px solid var(--cs-border-subtle)",
            backgroundColor: "var(--cs-surface-2)",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
            style={{ backgroundColor: "var(--cs-surface-3)" }}
          >
            <WarningCircleIcon size={22} style={{ color: "var(--cs-text-tertiary)" }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: "var(--cs-text-primary)" }}>
            Something went wrong
          </h3>
          <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
            We couldn&apos;t load your orders. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (!purchaseHistory || !Array.isArray(purchaseHistory.data) || purchaseHistory.data.length === 0) {
    return (
      <div
        className="rounded-2xl px-8 py-16 text-center"
        style={{
          border: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-1)",
        }}
      >
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{ backgroundColor: "var(--cs-surface-3)" }}
        >
          <PackageIcon size={24} style={{ color: "var(--cs-text-tertiary)" }} />
        </div>
        <h3 className="text-base font-semibold mb-2" style={{ color: "var(--cs-text-primary)" }}>
          No orders yet
        </h3>
        <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--cs-text-secondary)" }}>
          Your past orders will appear here once you make a purchase.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--cs-border-subtle)" }}
    >
      {purchaseHistory.data.map((order) => (
        <CompactPurchaseCard key={order._id} purchase={order} />
      ))}
    </div>
  );
}
