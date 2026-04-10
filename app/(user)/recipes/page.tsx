"use client";

import { useRecipes } from "@/hooks/useRecipe";
import { Recipe } from "@/types/recipes.type";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Loader2 } from "lucide-react";
import { RecipeGrid } from "@/components/User/Recipe/RecipeGrid";
import { RecipeFilters } from "@/components/User/Recipe/RecipeFilters";
import { PaginationSection } from "@/components/common/Pagination";

// ── constants ──────────────────────────────────────────────────────────────────

const DIFFICULTIES = ["beginner", "intermediate", "advance"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner:
    "border-emerald-500 text-emerald-600 data-[active=true]:bg-emerald-500 data-[active=true]:text-white",
  intermediate:
    "border-amber-500  text-amber-600  data-[active=true]:bg-amber-500  data-[active=true]:text-white",
  advance:
    "border-rose-500   text-rose-600   data-[active=true]:bg-rose-500   data-[active=true]:text-white",
};

// Popular tags — swap out for whatever your app uses
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

// ── component ──────────────────────────────────────────────────────────────────

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState("");

  const [debouncedAuthor] = useDebounce(author, 500);
  const [debouncedSearch] = useDebounce(search, 500);

  // Tags are sent as a comma-separated string: "vegan,quick"
  const tagsParam = selectedTags.join(",");

  const { recipes, isLoading, isFetching } = useRecipes({
    search: debouncedSearch,
    page,
    limit: 12,
    tags: tagsParam || undefined,
    difficulty: difficulty || undefined,
    author: debouncedAuthor || undefined,
  });

  const data: Recipe[] | undefined = recipes?.data?.recipes;
  const totalPages = recipes?.data?.pagination.totalPages || 1;
  const currentPage = recipes?.data?.pagination.page || page;

  const isInitialLoading = isLoading && !recipes;

  // ── helpers ────────────────────────────────────────────────────────────────

  const resetPage = () => setPage(1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetPage();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    resetPage();
  };

  const toggleDifficulty = (d: Difficulty) => {
    setDifficulty((prev) => (prev === d ? "" : d));
    resetPage();
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setDifficulty("");
    setAuthor("");
    resetPage();
  };

  const hasActiveFilters = Boolean(
    search || selectedTags.length > 0 || difficulty || debouncedAuthor,
  );

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !selectedTags.includes(newTag)) {
        setSelectedTags((prev) => [...prev, newTag]);
        resetPage();
      }
      setTagInput("");
    }
    // backspace on empty input removes last tag
    if (e.key === "Backspace" && tagInput === "") {
      setSelectedTags((prev) => prev.slice(0, -1));
      resetPage();
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 my-3 md:my-6 max-w-7xl mx-auto px-3">
      <div>
        <h2 className="text-5xl font-pinyon-script font-bold text-primary italic capitalize mb-2 tracking-widest">
          Recipes
        </h2>
        <p className="text-muted-foreground max-w-200">
          Discover delicious recipes tailored to your taste and dietary
          preferences. Use the filters to find the perfect meal for any
          occasion, whether you&apos;re a beginner or a seasoned chef. Happy
          cooking!
        </p>
      </div>
      {/* ── FILTERS ── */}
      <RecipeFilters
        DIFFICULTIES={DIFFICULTIES}
        DIFFICULTY_STYLES={DIFFICULTY_STYLES}
        POPULAR_TAGS={POPULAR_TAGS}
        difficulty={difficulty}
        selectedTags={selectedTags}
        tagInput={tagInput}
        author={author}
        toggleTag={toggleTag}
        toggleDifficulty={toggleDifficulty}
        setTagInput={setTagInput}
        setAuthor={setAuthor}
        resetPage={resetPage}
        handleTagInputKeyDown={handleTagInputKeyDown}
        handleSearchChange={handleSearchChange}
        isFetching={isFetching}
        debouncedAuthor={debouncedAuthor}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        setDifficulty={setDifficulty}
        search={search}
      />
      {/* ── GRID ── */}
      {!isLoading && recipes && (
        <p className="text-sm text-muted-foreground">
          {recipes.data?.pagination.total === 0
            ? "No recipes found"
            : `Showing ${data?.length} of ${recipes.data?.pagination.total} recipe${recipes.data?.pagination.total !== 1 ? "s" : ""}`}
        </p>
      )}
      <RecipeGrid isFetching={isFetching} data={data} />
      {/* ── PAGINATION ── */}
      <PaginationSection
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setPage}
      />
    </div>
  );
}
