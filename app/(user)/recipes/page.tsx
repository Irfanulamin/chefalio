"use client";

import { useRecipes, useBatchRecipeStats, useToggleLove, useToggleSave } from "@/hooks/useRecipe";
import { Recipe } from "@/types/recipes.type";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { useDebounce } from "use-debounce";
import { RecipeGrid } from "@/components/User/Recipe/RecipeGrid";
import { RecipeFilters } from "@/components/User/Recipe/RecipeFilters";
import { PaginationSection } from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  FireIcon,
  HeartIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";

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

const difficultyDot: Record<string, string> = {
  beginner: "bg-emerald-400",
  intermediate: "bg-amber-400",
  advance: "bg-rose-400",
};

// ─── Trending Card ────────────────────────────────────────────────────────────
function TrendingCard({
  recipe,
  rank,
  statsFor,
}: {
  recipe: Recipe;
  rank: number;
  statsFor: (id: string) => { isLoved: boolean; isSaved: boolean };
}) {
  const { mutate: toggleLove } = useToggleLove();
  return (
    <Link
      href={`/recipes/${recipe._id}`}
      className="group relative flex-shrink-0 w-52 rounded-2xl overflow-hidden border border-border/40 hover:border-border hover:-translate-y-1 hover:shadow-lg transition-all duration-200 bg-background cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={recipe.images[0]}
          alt={recipe.title}
          fill
          sizes="208px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Rank badge */}
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
          {rank}
        </div>
        {/* Difficulty */}
        <div className="absolute bottom-2 right-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full inline-block",
              difficultyDot[recipe.difficulty] ?? "bg-muted",
            )}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-sm font-semibold line-clamp-2 leading-snug mb-1.5">
          {recipe.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <HeartIcon weight="fill" className="w-3.5 h-3.5 text-rose-500" />
            {recipe.lovedCount.toLocaleString()}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLove(recipe._id);
            }}
            className={cn(
              "p-1 rounded-lg transition-colors",
              statsFor(recipe._id).isLoved
                ? "text-rose-500"
                : "text-muted-foreground/50 hover:text-rose-500",
            )}
          >
            <HeartIcon
              weight={statsFor(recipe._id).isLoved ? "fill" : "bold"}
              className="w-3.5 h-3.5"
            />
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Trending Skeleton ─────────────────────────────────────────────────────────
function TrendingSkeletonCard() {
  return (
    <div className="flex-shrink-0 w-52 rounded-2xl overflow-hidden border border-border/40">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export default function RecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Read state from URL ────────────────────────────────────────────────────
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const difficulty = (searchParams.get("difficulty") ?? "") as Difficulty | "";
  const author = searchParams.get("author") ?? "";
  const selectedTags = searchParams.get("tags")
    ? searchParams.get("tags")!.split(",").filter(Boolean)
    : [];

  // ── URL updater ────────────────────────────────────────────────────────────
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

  // ── Trending: always loaded, hidden when filters are active ───────────────
  const hasActiveFilters = Boolean(
    search || selectedTags.length || difficulty || debouncedAuthor,
  );

  const { recipes: trendingRecipes, isLoading: isTrendingLoading } = useRecipes({
    page: 1,
    limit: 8,
    sort: "trending",
  });
  const trendingData = trendingRecipes?.data?.recipes ?? [];
  const trendingIds = useMemo(() => trendingData.map((r) => r._id), [trendingData]);
  const { statsFor } = useBatchRecipeStats(trendingIds);

  // ── Main grid ──────────────────────────────────────────────────────────────
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

  // ── Handlers ───────────────────────────────────────────────────────────────
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

  const handleRecipeLoading = isLoading && !recipes;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <title>Chefalio - Recipes</title>
      <div ref={scrollRef} className="space-y-6 my-3 md:my-6 max-w-7xl mx-auto px-3">
        <div>
          <h2 className="text-5xl font-pinyon-script font-bold text-primary italic capitalize mb-2 tracking-widest">
            Recipes
          </h2>
          <p className="text-muted-foreground max-w-200">
            Discover delicious recipes tailored to your taste and dietary
            preferences. Use the filters to find the perfect meal for any
            occasion. Happy cooking!
          </p>
        </div>

        {/* ── Trending Now ────────────────────────────────────────────────── */}
        {!hasActiveFilters && page === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <FireIcon weight="fill" className="w-4 h-4 text-orange-500" />
                Trending Now
              </h3>
              <Link
                href="/recipes?page=2"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                See more <ArrowRightIcon weight="bold" className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {isTrendingLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TrendingSkeletonCard key={i} />
                  ))
                : trendingData.map((recipe, i) => (
                    <TrendingCard
                      key={recipe._id}
                      recipe={recipe}
                      rank={i + 1}
                      statsFor={statsFor}
                    />
                  ))}
            </div>
          </div>
        )}

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
          <p className="text-sm text-muted-foreground">
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
