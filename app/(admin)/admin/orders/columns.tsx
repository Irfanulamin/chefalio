"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { AdminOrder } from "@/types/admin.type"

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
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
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          Cookbook
        </span>
      ),
      cell: ({ row }) => {
        const o = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
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
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:block">
          Customer
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-zinc-500 truncate max-w-48 hidden sm:block">
          {row.original.receiptEmail}
        </span>
      ),
    },
    {
      id: "amount",
      accessorKey: "price",
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden md:block">
          <SortableHeader column={column} title="Amount" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="hidden md:block text-sm font-medium text-foreground tabular-nums">
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          Status
        </span>
      ),
      cell: ({ row }) => {
        const s = row.original.paymentStatus
        const Icon = STATUS_ICONS[s] ?? ClockIcon
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[s] ?? "bg-zinc-100 text-zinc-500"}`}
          >
            <Icon size={11} weight="fill" />
            {s}
          </span>
        )
      },
    },
    {
      id: "date",
      accessorFn: (row) => new Date(row.createdAt).getTime(),
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden lg:block">
          <SortableHeader column={column} title="Date" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="hidden lg:block text-xs text-zinc-400 tabular-nums">
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
