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

const DIFFICULTY_STYLE: Record<string, { backgroundColor: string; color: string }> = {
  beginner: { backgroundColor: "#f0fdf4", color: "#15803d" },
  intermediate: { backgroundColor: "#fffbeb", color: "#b45309" },
  advance: { backgroundColor: "#fef2f2", color: "#b91c1c" },
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
        <span className="text-xs font-medium" style={{ color: "var(--cs-text-tertiary)" }}>Recipe</span>
      ),
      cell: ({ row }) => {
        const r = row.original
        return (
          <div className="flex items-center gap-3">
            <div
              className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0"
              style={{ backgroundColor: "var(--cs-surface-3)" }}
            >
              {r.images[0] && (
                <Image src={r.images[0]} alt={r.title} fill className="object-cover" sizes="56px" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate max-w-[240px]" style={{ color: "var(--cs-text-primary)" }}>{r.title}</p>
              <p className="text-xs mt-0.5 line-clamp-1 max-w-[240px]" style={{ color: "var(--cs-text-tertiary)" }}>{r.description}</p>
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
          className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium capitalize"
          style={DIFFICULTY_STYLE[row.original.difficulty] ?? { backgroundColor: "var(--cs-surface-3)", color: "var(--cs-text-secondary)" }}
        >
          {row.original.difficulty}
        </span>
      ),
    },
    {
      id: "tags",
      header: () => (
        <span className="text-xs font-medium hidden md:block" style={{ color: "var(--cs-text-tertiary)" }}>Tags</span>
      ),
      cell: ({ row }) => (
        <div className="hidden md:flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 text-[11px] rounded"
              style={{ backgroundColor: "var(--cs-surface-3)", color: "var(--cs-text-secondary)" }}
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
        <span className="hidden lg:flex items-center gap-2 text-xs tabular-nums" style={{ color: "var(--cs-text-tertiary)" }}>
          <span className="flex items-center gap-1">
            <HeartIcon size={11} weight="fill" style={{ color: "#f87171" }} />
            {row.original.lovedCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <BookmarkSimpleIcon size={11} weight="fill" style={{ color: "var(--cs-accent)" }} />
            {row.original.savedCount.toLocaleString()}
          </span>
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <span className="text-xs font-medium text-right block pr-1" style={{ color: "var(--cs-text-tertiary)" }}>Actions</span>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Link href={`/chef/recipes/${row.original._id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs px-2.5 transition-colors duration-150"
              style={{ color: "var(--cs-text-secondary)" }}
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
                className="h-7 px-2 transition-colors duration-150 hover:text-red-500 hover:bg-red-50"
                style={{ color: "var(--cs-text-tertiary)" }}
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
