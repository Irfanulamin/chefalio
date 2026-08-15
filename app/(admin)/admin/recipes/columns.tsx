"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import {
  HeartIcon,
  BookmarkSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr"
import { StatusPill, type StatusTone } from "@/components/Admin/AdminUI"
import type { Recipe } from "@/types/recipes.type"

export type AdminRecipeRow = Recipe

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
  onDelete: (recipe: Recipe) => void
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
