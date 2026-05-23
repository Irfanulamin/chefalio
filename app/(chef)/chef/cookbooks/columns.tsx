"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import Link from "next/link"
import { SortableHeader } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr"
import type { Cookbook } from "@/types/cookbook.type"

export function createChefCookbookColumns({
  onDelete,
  isDeleting,
}: {
  onDelete: (id: string) => void
  isDeleting: boolean
}): ColumnDef<Cookbook, unknown>[] {
  return [
    {
      id: "cookbook",
      header: () => (
        <span className="text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Cookbook</span>
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
      header: ({ column }) => (
        <SortableHeader column={column} title="Price" />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-bold tabular-nums" style={{ color: "var(--cs-text-primary)" }}>
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "stock",
      accessorKey: "stockCount",
      enableSorting: true,
      header: ({ column }) => (
        <SortableHeader column={column} title="Stock" />
      ),
      cell: ({ row }) => {
        const count = row.original.stockCount
        const color = count === 0 ? "#ef4444" : count < 5 ? "#f59e0b" : "var(--cs-text-secondary)"
        return (
          <span className="text-xs font-medium tabular-nums" style={{ color }}>
            {count} in stock
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="text-xs font-medium text-right block pr-1" style={{ color: "var(--cs-text-tertiary)" }}>Actions</span>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Link href={`/chef/cookbooks/${row.original._id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs px-2.5 transition-colors duration-150"
              style={{ color: "var(--cs-text-secondary)" }}
            >
              <PencilSimpleIcon size={12} />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 rounded-lg transition-colors duration-150 hover:text-red-500 hover:bg-red-50"
                style={{ color: "var(--cs-text-tertiary)" }}
              >
                <TrashIcon size={13} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete cookbook?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>&quot;{row.original.title}&quot;</strong> will be
                  permanently removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-lg h-9">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(row.original._id)}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 rounded-lg h-9 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]
}
