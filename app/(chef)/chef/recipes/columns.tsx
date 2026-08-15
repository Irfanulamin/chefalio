"use client"

import { type ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { SortableHeader } from "@/components/ui/data-table"
import {
  PencilSimpleIcon,
  TrashIcon,
  HeartIcon,
  BookmarkSimpleIcon,
} from "@phosphor-icons/react/dist/ssr"
import type { Recipe } from "@/types/recipes.type"
import { DIFFICULTY } from "@/components/Chef/studio/viz"

/**
 * Difficulty is an ordered scale, so the pill is one hue at three steps of
 * the ordinal ramp rather than the green / amber / red traffic light it
 * used to be. Red for "advanced" was actively wrong: it borrows the danger
 * colour to say "this recipe is ambitious", which is not a warning.
 *
 * The old values (`#f0fdf4` on `#15803d` and friends) were light-mode
 * literals too — a mint chip stayed mint on a near-black row in dark mode.
 */
const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advance: "Advanced",
}

const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advance: 2,
}

/** Non-sortable header label, matching SortableHeader's type treatment. */
function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-medium uppercase tracking-[0.05em] whitespace-nowrap"
      style={{ color: "var(--cs-text-tertiary)" }}
    >
      {children}
    </span>
  )
}

export function createChefRecipeColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (recipe: Recipe) => void
  onDelete: (recipe: Recipe) => void
}): ColumnDef<Recipe, unknown>[] {
  return [
    {
      id: "recipe",
      header: () => <ColumnLabel>Recipe</ColumnLabel>,
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
      // Responsive visibility belongs to the column, not to an element
      // inside the cell — otherwise the `<td>` keeps its width while its
      // contents disappear, and the table squeezes around empty space.
      meta: { className: "hidden sm:table-cell w-px" },
      header: ({ column }) => <SortableHeader column={column} title="Difficulty" />,
      cell: ({ row }) => (
        <span
          className="inline-flex items-center gap-1.5 px-2 h-6 rounded-full text-[11px] font-medium whitespace-nowrap"
          style={{
            backgroundColor: "var(--cs-surface-3)",
            color: "var(--cs-text-secondary)",
          }}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-[2px]"
            style={{
              backgroundColor: DIFFICULTY[row.original.difficulty] ?? "var(--cv-ord-2)",
            }}
          />
          {DIFFICULTY_LABEL[row.original.difficulty] ?? row.original.difficulty}
        </span>
      ),
    },
    {
      id: "tags",
      meta: { className: "hidden md:table-cell" },
      header: () => <ColumnLabel>Tags</ColumnLabel>,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
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
      meta: { className: "hidden lg:table-cell w-px" },
      header: ({ column }) => <SortableHeader column={column} title="Loves / Saves" />,
      cell: ({ row }) => (
        <span className="flex items-center gap-2.5 text-xs tabular-nums whitespace-nowrap" style={{ color: "var(--cs-text-secondary)" }}>
          <span className="flex items-center gap-1">
            <HeartIcon size={11} weight="fill" style={{ color: "var(--cs-love)" }} />
            {row.original.lovedCount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <BookmarkSimpleIcon size={11} weight="fill" style={{ color: "var(--cs-text-tertiary)" }} />
            {row.original.savedCount.toLocaleString()}
          </span>
        </span>
      ),
    },
    {
      id: "actions",
      meta: { className: "w-px", align: "right" },
      header: () => <ColumnLabel>Actions</ColumnLabel>,
      cell: ({ row }) => (
        /* The row itself opens the editor, so these must not bubble —
           otherwise pressing Delete would also open the thing you're
           deleting, behind the confirmation dialog. */
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
