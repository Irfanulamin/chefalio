import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { ChefOrdersResponse } from "@/types/chef-dashboard.type"

export function useChefOrdersTable() {
  const { data, isLoading, isValidating, mutate } = useSWR<ChefOrdersResponse>(
    ["/cookbook-purchase/orders", {}],
    tableFetcher,
    { revalidateOnFocus: false },
  )

  return {
    orders: data?.data ?? [],
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}
