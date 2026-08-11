"use client";

import { PackageIcon } from "@phosphor-icons/react/dist/ssr";
import { usePurchaseHistory } from "@/hooks/useCookbook";
import {
  CompactPurchaseCard,
  CompactPurchaseCardSkeleton,
} from "@/components/User/Recipe/CompactPaymentHistory";
import { AsyncSection } from "@/components/User/shared/AsyncSection";

export default function OrdersSection() {
  const { purchaseHistory, isLoading, error } = usePurchaseHistory();
  const orders = Array.isArray(purchaseHistory?.data) ? purchaseHistory.data : [];

  return (
    <AsyncSection
      loading={isLoading}
      error={error}
      isEmpty={orders.length === 0}
      errorSubject="your orders"
      skeleton={Array.from({ length: 3 }).map((_, i) => (
        <CompactPurchaseCardSkeleton key={i} />
      ))}
      empty={{
        icon: <PackageIcon size={24} />,
        title: "No orders yet",
        description:
          "Cookbooks you buy show up here with their receipts, and stay available to read.",
        action: { label: "Browse cookbooks", href: "/cookbooks" },
      }}
    >
      {orders.map((order) => (
        <CompactPurchaseCard key={order._id} purchase={order} />
      ))}
    </AsyncSection>
  );
}
