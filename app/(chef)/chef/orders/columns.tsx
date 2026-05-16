"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowsClockwiseIcon,
  ReceiptIcon,
  CaretDownIcon,
  PackageIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { ChefOrder, PaymentStatus } from "@/types/chef-dashboard.type"

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
    className: "bg-primary/5 text-primary border-primary/20 dark:bg-primary/10",
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
}

const UPDATABLE: ("shipped" | "delivered")[] = ["shipped", "delivered"]

export function createChefOrderColumns({
  onUpdateStatus,
  isUpdating,
}: {
  onUpdateStatus: (id: string, status: "shipped" | "delivered") => void
  isUpdating: boolean
}): ColumnDef<ChefOrder, unknown>[] {
  return [
    {
      id: "cookbook",
      header: () => (
        <span className="text-xs font-medium text-zinc-400">Cookbook</span>
      ),
      cell: ({ row }) => {
        const o = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
              <Image src={o.cookbookImage} alt={o.cookbookTitle} fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{o.cookbookTitle}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {new Date(o.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      id: "customer",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 hidden md:block">Customer</span>
      ),
      cell: ({ row }) => (
        <div className="hidden md:flex items-center gap-1 text-xs text-zinc-500">
          <ReceiptIcon size={11} className="shrink-0" />
          <span className="truncate max-w-[160px]">{row.original.receiptEmail}</span>
        </div>
      ),
    },
    {
      id: "address",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 hidden lg:block">Shipping</span>
      ),
      cell: ({ row }) => {
        const addr = row.original.billingAddress
        return addr?.name ? (
          <p className="text-xs text-zinc-400 truncate max-w-[180px] hidden lg:block">
            {addr.name},{" "}
            {[addr.city, addr.state, addr.country].filter(Boolean).join(", ")}
          </p>
        ) : (
          <span className="text-xs text-zinc-300 dark:text-zinc-600 hidden lg:block">—</span>
        )
      },
    },
    {
      id: "amount",
      accessorKey: "price",
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden sm:block text-right">
          <SortableHeader column={column} title="Amount" className="justify-end" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="hidden sm:block text-sm font-semibold text-foreground tabular-nums text-right">
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <span className="text-xs font-medium text-zinc-400">Status</span>
      ),
      cell: ({ row }) => {
        const s = row.original.paymentStatus as PaymentStatus
        const cfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.pending
        const Icon = cfg.icon
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${cfg.className}`}
          >
            <Icon size={11} weight="fill" />
            {cfg.label}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const s = row.original.paymentStatus as PaymentStatus
        const canUpdate = s === "paid" || s === "shipped"
        if (!canUpdate) return null
        return (
          <div className="flex justify-end">
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
              <DropdownMenuContent align="end" className="rounded-xl w-36">
                {UPDATABLE.filter(
                  (next) =>
                    next !== s &&
                    !(s === "paid" && next === "delivered"),
                ).map((next) => {
                  const cfg = STATUS_CONFIG[next]
                  const Icon = cfg.icon
                  return (
                    <DropdownMenuItem
                      key={next}
                      onClick={() => onUpdateStatus(row.original._id, next)}
                      className="gap-2 cursor-pointer rounded-lg text-xs"
                    >
                      <Icon size={13} weight="fill" />
                      Mark as {cfg.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
