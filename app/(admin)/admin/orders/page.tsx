"use client"

import { useState, useMemo } from "react"
import { useAdminOrdersTable } from "@/hooks/swr/use-admin-orders-table"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { createAdminOrderColumns } from "./columns"
import { ShoppingCartSimpleIcon } from "@phosphor-icons/react/dist/ssr"
import { PageHeader } from "@/components/Admin/AdminUI"

const STATUS_FILTER: FilterConfig = {
  key: "status",
  type: "pill",
  options: [
    { label: "All", value: "" },
    { label: "Paid", value: "paid" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
  ],
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "",
  })
  const [page, setPage] = useState(1)

  const { orders, pagination, isLoading, isFetching } = useAdminOrdersTable({
    page,
    limit: 20,
    search: search || undefined,
    status: filterValues.status || undefined,
  })

  function handleFilterChange(key: string, value: string) {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const columns = useMemo(() => createAdminOrderColumns(), [])

  const totalPages = pagination?.totalPages ?? 1

  return (
    <>
      <title>Orders – Chefalio Admin</title>

      <div className="space-y-4 max-w-7xl mx-auto">
        <PageHeader
          title="Orders"
          description={`View and track all cookbook purchases · ${pagination?.total ?? 0} total`}
          icon={ShoppingCartSimpleIcon}
          iconTone="success"
        />

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={ShoppingCartSimpleIcon}
          emptyMessage="No orders found"
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          searchPlaceholder="Search by cookbook title or email..."
          filterConfigs={[STATUS_FILTER]}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          pagination={
            totalPages > 1
              ? {
                  page,
                  totalPages,
                  total: pagination?.total ?? 0,
                  itemLabel: "orders",
                  onPageChange: setPage,
                }
              : undefined
          }
        />
      </div>
    </>
  )
}
