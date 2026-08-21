import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import axiosInstance from "./axios/interceptors";
import { toast } from "sonner";
import type {
  Recipe,
  RecipeApiResponse,
  SingleRecipeApiResponse,
  SavedRecipeApiResponse,
  RecipeStats,
  BatchStatsMap,
} from "@/types/recipes.type";
import type { GetChefRecipesResponse } from "@/types/chef.type";

export type { RecipeStats, BatchStatsMap };

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
  sort?: "newest" | "trending" | "popular";
}) {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [
      "recipes",
      params?.search,
      params?.page,
      params?.limit,
      params?.tags,
      params?.difficulty,
      params?.author,
      params?.sort,
    ],
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

/* =========================
   1b. INFINITE RECIPES LIST HOOK
========================= */
export function useInfiniteRecipes(params?: {
  search?: string;
  limit?: number;
  tags?: string;
  difficulty?: string;
  author?: string;
  sort?: "newest" | "trending" | "popular";
}) {
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "recipes-infinite",
      params?.search,
      params?.limit,
      params?.tags,
      params?.difficulty,
      params?.author,
      params?.sort,
    ],
    queryFn: ({ pageParam }) =>
      axiosInstance
        .get<RecipeApiResponse>("/recipes/all", {
          params: { ...params, page: pageParam },
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60,
  });

  const recipes = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;

  return {
    recipes,
    total,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}

export function useSingleRecipe(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () =>
      axiosInstance
        .get<SingleRecipeApiResponse>(`/recipes/${id}`)
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
========================= */
export function useBatchRecipeStats(recipeIds: string[]) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["recipe-stats-batch", [...recipeIds].sort().join(",")],
    queryFn: () =>
      axiosInstance
        .post<BatchStatsMap>("/recipe-interaction/stats/batch", { recipeIds })
        .then((res) => res.data),
    enabled: recipeIds.length > 0,
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev,
  });

  const statsFor = (id: string): RecipeStats =>
    data?.[id] ?? { isLoved: false, isSaved: false };

  return { statsMap: data, statsFor, isLoading, isFetching };
}

/* =========================
   3. SINGLE RECIPE STATS HOOK
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
========================= */
function patchRecipesCache(id: string, patch: Partial<Recipe>) {
  queryClient.setQueriesData<RecipeApiResponse>(
    { queryKey: ["recipes"], exact: false },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((recipe) =>
          recipe._id === id ? { ...recipe, ...patch } : recipe,
        ),
      };
    },
  );
  queryClient.setQueriesData<InfiniteData<RecipeApiResponse>>(
    { queryKey: ["recipes-infinite"], exact: false },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((recipe) =>
            recipe._id === id ? { ...recipe, ...patch } : recipe,
          ),
        })),
      };
    },
  );
}

