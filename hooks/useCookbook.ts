import { useQuery } from "@tanstack/react-query";
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
