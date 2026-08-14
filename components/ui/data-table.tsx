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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { SPRING } from "@/lib/motion"
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

/**
 * The product's table.
 *
 * Two things were wrong with it, and they compounded into the "falling
 * apart" look on the orders page.
 *
 * **It was skinned in raw `zinc-*`.** Every border, divider, hover, input
 * and pagination button was a hardcoded Tailwind neutral, while everything
 * around the table — the page header, the panels, the sidebar — is drawn
 * from `--cs-*`. Two different neutral ramps meeting at the table's edge is
 * exactly the kind of seam that reads as broken without being obviously
 * anything. It now uses the same surfaces as its surroundings.
 *
 * **Responsive columns hid their contents, not themselves.** Column cells
 * carried `hidden md:block` on the element *inside* the `<td>`, so on a
 * narrow viewport the content vanished but the cell kept its share of the
 * table width — several empty columns pushing the real ones into a squeeze,
 * with headers floating over nothing. Columns now declare
 * `meta.className`, which lands on the `<th>` and every `<td>` alike, so
 * hiding a column removes the whole column.
 */

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

/**
 * Per-column presentation, applied to the header cell and every body cell
 * of that column together. Put responsive visibility and alignment here —
 * never on an element inside the cell.
 */
export interface DataTableColumnMeta {
  className?: string
  align?: "left" | "right" | "center"
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string
    align?: "left" | "right" | "center"
    /* Present only so the two type parameters the interface declares are
       both used; augmenting a generic interface requires matching its
       signature exactly. */
    _row?: TData
    _value?: TValue
  }
}

