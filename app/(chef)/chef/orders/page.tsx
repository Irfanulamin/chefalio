"use client"

import { useState, useMemo } from "react"
import { useChefOrdersTable } from "@/hooks/swr/use-chef-orders-table"
import { useUpdateOrderStatus, type PaymentStatus } from "@/hooks/useChefs"
import { DataTable, type FilterConfig } from "@/components/ui/data-table"
import { createChefOrderColumns } from "./columns"
import { toast } from "sonner"
import { PackageIcon } from "@phosphor-icons/react/dist/ssr"

const STATUS_FILTER: FilterConfig = {
  key: "status",
  type: "pill",
  options: [
    { label: "All", value: "" },
    { label: "Paid", value: "paid" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Pending", value: "pending" },
    { label: "Refunded", value: "refunded" },
  ],
}

export default function ChefOrdersPage() {
  const { orders, isLoading, isFetching, refresh } = useChefOrdersTable()
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus()
  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: "",
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const statusFilter = filterValues.status
    return orders.filter((o) => {
      const matchesStatus = !statusFilter || o.paymentStatus === statusFilter
      const matchesSearch =
        !q ||
        o.cookbookTitle.toLowerCase().includes(q) ||
        o.receiptEmail.toLowerCase().includes(q) ||
        o.billingAddress?.name?.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [orders, search, filterValues.status])

  function handleUpdateStatus(
    purchaseId: string,
    paymentStatus: "shipped" | "delivered",
  ) {
    updateStatus(
      { purchaseId, paymentStatus },
      {
        onSuccess: () => {
          toast.success(`Order marked as ${paymentStatus}.`, {
            position: "bottom-right",
          })
          refresh()
        },
        onError: () =>
          toast.error("Failed to update order status.", {
            position: "bottom-right",
          }),
      },
    )
  }

  const columns = useMemo(
    () =>
      createChefOrderColumns({
        onUpdateStatus: handleUpdateStatus,
        isUpdating,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isUpdating],
  )

  return (
    <>
      <title>Orders – Chefalio</title>

      <div className="space-y-5 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--cs-text-primary)" }}>Orders</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
              {isFetching && (
                <span className="ml-2 text-xs">Refreshing…</span>
              )}
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyIcon={PackageIcon}
          emptyMessage={
            search || filterValues.status
              ? "No orders match your filter"
              : "No orders yet"
          }
          onSearchChange={setSearch}
          searchPlaceholder="Search by cookbook, email, name…"
          filterConfigs={[STATUS_FILTER]}
          filterValues={filterValues}
          onFilterChange={(key, value) =>
            setFilterValues((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>
    </>
  )
}
