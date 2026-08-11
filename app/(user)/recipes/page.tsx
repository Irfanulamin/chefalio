"use client";

import { useInfiniteRecipes } from "@/hooks/useRecipe";
import { Recipe } from "@/types/recipes.type";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { RecipeGrid } from "@/components/User/Recipe/RecipeGrid";
import { RecipeFilters } from "@/components/User/Recipe/RecipeFilters";
import { PageHeader } from "@/components/User/shared/PageHeader";
import { LoadMoreSentinel } from "@/components/User/shared/LoadMoreSentinel";
import { DIFFICULTIES, type Difficulty } from "@/lib/recipe-display";

export const POPULAR_TAGS = [
  "vegetarian",
  "dessert",
  "French",
  "Italian",
  "seafood",
  "modernist",
  "fine dining",
  "Nordic",
];

export default function RecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const difficulty = (searchParams.get("difficulty") ?? "") as Difficulty | "";
  const author = searchParams.get("author") ?? "";
  const selectedTags = searchParams.get("tags")
    ? searchParams.get("tags")!.split(",").filter(Boolean)
    : [];

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedAuthor] = useDebounce(author, 500);

  const {
    recipes,
    total,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteRecipes({
    search: debouncedSearch,
    limit: 12,
    tags: selectedTags.join(",") || undefined,
    difficulty: difficulty || undefined,
    author: debouncedAuthor || undefined,
  });

  const data: Recipe[] = recipes;

  const handleSearchChange = (value: string) =>
    updateParams({ search: value || null });

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    updateParams({ tags: next.join(",") || null });
  };

  const toggleDifficulty = (d: Difficulty) =>
    updateParams({ difficulty: difficulty === d ? null : d });

  const clearAllFilters = () =>
    updateParams({ search: null, tags: null, difficulty: null, author: null });

  const hasActiveFilters = Boolean(
    search || selectedTags.length || difficulty || debouncedAuthor,
  );

  const handleRecipeLoading = isLoading && data.length === 0;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="app-root">
      <title>Chefalio — Recipes</title>

      <div className="page-content">
        <PageHeader
          title="Recipes"
          lede="Everything the chefs have published. Filter by level, tag or chef to narrow it down."
          meta={
            !isLoading && data.length > 0
              ? `Showing ${data.length} of ${total} recipe${total !== 1 ? "s" : ""}`
              : undefined
          }
        />

        <div className="mb-6">
          <RecipeFilters
            DIFFICULTIES={DIFFICULTIES}
            POPULAR_TAGS={POPULAR_TAGS}
            difficulty={difficulty}
            selectedTags={selectedTags}
            author={author}
            toggleTag={toggleTag}
            toggleDifficulty={toggleDifficulty}
            setAuthor={(value) => updateParams({ author: value || null })}
            handleSearchChange={handleSearchChange}
            isFetching={isFetching}
            debouncedAuthor={debouncedAuthor}
            hasActiveFilters={hasActiveFilters}
            clearAllFilters={clearAllFilters}
            search={search}
          />
        </div>

        <RecipeGrid
          handleRecipeLoading={handleRecipeLoading}
          isFetching={isFetching && !isFetchingNextPage}
          data={data}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />

        <LoadMoreSentinel
          ref={sentinelRef}
          loading={isFetchingNextPage}
          done={!hasNextPage && data.length > 0}
          label="recipes"
        />
      </div>
    </div>
  );
}