function patchChefRecipesCache(id: string, patch: Partial<Recipe>) {
  queryClient.setQueriesData<GetChefRecipesResponse>(
    { queryKey: ["chef-recipes"], exact: false },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((recipe) =>
          recipe._id === id ? { ...recipe, ...patch } : recipe,
        ),
      };
    },
  );
  queryClient.setQueriesData<InfiniteData<GetChefRecipesResponse>>(
    { queryKey: ["chef-recipes-infinite"], exact: false },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          data: page.data.map((recipe) =>
            recipe._id === id ? { ...recipe, ...patch } : recipe,
          ),
        })),
      };
    },
  );
}

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
      await queryClient.cancelQueries({ queryKey: ["recipe-stats-batch"] });
      await queryClient.cancelQueries({ queryKey: ["recipe-stats", id] });
      await queryClient.cancelQueries({ queryKey: ["recipe", id] });
      await queryClient.cancelQueries({ queryKey: ["recipes"] });
      await queryClient.cancelQueries({ queryKey: ["recipes-infinite"] });
      await queryClient.cancelQueries({ queryKey: ["chef-recipes"] });
      await queryClient.cancelQueries({ queryKey: ["chef-recipes-infinite"] });

      const batchEntries = queryClient.getQueriesData<BatchStatsMap>({
        queryKey: ["recipe-stats-batch"],
      });
      const statsFromBatch = batchEntries.map(([, map]) => map?.[id]).find(Boolean);

      const previousBatch = batchEntries;
      const previousSingle = queryClient.getQueryData<RecipeStats>(["recipe-stats", id]);
      const previousSingleRecipe = queryClient.getQueryData<SingleRecipeApiResponse>(["recipe", id]);

      // Use batch cache if available, fall back to single-recipe stats cache (detail page case)
      const currentStats = statsFromBatch ?? previousSingle ?? { isLoved: false, isSaved: false };
      const wasLoved = currentStats.isLoved;

      const allRecipePages = queryClient.getQueriesData<RecipeApiResponse>({
        queryKey: ["recipes"],
      });
      const recipeFromList = allRecipePages
        .flatMap(([, page]) => page?.data ?? [])
        .find((r) => r._id === id);

      const allRecipeInfinitePages = queryClient.getQueriesData<InfiniteData<RecipeApiResponse>>({
        queryKey: ["recipes-infinite"],
      });
      const recipeFromInfiniteList = recipeFromList
        ? undefined
        : allRecipeInfinitePages
            .flatMap(([, iData]) => iData?.pages.flatMap((p) => p?.data ?? []) ?? [])
            .find((r) => r._id === id);

      const allChefRecipePages = queryClient.getQueriesData<GetChefRecipesResponse>({
        queryKey: ["chef-recipes"],
      });
      const previousChefRecipes = allChefRecipePages;
      const recipeFromChef = allChefRecipePages
        .flatMap(([, page]) => page?.data ?? [])
        .find((r) => r._id === id);

      const allChefRecipeInfinitePages = queryClient.getQueriesData<InfiniteData<GetChefRecipesResponse>>({
        queryKey: ["chef-recipes-infinite"],
      });
      const previousChefRecipesInfinite = allChefRecipeInfinitePages;
      const recipeFromChefInfinite = recipeFromChef
        ? undefined
        : allChefRecipeInfinitePages
            .flatMap(([, iData]) => iData?.pages.flatMap((p) => p?.data ?? []) ?? [])
            .find((r) => r._id === id);

      const currentRecipe = recipeFromList ?? recipeFromInfiniteList ?? recipeFromChef ?? recipeFromChefInfinite;

      patchBatchStatsCache(id, { isLoved: !wasLoved });

      queryClient.setQueryData(
        ["recipe-stats", id],
        (old: RecipeStats | undefined) =>
          old ? { ...old, isLoved: !wasLoved } : old,
      );

      if (currentRecipe) {
        const newCount = wasLoved
          ? currentRecipe.lovedCount - 1
          : currentRecipe.lovedCount + 1;
        patchRecipesCache(id, { lovedCount: newCount });
        patchChefRecipesCache(id, { lovedCount: newCount });
      }

      // Patch single-recipe cache (used on the detail page)
      if (previousSingleRecipe) {
        const currentCount = previousSingleRecipe.data.lovedCount;
        const newCount = wasLoved ? currentCount - 1 : currentCount + 1;
        queryClient.setQueryData<SingleRecipeApiResponse>(["recipe", id], (old) =>
          old ? { ...old, data: { ...old.data, lovedCount: newCount } } : old,
        );
      }

      return { previousBatch, previousSingle, previousSingleRecipe, previousChefRecipes, previousChefRecipesInfinite, wasLoved };
    },

    onError: (err, id, context) => {
      if (context?.previousBatch) {
        context.previousBatch.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSingle !== undefined) {
        queryClient.setQueryData(["recipe-stats", id], context.previousSingle);
      }
      if (context?.previousSingleRecipe !== undefined) {
        queryClient.setQueryData<SingleRecipeApiResponse>(["recipe", id], context.previousSingleRecipe);
      }
      if (context?.previousChefRecipes) {
        context.previousChefRecipes.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousChefRecipesInfinite) {
        context.previousChefRecipesInfinite.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipes-infinite"] });
      // The optimistic heart already reverted above — without this, that
      // revert is the only signal the click did nothing, which just reads
      // as a flaky button rather than a rejected action.
      toast.error(err instanceof Error ? err.message : "Couldn't update this recipe", {
        position: "bottom-right",
      });
    },

    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: ["recipe-stats-batch"] });
      queryClient.invalidateQueries({ queryKey: ["recipe-stats", id] });
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
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
      await queryClient.cancelQueries({ queryKey: ["recipes-infinite"] });
      await queryClient.cancelQueries({ queryKey: ["chef-recipes"] });
      await queryClient.cancelQueries({ queryKey: ["chef-recipes-infinite"] });

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
      const recipeFromList = allRecipePages
        .flatMap(([, page]) => page?.data ?? [])
        .find((r) => r._id === id);

      const allRecipeInfinitePages = queryClient.getQueriesData<InfiniteData<RecipeApiResponse>>({
        queryKey: ["recipes-infinite"],
      });
      const recipeFromInfiniteList = recipeFromList
        ? undefined
        : allRecipeInfinitePages
            .flatMap(([, iData]) => iData?.pages.flatMap((p) => p?.data ?? []) ?? [])
            .find((r) => r._id === id);

      const allChefRecipePages = queryClient.getQueriesData<GetChefRecipesResponse>({
        queryKey: ["chef-recipes"],
      });
      const previousChefRecipes = allChefRecipePages;
      const recipeFromChef = allChefRecipePages
        .flatMap(([, page]) => page?.data ?? [])
        .find((r) => r._id === id);

      const allChefRecipeInfinitePages = queryClient.getQueriesData<InfiniteData<GetChefRecipesResponse>>({
        queryKey: ["chef-recipes-infinite"],
      });
      const previousChefRecipesInfinite = allChefRecipeInfinitePages;
      const recipeFromChefInfinite = recipeFromChef
        ? undefined
        : allChefRecipeInfinitePages
            .flatMap(([, iData]) => iData?.pages.flatMap((p) => p?.data ?? []) ?? [])
            .find((r) => r._id === id);

      const currentRecipe = recipeFromList ?? recipeFromInfiniteList ?? recipeFromChef ?? recipeFromChefInfinite;

      const wasSaved = currentStats.isSaved;

      patchBatchStatsCache(id, { isSaved: !wasSaved });

      queryClient.setQueryData(
        ["recipe-stats", id],
        (old: RecipeStats | undefined) =>
          old ? { ...old, isSaved: !wasSaved } : old,
      );

      if (currentRecipe) {
        const newCount = wasSaved
          ? currentRecipe.savedCount - 1
          : currentRecipe.savedCount + 1;
        patchRecipesCache(id, { savedCount: newCount });
        patchChefRecipesCache(id, { savedCount: newCount });
      }

      return { previousBatch, previousSingle, previousChefRecipes, previousChefRecipesInfinite, wasSaved };
    },

    onError: (err, id, context) => {
      if (context?.previousBatch) {
        context.previousBatch.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousSingle !== undefined) {
        queryClient.setQueryData(["recipe-stats", id], context.previousSingle);
      }
      if (context?.previousChefRecipes) {
        context.previousChefRecipes.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousChefRecipesInfinite) {
        context.previousChefRecipesInfinite.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipes-infinite"] });
      toast.error(err instanceof Error ? err.message : "Couldn't update this recipe", {
        position: "bottom-right",
      });
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
