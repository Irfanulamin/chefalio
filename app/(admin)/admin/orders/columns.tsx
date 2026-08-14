"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { StatusPill, type StatusTone } from "@/components/Admin/AdminUI"
import type { AdminOrder } from "@/types/admin.type"

const STATUS_TONE: Record<string, StatusTone> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  paid: CheckCircleIcon,
  pending: ClockIcon,
  failed: XCircleIcon,
}

export function createAdminOrderColumns(): ColumnDef<AdminOrder, unknown>[] {
  return [
    {
      id: "cookbook",
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Cookbook
        </span>
      ),
      cell: ({ row }) => {
        const o = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: "var(--cs-surface-3)" }}>
              {o.cookbookImage && (
                <Image src={o.cookbookImage} alt={o.cookbookTitle} fill className="object-cover" sizes="40px" />
              )}
            </div>
            <span className="font-medium text-foreground truncate max-w-48 text-sm">
              {o.cookbookTitle}
            </span>
          </div>
        )
      },
    },
    {
      id: "customer",
      meta: { className: "hidden sm:table-cell" },
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Customer
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-xs truncate max-w-48 block" style={{ color: "var(--cs-text-secondary)" }}>
          {row.original.receiptEmail}
        </span>
      ),
    },
    {
      id: "amount",
      accessorKey: "price",
      enableSorting: true,
      meta: { className: "hidden md:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Amount" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground tabular-nums">
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Status
        </span>
      ),
      cell: ({ row }) => {
        const s = row.original.paymentStatus
        return (
          <StatusPill tone={STATUS_TONE[s] ?? "neutral"} icon={STATUS_ICONS[s] ?? ClockIcon}>
            {s}
          </StatusPill>
        )
      },
    },
    {
      id: "date",
      accessorFn: (row) => new Date(row.createdAt).getTime(),
      enableSorting: true,
      meta: { className: "hidden lg:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => (
        <span className="text-xs ui-numeric" style={{ color: "var(--cs-text-tertiary)" }}>
          {new Date(row.original.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
  ]
}
