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
  authProvider: "local" | "google";
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
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
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
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
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
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
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

// ─── Admin Update Cookbook ────────────────────────────────────────────────────

export function useAdminUpdateCookbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        price?: number;
        stockCount?: number;
        title?: string;
        description?: string;
      };
    }) =>
      axiosInstance
        .patch(`/cookbooks/admin/${id}`, payload)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cookbooks"] });
    },
  });
}

// ─── Admin Delete User ────────────────────────────────────────────────────────

export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/users/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-analytics"] });
    },
  });
}

// ─── Admin Create User ────────────────────────────────────────────────────────

export function useAdminCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      fullName: string;
      username: string;
      email: string;
      password: string;
      role: string;
    }) =>
      axiosInstance.post("/users/create", payload).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-analytics"] });
    },
  });
}

// ─── Admin Recipe Interactions ────────────────────────────────────────────────

export interface AdminInteractionRecipe {
  _id: string;
  totalLoves: number;
  totalSaves: number;
  engagementScore: number;
  recipe: { title: string; images: string[] };
}

export interface AdminRecipeInteractionsData {
  topEngaged: AdminInteractionRecipe[];
  topLoved: AdminInteractionRecipe[];
  topSaved: AdminInteractionRecipe[];
}

export function useAdminRecipeInteractions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-recipe-interactions"],
    queryFn: () =>
      axiosInstance
        .get<AdminRecipeInteractionsData>("/recipe-interaction/analytics/admin")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { interactions: data, isLoading, error };
}

// ─── Admin Recipe Upload Trend ────────────────────────────────────────────────

export interface AdminRecipeTrendItem {
  date: string;
  count: number;
}

export function useAdminRecipeTrend() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-recipe-trend"],
    queryFn: () =>
      axiosInstance
        .get<{ success: boolean; data: AdminRecipeTrendItem[] }>(
          "/recipes/admin/upload-trend"
        )
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { trend: data?.data ?? [], isLoading, error };
}

// ─── Admin Top Chefs ──────────────────────────────────────────────────────────

export interface AdminTopChef {
  chefId: string;
  fullName: string;
  username: string;
  profileUrl: string;
  totalRevenue: number;
  totalSales: number;
}

export function useAdminTopChefs() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-top-chefs"],
    queryFn: () =>
      axiosInstance
        .get<{ success: boolean; data: AdminTopChef[] }>(
          "/cookbook-purchase/analytics/admin/top-chefs"
        )
        .then((res) => res.data),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { topChefs: data?.data ?? [], isLoading, error };
}

// ─── Admin Orders ─────────────────────────────────────────────────────────────

export interface AdminOrder {
  _id: string;
  cookbookId: string;
  buyerId: string;
  chefId: string;
  cookbookTitle: string;
  cookbookImage: string;
  price: number;
  stripeSessionId: string;
  paymentStatus: string;
  billingAddress: Record<string, string>;
  receiptEmail: string;
  createdAt: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: AdminOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useAdminOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => {
      const p: Record<string, string | number> = {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      };
      if (params.search) p.search = params.search;
      if (params.status) p.status = params.status;
      return axiosInstance
        .get<AdminOrdersResponse>("/cookbook-purchase/admin/orders", {
          params: p,
        })
        .then((res) => res.data);
    },
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  return {
    orders: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isFetching,
    error,
  };
}
