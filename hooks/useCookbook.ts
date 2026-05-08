import { useMutation, useQuery } from "@tanstack/react-query";
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
