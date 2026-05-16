import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { ChefApplication, ChefApplicationStats } from "@/types/chef-application.type"

interface ApplicationsResponse {
  success: boolean
  data: ChefApplication[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface StatsResponse {
  success: boolean
  data: ChefApplicationStats
}

export function useChefApplicationsTable(params: {
  page: number
  limit: number
  status?: string
}) {
  const p = {
    page: params.page,
    limit: params.limit,
    ...(params.status && { status: params.status }),
  }

  const { data, isLoading, isValidating, mutate } =
    useSWR<ApplicationsResponse>(
      ["/chef-applications", p],
      tableFetcher,
      { keepPreviousData: true, revalidateOnFocus: false },
    )

  return {
    applications: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}

export function useChefApplicationStatsTable() {
  const { data, isLoading } = useSWR<StatsResponse>(
    ["/chef-applications/stats", {}],
    tableFetcher,
    { revalidateOnFocus: false },
  )

  return {
    stats: data?.data,
    isLoading,
  }
}
