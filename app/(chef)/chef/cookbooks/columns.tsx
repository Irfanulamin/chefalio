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
        <span className="text-xs font-medium text-zinc-400">Cookbook</span>
      ),
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
              <Image src={c.cookbook_image} alt={c.title} fill className="object-cover" sizes="56px" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate max-w-[240px]">{c.title}</p>
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-[240px]">{c.description}</p>
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
        <span className="text-sm font-bold text-foreground tabular-nums">
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
      cell: ({ row }) => (
        <span
          className={`text-xs font-medium tabular-nums ${
            row.original.stockCount === 0
              ? "text-red-500"
              : row.original.stockCount < 5
                ? "text-amber-500"
                : "text-zinc-500"
          }`}
        >
          {row.original.stockCount} in stock
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 text-right block pr-1">Actions</span>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Link href={`/chef/cookbooks/${row.original._id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground px-2.5"
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
                className="h-7 px-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
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
