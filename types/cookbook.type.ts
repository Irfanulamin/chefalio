import { Author, Pagination } from "@/types/recipes.type";

export interface Cookbook {
  _id: string;
  title: string;
  description: string;
  authorId: Author;
  cookbook_image: string;
  price: number;
  stockCount: number;
}

export interface GetCookbooksResponse {
  success: boolean;
  message: string;
  data: Cookbook[];
  pagination: Pagination;
}

export interface GetCookbookResponse {
  success: boolean;
  message: string;
  data: Cookbook;
}
