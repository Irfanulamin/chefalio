import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios/interceptors";
import type {
  MyRecipesResponse,
  MyCookbooksResponse,
  DifficultyCount,
  TagCount,
  TopAuthor,
  DashboardAnalytics,
  DashboardAnalyticsResponse,
  RecipeEngagement,
  ChefEngagementAnalyticsResponse,
  RevenuePeriod,
  SalesGraphPoint,
  ChefEarningsData,
  ChefEarningsAnalyticsResponse,
  PaymentStatus,
  BillingAddress,
  ChefOrder,
  ChefOrdersResponse,
  CreateRecipePayload,
  UpdateRecipePayload,
  CreateCookbookPayload,
  UpdateCookbookPayload,
  ChefRecipeAnalyticsData,
  ChefDashboardEarningsData,
} from "@/types/chef-dashboard.type";

export type {
  MyRecipesResponse,
  MyCookbooksResponse,
  DifficultyCount,
  TagCount,
  TopAuthor,
  DashboardAnalytics,
  DashboardAnalyticsResponse,
  RecipeEngagement,
  ChefEngagementAnalyticsResponse,
  RevenuePeriod,
  SalesGraphPoint,
  ChefEarningsData,
  ChefEarningsAnalyticsResponse,
  PaymentStatus,
  BillingAddress,
  ChefOrder,
  ChefOrdersResponse,
  CreateRecipePayload,
  UpdateRecipePayload,
  CreateCookbookPayload,
  UpdateCookbookPayload,
  ChefRecipeAnalyticsData,
  ChefDashboardEarningsData,
};

// ─── My Recipes ───────────────────────────────────────────────────────────────

export function useMyRecipes() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["my-recipes"],
    queryFn: () =>
      axiosInstance
        .get<MyRecipesResponse>("/recipes/my-recipes")
        .then((res) => res.data),
    staleTime: 1000 * 60,
  });

  return {
    myRecipes: data?.data ?? [],
    isLoading,
    isFetching,
    error,
  };
}

// ─── My Cookbooks ─────────────────────────────────────────────────────────────

export function useMyCookbooks() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["my-cookbooks"],
    queryFn: () =>
      axiosInstance
        .get<MyCookbooksResponse>("/cookbooks/my-cookbooks", {
          params: { limit: 100 },
        })
        .then((res) => res.data),
    staleTime: 1000 * 60,
  });

  return {
    myCookbooks: data?.data ?? [],
    isLoading,
    isFetching,
    error,
  };
}

// ─── Dashboard Analytics ──────────────────────────────────────────────────────

export function useDashboardAnalytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: () =>
      axiosInstance
        .get<DashboardAnalyticsResponse>("/recipes/dashboard/analytics")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  return {
    analytics: data?.data,
    isLoading,
    error,
  };
}

// ─── Create Recipe ────────────────────────────────────────────────────────────

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecipePayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      payload.ingredients.forEach((ing) => formData.append("ingredients", ing));
      payload.tags.forEach((tag) => formData.append("tags", tag));
      formData.append("instructions", JSON.stringify(payload.instructions));
      formData.append("difficulty", payload.difficulty);
      payload.images.forEach((img) => formData.append("images", img));

      return axiosInstance
        .post("/recipes/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-analytics"] });
    },
  });
}

// ─── Update Recipe ────────────────────────────────────────────────────────────

