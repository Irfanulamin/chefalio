import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./axios";
import type {
  Chef,
  ChefPagination,
  GetChefsResponse,
  GetChefResponse,
  GetChefCountResponse,
  GetChefRecipesResponse,
  GetChefCookbooksResponse,
} from "@/types/chef.type";

export type {
  Chef,
  ChefPagination,
  GetChefsResponse,
  GetChefResponse,
  GetChefCountResponse,
  GetChefRecipesResponse,
  GetChefCookbooksResponse,
};

/** GET /chefs — paginated list of all chefs */
export function useChefs(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["chefs", params],
    queryFn: () =>
      axiosInstance
        .get<GetChefsResponse>("/chefs", { params })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  return { chefs: data, isLoading, isFetching, error };
}

/** GET /chefs/count — total number of chefs */
export function useChefCount() {
  const { data, isLoading } = useQuery({
    queryKey: ["chefs-count"],
    queryFn: () =>
      axiosInstance
        .get<GetChefCountResponse>("/chefs/count")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  return { count: data?.data?.total ?? 0, isLoading };
}

/** GET /chefs/:id — single chef profile */
export function useChef(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chef", id],
    queryFn: () =>
      axiosInstance
        .get<GetChefResponse>(`/chefs/${id}`)
        .then((res) => res.data),
    staleTime: 1000 * 60,
    enabled: !!id,
  });

  return { chef: data?.data, isLoading, error };
}

/** GET /chefs/:id/recipes — recipes by a specific chef */
export function useChefRecipes(
  id: string,
  params?: { page?: number; limit?: number },
) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["chef-recipes", id, params],
    queryFn: () =>
      axiosInstance
        .get<GetChefRecipesResponse>(`/chefs/${id}/recipes`, { params })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    enabled: !!id,
    placeholderData: (prev) => prev,
  });

  return {
    recipes: data?.data?.recipes,
    pagination: data?.data?.pagination,
    isLoading,
    isFetching,
    error,
  };
}

/** GET /chefs/:id/cookbooks — cookbooks by a specific chef */
export function useChefCookbooks(
  id: string,
  params?: { page?: number; limit?: number },
) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["chef-cookbooks", id, params],
    queryFn: () =>
      axiosInstance
        .get<GetChefCookbooksResponse>(`/chefs/${id}/cookbooks`, { params })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    enabled: !!id,
    placeholderData: (prev) => prev,
  });

  return {
    cookbooks: data?.data?.cookbooks,
    pagination: data?.data?.pagination,
    isLoading,
    isFetching,
    error,
  };
}

/** GET /chefs/:id/related — other chefs to suggest */
export function useRelatedChefs(id: string, limit = 4) {
  const { data, isLoading } = useQuery({
    queryKey: ["chef-related", id],
    queryFn: () =>
      axiosInstance
        .get<GetChefsResponse>(`/chefs/${id}/related`, { params: { limit } })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    enabled: !!id,
  });

  return { relatedChefs: data?.data ?? [], isLoading };
}
