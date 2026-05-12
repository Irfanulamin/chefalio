import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

/** GET /chefs — infinite paginated list of all chefs */
export function useInfiniteChefs(params?: {
  limit?: number;
  search?: string;
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
    queryKey: ["chefs-infinite", params?.search, params?.limit],
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get<GetChefsResponse>("/chefs", {
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

  const chefs = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;

  return { chefs, total, isLoading, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage };
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

/** GET /chefs/:id/recipes — infinite recipes by a specific chef */
export function useInfiniteChefRecipes(
  id: string,
  params?: { limit?: number },
) {
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chef-recipes-infinite", id, params],
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get<GetChefRecipesResponse>(`/chefs/${id}/recipes`, {
          params: { ...params, page: pageParam },
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60,
    enabled: !!id,
  });

  const recipes = data?.pages.flatMap((p) => p.data.recipes) ?? [];
  const total = data?.pages[0]?.data.pagination.total ?? 0;

  return { recipes, total, isLoading, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage };
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

/** GET /chefs/:id/cookbooks — infinite cookbooks by a specific chef */
export function useInfiniteChefCookbooks(
  id: string,
  params?: { limit?: number },
) {
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chef-cookbooks-infinite", id, params],
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get<GetChefCookbooksResponse>(`/chefs/${id}/cookbooks`, {
          params: { ...params, page: pageParam },
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60,
    enabled: !!id,
  });

  const cookbooks = data?.pages.flatMap((p) => p.data.cookbooks) ?? [];
  const total = data?.pages[0]?.data.pagination.total ?? 0;

  return { cookbooks, total, isLoading, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage };
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
