"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr"
import type { Cookbook } from "@/types/cookbook.type"

export function createChefCookbookColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (cookbook: Cookbook) => void
  onDelete: (cookbook: Cookbook) => void
}): ColumnDef<Cookbook, unknown>[] {
  return [
    {
      id: "cookbook",
      header: () => (
        <span
          className="text-[11px] font-medium uppercase tracking-[0.05em] whitespace-nowrap"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          Cookbook
        </span>
      ),
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-3">
            <div
              className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0"
              style={{ backgroundColor: "var(--cs-surface-3)" }}
            >
              <Image src={c.cookbook_image} alt={c.title} fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate max-w-[240px]" style={{ color: "var(--cs-text-primary)" }}>{c.title}</p>
              <p className="text-xs mt-0.5 line-clamp-1 max-w-[240px]" style={{ color: "var(--cs-text-tertiary)" }}>{c.description}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "price",
      accessorKey: "price",
      enableSorting: true,
      meta: { className: "w-px", align: "right" },
      header: ({ column }) => <SortableHeader column={column} title="Price" />,
      cell: ({ row }) => (
        <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--cs-text-primary)" }}>
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "stock",
      accessorKey: "stockCount",
      enableSorting: true,
      meta: { className: "hidden sm:table-cell w-px" },
      header: ({ column }) => <SortableHeader column={column} title="Stock" />,
      cell: ({ row }) => {
        // Out-of-stock and running-low are genuine statuses, so they use the
        // reserved status tokens rather than raw Tailwind hexes that only
        // ever looked right on a white row.
        const count = row.original.stockCount
        const color =
          count === 0
            ? "var(--cs-danger-fg)"
            : count < 5
              ? "var(--cs-warning-fg)"
              : "var(--cs-text-secondary)"
        return (
          <span className="text-xs font-medium tabular-nums" style={{ color }}>
            {count === 0 ? "Out of stock" : `${count} in stock`}
          </span>
        )
      },
    },
    {
      id: "actions",
      meta: { className: "w-px", align: "right" },
      header: () => (
        <span
          className="text-[11px] font-medium uppercase tracking-[0.05em] whitespace-nowrap"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          Actions
        </span>
      ),
      cell: ({ row }) => (
        /* The row opens the editor; these actions must not bubble into it. */
        <div
          className="flex items-center gap-1 justify-end"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label={`Edit ${row.original.title}`}
            onClick={() => onEdit(row.original)}
            className="focus-ring h-8 w-8 flex items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 active:scale-90 hover:!text-[var(--cs-accent-text)] hover:!bg-[var(--cs-accent-muted)]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <PencilSimpleIcon size={15} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${row.original.title}`}
            onClick={() => onDelete(row.original)}
            className="focus-ring h-8 w-8 flex items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 active:scale-90 hover:!text-[var(--cs-danger-fg)] hover:!bg-[var(--cs-danger-bg)]"
            style={{ color: "var(--cs-text-tertiary)" }}
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ]
}
