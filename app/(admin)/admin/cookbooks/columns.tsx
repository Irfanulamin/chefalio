"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
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
import { TrashIcon, PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr"
import type { Cookbook } from "@/types/cookbook.type"

export function createCookbookColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (cookbook: Cookbook) => void
  onDelete: (id: string) => void
}): ColumnDef<Cookbook, unknown>[] {
  return [
    {
      id: "cookbook",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          Cookbook
        </span>
      ),
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
              {c.cookbook_image && (
                <Image src={c.cookbook_image} alt={c.title} fill className="object-cover" sizes="40px" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate max-w-48 text-sm">{c.title}</p>
              <p className="text-xs text-zinc-400 truncate max-w-48">{c.description}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "author",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide hidden sm:block">
          Author
        </span>
      ),
      cell: ({ row }) => {
        const a = row.original.authorId
        return (
          <div className="hidden sm:block">
            <p className="text-sm text-foreground">{a.fullName}</p>
            <p className="text-xs text-zinc-400">@{a.username}</p>
          </div>
        )
      },
    },
    {
      id: "price",
      accessorKey: "price",
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden md:block">
          <SortableHeader column={column} title="Price" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="hidden md:block text-sm font-medium text-foreground">
          ${row.original.price.toFixed(2)}
        </span>
      ),
    },
    {
      id: "stock",
      accessorKey: "stockCount",
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden lg:block">
          <SortableHeader column={column} title="Stock" />
        </div>
      ),
      cell: ({ row }) => {
        const s = row.original.stockCount
        return (
          <span
            className={`hidden lg:block text-xs font-medium tabular-nums ${
              s === 0 ? "text-red-500" : s < 5 ? "text-amber-500" : "text-zinc-500"
            }`}
          >
            {s} left
          </span>
        )
      },
    },
    {
      id: "discount",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide hidden xl:block">
          Discount
        </span>
      ),
      cell: ({ row }) => {
        const d = row.original.discount ?? 0
        return d > 0 ? (
          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            -{d}%
          </span>
        ) : (
          <span className="hidden xl:block text-xs text-zinc-400">—</span>
        )
      },
    },
    {
      id: "edit",
      size: 52,
      header: () => null,
      cell: ({ row }) => (
        <button
          onClick={() => onEdit(row.original)}
          className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <PencilSimpleIcon size={14} />
        </button>
      ),
    },
    {
      id: "delete",
      size: 52,
      header: () => null,
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="h-7 w-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <TrashIcon size={14} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete cookbook?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &ldquo;{row.original.title}&rdquo;.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(row.original._id)}
                className="bg-red-500 hover:bg-red-600 text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ]
}
