import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { AdminOrdersResponse } from "@/types/admin.type"

interface Params {
  page: number
  limit: number
  search?: string
  status?: string
}

export function useAdminOrdersTable(params: Params) {
  const p = {
    page: params.page,
    limit: params.limit,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
  }

  const { data, isLoading, isValidating, mutate } =
    useSWR<AdminOrdersResponse>(
      ["/cookbook-purchase/admin/orders", p],
      tableFetcher,
      { keepPreviousData: true, revalidateOnFocus: false },
    )

  return {
    orders: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}
