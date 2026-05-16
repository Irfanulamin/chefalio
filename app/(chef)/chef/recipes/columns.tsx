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
import {
  PencilSimpleIcon,
  TrashIcon,
  HeartIcon,
  BookmarkSimpleIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { Recipe } from "@/types/recipes.type"

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advance: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advance: 2,
}

export function createChefRecipeColumns({
  onDelete,
  isDeleting,
}: {
  onDelete: (id: string) => void
  isDeleting: boolean
}): ColumnDef<Recipe, unknown>[] {
  return [
    {
      id: "recipe",
      header: () => (
        <span className="text-xs font-medium text-zinc-400">Recipe</span>
      ),
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
              {r.images[0] && (
                <Image src={r.images[0]} alt={r.title} fill className="object-cover" sizes="56px" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate max-w-[240px]">{r.title}</p>
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-[240px]">{r.description}</p>
            </div>
          </div>
        )
      },
    },
    {
      id: "difficulty",
      accessorFn: (row) => DIFFICULTY_ORDER[row.difficulty] ?? 0,
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden sm:block">
          <SortableHeader column={column} title="Difficulty" />
        </div>
      ),
      cell: ({ row }) => (
        <span
          className={`hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium capitalize ${DIFFICULTY_BADGE[row.original.difficulty] ?? ""}`}
        >
          {row.original.difficulty}
        </span>
      ),
    },
    {
      id: "tags",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 hidden md:block">Tags</span>
      ),
      cell: ({ row }) => (
        <div className="hidden md:flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[11px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            >
              #{t}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "engagement",
      accessorFn: (row) => row.lovedCount + row.savedCount,
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden lg:block">
          <SortableHeader column={column} title="Loves / Saves" />
        </div>
      ),
      cell: ({ row }) => (
        <span className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 tabular-nums">
          <span className="flex items-center gap-1">
            <HeartIcon size={11} weight="fill" className="text-red-400" />
            {row.original.lovedCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <BookmarkSimpleIcon size={11} weight="fill" className="text-primary" />
            {row.original.savedCount.toLocaleString()}
          </span>
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
          <Link href={`/chef/recipes/${row.original._id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs text-zinc-500 hover:text-foreground px-2.5"
            >
              <PencilSimpleIcon size={13} />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <TrashIcon size={13} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
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
