import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { AllRecipesResponse } from "@/types/admin.type"

interface Params {
  page: number
  limit: number
  search?: string
}

export function useAdminRecipesTable(params: Params) {
  const p = {
    page: params.page,
    limit: params.limit,
    search: params.search ?? "",
  }

  const { data, isLoading, isValidating, mutate } = useSWR<AllRecipesResponse>(
    ["/recipes/all", p],
    tableFetcher,
    { keepPreviousData: true, revalidateOnFocus: false },
  )

  return {
    recipes: data?.data?.recipes ?? [],
    pagination: data?.data?.pagination,
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}
