import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/hooks/axios/interceptors";
import { Recipe } from "@/types/recipes.type";
import { Cookbook } from "@/hooks/useCookbook";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MyRecipesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Recipe[];
}

export interface MyCookbooksResponse {
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

export interface DifficultyCount {
  difficulty: "beginner" | "intermediate" | "advance";
  count: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface TopAuthor {
  userId: string;
  fullName: string;
  username: string;
  count: number;
}

export interface DashboardAnalytics {
  totalRecipes: number;
  recipesPerDifficulty: DifficultyCount[];
  topTags: TagCount[];
  top3MostUploadedAuthors: TopAuthor[];
}

export interface DashboardAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardAnalytics;
}

// ─── Chef Engagement Analytics (recipe-interaction) ──────────────────────────

export interface RecipeEngagement {
  _id: string;
  title: string;
  thumbnail: string;
  lovedCount: number;
  savedCount: number;
  uniqueUsersCount: number;
  engagementScore: number;
}

export interface ChefEngagementAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  totalReturned: number;
  recipes: RecipeEngagement[];
}

// ─── Chef Earnings Analytics (cookbook-purchase) ──────────────────────────────

export type RevenuePeriod = 'daily' | 'weekly' | 'monthly' | 'lifetime';

export interface SalesGraphPoint {
  date: string;
  amount: number;
  orders: number;
}

export interface ChefEarningsData {
  totalEarned: number;
  totalProfit: number;
  profitRate: string;
  totalOrders: number;
  period: string;
  salesGraph: SalesGraphPoint[];
}

export interface ChefEarningsAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ChefEarningsData;
}

// ─── Chef Orders (cookbook-purchase) ─────────────────────────────────────────

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "shipped"
  | "delivered";

export interface BillingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ChefOrder {
  _id: string;
  cookbookId: string;
  buyerId: string;
  chefId: string;
  cookbookTitle: string;
  cookbookImage: string;
  price: number;
  stripeSessionId: string;
  paymentStatus: PaymentStatus;
  billingAddress: BillingAddress;
  receiptEmail: string;
  createdAt: string;
}

export interface ChefOrdersResponse {
  success: boolean;
  message: string;
  data: ChefOrder[];
}

export interface CreateRecipePayload {
  title: string;
  description: string;
  ingredients: string[];
  tags: string[];
  instructions: { step: number; instruction: string }[];
  difficulty: "beginner" | "intermediate" | "advance";
  images: File[];
}

export interface UpdateRecipePayload {
  title?: string;
  description?: string;
  ingredients?: string[];
  tags?: string[];
  instructions?: { step: number; instruction: string }[];
  difficulty?: string;
  images?: File[];
  removeImages?: string[];
}

export interface CreateCookbookPayload {
  title: string;
  description: string;
  price: number;
  stockCount: number;
  image: File;
}

export interface UpdateCookbookPayload {
  title?: string;
  description?: string;
  price?: number;
  stockCount?: number;
  image?: File;
}

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
