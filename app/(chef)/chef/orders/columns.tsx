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
  { label: string; style: { backgroundColor: string; color: string; border: string }; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    style: { backgroundColor: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" },
    icon: ClockIcon,
  },
  paid: {
    label: "Paid",
    style: { backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" },
    icon: CheckCircleIcon,
  },
  shipped: {
    label: "Shipped",
    style: { backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
    icon: TruckIcon,
  },
  delivered: {
    label: "Delivered",
    style: { backgroundColor: "var(--cs-accent-muted)", color: "var(--cs-accent)", border: "1px solid rgba(167,209,41,0.3)" },
    icon: PackageIcon,
  },
  failed: {
    label: "Failed",
    style: { backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" },
    icon: XCircleIcon,
  },
  refunded: {
    label: "Refunded",
    style: { backgroundColor: "var(--cs-surface-3)", color: "var(--cs-text-secondary)", border: "1px solid var(--cs-border-subtle)" },
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
        <span className="text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Cookbook</span>
      ),
      cell: ({ row }) => {
        const o = row.original
        return (
          <div className="flex items-center gap-3">
            <div
              className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0"
              style={{ backgroundColor: "var(--cs-surface-3)" }}
            >
              <Image src={o.cookbookImage} alt={o.cookbookTitle} fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[180px]" style={{ color: "var(--cs-text-primary)" }}>{o.cookbookTitle}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
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
        <span className="text-xs font-medium hidden md:block" style={{ color: "var(--cs-text-tertiary)" }}>Customer</span>
      ),
      cell: ({ row }) => (
        <div className="hidden md:flex items-center gap-1 text-xs" style={{ color: "var(--cs-text-secondary)" }}>
          <ReceiptIcon size={11} className="shrink-0" />
          <span className="truncate max-w-[160px]">{row.original.receiptEmail}</span>
        </div>
      ),
    },
    {
      id: "address",
      header: () => (
        <span className="text-xs font-medium hidden lg:block" style={{ color: "var(--cs-text-tertiary)" }}>Shipping</span>
      ),
      cell: ({ row }) => {
        const addr = row.original.billingAddress
        return addr?.name ? (
          <p className="text-xs truncate max-w-[180px] hidden lg:block" style={{ color: "var(--cs-text-tertiary)" }}>
            {addr.name},{" "}
            {[addr.city, addr.state, addr.country].filter(Boolean).join(", ")}
          </p>
        ) : (
          <span className="text-xs hidden lg:block" style={{ color: "var(--cs-text-tertiary)" }}>—</span>
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
        <span className="hidden sm:block text-sm font-semibold tabular-nums text-right" style={{ color: "var(--cs-text-primary)" }}>
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <span className="text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Status</span>
      ),
      cell: ({ row }) => {
        const s = row.original.paymentStatus as PaymentStatus
        const cfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.pending
        const Icon = cfg.icon
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
            style={cfg.style}
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
                  className="h-7 gap-1 text-xs rounded-lg px-2.5"
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
