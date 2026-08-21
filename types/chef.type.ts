import { Recipe, Pagination } from "@/types/recipes.type";
import { Cookbook } from "@/types/cookbook.type";

export interface Chef {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  profile_url: string;
  role: "chef";
  recipeCount?: number;
  cookbookCount?: number;
  followerCount?: number;
  /** Whether the viewer already follows this chef — computed server-side
     against the requesting user, not derived on the client. */
  isFollowing?: boolean;
}

export interface ChefPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetChefsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Chef[];
  pagination: ChefPagination;
}

export interface GetChefResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Chef;
}

export interface GetChefCountResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: { total: number };
}

export interface GetChefRecipesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Recipe[];
  pagination: Pagination;
}

export interface GetChefCookbooksResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Cookbook[];
  pagination: ChefPagination;
}
