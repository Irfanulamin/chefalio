import useSWR from "swr"
import { tableFetcher } from "./table-fetcher"
import type { MyRecipesResponse } from "@/types/chef-dashboard.type"

export function useChefRecipesTable() {
  const { data, isLoading, isValidating, mutate } = useSWR<MyRecipesResponse>(
    ["/recipes/my-recipes", {}],
    tableFetcher,
    { revalidateOnFocus: false },
  )

  return {
    recipes: data?.data ?? [],
    isLoading,
    isFetching: isValidating,
    refresh: () => mutate(),
  }
}
