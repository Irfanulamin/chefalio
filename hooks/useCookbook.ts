import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "./axios";
import { useRouter } from "next/navigation";
import type {
  Cookbook,
  GetCookbooksResponse,
  GetCookbookResponse,
} from "@/types/cookbook.type";

export type { Cookbook, GetCookbooksResponse, GetCookbookResponse };

export function useCookbooks(params?: {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [
      "cookbooks",
      params?.search,
      params?.page,
      params?.limit,
      params?.author,
    ],
    queryFn: () =>
      axiosInstance
        .get<GetCookbooksResponse>("/cookbooks", { params })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  return {
    cookbooks: data,
    isLoading,
    isFetching,
    error,
  };
}

export function useInfiniteCookbooks(params?: {
  limit?: number;
  search?: string;
  author?: string;
}) {
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["cookbooks-infinite", params?.search, params?.limit, params?.author],
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get<GetCookbooksResponse>("/cookbooks", {
          params: { ...params, page: pageParam },
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60,
  });

  const cookbooks = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;

  return { cookbooks, total, isLoading, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage };
}

export function useCookbook(id: string) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["cookbook", id],
    queryFn: () =>
      axiosInstance
        .get<GetCookbookResponse>(`/cookbooks/${id}`)
        .then((res) => res.data),
    staleTime: 1000 * 60,
    enabled: !!id,
  });

  return {
    cookbook: data?.data,
    isLoading,
    isFetching,
    error,
  };
}

export function usePaymentCookbook() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload: {
      cookbookId: string;
      receiptEmail: string;
      billingAddress: {
        name: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    }) => {
      return axiosInstance
        .post("/cookbook-purchase/payment", payload)
        .then((res) => res.data);
    },

    onSuccess: (data) => {
      router.push(data?.redirectUrl);
    },
  });

  return {
    payCookbook: mutation.mutate,
    payCookbookAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function usePurchaseHistory() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["purchase-history"],
    queryFn: () =>
      axiosInstance
        .get<GetCookbookResponse>("/cookbook-purchase/history")
        .then((res) => res.data),
    staleTime: 1000 * 60,
  });

  return {
    purchaseHistory: data,
    isLoading,
    isFetching,
    error,
  };
}