const ALIGN_CLASS = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const

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
  const base =
    "text-[11px] font-medium uppercase tracking-[0.05em] whitespace-nowrap"

  if (!column.getCanSort()) {
    return (
      <span className={cn(base, className)} style={{ color: "var(--cs-text-tertiary)" }}>
        {title}
      </span>
    )
  }

  const sorted = column.getIsSorted()
  return (
    <button
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        base,
        "inline-flex items-center gap-1 transition-colors duration-150 hover:text-[var(--cs-text-primary)]",
        className,
      )}
      style={{ color: sorted ? "var(--cs-text-primary)" : "var(--cs-text-tertiary)" }}
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
          <tr style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
              {Array.from({ length: columnCount }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  {j === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-12 rounded-lg shrink-0" />
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
  /**
   * Filtering happens in the browser against data already in memory.
   *
   * The search box debounced by 400ms unconditionally, which is right when
   * every keystroke costs a network request and simply wrong when it costs
   * an `Array.filter`. It put nearly half a second between typing and the
   * list responding, for no reason. Set this wherever the parent filters
   * locally and the list updates on the keystroke.
   */
  instantSearch?: boolean
  /**
   * Makes each row a direct handle on the thing it represents — pressing
   * anywhere on it opens that record. Rows get a press state to advertise
   * it, and the action buttons stop propagation so Delete doesn't also open
   * the editor.
   */
  onRowClick?: (row: TData) => void
  /**
   * A table narrowed to phone width isn't a table — it's a squeeze. Supply
   * a card and the list swaps to it below `sm` instead.
   */
  renderCard?: (row: TData) => React.ReactNode
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
  instantSearch = false,
  onRowClick,
  renderCard,
}: DataTableProps<TData>) {
  const [rawSearch, setRawSearch] = useState("")
  const [debouncedSearch] = useDebounce(rawSearch, instantSearch ? 0 : 400)
  const [sorting, setSorting] = useState<SortingState>([])
  const reduceMotion = useReducedMotion()

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

  const cellClass = (meta: DataTableColumnMeta | undefined) =>
    cn(ALIGN_CLASS[meta?.align ?? "left"], meta?.className)

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
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--cs-text-tertiary)" }}
              />
              <input
                type="text"
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-9 pl-8 pr-3 text-sm rounded-lg outline-none transition-colors duration-150 focus:border-[var(--cs-accent)] placeholder:text-[var(--cs-text-tertiary)]"
                style={{
                  border: "1px solid var(--cs-border-default)",
                  backgroundColor: "var(--cs-surface-1)",
                  color: "var(--cs-text-primary)",
                }}
              />
            </div>
          )}

          {filterConfigs?.map((fc) => {
            if (fc.type === "segmented") {
              return (
                <div
                  key={fc.key}
                  className="flex items-center rounded-[10px] p-0.5 shrink-0"
                  style={{ backgroundColor: "var(--cs-surface-3)" }}
                >
                  {fc.options.map((opt) => {
                    const isActive = (filterValues[fc.key] ?? "") === opt.value
                    // `activeClassName` names itself for the selected state —
                    // it used to land on the button unconditionally, so an
                    // unselected colored option showed the color's
                    // background with the *inactive* gray text on top of
                    // it, which is what made Active/Inactive unreadable.
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onFilterChange?.(fc.key, opt.value)}
                        className={cn(
                          "px-3 h-7 text-xs font-medium rounded-lg transition-all duration-150 active:scale-[0.97]",
                          isActive && opt.activeClassName,
                        )}
                        style={
                          isActive
                            ? isActive && opt.activeClassName
                              ? undefined
                              : {
                                  backgroundColor: "var(--cs-surface-1)",
                                  color: "var(--cs-text-primary)",
                                  boxShadow: "var(--cs-shadow-chip)",
                                }
                            : { color: "var(--cs-text-secondary)" }
                        }
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              )
            }

            // pill (default) — the selected pill reads as a raised chip on a
            // recessed track, matching the analytics period selector. Solid
            // brand lime here made a filter the loudest thing on the page.
            return (
              <div
                key={fc.key}
                className="flex items-center rounded-[10px] p-0.5 shrink-0 overflow-x-auto"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              >
                {fc.options.map((opt) => {
                  const isActive = (filterValues[fc.key] ?? "") === opt.value
                  return (
                    <button
                      key={`${fc.key}-${opt.value}`}
                      onClick={() => onFilterChange?.(fc.key, opt.value)}
                      className={cn(
                        "px-3 h-7 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 active:scale-[0.97]",
                        isActive && opt.activeClassName,
                      )}
                      style={
                        isActive
                          ? isActive && opt.activeClassName
                            ? undefined
                            : {
                                backgroundColor: "var(--cs-surface-1)",
                                color: "var(--cs-text-primary)",
                                boxShadow: "var(--cs-shadow-chip)",
                              }
                          : { color: "var(--cs-text-secondary)" }
                      }
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            )
          })}

          {toolbarRight && <div className="ml-auto shrink-0">{toolbarRight}</div>}
        </div>
      )}

      {/* ── Table ── */}
      <div
        className={cn(
          "rounded-xl overflow-hidden transition-opacity duration-150",
          isFetching && !isLoading ? "opacity-70" : "",
        )}
        style={{
          border: "1px solid var(--cs-border-subtle)",
          backgroundColor: "var(--cs-surface-2)",
        }}
      >
        {isLoading ? (
          <SkeletonTable columnCount={columns.length} rowCount={skeletonRows} />
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            {EmptyIcon && <EmptyIcon size={22} style={{ color: "var(--cs-text-tertiary)" }} />}
            <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
              {emptyMessage}
            </p>
            {emptyAction}
          </div>
        ) : (
          <>
            {/* Phone: cards. A row of six columns squeezed into 380px is
                unreadable no matter how it's styled. */}
            {renderCard && (
              <ul className="sm:hidden divide-y" style={{ borderColor: "var(--cs-border-subtle)" }}>
                <AnimatePresence initial={false} mode="popLayout">
                  {table.getRowModel().rows.map((row) => (
                    <motion.li
                      key={row.id}
                      layout={!reduceMotion}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={reduceMotion ? { duration: 0.12 } : SPRING.snappy}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className={cn(
                        "p-3",
                        onRowClick &&
                          "cursor-pointer transition-[background-color,transform] duration-100 active:scale-[0.99] active:bg-[var(--cs-active)]",
                      )}
                      style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}
                    >
                      {renderCard(row.original)}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            <div
              className={cn(
                "overflow-x-auto scroll-panel",
                renderCard ? "hidden sm:block" : "",
              )}
            >
              <table className="w-full text-sm">
                {/* The header sits above the rows as a material rather than
                    scrolling away with them — the column a number belongs to
                    should still be nameable when you've scrolled to it. */}
                <thead
                  className="sticky top-0 z-10"
                  style={{
                    backgroundColor: "var(--cs-material-thick)",
                    backdropFilter: "blur(var(--cs-material-blur))",
                    WebkitBackdropFilter: "blur(var(--cs-material-blur))",
                  }}
                >
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          className={cn(
                            "px-4 py-2.5 font-medium",
                            cellClass(header.column.columnDef.meta),
                          )}
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
                <tbody>
                  <AnimatePresence initial={false} mode="popLayout">
                    {table.getRowModel().rows.map((row, i, rows) => (
                      /* Rows spring into their new positions when a filter
                         or sort changes, so the list visibly rearranges
                         rather than cutting to a different set of rows. */
                      <motion.tr
                        key={row.id}
                        layout={!reduceMotion}
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={reduceMotion ? { duration: 0.12 } : SPRING.snappy}
                        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                        className={cn(
                          "transition-colors duration-150 hover:bg-[var(--cs-hover)]",
                          onRowClick && "cursor-pointer active:bg-[var(--cs-active)]",
                        )}
                        style={
                          i === rows.length - 1
                            ? undefined
                            : { borderBottom: "1px solid var(--cs-border-subtle)" }
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={cn(
                              "px-4 py-3 align-middle",
                              cellClass(cell.column.columnDef.meta),
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs" style={{ color: "var(--cs-text-tertiary)" }}>
            Page {pagination.page} of {pagination.totalPages}
            {pagination.total > 0 &&
              ` · ${pagination.total.toLocaleString()} ${pagination.itemLabel ?? "items"}`}
          </p>
          <div className="flex items-center gap-1">
            {[
              { dir: -1, icon: CaretLeftIcon, disabled: pagination.page === 1, label: "Previous page" },
              {
                dir: 1,
                icon: CaretRightIcon,
                disabled: pagination.page === pagination.totalPages,
                label: "Next page",
              },
            ].map(({ dir, icon: Icon, disabled, label }) => (
              <button
                key={label}
                aria-label={label}
                onClick={() => pagination.onPageChange(pagination.page + dir)}
                disabled={disabled}
                className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--cs-hover)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                style={{
                  border: "1px solid var(--cs-border-default)",
                  color: "var(--cs-text-secondary)",
                }}
              >
                <Icon size={12} weight="bold" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
