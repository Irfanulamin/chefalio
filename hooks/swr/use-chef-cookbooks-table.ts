import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { MyCookbooksResponse } from "@/types/chef-dashboard.type"

export function useChefCookbooksTable() {
  const { data, isLoading, isValidating, mutate } =
    useSWR<MyCookbooksResponse>(
      ["/cookbooks/my-cookbooks", { limit: 100 }],
      tableFetcher,
      { revalidateOnFocus: false },
    )

  return {
    cookbooks: data?.data ?? [],
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}
