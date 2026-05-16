import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { AllCookbooksResponse } from "@/types/admin.type"

interface Params {
  page: number
  limit: number
  search?: string
}

export function useAdminCookbooksTable(params: Params) {
  const p = {
    page: params.page,
    limit: params.limit,
    search: params.search ?? "",
  }

  const { data, isLoading, isValidating, mutate } =
    useSWR<AllCookbooksResponse>(
      ["/cookbooks", p],
      tableFetcher,
      { keepPreviousData: true, revalidateOnFocus: false },
    )

  return {
    cookbooks: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}
