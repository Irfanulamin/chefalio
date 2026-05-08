import { Recipe } from "@/types/recipes.type";
import { Cookbook } from "@/types/cookbook.type";

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

export interface AdminRecipeTrendItem {
  date: string;
  count: number;
}

export interface AdminTopChef {
  chefId: string;
  fullName: string;
  username: string;
  profileUrl: string;
  totalRevenue: number;
  totalSales: number;
}

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
