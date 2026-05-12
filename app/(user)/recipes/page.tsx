"use client";

import { useInfiniteRecipes } from "@/hooks/useRecipe";
import { Recipe } from "@/types/recipes.type";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { RecipeGrid } from "@/components/User/Recipe/RecipeGrid";
import { RecipeFilters } from "@/components/User/Recipe/RecipeFilters";
import { Loader2 } from "lucide-react";

const DIFFICULTIES = ["beginner", "intermediate", "advance"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner:
    "border-emerald-500 text-emerald-600 data-[active=true]:bg-emerald-500 data-[active=true]:text-white",
  intermediate:
    "border-amber-500 text-amber-600 data-[active=true]:bg-amber-500 data-[active=true]:text-white",
  advance:
    "border-rose-500 text-rose-600 data-[active=true]:bg-rose-500 data-[active=true]:text-white",
};

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
    <>
      <title>Chefalio - Recipes</title>
      <div className="space-y-6 my-4 md:my-8 max-w-7xl mx-auto px-3">
        {/* Header */}
        <div className="pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Recipes</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Discover delicious recipes tailored to your taste. Filter by difficulty, tags, or author to find your next favourite dish.
          </p>
        </div>

        <RecipeFilters
          DIFFICULTIES={DIFFICULTIES}
          DIFFICULTY_STYLES={DIFFICULTY_STYLES}
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
          setDifficulty={(d) => updateParams({ difficulty: d || null })}
          search={search}
        />

        {!isLoading && data.length > 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {total === 0
              ? "No recipes found"
              : `Showing ${data.length} of ${total} recipe${total !== 1 ? "s" : ""}`}
          </p>
        )}

        <RecipeGrid
          handleRecipeLoading={handleRecipeLoading}
          isFetching={isFetching && !isFetchingNextPage}
          data={data}
        />

        <div ref={sentinelRef} className="h-4" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          </div>
        )}
      </div>
    </>
  );
}
