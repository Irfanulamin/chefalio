"use client"

import { useState, useMemo } from "react"
import {
  useChefApplicationsTable,
  useChefApplicationStatsTable,
} from "@/hooks/swr/use-chef-applications-table"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { createChefApplicationColumns } from "./columns"
import type { ApplicationStatus } from "@/types/chef-application.type"
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChefHatIcon,
} from "@phosphor-icons/react/dist/ssr"
import { PageHeader, StatCard } from "@/components/Admin/AdminUI"

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
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Chef Applications"
        description="Review and manage chef applicants"
        icon={ChefHatIcon}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard index={0} label="Total" value={stats?.total ?? 0} icon={ChefHatIcon} tone="neutral" />
        <StatCard index={1} label="Pending" value={stats?.pending ?? 0} icon={ClockIcon} tone="warning" />
        <StatCard index={2} label="Approved" value={stats?.approved ?? 0} icon={CheckCircleIcon} tone="success" />
        <StatCard index={3} label="Rejected" value={stats?.rejected ?? 0} icon={XCircleIcon} tone="danger" />
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
