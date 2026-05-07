import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios/interceptors";
import { Recipe } from "@/types/recipes.type";
import { Cookbook } from "@/hooks/useCookbook";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: "user" | "chef" | "admin";
  profile_url: string;
  isActive: boolean;
  authProvider: "local" | "google" | "facebook";
}

export interface AllUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface UserAnalyticsData {
  totalUsers: number;
  totalAdmins: number;
  totalChefs: number;
  totalMembers: number;
  activeAdmins: number;
  activeChefs: number;
  activeMembers: number;
  recentJoinedByRole: { date: string; role: string; count: number }[];
}

export interface UserAnalyticsResponse {
  success: boolean;
  statusCode: number;
  data: UserAnalyticsData;
}

export interface AdminEarningsData {
  totalRevenue: number;
  totalProfit: number;
  profitRate: string;
  totalOrders: number;
  salesGraph: { date: string; amount: number; orders: number }[];
  top3MostSoldCookbooks: {
    cookbookId: string;
    cookbookTitle: string;
    cookbookImage: string;
    totalSold: number;
    totalRevenue: number;
  }[];
}

export interface AdminEarningsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminEarningsData;
}

export interface AllRecipesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    recipes: Recipe[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AllCookbooksResponse {
  success: boolean;
  message: string;
  data: Cookbook[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── All Users ────────────────────────────────────────────────────────────────

export function useAllUsers(params: {
  page?: number;
  limit?: number;
  role?: "user" | "chef" | "admin" | undefined;
  search?: string;
  isActive?: boolean | undefined;
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => {
      const p: Record<string, string | number> = {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      };
      if (params.search) p.search = params.search;
      if (params.role) p.role = params.role;
      if (params.isActive !== undefined) p.isActive = String(params.isActive);
      return axiosInstance
        .get<AllUsersResponse>("/users/all", { params: p })
        .then((res) => res.data);
    },
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });

  return {
    users: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    error,
  };
}

// ─── User Analytics ───────────────────────────────────────────────────────────

export function useUserAnalytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-user-analytics"],
    queryFn: () =>
      axiosInstance
        .get<UserAnalyticsResponse>("/users/dashboard/analytics")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  return { analytics: data?.data, isLoading, error };
}

// ─── Admin Earnings ───────────────────────────────────────────────────────────

export function useAdminEarnings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-earnings"],
    queryFn: () =>
      axiosInstance
        .get<AdminEarningsResponse>("/cookbook-purchase/analytics/admin")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  return { earnings: data?.data, isLoading, error };
}

// ─── Admin Update User ────────────────────────────────────────────────────────

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { role?: string; isActive?: boolean };
    }) =>
      axiosInstance
        .patch(`/users/update/${id}`, payload)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-analytics"] });
    },
  });
}

// ─── All Recipes (Admin) ──────────────────────────────────────────────────────

export function useAdminRecipes(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["admin-recipes", params],
    queryFn: () =>
      axiosInstance
        .get<AllRecipesResponse>("/recipes/all", {
          params: {
            page: params.page ?? 1,
            limit: params.limit ?? 20,
            search: params.search ?? "",
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });

  return {
    recipes: data?.data?.recipes ?? [],
    pagination: data?.data?.pagination,
    isLoading,
    isFetching,
    error,
  };
}

// ─── Admin Delete Recipe ──────────────────────────────────────────────────────

export function useAdminDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/recipes/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
    },
  });
}

// ─── All Cookbooks (Admin) ────────────────────────────────────────────────────

export function useAdminCookbooks(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["admin-cookbooks", params],
    queryFn: () =>
      axiosInstance
        .get<AllCookbooksResponse>("/cookbooks", {
          params: {
            page: params.page ?? 1,
            limit: params.limit ?? 20,
            search: params.search ?? "",
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });

  return {
    cookbooks: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    error,
  };
}

// ─── Admin Delete Cookbook ────────────────────────────────────────────────────

export function useAdminDeleteCookbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/cookbooks/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cookbooks"] });
    },
  });
}
