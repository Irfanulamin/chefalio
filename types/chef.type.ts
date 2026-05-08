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
  data: {
    recipes: Recipe[];
    pagination: Pagination;
  };
}

export interface GetChefCookbooksResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    cookbooks: Cookbook[];
    pagination: ChefPagination;
  };
}
