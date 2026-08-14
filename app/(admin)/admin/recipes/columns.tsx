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
import { StatusPill, type StatusTone } from "@/components/Admin/AdminUI"
import type { Recipe } from "@/types/recipes.type"

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advance: 2,
}

const DIFFICULTY_TONE: Record<string, StatusTone> = {
  beginner: "success",
  intermediate: "warning",
  advance: "danger",
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
        <span className="ui-micro font-medium uppercase tracking-wide" style={{ color: "var(--cs-text-tertiary)" }}>
          Recipe
        </span>
      ),
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: "var(--cs-surface-3)" }}>
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
      id: "difficulty",
      accessorFn: (row) => DIFFICULTY_ORDER[row.difficulty] ?? 0,
      enableSorting: true,
      meta: { className: "hidden md:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Difficulty" />,
      cell: ({ row }) => (
        <StatusPill tone={DIFFICULTY_TONE[row.original.difficulty] ?? "neutral"}>
          {row.original.difficulty}
        </StatusPill>
      ),
    },
    {
      id: "engagement",
      accessorFn: (row) => row.lovedCount * 2 + row.savedCount * 1.5,
      enableSorting: true,
      meta: { className: "hidden lg:table-cell" },
      header: ({ column }) => <SortableHeader column={column} title="Engagement" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
          <span className="flex items-center gap-1">
            <HeartIcon size={11} weight="fill" style={{ color: "var(--cs-love)" }} />
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
            <button
              className="focus-ring h-7 w-7 flex items-center justify-center rounded-lg transition-[background-color,color,transform] duration-150 active:scale-90 hover:text-red-500 hover:bg-(--cs-danger-bg)"
              style={{ color: "var(--cs-text-tertiary)" }}
            >
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
