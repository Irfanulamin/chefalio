"use client"

import { useState, useMemo } from "react"
import {
  useChefApplicationsTable,
  useChefApplicationStatsTable,
} from "@/hooks/swr/use-chef-applications-table"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { createChefApplicationColumns } from "./columns"
import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/types/chef-application.type"
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChefHatIcon,
} from "@phosphor-icons/react/dist/ssr"

function StatCard({
  label,
  value,
  icon: Icon,
  classes,
}: {
  label: string
  value: number
  icon: React.ElementType
  classes: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{label}</p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            classes,
          )}
        >
          <Icon size={15} weight="fill" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}

const STATUS_FILTER: FilterConfig = {
  key: "status",
  type: "pill",
  options: [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ],
}

export default function AdminChefApplicationsPage() {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "",
  })
  const [page, setPage] = useState(1)

  const status = filterValues.status as ApplicationStatus | ""

  const { applications, pagination, isLoading, isFetching } =
    useChefApplicationsTable({
      page,
      limit: 20,
      status: status || undefined,
    })

  const { stats } = useChefApplicationStatsTable()

  // Client-side search filter (API doesn't support search for applications)
  const filtered = useMemo(() => {
    if (!search) return applications
    const q = search.toLowerCase()
    return applications.filter((a) => {
      const user = typeof a.userId === "object" ? a.userId : null
      const name = (user?.fullName ?? a.fullName).toLowerCase()
      const email = (user?.email ?? "").toLowerCase()
      return (
        name.includes(q) ||
        email.includes(q) ||
        a.specialty.toLowerCase().includes(q)
      )
    })
  }, [applications, search])

  function handleFilterChange(key: string, value: string) {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const columns = useMemo(() => createChefApplicationColumns(), [])

  const totalPages = pagination?.totalPages ?? 1

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <ChefHatIcon size={18} weight="duotone" className="text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Chef Applications
          </h1>
          <p className="text-xs text-zinc-500">
            Review and manage chef applicants
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={stats?.total ?? 0}
          icon={ChefHatIcon}
          classes="bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? 0}
          icon={ClockIcon}
          classes="bg-amber-100 dark:bg-amber-900/30 text-amber-500"
        />
        <StatCard
          label="Approved"
          value={stats?.approved ?? 0}
          icon={CheckCircleIcon}
          classes="bg-green-100 dark:bg-green-900/30 text-green-500"
        />
        <StatCard
          label="Rejected"
          value={stats?.rejected ?? 0}
          icon={XCircleIcon}
          classes="bg-red-100 dark:bg-red-900/30 text-red-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyIcon={ChefHatIcon}
        emptyMessage="No applications found"
        onSearchChange={setSearch}
        searchPlaceholder="Search name, email, specialty…"
        filterConfigs={[STATUS_FILTER]}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        pagination={
          totalPages > 1
            ? {
                page,
                totalPages,
                total: pagination?.total ?? 0,
                itemLabel: "applications",
                onPageChange: setPage,
              }
            : undefined
        }
      />
    </div>
  )
}