export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRecipePayload;
    }) => {
      const formData = new FormData();
      if (payload.title) formData.append("title", payload.title);
      if (payload.description)
        formData.append("description", payload.description);
      if (payload.ingredients)
        payload.ingredients.forEach((ing) =>
          formData.append("ingredients", ing),
        );
      if (payload.tags)
        payload.tags.forEach((tag) => formData.append("tags", tag));
      if (payload.instructions)
        formData.append("instructions", JSON.stringify(payload.instructions));
      if (payload.difficulty) formData.append("difficulty", payload.difficulty);
      if (payload.images)
        payload.images.forEach((img) => formData.append("images", img));
      if (payload.removeImages)
        payload.removeImages.forEach((url) =>
          formData.append("removeImages", url),
        );

      return axiosInstance
        .patch(`/recipes/update/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

// ─── Delete Recipe ────────────────────────────────────────────────────────────

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/recipes/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-analytics"] });
    },
  });
}

// ─── Create Cookbook ──────────────────────────────────────────────────────────

export function useCreateCookbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCookbookPayload) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("price", String(payload.price));
      formData.append("stockCount", String(payload.stockCount));
      formData.append("image", payload.image);

      return axiosInstance
        .post("/cookbooks/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-cookbooks"] });
    },
  });
}

// ─── Update Cookbook ──────────────────────────────────────────────────────────

export function useUpdateCookbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCookbookPayload;
    }) => {
      const formData = new FormData();
      if (payload.title) formData.append("title", payload.title);
      if (payload.description)
        formData.append("description", payload.description);
      if (payload.price !== undefined)
        formData.append("price", String(payload.price));
      if (payload.stockCount !== undefined)
        formData.append("stockCount", String(payload.stockCount));
      if (payload.image) formData.append("image", payload.image);

      return axiosInstance
        .patch(`/cookbooks/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-cookbooks"] });
      queryClient.invalidateQueries({ queryKey: ["cookbooks"] });
    },
  });
}

// ─── Delete Cookbook ──────────────────────────────────────────────────────────

export function useDeleteCookbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/cookbooks/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-cookbooks"] });
    },
  });
}

// ─── Chef Engagement Analytics ────────────────────────────────────────────────

export function useChefEngagementAnalytics(period: RevenuePeriod = "lifetime") {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["chef-engagement-analytics", period],
    queryFn: () =>
      axiosInstance
        .get<ChefEngagementAnalyticsResponse>(
          "/recipe-interaction/analytics/chef",
          { params: { period } },
        )
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  return {
    engagementData: data,
    recipes: data?.recipes ?? [],
    isLoading,
    isFetching,
    error,
  };
}

// ─── Chef Earnings Analytics ──────────────────────────────────────────────────

export function useChefEarningsAnalytics(period: RevenuePeriod = "lifetime") {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["chef-earnings-analytics", period],
    queryFn: () =>
      axiosInstance
        .get<ChefEarningsAnalyticsResponse>(
          "/cookbook-purchase/analytics/chef",
          { params: { period } },
        )
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  return {
    earnings: data?.data,
    isLoading,
    isFetching,
    error,
  };
}

// ─── Chef Orders ──────────────────────────────────────────────────────────────

export function useChefOrders() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["chef-orders"],
    queryFn: () =>
      axiosInstance
        .get<ChefOrdersResponse>("/cookbook-purchase/orders")
        .then((res) => res.data),
    staleTime: 1000 * 30,
  });

  return {
    orders: data?.data ?? [],
    isLoading,
    isFetching,
    error,
  };
}

// ─── Chef Recipe Analytics (dashboard) ───────────────────────────────────────

export function useChefRecipeAnalytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chef-recipe-analytics"],
    queryFn: () =>
      axiosInstance
        .get<{ data: ChefRecipeAnalyticsData }>("/recipes/my/analytics")
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

  return {
    recipeAnalytics: data?.data,
    isLoading,
    error,
  };
}

// ─── Chef Dashboard Earnings (dashboard) ─────────────────────────────────────

export function useChefDashboardEarnings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chef-dashboard-earnings"],
    queryFn: () =>
      axiosInstance
        .get<{ data: ChefDashboardEarningsData }>("/cookbook-purchase/dashboard/chef")
        .then((res) => res.data),
    staleTime: 1000 * 60,
  });

  return {
    dashboardEarnings: data?.data,
    isLoading,
    error,
  };
}

// ─── Update Payment Status ────────────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      purchaseId,
      paymentStatus,
    }: {
      purchaseId: string;
      paymentStatus: "shipped" | "delivered";
    }) =>
      axiosInstance
        .patch(`/cookbook-purchase/update-payment-status/${purchaseId}`, {
          paymentStatus,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chef-orders"] });
      queryClient.invalidateQueries({ queryKey: ["chef-earnings-analytics"] });
    },
  });
}
