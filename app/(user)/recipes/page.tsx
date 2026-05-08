"use client";

import { useRecipes } from "@/hooks/useRecipe";
import { Recipe } from "@/types/recipes.type";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { useDebounce } from "use-debounce";
import { RecipeGrid } from "@/components/User/Recipe/RecipeGrid";
import { RecipeFilters } from "@/components/User/Recipe/RecipeFilters";
import { PaginationSection } from "@/components/common/Pagination";

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
  const page = Number(searchParams.get("page") ?? "1");
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
      if (!("page" in updates)) params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedAuthor] = useDebounce(author, 500);

  const { recipes, isLoading, isFetching } = useRecipes({
    search: debouncedSearch,
    page,
    limit: 12,
    tags: selectedTags.join(",") || undefined,
    difficulty: difficulty || undefined,
    author: debouncedAuthor || undefined,
  });

  const data: Recipe[] | undefined = recipes?.data?.recipes;
  const totalPages = recipes?.data?.pagination.totalPages || 1;
  const currentPage = recipes?.data?.pagination.page || page;

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

  const handleRecipeLoading = isLoading && !recipes;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <title>Chefalio - Recipes</title>
      <div ref={scrollRef} className="space-y-6 my-4 md:my-8 max-w-7xl mx-auto px-3">
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

        {!isLoading && recipes && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {recipes.data?.pagination.total === 0
              ? "No recipes found"
              : `Showing ${data?.length} of ${recipes.data?.pagination.total} recipe${recipes.data?.pagination.total !== 1 ? "s" : ""}`}
          </p>
        )}

        <RecipeGrid
          handleRecipeLoading={handleRecipeLoading}
          isFetching={isFetching}
          data={data}
        />

        <PaginationSection
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={(p) => updateParams({ page: String(p) })}
          scrollTargetRef={scrollRef}
        />
      </div>
    </>
  );
}
