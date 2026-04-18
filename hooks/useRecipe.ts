import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import axiosInstance from "./axios/interceptors";
import {
  Recipe,
  RecipeApiResponse,
  SavedRecipeApiResponse,
} from "@/types/recipes.type";

// Shape of one recipe's stats
export interface RecipeStats {
  isLoved: boolean;
  isSaved: boolean;
}

// Shape of the batch response: { [recipeId]: RecipeStats }
export type BatchStatsMap = Record<string, RecipeStats>;

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

  return {
    recipes: data,
    isLoading,
    isFetching,
    error,
  };
}

export function useSingleRecipe(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () =>
      axiosInstance
        .get<RecipeApiResponse>(`/recipes/${id}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  return {
    singleRecipe: data,
    isSingleRecipeLoading: isLoading,
    singleRecipeError: error,
  };
}

/* =========================
   2. BATCH STATS HOOK
   — replaces useRecipeStats for the grid/list.
   — Call once with the current page's recipe IDs.
   — Returns the full map + a helper to read one entry.
========================= */
export function useBatchRecipeStats(recipeIds: string[]) {
  const { data, isLoading, isFetching } = useQuery({
    // Key includes the sorted IDs so different pages get different cache entries
    queryKey: ["recipe-stats-batch", [...recipeIds].sort().join(",")],
    queryFn: () =>
      axiosInstance
        .post<BatchStatsMap>("/recipe-interaction/stats/batch", { recipeIds })
        .then((res) => res.data),
    enabled: recipeIds.length > 0,
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  // Helper: statsFor(id) always returns something safe
  const statsFor = (id: string): RecipeStats =>
    data?.[id] ?? { isLoved: false, isSaved: false };

  return { statsMap: data, statsFor, isLoading, isFetching };
}

/* =========================
   3. SINGLE RECIPE STATS HOOK
   — kept only for the detail page (/recipes/[id])
   — do NOT use this in grids/lists
========================= */
export function useRecipeStats(id?: string) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["recipe-stats", id],
    queryFn: () =>
      axiosInstance
        .get<RecipeStats>(`/recipe-interaction/stats/${id}`)
        .then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60,
  });

  return { stats: data, isLoading, isFetching, error };
}

/* =========================
   SHARED CACHE PATCHER
   Patches every cached "recipes" page that contains the target id.
   Works correctly on page 4, page 10, any page.
========================= */
function patchRecipesCache(id: string, patch: Partial<Recipe>) {
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

// Patches the batch-stats cache entry that contains this recipe id
function patchBatchStatsCache(id: string, patch: Partial<RecipeStats>) {
  queryClient.setQueriesData<BatchStatsMap>(
    { queryKey: ["recipe-stats-batch"], exact: false },
    (old) => {
      if (!old || !(id in old)) return old;
      return { ...old, [id]: { ...old[id], ...patch } };
    },
  );
}

/* =========================
   4. TOGGLE LOVE
========================= */
export function useToggleLove() {
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance
        .post<{
          isLoved: boolean;
          success: boolean;
        }>(`/recipe-interaction/love/${id}`)
        .then((res) => res.data),

    onMutate: async (id) => {
      // Cancel any in-flight refetches so they don't stomp our optimistic update
      await queryClient.cancelQueries({ queryKey: ["recipe-stats-batch"] });
      await queryClient.cancelQueries({ queryKey: ["recipe-stats", id] });
      await queryClient.cancelQueries({ queryKey: ["recipes"] });

      // Snapshot current state from the batch cache (works on any page)
      const batchEntries = queryClient.getQueriesData<BatchStatsMap>({
        queryKey: ["recipe-stats-batch"],
      });
      const currentStats = batchEntries
        .map(([, map]) => map?.[id])
        .find(Boolean) ?? { isLoved: false, isSaved: false };

      // Snapshot for rollback
      const previousBatch = batchEntries;
      const previousSingle = queryClient.getQueryData<RecipeStats>([
        "recipe-stats",
        id,
      ]);

      // Find current lovedCount from whichever cached recipes page holds this recipe
      const allRecipePages = queryClient.getQueriesData<RecipeApiResponse>({
        queryKey: ["recipes"],
      });
      const currentRecipe = allRecipePages
        .flatMap(([, page]) => page?.data?.recipes ?? [])
        .find((r) => r._id === id);

      const wasLoved = currentStats.isLoved;

      // Optimistically update the batch stats cache
      patchBatchStatsCache(id, { isLoved: !wasLoved });

      // Optimistically update the single stats cache (detail page)
      queryClient.setQueryData(
        ["recipe-stats", id],
        (old: RecipeStats | undefined) =>
          old ? { ...old, isLoved: !wasLoved } : old,
      );

      // Optimistically update the lovedCount in the recipe list
      if (currentRecipe) {
        patchRecipesCache(id, {
          lovedCount: wasLoved
            ? currentRecipe.lovedCount - 1
            : currentRecipe.lovedCount + 1,
        });
      }

      return { previousBatch, previousSingle, wasLoved };
    },

    onError: (_err, id, context) => {
      // Roll back everything
      if (context?.previousBatch) {
        context.previousBatch.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSingle !== undefined) {
        queryClient.setQueryData(["recipe-stats", id], context.previousSingle);
      }
      // Re-fetch recipes list to restore counts
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },

    onSettled: (_data, _error, id) => {
      // Re-sync in background — the optimistic update already made UI feel instant
      queryClient.invalidateQueries({ queryKey: ["recipe-stats-batch"] });
      queryClient.invalidateQueries({ queryKey: ["recipe-stats", id] });
      queryClient.invalidateQueries({ queryKey: ["loved-recipes"] });
    },
  });
}

/* =========================
   5. TOGGLE SAVE
========================= */
export function useToggleSave() {
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance
        .post<{
          isSaved: boolean;
          success: boolean;
        }>(`/recipe-interaction/save/${id}`)
        .then((res) => res.data),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["recipe-stats-batch"] });
      await queryClient.cancelQueries({ queryKey: ["recipe-stats", id] });
      await queryClient.cancelQueries({ queryKey: ["recipes"] });

      const batchEntries = queryClient.getQueriesData<BatchStatsMap>({
        queryKey: ["recipe-stats-batch"],
      });
      const currentStats = batchEntries
        .map(([, map]) => map?.[id])
        .find(Boolean) ?? { isLoved: false, isSaved: false };

      const previousBatch = batchEntries;
      const previousSingle = queryClient.getQueryData<RecipeStats>([
        "recipe-stats",
        id,
      ]);

      const allRecipePages = queryClient.getQueriesData<RecipeApiResponse>({
        queryKey: ["recipes"],
      });
      const currentRecipe = allRecipePages
        .flatMap(([, page]) => page?.data?.recipes ?? [])
        .find((r) => r._id === id);

      const wasSaved = currentStats.isSaved;

      patchBatchStatsCache(id, { isSaved: !wasSaved });

      queryClient.setQueryData(
        ["recipe-stats", id],
        (old: RecipeStats | undefined) =>
          old ? { ...old, isSaved: !wasSaved } : old,
      );

      if (currentRecipe) {
        patchRecipesCache(id, {
          savedCount: wasSaved
            ? currentRecipe.savedCount - 1
            : currentRecipe.savedCount + 1,
        });
      }

      return { previousBatch, previousSingle, wasSaved };
    },

    onError: (_err, id, context) => {
      if (context?.previousBatch) {
        context.previousBatch.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSingle !== undefined) {
        queryClient.setQueryData(["recipe-stats", id], context.previousSingle);
      }
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },

    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: ["recipe-stats-batch"] });
      queryClient.invalidateQueries({ queryKey: ["recipe-stats", id] });
      queryClient.invalidateQueries({ queryKey: ["saved-recipes"] });
    },
  });
}

/* =========================
   6. SAVED RECIPES HOOK
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
   7. LOVED RECIPES HOOK
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
