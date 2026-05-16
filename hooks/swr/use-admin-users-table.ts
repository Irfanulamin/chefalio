import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { AllUsersResponse } from "@/types/admin.type"

interface Params {
  page: number
  limit: number
  search?: string
  role?: string
  isActive?: boolean
}

export function useAdminUsersTable(params: Params) {
  const p = {
    page: params.page,
    limit: params.limit,
    ...(params.search && { search: params.search }),
    ...(params.role && { role: params.role }),
    ...(params.isActive !== undefined && { isActive: params.isActive }),
  }

  const { data, isLoading, isValidating, mutate } = useSWR<AllUsersResponse>(
    ["/users/all", p],
    tableFetcher,
    { keepPreviousData: true, revalidateOnFocus: false },
  )

  return {
    users: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}
