import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios/interceptors";
import {
  Recipe,
  RecipeApiResponse,
  SavedRecipeApiResponse,
} from "@/types/recipes.type";

interface RecipeStats {
  isLoved: boolean;
  loveCount: number;
  isSaved: boolean;
  saveCount: number;
}

/* =========================
   1. RECIPES LIST HOOK
========================= */
export function useRecipes(params?: {
  search?: string;
  page?: number;
  limit?: number;
  tags?: string;
  difficulty?: string;
  author?: string;
  id?: string; // For single recipe fetch
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["recipes", params],
    queryFn: () =>
      axiosInstance
        .get<RecipeApiResponse>("/recipes/all", { params })
        .then((res) => res.data),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  const {
    data: singleRecipe,
    isLoading: isSingleRecipeLoading,
    error: singleRecipeError,
  } = useQuery({
    queryKey: ["recipe", params?.id], // ✅ unique key
    queryFn: () =>
      axiosInstance
        .get<RecipeApiResponse>(`/recipes/${params?.id}`)
        .then((res) => res.data),
    staleTime: 1000 * 60,
    enabled: !!params?.id, // ✅ prevent undefined calls
  });
  return {
    recipes: data,
    isLoading,
    isFetching,
    error,
    singleRecipe,
    isSingleRecipeLoading,
    singleRecipeError,
  };
}

/* =========================
   2. RECIPE STATS HOOK
========================= */
export function useRecipeStats(id?: string) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["recipe-stats", id],
    queryFn: () =>
      axiosInstance
        .get(`/recipe-interaction/stats/${id}`)
        .then((res) => res.data),
    enabled: !!id,
  });

  return { stats: data, isLoading, isFetching, error };
}

/* =========================
   SHARED OPTIMISTIC UPDATER
========================= */
// Patches all cached recipe list pages that contain the target recipe
function patchRecipesCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  patch: Partial<Recipe>,
) {
  queryClient.setQueriesData<RecipeApiResponse>(
    { queryKey: ["recipes"], exact: false },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: {
          ...old.data,
          recipes: old.data.recipes.map((recipe) =>
            recipe._id === id ? { ...recipe, ...patch } : recipe,
          ),
        },
      };
    },
  );
}
/* =========================
   3. TOGGLE LOVE (LIKE)
========================= */
export function useToggleLove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.post(`/recipe-interaction/love/${id}`),

    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["recipe-stats", id] }),
        queryClient.cancelQueries({ queryKey: ["recipes"] }),
      ]);

      const previousStats = queryClient.getQueryData<RecipeStats>([
        "recipe-stats",
        id,
      ]);
      const previousRecipes = queryClient.getQueriesData<RecipeApiResponse>({
        queryKey: ["recipes"],
      });

      // Read current recipe from list cache
      const cachedRecipes = previousRecipes?.[0]?.[1];
      const currentRecipe = cachedRecipes?.data?.recipes?.find(
        (r) => r._id === id,
      );

      // Update recipe-stats cache (isLoved toggle)
      queryClient.setQueryData(
        ["recipe-stats", id],
        (old: RecipeStats | undefined) => {
          if (!old) return old;
          return { ...old, isLoved: !old.isLoved };
        },
      );

      // Update recipes list cache using lovedCount from the recipe itself
      if (currentRecipe) {
        patchRecipesCache(queryClient, id, {
          lovedCount: previousStats?.isLoved
            ? currentRecipe.lovedCount - 1
            : currentRecipe.lovedCount + 1,
        });
      }

      return { previousStats, previousRecipes };
    },

    onError: (_err, id, context) => {
      // Roll back both caches
      if (context?.previousStats) {
        queryClient.setQueryData(["recipe-stats", id], context.previousStats);
      }
      if (context?.previousRecipes) {
        context.previousRecipes.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: (_data, _error, id) => {
      // Revalidate in background — no visual flash since optimistic update already applied
      queryClient.invalidateQueries({ queryKey: ["recipe-stats", id] });
      queryClient.invalidateQueries({ queryKey: ["loved-recipes"] });
    },
  });
}

/* =========================
   4. TOGGLE SAVE (BOOKMARK)
========================= */
export function useToggleSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.post(`/recipe-interaction/save/${id}`),

    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["recipe-stats", id] }),
        queryClient.cancelQueries({ queryKey: ["recipes"] }),
      ]);

      const previousStats = queryClient.getQueryData<RecipeStats>([
        "recipe-stats",
        id,
      ]);
      const previousRecipes = queryClient.getQueriesData<RecipeApiResponse>({
        queryKey: ["recipes"],
      });

      const cachedRecipes = previousRecipes?.[0]?.[1];
      const currentRecipe = cachedRecipes?.data?.recipes?.find(
        (r) => r._id === id,
      );

      queryClient.setQueryData(
        ["recipe-stats", id],
        (old: RecipeStats | undefined) => {
          if (!old) return old;
          return { ...old, isSaved: !old.isSaved };
        },
      );

      if (currentRecipe) {
        patchRecipesCache(queryClient, id, {
          savedCount: previousStats?.isSaved
            ? currentRecipe.savedCount - 1
            : currentRecipe.savedCount + 1,
        });
      }

      return { previousStats, previousRecipes };
    },

    onError: (_err, id, context) => {
      if (context?.previousStats) {
        queryClient.setQueryData(["recipe-stats", id], context.previousStats);
      }
      if (context?.previousRecipes) {
        context.previousRecipes.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: ["recipe-stats", id] });
      queryClient.invalidateQueries({ queryKey: ["saved-recipes"] }); // Also refresh saved recipes list
    },
  });
}

/* =========================
   5. SAVED RECIPES HOOK
========================= */
export function useSavedRecipes() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["saved-recipes"],
    queryFn: () =>
      axiosInstance
        .get<SavedRecipeApiResponse>("/recipe-interaction/saved")
        .then((res) => res.data),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });
  return { savedRecipes: data, isLoading, isFetching, error };
}

/* =========================
   6. LOVED RECIPE HOOK
========================= */
export function useLovedRecipes() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["loved-recipes"],
    queryFn: () =>
      axiosInstance
        .get<SavedRecipeApiResponse>("/recipe-interaction/loved")
        .then((res) => res.data),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });
  return { lovedRecipes: data, isLoading, isFetching, error };
}
