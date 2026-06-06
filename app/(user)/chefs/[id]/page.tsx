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
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Loader2Icon } from "lucide-react";
import { TrophyIcon, ForkKnifeIcon, BookOpenIcon } from "@phosphor-icons/react/dist/ssr";
import type { Cookbook } from "@/hooks/useCookbook";

function ChefCookbookCard({ cookbook }: { cookbook: Cookbook }) {
  const discountedPrice =
    (cookbook.discount ?? 0) > 0
      ? cookbook.price * (1 - cookbook.discount / 100)
      : null;

  return (
    <div
      className="group rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      style={{
        backgroundColor: "var(--cs-surface-2)",
        border: "1px solid var(--cs-border-subtle)",
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <Image
          src={cookbook.cookbook_image}
          alt={cookbook.title}
          fill
          loading="lazy"
          className="object-cover"
        />
        <span
          className="absolute bottom-2.5 right-2.5 text-sm font-bold px-2.5 py-1 rounded-lg z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#fff" }}
        >
          ${(discountedPrice ?? cookbook.price).toFixed(2)}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p
          className="text-[15px] font-semibold leading-snug line-clamp-2 mb-3"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {cookbook.title}
        </p>
        <div className="mt-auto">
          <Link
            href={`/purchase-cookbook/${cookbook._id}`}
            className="block w-full text-center py-2 rounded-xl text-sm font-semibold transition-colors duration-150"
            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: "var(--cs-surface-2)",
            border: "1px solid var(--cs-border-subtle)",
          }}
        >
          <Skeleton className="w-full" style={{ aspectRatio: "4/3" }} />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChefProfilePage() {
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
  const { profile: chefProfile, isLoading: isChefProfileLoading } = useChefProfile(chefId);

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
        if (entries[0].isIntersecting && recipesHasNextPage && !isRecipesFetchingNextPage)
          fetchNextRecipesPage();
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
        if (entries[0].isIntersecting && cookbooksHasNextPage && !isCookbooksFetchingNextPage)
          fetchNextCookbooksPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cookbooksHasNextPage, isCookbooksFetchingNextPage, fetchNextCookbooksPage]);

  if (isChefLoading) return null;

  if (!chef) {
    return (
      <div className="page-root flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center text-center px-4 max-w-sm">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--cs-text-primary)" }}>
            Chef not found
          </h1>
          <Link
            href="/chefs"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
          >
            Back to Chefs
          </Link>
        </div>
      </div>
    );
  }

  const initials = chef.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <title>{chef.fullName} — Chefalio</title>
      <div className="page-root">
        <div className="page-content space-y-6">
          {/* Chef Hero */}
          <div
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl"
            style={{
              backgroundColor: "var(--cs-surface-2)",
              border: "1px solid var(--cs-border-subtle)",
            }}
          >
            {/* Avatar */}
            <div className="relative w-24 h-24 shrink-0">
              {chef.profile_url ? (
                <Image
                  src={chef.profile_url}
                  alt={chef.fullName}
                  fill
                  sizes="96px"
                  className="rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
                >
                  {initials}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {chef.fullName}
              </h1>
              {chef.username && (
                <p className="text-sm mt-0.5" style={{ color: "var(--cs-text-tertiary)" }}>
                  @{chef.username}
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <span
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: "var(--cs-surface-3)",
                    color: "var(--cs-text-secondary)",
                    border: "1px solid var(--cs-border-subtle)",
                  }}
                >
                  <ForkKnifeIcon size={13} />
                  {isRecipesLoading ? "…" : recipesTotal} Recipes
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{
                    backgroundColor: "var(--cs-surface-3)",
                    color: "var(--cs-text-secondary)",
                    border: "1px solid var(--cs-border-subtle)",
                  }}
                >
                  <BookOpenIcon size={13} />
                  {isCookbooksLoading ? "…" : cookbooksTotal} Cookbooks
                </span>
              </div>

              {/* Bio */}
              {!isChefProfileLoading && (
                <p
                  className="text-sm mt-3 leading-relaxed max-w-2xl"
                  style={{ color: chefProfile?.bio ? "var(--cs-text-secondary)" : "var(--cs-text-tertiary)" }}
                >
                  {chefProfile?.bio ?? "No bio yet"}
                </p>
              )}

              {/* Genres */}
              {chefProfile?.genres && chefProfile.genres.length > 0 && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                  {chefProfile.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--cs-accent-muted)",
                        color: "var(--cs-accent)",
                        border: "1px solid var(--cs-accent)",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Achievements */}
              {chefProfile?.achievements && chefProfile.achievements.length > 0 && (
                <div className="mt-3">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-center sm:text-left"
                    style={{ color: "var(--cs-text-tertiary)" }}
                  >
                    Achievements
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {chefProfile.achievements.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "#fef9c3",
                          border: "1px solid #fde047",
                          color: "#a16207",
                        }}
                      >
                        <TrophyIcon size={12} weight="fill" />
                        <span className="font-semibold">{a.title}</span>
                        {a.year && <span style={{ color: "#ca8a04" }}>· {a.year}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl w-fit"
            style={{ backgroundColor: "var(--cs-surface-3)" }}
          >
            {(["recipes", "cookbooks"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-150"
                style={
                  tab === t
                    ? {
                        backgroundColor: "var(--cs-surface-1)",
                        color: "var(--cs-text-primary)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                        border: "1px solid var(--cs-border-subtle)",
                      }
                    : { color: "var(--cs-text-secondary)" }
                }
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === "recipes" ? (
            <>
              {isRecipesLoading ? (
                <GridSkeleton />
              ) : recipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ForkKnifeIcon
                    size={40}
                    style={{ color: "var(--cs-border-default)", marginBottom: "0.75rem" }}
                  />
                  <p className="text-sm" style={{ color: "var(--cs-text-tertiary)" }}>
                    No recipes yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} statsFor={statsFor} />
                  ))}
                </div>
              )}
              <div ref={recipesSentinelRef} className="h-4" />
              {isRecipesFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <Loader2Icon className="animate-spin" size={20} style={{ color: "var(--cs-text-tertiary)" }} />
                </div>
              )}
            </>
          ) : (
            <>
              {isCookbooksLoading ? (
                <GridSkeleton />
              ) : cookbooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <BookOpenIcon
                    size={40}
                    style={{ color: "var(--cs-border-default)", marginBottom: "0.75rem" }}
                  />
                  <p className="text-sm" style={{ color: "var(--cs-text-tertiary)" }}>
                    No cookbooks yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cookbooks.map((cookbook) => (
                    <ChefCookbookCard key={cookbook._id} cookbook={cookbook} />
                  ))}
                </div>
              )}
              <div ref={cookbooksSentinelRef} className="h-4" />
              {isCookbooksFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <Loader2Icon className="animate-spin" size={20} style={{ color: "var(--cs-text-tertiary)" }} />
                </div>
              )}
            </>
          )}

          {/* Other Chefs */}
          {relatedChefs.length > 0 && (
            <div
              className="space-y-4 pt-6"
              style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
            >
              <h2
                className="text-base font-semibold"
                style={{ color: "var(--cs-text-primary)" }}
              >
                Other Chefs
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedChefs.map((related) => {
                  const relInitials = related.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <Link
                      key={related._id}
                      href={`/chefs/${related._id}`}
                      className="group flex flex-col items-center gap-3 p-4 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                      style={{
                        backgroundColor: "var(--cs-surface-2)",
                        border: "1px solid var(--cs-border-subtle)",
                      }}
                    >
                      <div className="relative w-14 h-14 shrink-0">
                        {related.profile_url ? (
                          <Image
                            src={related.profile_url}
                            alt={related.fullName}
                            fill
                            sizes="56px"
                            loading="lazy"
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold"
                            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
                          >
                            {relInitials}
                          </div>
                        )}
                      </div>
                      <div className="text-center min-w-0 w-full">
                        <p
                          className="text-sm font-semibold line-clamp-1"
                          style={{ color: "var(--cs-text-primary)" }}
                        >
                          {related.fullName}
                        </p>
                        <p
                          className="text-xs line-clamp-1 mt-0.5"
                          style={{ color: "var(--cs-text-tertiary)" }}
                        >
                          @{related.username}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
