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

/**
 * Order status pills.
 *
 * Four of these were hardcoded Tailwind pastels — `#fffbeb` on `#b45309`,
 * `#f0fdf4` on `#15803d` and so on. Those are light-mode literals: in dark
 * mode a mint or butter-yellow chip stayed mint and butter-yellow, glowing
 * off a near-black row, which is most of why the column looked wrong.
 *
 * "Delivered" was worse than wrong — it put raw brand lime on a lime wash,
 * which measures about 1.7:1. The label was there but you couldn't read it.
 *
 * Each status is now a triplet from the theme (`bg` / `fg` / `edge`), all
 * three restated per theme in globals.css. The set also reads as a sequence
 * rather than six unrelated colours: waiting is amber, money cleared is
 * green, in transit is blue, and delivered — the end of the happy path —
 * is the brand lime, in the deepened step that is actually legible.
 */
type StatusStyle = { backgroundColor: string; color: string; border: string }

const triplet = (name: string): StatusStyle => ({
  backgroundColor: `var(--cs-${name}-bg)`,
  color: `var(--cs-${name}-fg)`,
  border: `1px solid var(--cs-${name}-edge)`,
})

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; style: StatusStyle; icon: React.ElementType }
> = {
  pending: { label: "Pending", style: triplet("warning"), icon: ClockIcon },
  paid: { label: "Paid", style: triplet("success"), icon: CheckCircleIcon },
  shipped: { label: "Shipped", style: triplet("info"), icon: TruckIcon },
  delivered: {
    label: "Delivered",
    style: {
      backgroundColor: "var(--cs-accent-muted)",
      color: "var(--cs-accent-text)",
      border: "1px solid rgba(167,209,41,0.35)",
    },
    icon: PackageIcon,
  },
  failed: { label: "Failed", style: triplet("danger"), icon: XCircleIcon },
  refunded: {
    label: "Refunded",
    style: {
      backgroundColor: "var(--cs-surface-3)",
      color: "var(--cs-text-secondary)",
      border: "1px solid var(--cs-border-subtle)",
    },
    icon: ArrowsClockwiseIcon,
  },
}

/**
 * Exported so the phone card and the table cell render the identical pill.
 * When they were two copies they drifted — which is how "Delivered" ended
 * up unreadable in one place and fine in the other.
 */
export function OrderStatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as PaymentStatus] ?? STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    /* Icon and label both, always. A status is never carried by the pill's
       colour alone. */
    <span
      className="inline-flex items-center gap-1.5 h-6 pl-1.5 pr-2.5 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={cfg.style}
    >
      <Icon size={12} weight="fill" className="shrink-0" />
      {cfg.label}
    </span>
  )
}

const UPDATABLE: ("shipped" | "delivered")[] = ["shipped", "delivered"]

/** Header label, matching SortableHeader's non-sortable styling so sorted
 *  and unsorted columns read as one row rather than two type treatments. */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-medium uppercase tracking-[0.05em] whitespace-nowrap"
      style={{ color: "var(--cs-text-tertiary)" }}
    >
      {children}
    </span>
  )
}

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
      header: () => <ColumnLabel>Cookbook</ColumnLabel>,
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
      // Responsive visibility lives on the column, so the whole column
      // disappears on a narrow viewport instead of leaving an empty cell
      // holding its share of the table width.
      meta: { className: "hidden md:table-cell" },
      header: () => <ColumnLabel>Customer</ColumnLabel>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--cs-text-secondary)" }}>
          <ReceiptIcon size={11} className="shrink-0" />
          <span className="truncate max-w-[180px]">{row.original.receiptEmail}</span>
        </div>
      ),
    },
    {
      id: "address",
      meta: { className: "hidden lg:table-cell" },
      header: () => <ColumnLabel>Shipping</ColumnLabel>,
      cell: ({ row }) => {
        const addr = row.original.billingAddress
        return addr?.name ? (
          <p className="text-xs truncate max-w-[200px]" style={{ color: "var(--cs-text-secondary)" }}>
            {addr.name},{" "}
            {[addr.city, addr.state, addr.country].filter(Boolean).join(", ")}
          </p>
        ) : (
          <span className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
            —
          </span>
        )
      },
    },
    {
      id: "amount",
      accessorKey: "price",
      enableSorting: true,
      meta: { className: "hidden sm:table-cell", align: "right" },
      header: ({ column }) => <SortableHeader column={column} title="Amount" />,
      cell: ({ row }) => (
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: "var(--cs-text-primary)" }}
        >
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "status",
      meta: { className: "w-px whitespace-nowrap" },
      header: () => <ColumnLabel>Status</ColumnLabel>,
      cell: ({ row }) => <OrderStatusPill status={row.original.paymentStatus} />,
    },
    {
      id: "actions",
      meta: { className: "w-px", align: "right" },
      header: () => null,
      cell: ({ row }) => {
        const s = row.original.paymentStatus as PaymentStatus
        const canUpdate = s === "paid" || s === "shipped"
        if (!canUpdate) return null
        return (
          <div className="flex justify-end">
            <DropdownMenu modal={false}>
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
