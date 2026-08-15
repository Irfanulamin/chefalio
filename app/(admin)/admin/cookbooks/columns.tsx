"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import { TrashIcon, PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr"
import { StatusPill } from "@/components/Admin/AdminUI"
import type { Cookbook } from "@/types/cookbook.type"

export function createCookbookColumns({
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
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Cookbook
        </span>
      ),
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: "var(--cs-surface-3)" }}>
              {c.cookbook_image && (
                <Image src={c.cookbook_image} alt={c.title} fill className="object-cover" sizes="40px" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate max-w-48 text-sm">{c.title}</p>
              <p className="text-xs truncate max-w-48" style={{ color: "var(--cs-text-tertiary)" }}>{c.description}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "author",
      meta: { className: "hidden sm:table-cell" },
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Author
        </span>
      ),
      cell: ({ row }) => {
        const a = row.original.authorId
        return (
          <div>
            <p className="text-sm text-foreground">{a.fullName}</p>
            <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>@{a.username}</p>
          </div>
        )
      },
    },
    {
      id: "price",
      accessorKey: "price",
      enableSorting: true,
      meta: { className: "hidden md:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Price" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground ui-numeric">
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "stock",
      accessorKey: "stockCount",
      enableSorting: true,
      meta: { className: "hidden lg:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Stock" />,
      cell: ({ row }) => {
        const s = row.original.stockCount
        const color =
          s === 0 ? "var(--cs-danger-fg)" : s < 5 ? "var(--cs-warning-fg)" : "var(--cs-text-secondary)"
        return (
          <span className="text-xs font-medium ui-numeric" style={{ color }}>
            {s} left
          </span>
        )
      },
    },
    {
      id: "discount",
      meta: { className: "hidden xl:table-cell" },
      header: () => (
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Discount
        </span>
      ),
      cell: ({ row }) => {
        const d = row.original.discount ?? 0
        return d > 0 ? (
          <StatusPill tone="success">-{d}%</StatusPill>
        ) : (
          <span className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>—</span>
        )
      },
    },
    {
      id: "edit",
      size: 52,
      header: () => null,
      cell: ({ row }) => (
        <button
          type="button"
          aria-label={`Edit ${row.original.title}`}
          onClick={() => onEdit(row.original)}
          className="focus-ring h-8 w-8 flex items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 active:scale-90 hover:!text-[var(--cs-accent-text)] hover:!bg-[var(--cs-accent-muted)]"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          <PencilSimpleIcon size={15} />
        </button>
      ),
    },
    {
      id: "delete",
      size: 52,
      header: () => null,
      cell: ({ row }) => (
        <button
          type="button"
          aria-label={`Delete ${row.original.title}`}
          onClick={() => onDelete(row.original)}
          className="focus-ring h-8 w-8 flex items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 active:scale-90 hover:!text-[var(--cs-danger-fg)] hover:!bg-[var(--cs-danger-bg)]"
          style={{ color: "var(--cs-text-tertiary)" }}
        >
          <TrashIcon size={15} />
        </button>
      ),
    },
  ]
}
