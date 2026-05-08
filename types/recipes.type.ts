export interface RecipeApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    recipes: Recipe[];
    pagination: Pagination;
  };
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  authorId: Author; // was: author: Author
  ingredients: string[];
  instructions: Instruction[];
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advance";
  images: string[];
  lovedCount: number;
  savedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  profile_url: string; // was: userId: string + image: string
}

export interface Instruction {
  _id: string;
  step: number;
  instruction: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SavedRecipeApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SavedRecipe[];
}

export interface SavedRecipe {
  _id: string;
  userId: string;
  recipeId: Recipe;
  isLoved: boolean;
  lovedAt: string | null;
  isSaved: boolean;
  savedAt: string | null;
  updatedAt: string;
}

export interface RecipeStats {
  isLoved: boolean;
  isSaved: boolean;
}

export type BatchStatsMap = Record<string, RecipeStats>;
