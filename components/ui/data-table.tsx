"use client"

import {
  type ColumnDef,
  type Column,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useState, useEffect, useRef } from "react"
import { useDebounce } from "use-debounce"
import {
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ArrowsDownUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react/dist/ssr"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterOption {
  label: string
  value: string
  /** Override active pill/segment class */
  activeClassName?: string
}

export interface FilterConfig {
  key: string
  /** pill = spaced pill buttons (default); segmented = joined segmented control */
  type?: "pill" | "segmented"
  options: FilterOption[]
}

export interface DataTablePagination {
  page: number
  totalPages: number
  total: number
  itemLabel?: string
  onPageChange: (page: number) => void
}

// ─── SortableHeader ───────────────────────────────────────────────────────────

export function SortableHeader<TData, TValue = unknown>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return (
      <span
        className={cn(
          "text-xs font-medium text-zinc-400 uppercase tracking-wide",
          className,
        )}
      >
        {title}
      </span>
    )
  }
  const sorted = column.getIsSorted()
  return (
    <button
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        "flex items-center gap-1 text-xs font-medium text-zinc-400 uppercase tracking-wide hover:text-foreground transition-colors",
        className,
      )}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUpIcon size={10} weight="bold" />
      ) : sorted === "desc" ? (
        <ArrowDownIcon size={10} weight="bold" />
      ) : (
        <ArrowsDownUpIcon size={10} />
      )}
    </button>
  )
}

// ─── SkeletonTable ────────────────────────────────────────────────────────────

function SkeletonTable({
  columnCount,
  rowCount,
}: {
  columnCount: number
  rowCount: number
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-800">
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {Array.from({ length: rowCount }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: columnCount }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  {j === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-10 rounded-md shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2.5 w-20" />
                      </div>
                    </div>
                  ) : (
                    <Skeleton className="h-3.5 w-24" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── DataTable ────────────────────────────────────────────────────────────────

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  isLoading?: boolean
  isFetching?: boolean
  skeletonRows?: number
  emptyIcon?: React.ElementType
  emptyMessage?: string
  emptyAction?: React.ReactNode
  /** Called with debounced search value. Omit to hide the search input. */
  onSearchChange?: (debouncedValue: string) => void
  searchPlaceholder?: string
  /** Controlled filter state managed by the parent */
  filterConfigs?: FilterConfig[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  pagination?: DataTablePagination
  toolbarLeft?: React.ReactNode
  toolbarRight?: React.ReactNode
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  isFetching,
  skeletonRows = 8,
  emptyIcon: EmptyIcon,
  emptyMessage = "No data found",
  emptyAction,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterConfigs,
  filterValues = {},
  onFilterChange,
  pagination,
  toolbarLeft,
  toolbarRight,
}: DataTableProps<TData>) {
  const [rawSearch, setRawSearch] = useState("")
  const [debouncedSearch] = useDebounce(rawSearch, 400)
  const [sorting, setSorting] = useState<SortingState>([])

  // Stable ref so the effect below doesn't re-fire when the callback identity changes
  const onSearchChangeRef = useRef(onSearchChange)
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange
  })

  useEffect(() => {
    onSearchChangeRef.current?.(debouncedSearch)
  }, [debouncedSearch])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const hasToolbar =
    !!onSearchChange ||
    (filterConfigs && filterConfigs.length > 0) ||
    !!toolbarLeft ||
    !!toolbarRight

  return (
    <div className="space-y-3">
      {/* ── Toolbar ── */}
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-2">
          {toolbarLeft}

          {onSearchChange && (
            <div className="relative flex-1 min-w-48">
              <MagnifyingGlassIcon
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="text"
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          )}

          {filterConfigs?.map((fc) => {
            if (fc.type === "segmented") {
              return (
                <div
                  key={fc.key}
                  className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-0.5 shrink-0"
                >
                  {fc.options.map((opt) => {
                    const isActive = (filterValues[fc.key] ?? "") === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onFilterChange?.(fc.key, opt.value)}
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded-md transition-all duration-150",
                          isActive
                            ? (opt.activeClassName ??
                                "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm")
                            : "text-zinc-500 dark:text-zinc-400 hover:text-foreground",
                        )}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )
            }

            // pill (default)
            return fc.options.map((opt) => {
              const isActive = (filterValues[fc.key] ?? "") === opt.value
              return (
                <button
                  key={`${fc.key}-${opt.value}`}
                  onClick={() => onFilterChange?.(fc.key, opt.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors shrink-0",
                    isActive
                      ? (opt.activeClassName ?? "bg-primary text-black border-primary")
                      : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
                  )}
                >
                  {opt.label}
                </button>
              )
            })
          })}

          {toolbarRight && <div className="ml-auto shrink-0">{toolbarRight}</div>}
        </div>
      )}

      {/* ── Table ── */}
      <div
        className={cn(
          "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-opacity duration-150",
          isFetching && !isLoading ? "opacity-60" : "",
        )}
      >
        {isLoading ? (
          <SkeletonTable columnCount={columns.length} rowCount={skeletonRows} />
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-zinc-400">
            {EmptyIcon && <EmptyIcon size={24} />}
            <p className="text-sm">{emptyMessage}</p>
            {emptyAction}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr
                    key={hg.id}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-3"
                        style={
                          header.column.columnDef.size
                            ? { width: header.column.columnDef.size }
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-zinc-400">
            Page {pagination.page} of {pagination.totalPages}
            {pagination.total > 0 &&
              ` · ${pagination.total.toLocaleString()} ${pagination.itemLabel ?? "items"}`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CaretLeftIcon size={12} />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="h-7 w-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CaretRightIcon size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
