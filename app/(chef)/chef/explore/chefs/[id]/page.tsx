"use client";

import {
  useChef,
  useInfiniteChefRecipes,
  useInfiniteChefCookbooks,
  useRelatedChefs,
} from "@/hooks/useChef";
import { useChefProfile } from "@/hooks/useChefProfile";
import { useBatchRecipeStats } from "@/hooks/useRecipe";
import { RecipeCard } from "@/components/User/Recipe/RecipeCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { BookOpen, ChefHat, Loader2, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Cookbook } from "@/hooks/useCookbook";

function ChefCookbookCard({ cookbook }: { cookbook: Cookbook }) {
  return (
    <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={cookbook.cookbook_image}
          alt={cookbook.title}
          fill
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={cn(
            "absolute top-2.5 right-2.5 text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm",
            cookbook.stockCount <= 3
              ? "bg-orange-500 text-white"
              : "bg-black/60 text-white",
          )}
        >
          {cookbook.stockCount <= 3 ? `${cookbook.stockCount} left` : `${cookbook.stockCount} in stock`}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[15px] font-semibold text-foreground leading-snug mb-1 line-clamp-2">
          {cookbook.title}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
          {cookbook.description}
        </p>
        <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">${cookbook.price.toFixed(2)}</p>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full inline-block",
                  cookbook.stockCount <= 3 ? "bg-orange-500" : "bg-emerald-500",
                )}
              />
              {cookbook.stockCount <= 3 ? "Almost gone" : "In stock"}
            </p>
          </div>
          <Link href={`/chef/explore/purchase-cookbook/${cookbook._id}`}>
            <Button size="sm" className="h-8 px-4 text-xs font-medium rounded-lg">
              Buy now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GridSkeleton({ type = "cookbook" }: { type?: "recipe" | "cookbook" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
          <Skeleton className={cn("w-full rounded-none", type === "recipe" ? "h-44" : "aspect-[4/3]")} />
          <div className="p-4 space-y-2.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChefExploreChefProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chefId = params.id;

  const tab = (searchParams.get("tab") ?? "recipes") as "recipes" | "cookbooks";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) p.delete(key);
        else p.set(key, value);
      });
      p.delete("page");
      router.replace(`?${p.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const setTab = (t: "recipes" | "cookbooks") => updateParams({ tab: t });

  const { chef, isLoading: isChefLoading } = useChef(chefId);
  const { profile: chefProfile } = useChefProfile(chefId);

  const {
    recipes,
    total: recipesTotal,
    isLoading: isRecipesLoading,
    isFetchingNextPage: isRecipesFetchingNextPage,
    hasNextPage: recipesHasNextPage,
    fetchNextPage: fetchNextRecipesPage,
  } = useInfiniteChefRecipes(chefId, { limit: 12 });

  const {
    cookbooks,
    total: cookbooksTotal,
    isLoading: isCookbooksLoading,
    isFetchingNextPage: isCookbooksFetchingNextPage,
    hasNextPage: cookbooksHasNextPage,
    fetchNextPage: fetchNextCookbooksPage,
  } = useInfiniteChefCookbooks(chefId, { limit: 12 });

  const { relatedChefs } = useRelatedChefs(chefId);

  const recipeIds = useMemo(() => recipes?.map((r) => r._id) ?? [], [recipes]);
  const { statsFor } = useBatchRecipeStats(recipeIds);

  const recipesSentinelRef = useRef<HTMLDivElement>(null);
  const cookbooksSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = recipesSentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && recipesHasNextPage && !isRecipesFetchingNextPage) {
          fetchNextRecipesPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [recipesHasNextPage, isRecipesFetchingNextPage, fetchNextRecipesPage]);

  useEffect(() => {
    const el = cookbooksSentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cookbooksHasNextPage && !isCookbooksFetchingNextPage) {
          fetchNextCookbooksPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cookbooksHasNextPage, isCookbooksFetchingNextPage, fetchNextCookbooksPage]);

  if (isChefLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Skeleton className="w-28 h-28 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-3 mt-2">
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-7 w-28 rounded-lg" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-48 rounded-xl" />
        <GridSkeleton type="recipe" />
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-base font-medium">Chef not found</p>
        <Link href="/chef/explore/chefs">
          <Button variant="outline">Back to Chefs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chef Hero */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="relative w-24 h-24 shrink-0">
          <Image src={chef.profile_url} alt={chef.fullName} fill sizes="96px" className="rounded-full object-cover" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{chef.fullName}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">@{chef.username}</p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              <ChefHat className="w-3.5 h-3.5" />
              {recipesTotal > 0 ? `${recipesTotal} Recipes` : isRecipesLoading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : "0 Recipes"}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              <BookOpen className="w-3.5 h-3.5" />
              {cookbooksTotal > 0 ? `${cookbooksTotal} Cookbooks` : isCookbooksLoading ? <Loader2 className="animate-spin w-3.5 h-3.5" /> : "0 Cookbooks"}
            </span>
          </div>

          {chefProfile?.bio && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-3 leading-relaxed max-w-2xl text-center sm:text-left">
              {chefProfile.bio}
            </p>
          )}

          {chefProfile?.genres && chefProfile.genres.length > 0 && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
              {chefProfile.genres.map((g) => (
                <span key={g} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {g}
                </span>
              ))}
            </div>
          )}

          {chefProfile?.achievements && chefProfile.achievements.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-center sm:text-left">
                Achievements
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {chefProfile.achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
                    <Trophy className="w-3 h-3 shrink-0" />
                    <span className="font-semibold">{a.title}</span>
                    {a.year && <span className="text-amber-500 dark:text-amber-400">· {a.year}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 w-fit">
        {(["recipes", "cookbooks"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200",
              tab === t
                ? "bg-white dark:bg-zinc-900 text-foreground shadow-sm border border-zinc-200 dark:border-zinc-700"
                : "text-zinc-500 dark:text-zinc-400 hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "recipes" ? (
        <>
          {isRecipesLoading ? (
            <GridSkeleton type="recipe" />
          ) : recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3 min-h-[30vh]">
              <ChefHat className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No recipes yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  statsFor={statsFor}
                  recipePath="/chef/explore/recipes"
                  chefPath="/chef/explore/chefs"
                />
              ))}
            </div>
          )}
          <div ref={recipesSentinelRef} className="h-4" />
          {isRecipesFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            </div>
          )}
        </>
      ) : (
        <>
          {isCookbooksLoading ? (
            <GridSkeleton type="cookbook" />
          ) : cookbooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3 min-h-[30vh]">
              <BookOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No cookbooks yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cookbooks.map((cookbook) => (
                <ChefCookbookCard key={cookbook._id} cookbook={cookbook} />
              ))}
            </div>
          )}
          <div ref={cookbooksSentinelRef} className="h-4" />
          {isCookbooksFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            </div>
          )}
        </>
      )}

      {relatedChefs.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-foreground">Other Chefs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedChefs.map((related) => (
              <Link
                key={related._id}
                href={`/chef/explore/chefs/${related._id}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
              >
                <div className="relative w-14 h-14 shrink-0">
                  <Image src={related.profile_url} alt={related.fullName} fill sizes="56px" loading="lazy" className="rounded-full object-cover" />
                </div>
                <div className="text-center min-w-0 w-full">
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{related.fullName}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">@{related.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
