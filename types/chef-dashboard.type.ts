import { Recipe } from "@/types/recipes.type";
import { Cookbook } from "@/types/cookbook.type";

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

export type RevenuePeriod = "daily" | "weekly" | "monthly" | "lifetime";

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

export interface ChefRecipeAnalyticsData {
  /* Headline totals and the four cards the dashboard renders, both computed
     server-side. The dashboard used to derive these from the full
     /recipes/my-recipes payload — every recipe document the chef owns,
     downloaded to produce three integers and four thumbnails. */
  totalRecipes: number;
  totalLoves: number;
  totalSaves: number;
  recentRecipes: {
    _id: string;
    title: string;
    image: string;
    difficulty: string;
    lovedCount: number;
  }[];
  myDifficultyBreakdown: { difficulty: string; count: number }[];
  myTopTags: { tag: string; count: number }[];
  uploadTrend: { date: string; count: number }[];
  topRecipes: {
    _id: string;
    title: string;
    image: string;
    lovedCount: number;
    savedCount: number;
    engagementScore: number;
  }[];
}

export interface ChefDashboardEarningsData {
  /** Counted server-side, replacing a /cookbooks/my-cookbooks?limit=100
   *  fetch whose only use was `.length`. */
  totalCookbooks: number;
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  recentOrders: {
    _id: string;
    cookbookTitle: string;
    cookbookImage: string;
    price: number;
    paymentStatus: string;
    createdAt: string;
    receiptEmail: string;
  }[];
  topCookbooks: {
    cookbookId: string;
    cookbookTitle: string;
    cookbookImage: string;
    totalSold: number;
    totalRevenue: number;
  }[];
}
