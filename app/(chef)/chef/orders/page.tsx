"use client";

import { useState } from "react";
import {
  useChefOrders,
  useUpdateOrderStatus,
  PaymentStatus,
} from "@/hooks/useChefs";
import { Button } from "@/components/ui/button";
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowsClockwiseIcon,
  MagnifyingGlassIcon,
  ReceiptIcon,
  CaretDownIcon,
  PackageIcon,
} from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    icon: ClockIcon,
  },
  paid: {
    label: "Paid",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircleIcon,
  },
  shipped: {
    label: "Shipped",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    icon: TruckIcon,
  },
  delivered: {
    label: "Delivered",
    className:
      "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10",
    icon: PackageIcon,
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    icon: XCircleIcon,
  },
  refunded: {
    label: "Refunded",
    className:
      "bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    icon: ArrowsClockwiseIcon,
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as PaymentStatus[];
const UPDATABLE: ("shipped" | "delivered")[] = ["shipped", "delivered"];

function StatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${cfg.className}`}
    >
      <Icon size={11} weight="fill" />
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<PaymentStatus | "all">("all");

  const countByStatus = ALL_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.paymentStatus === s).length }),
    {} as Record<PaymentStatus, number>,
  );

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
          toast.success(`Order marked as ${paymentStatus}.`, {
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
      <title>Orders – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-foreground">Orders</h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
              {isFetching && (
                <span className="ml-2 text-xs text-zinc-400">Refreshing…</span>
              )}
            </p>
          </div>

          {/* Summary pills */}
          {!isLoading && orders.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ALL_STATUSES.filter((s) => countByStatus[s] > 0).map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <span
                    key={s}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${cfg.className}`}
                  >
                    {cfg.label}{" "}
                    <span className="font-bold">{countByStatus[s]}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by cookbook, email, name…"
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-zinc-400"
            />
          </div>

          <div className="flex gap-0.5 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 w-fit overflow-x-auto">
            {FILTER_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={[
                  "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                  activeFilter === value
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                    : "text-zinc-400 hover:text-foreground",
                ].join(" ")}
              >
                {label}
                {value !== "all" && countByStatus[value as PaymentStatus] > 0 && (
                  <span className="ml-1.5 text-[10px] font-bold text-primary">
                    {countByStatus[value as PaymentStatus]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-2.5 pl-4 pr-3 text-left"><Skeleton className="h-3 w-16" /></th>
                  <th className="py-2.5 px-3 text-left hidden md:table-cell"><Skeleton className="h-3 w-16" /></th>
                  <th className="py-2.5 px-3 text-left hidden lg:table-cell"><Skeleton className="h-3 w-24" /></th>
                  <th className="py-2.5 px-3 text-right hidden sm:table-cell"><Skeleton className="h-3 w-12 ml-auto" /></th>
                  <th className="py-2.5 px-3 text-left"><Skeleton className="h-3 w-12" /></th>
                  <th className="py-2.5 pl-3 pr-4" />
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/60 last:border-0">
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-14 rounded-lg shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-36" />
                          <Skeleton className="h-2.5 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <Skeleton className="h-3 w-40" />
                    </td>
                    <td className="py-3 px-3 hidden lg:table-cell">
                      <Skeleton className="h-3 w-44" />
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell text-right">
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </td>
                    <td className="py-3 px-3">
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </td>
                    <td className="py-3 pl-3 pr-4 text-right">
                      <Skeleton className="h-7 w-16 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 py-16 flex flex-col items-center gap-3 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <PackageIcon size={20} className="text-zinc-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {search || activeFilter !== "all"
                  ? "No orders match your filter"
                  : "No orders yet"}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {search || activeFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Orders appear here when customers purchase your cookbooks"}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-2.5 pl-4 pr-3 text-left text-xs font-medium text-zinc-400">
                    Cookbook
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-zinc-400 hidden md:table-cell">
                    Customer
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-zinc-400 hidden lg:table-cell">
                    Shipping Address
                  </th>
                  <th className="py-2.5 px-3 text-right text-xs font-medium text-zinc-400 hidden sm:table-cell">
                    Amount
                  </th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-zinc-400">
                    Status
                  </th>
                  <th className="py-2.5 pl-3 pr-4 text-right text-xs font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const canUpdate =
                    order.paymentStatus === "paid" ||
                    order.paymentStatus === "shipped";
                  return (
                    <tr
                      key={order._id}
                      className="border-b border-zinc-50 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-3 pl-4 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                            <Image
                              src={order.cookbookImage}
                              alt={order.cookbookTitle}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                              {order.cookbookTitle}
                            </p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-xs text-zinc-500">
                          <ReceiptIcon size={11} className="shrink-0" />
                          <span className="truncate max-w-[160px]">
                            {order.receiptEmail}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 hidden lg:table-cell">
                        {order.billingAddress?.name ? (
                          <p className="text-xs text-zinc-400 truncate max-w-[180px]">
                            {order.billingAddress.name},{" "}
                            {[
                              order.billingAddress.city,
                              order.billingAddress.state,
                              order.billingAddress.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        ) : (
                          <span className="text-xs text-zinc-300 dark:text-zinc-600">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 hidden sm:table-cell text-right">
                        <span className="text-sm font-semibold text-foreground tabular-nums">
                          ${order.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge
                          status={order.paymentStatus as PaymentStatus}
                        />
                      </td>
                      <td className="py-3 pl-3 pr-4 text-right">
                        {canUpdate && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 text-xs rounded-lg border-zinc-200 dark:border-zinc-700 px-2.5"
                                disabled={isUpdating}
                              >
                                Update
                                <CaretDownIcon size={10} weight="bold" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl w-36"
                            >
                              {UPDATABLE.filter(
                                (s) =>
                                  s !== order.paymentStatus &&
                                  !(
                                    order.paymentStatus === "paid" &&
                                    s === "delivered"
                                  ),
                              ).map((s) => {
                                const cfg = STATUS_CONFIG[s];
                                const Icon = cfg.icon;
                                return (
                                  <DropdownMenuItem
                                    key={s}
                                    onClick={() =>
                                      handleUpdateStatus(order._id, s)
                                    }
                                    className="gap-2 cursor-pointer rounded-lg text-xs"
                                  >
                                    <Icon size={13} weight="fill" />
                                    Mark as {cfg.label}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
