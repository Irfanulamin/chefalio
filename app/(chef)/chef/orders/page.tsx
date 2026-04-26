"use client";

import { useState } from "react";
import {
  useChefOrders,
  useUpdateOrderStatus,
  PaymentStatus,
} from "@/hooks/useChefs";
import { Button } from "@/components/ui/button";
import {
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowsClockwiseIcon,
  MagnifyingGlassIcon,
  ReceiptIcon,
  CaretDownIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { GridLoader } from "@/components/ui/GridLoading";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    icon: ClockIcon,
  },
  paid: {
    label: "Paid",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    icon: CheckCircleIcon,
  },
  shipped: {
    label: "Shipped",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    icon: TruckIcon,
  },
  delivered: {
    label: "Delivered",
    color: "text-primary",
    bg: "bg-primary/5 border-primary/20",
    icon: PackageIcon,
  },
  failed: {
    label: "Failed",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    icon: XCircleIcon,
  },
  refunded: {
    label: "Refunded",
    color: "text-zinc-500",
    bg: "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700",
    icon: ArrowsClockwiseIcon,
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as PaymentStatus[];
const UPDATABLE_STATUSES: ("shipped" | "delivered")[] = [
  "shipped",
  "delivered",
];

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}
    >
      <Icon size={12} weight="fill" />
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Summary cards ────────────────────────────────────────────────────────────

function SummaryCard({
  status,
  count,
}: {
  status: PaymentStatus;
  count: number;
}) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-3 ${cfg.bg}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 dark:bg-black/30 ${cfg.color}`}
      >
        <Icon size={18} weight="fill" />
      </span>
      <div>
        <p className={`text-xl font-bold leading-none ${cfg.color}`}>{count}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{cfg.label}</p>
      </div>
    </div>
  );
}

// ─── Order row ────────────────────────────────────────────────────────────────

function OrderRow({
  order,
  onUpdateStatus,
  isUpdating,
}: {
  order: ReturnType<typeof useChefOrders>["orders"][number];
  onUpdateStatus: (id: string, status: "shipped" | "delivered") => void;
  isUpdating: boolean;
}) {
  const canUpdate =
    order.paymentStatus === "paid" || order.paymentStatus === "shipped";

  return (
    <div className="rounded-xl border border-border/60 bg-white dark:bg-zinc-900 p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Cookbook image + info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="relative h-14 w-20 rounded-lg overflow-hidden shrink-0 border border-border/40">
            <Image
              src={order.cookbookImage}
              alt={order.cookbookTitle}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground line-clamp-1">
              {order.cookbookTitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ReceiptIcon size={11} />
                {order.receiptEmail}
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ${order.price.toFixed(2)}
              </span>
            </div>

            {/* Billing address */}
            {order.billingAddress?.name && (
              <p className="text-xs text-muted-foreground mt-1">
                📦 {order.billingAddress.name} —{" "}
                {[
                  order.billingAddress.address,
                  order.billingAddress.city,
                  order.billingAddress.state,
                  order.billingAddress.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}

            <p className="text-[11px] text-muted-foreground mt-1.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Status + actions */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-3 shrink-0">
          <StatusBadge status={order.paymentStatus as PaymentStatus} />

          {canUpdate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg text-xs"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <GridLoader label="Updating status..." />
                  ) : (
                    <>
                      Update Status
                      <CaretDownIcon size={11} weight="bold" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl w-40">
                {UPDATABLE_STATUSES.filter(
                  (s) =>
                    s !== order.paymentStatus &&
                    !(order.paymentStatus === "paid" && s === "delivered"), // must ship first
                ).map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  const Icon = cfg.icon;
                  return (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => onUpdateStatus(order._id, s)}
                      className="flex items-center gap-2 cursor-pointer rounded-lg"
                    >
                      <Icon size={14} weight="fill" className={cfg.color} />
                      Mark as {cfg.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTER_TABS: { label: string; value: PaymentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Pending", value: "pending" },
  { label: "Refunded", value: "refunded" },
];

export default function ChefOrdersPage() {
  const { orders, isLoading, isFetching } = useChefOrders();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<PaymentStatus | "all">(
    "all",
  );

  // Count per status for summary
  const countByStatus = ALL_STATUSES.reduce(
    (acc, s) => ({
      ...acc,
      [s]: orders.filter((o) => o.paymentStatus === s).length,
    }),
    {} as Record<PaymentStatus, number>,
  );

  // Filter
  const filtered = orders.filter((o) => {
    const matchesFilter =
      activeFilter === "all" || o.paymentStatus === activeFilter;
    const matchesSearch =
      !search ||
      o.cookbookTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.receiptEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.billingAddress?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUpdateStatus = (
    purchaseId: string,
    paymentStatus: "shipped" | "delivered",
  ) => {
    updateStatus(
      { purchaseId, paymentStatus },
      {
        onSuccess: () =>
          toast.success(`Order marked as ${paymentStatus}!`, {
            position: "bottom-right",
          }),
        onError: () =>
          toast.error("Failed to update order status.", {
            position: "bottom-right",
          }),
      },
    );
  };

  return (
    <>
      <title>Orders – Chefalio Chef</title>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <PackageIcon size={20} weight="fill" className="text-primary" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Orders
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage cookbook purchases from your customers
              </p>
            </div>
          </div>
          {isFetching && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <GridLoader label="Refreshing orders..." />
            </div>
          )}
        </div>

        {/* Summary cards — only non-zero */}
        {!isLoading && orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ALL_STATUSES.filter((s) => countByStatus[s] > 0).map((s) => (
              <SummaryCard key={s} status={s} count={countByStatus[s]} />
            ))}
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by cookbook, email, name…"
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1 p-1 rounded-xl border border-border/60 bg-zinc-50 dark:bg-zinc-900 w-fit overflow-x-auto">
            {FILTER_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={[
                  "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                  activeFilter === value
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm border border-border/40"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {label}
                {value !== "all" &&
                  countByStatus[value as PaymentStatus] > 0 && (
                    <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                      {countByStatus[value as PaymentStatus]}
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <GridLoader label="Loading orders..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <PackageIcon
                size={26}
                weight="duotone"
                className="text-primary"
              />
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {search || activeFilter !== "all"
                  ? "No orders match your filter"
                  : "No orders yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search || activeFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Orders will appear here once customers purchase your cookbooks"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
