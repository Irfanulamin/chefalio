import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./axios";

export interface Author {
  _id: string;
  userId: string;
  fullName: string;
  username: string;
  email: string;
  image?: string; // optional because it's not always present
}

export interface Cookbook {
  _id: string;
  title: string;
  description: string;
  author: Author;
  cookbook_image: string;
  price: number;
  stockCount: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCookbooksResponse {
  success: boolean;
  message: string;
  data: Cookbook[];
  pagination: Pagination;
}

export interface GetCookbookResponse {
  success: boolean;
  message: string;
  data: Cookbook;
}

export function useCookbooks(params?: {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["cookbooks", params],
    queryFn: () =>
      axiosInstance
        .get<GetCookbooksResponse>("/cookbooks", { params })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  return {
    cookbbooks: data,
    isLoading,
    isFetching,
    error,
  };
}

export function useCookbook(id: string) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["cookbooks", id],
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
      if (data?.success === true) {
        window.open(data.redirectUrl, "_blank");
      }
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
