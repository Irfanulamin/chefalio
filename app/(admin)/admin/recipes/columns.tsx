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
import {
  HeartIcon,
  BookmarkSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { Recipe } from "@/types/recipes.type"

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advance: 2,
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  advance: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function createRecipeColumns({
  onDelete,
}: {
  onDelete: (id: string) => void
}): ColumnDef<Recipe, unknown>[] {
  return [
    {
      id: "recipe",
      header: () => (
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          Recipe
        </span>
      ),
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-12 rounded-md overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800">
              {r.images[0] && (
                <Image src={r.images[0]} alt={r.title} fill className="object-cover" sizes="48px" />
              )}
            </div>
            <p className="font-medium text-foreground truncate max-w-48 text-sm">{r.title}</p>
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
      id: "difficulty",
      accessorFn: (row) => DIFFICULTY_ORDER[row.difficulty] ?? 0,
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden md:block">
          <SortableHeader column={column} title="Difficulty" />
        </div>
      ),
      cell: ({ row }) => (
        <span
          className={`hidden md:inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${DIFFICULTY_COLORS[row.original.difficulty] ?? ""}`}
        >
          {row.original.difficulty}
        </span>
      ),
    },
    {
      id: "engagement",
      accessorFn: (row) => row.lovedCount * 2 + row.savedCount * 1.5,
      enableSorting: true,
      header: ({ column }) => (
        <div className="hidden lg:block">
          <SortableHeader column={column} title="Engagement" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="hidden lg:flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <HeartIcon size={11} weight="fill" className="text-red-400" />
            {row.original.lovedCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <BookmarkSimpleIcon size={11} weight="fill" className="text-primary" />
            {row.original.savedCount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
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
              <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
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
