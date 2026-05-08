"use client";

import { useState } from "react";
import { useAdminOrders } from "@/hooks/useAdmin";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import {
  MagnifyingGlassIcon,
  ShoppingCartSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  paid: CheckCircleIcon,
  pending: ClockIcon,
  failed: XCircleIcon,
};

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { orders, pagination, isLoading, isFetching } = useAdminOrders({
    page,
    limit: 20,
    search: debouncedSearch,
    status: statusFilter,
  });

  const totalPages = pagination?.totalPages ?? 1;

  return (
    <>
      <title>Orders – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Orders</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {pagination?.total ?? 0} total orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-52">
            <MagnifyingGlassIcon
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by cookbook title or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {STATUS_FILTERS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => {
                setStatusFilter(value);
                setPage(1);
              }}
              className={[
                "px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors shrink-0",
                statusFilter === value
                  ? "bg-primary text-black border-primary"
                  : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className={[
            "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-opacity duration-150",
            isFetching ? "opacity-60" : "",
          ].join(" ")}
        >
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3">
                      <Skeleton className="h-3 w-16" />
                    </th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">
                      <Skeleton className="h-3 w-12" />
                    </th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">
                      <Skeleton className="h-3 w-10" />
                    </th>
                    <th className="text-left px-4 py-3">
                      <Skeleton className="h-3 w-12" />
                    </th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">
                      <Skeleton className="h-3 w-16" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-md shrink-0" />
                          <Skeleton className="h-3.5 w-40" />
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Skeleton className="h-3 w-36" />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Skeleton className="h-3 w-12" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <Skeleton className="h-3 w-20" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-zinc-400">
              <ShoppingCartSimpleIcon size={24} />
              <p className="text-sm">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Cookbook
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:table-cell">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden md:table-cell">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wide hidden lg:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {orders.map((order) => {
                    const StatusIcon =
                      STATUS_ICONS[order.paymentStatus] ?? ClockIcon;
                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
                              {order.cookbookImage && (
                                <Image
                                  src={order.cookbookImage}
                                  alt={order.cookbookTitle}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              )}
                            </div>
                            <span className="font-medium text-foreground truncate max-w-48 text-sm">
                              {order.cookbookTitle}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-zinc-500 truncate max-w-48 block">
                            {order.receiptEmail}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm font-medium text-foreground tabular-nums">
                            ${order.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={[
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                              STATUS_STYLES[order.paymentStatus] ??
                                "bg-zinc-100 text-zinc-500",
                            ].join(" ")}
                          >
                            <StatusIcon size={11} weight="fill" />
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-zinc-400 tabular-nums">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-zinc-400">
              Page {page} of {totalPages} · {pagination?.total ?? 0} orders
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretLeftIcon size={12} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretRightIcon size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
