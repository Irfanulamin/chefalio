import axiosInstance from "@/hooks/axios/interceptors"

export type TableFetcherKey = [
  string,
  Record<string, string | number | boolean | undefined>,
]

export const tableFetcher = ([url, params]: TableFetcherKey) =>
  axiosInstance.get(url, { params }).then((r) => r.data)
