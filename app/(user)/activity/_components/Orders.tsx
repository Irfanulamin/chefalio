"use client";

import {
  BookmarkSimpleIcon,
  ChefHatIcon,
} from "@phosphor-icons/react/dist/ssr";
import { usePurchaseHistory } from "@/hooks/useCookbook";
import {
  CompactPurchaseCard,
  CompactPurchaseCardSkeleton,
} from "@/components/User/Recipe/CompactPaymentHistory";

export default function OrdersSection() {
  const { purchaseHistory, isLoading, isFetching, error } =
    usePurchaseHistory();

  if (isLoading || isFetching) {
    return (
      <section>
        <div className="rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/40">
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
        <div className="rounded-2xl border border-border/40 bg-muted/20 px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/20 mb-4">
            <ChefHatIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold mb-1">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t load your orders. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (
    !purchaseHistory ||
    !Array.isArray(purchaseHistory.data) ||
    purchaseHistory.data.length === 0
  ) {
    return (
      <div className="rounded-2xl border border-border/40 bg-background px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/20 mb-5">
          <BookmarkSimpleIcon className="w-7 h-7 text-muted-foreground/50" />
        </div>
        <h3 className="text-base font-semibold mb-2">No orders yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Your past orders will appear here once you make a purchase.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/40 shadow-sm">
        {Array.isArray(purchaseHistory?.data) &&
          purchaseHistory.data.map((order) => {
            return <CompactPurchaseCard key={order._id} purchase={order} />;
          })}
      </div>
    </>
  );
}
