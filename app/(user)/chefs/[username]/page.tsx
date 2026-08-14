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
import { CookbookCard } from "@/components/common/CookbookCard";
import { ChefCard } from "@/components/common/ChefCard";
import { SafeImage } from "@/components/common/SafeImage";
import { EmptyState } from "@/components/common/EmptyState";
import { CardSkeletonGrid } from "@/components/User/shared/CardSkeleton";
import { LoadMoreSentinel } from "@/components/User/shared/LoadMoreSentinel";
import { SegmentedTabs, type Segment } from "@/components/User/shared/SegmentedTabs";
import { FollowButton } from "@/components/common/FollowButton";
import { useFollowStatus } from "@/hooks/useFollow";
import { initialsOf } from "@/lib/recipe-display";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  TrophyIcon,
  ForkKnifeIcon,
  BookOpenIcon,
  UsersIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react/dist/ssr";

type Tab = "recipes" | "cookbooks";

const TABS: readonly Segment<Tab>[] = [
  { id: "recipes", label: "Recipes", Icon: ForkKnifeIcon },
  { id: "cookbooks", label: "Cookbooks", Icon: BookOpenIcon },
];

const RECIPE_GRID = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

/** Recipes and cookbooks under one chef, so the counts read as a pair. */
function StatPill({
  Icon,
  value,
  label,
  loading,
}: {
  Icon: React.ElementType;
  value: number;
  label: string;
  loading: boolean;
}) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
      style={{
        backgroundColor: "var(--cs-surface-3)",
        border: "1px solid var(--cs-border-subtle)",
        color: "var(--cs-text-secondary)",
      }}
    >
      <Icon size={13} aria-hidden />
      <span className="ui-micro ui-numeric font-semibold">
        {loading ? "—" : value}
      </span>
      <span className="ui-micro">{label}</span>
    </span>
  );
}

export default function ChefProfilePage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chefId = params.username;

  const tab = (searchParams.get("tab") ?? "recipes") as Tab;

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

  const setTab = (t: Tab) => updateParams({ tab: t });

  const { chef, isLoading: isChefLoading } = useChef(chefId);
  const { profile: chefProfile, isLoading: isChefProfileLoading } =
    useChefProfile(chefId);
  const { status: followStatus, isLoading: isFollowStatusLoading } =
    useFollowStatus(chef?._id);

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
        if (
          entries[0].isIntersecting &&
          recipesHasNextPage &&
          !isRecipesFetchingNextPage
        )
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
        if (
          entries[0].isIntersecting &&
          cookbooksHasNextPage &&
          !isCookbooksFetchingNextPage
        )
          fetchNextCookbooksPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cookbooksHasNextPage, isCookbooksFetchingNextPage, fetchNextCookbooksPage]);

  if (isChefLoading) {
    return (
      <div className="app-root">
        <div className="page-content">
          <div className="ui-card mb-6 flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
            <div
              className="h-24 w-24 shrink-0 animate-pulse rounded-full"
              style={{ backgroundColor: "var(--cs-surface-3)" }}
            />
            <div className="w-full space-y-3">
              <div
                className="h-6 w-48 animate-pulse rounded"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              />
              <div
                className="h-4 w-32 animate-pulse rounded"
                style={{ backgroundColor: "var(--cs-surface-3)" }}
              />
            </div>
          </div>
          <div className={RECIPE_GRID}>
            <CardSkeletonGrid variant="recipe" count={6} />
          </div>
        </div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="app-root">
        <div className="page-content">
          <EmptyState
            icon={<ForkKnifeIcon size={24} />}
            title="No chef at this address"
            description="This profile may have been removed, or the link may be wrong."
            action={{ label: "Back to chefs", href: "/chefs" }}
          />
        </div>
      </div>
    );
  }

  const initials = initialsOf(chef.fullName);

  return (
    <>
      <title>{`${chef.fullName} — Chefalio`}</title>
      <div className="app-root">
        <div className="page-content space-y-6">
          <header className="ui-card flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
            <div
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full"
              style={{ border: "1px solid var(--cs-border-subtle)" }}
            >
              <SafeImage
                src={chef.profile_url}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
                fallback={
                  <span
                    className="flex h-full w-full items-center justify-center text-2xl font-bold"
                    style={{
                      backgroundColor: "var(--cs-accent-muted)",
                      color: "var(--cs-accent-text)",
                    }}
                  >
                    {initials}
                  </span>
                }
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="ui-title" style={{ color: "var(--cs-text-primary)" }}>
                    {chef.fullName}
                  </h1>
                  {chef.username && (
                    <p
                      className="ui-caption mt-0.5"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      @{chef.username}
                    </p>
                  )}
                </div>
                <FollowButton chefId={chef._id} chefUsername={chef.username} />
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <StatPill
                  Icon={ForkKnifeIcon}
                  value={recipesTotal}
                  label="recipes"
                  loading={isRecipesLoading}
                />
                <StatPill
                  Icon={BookOpenIcon}
                  value={cookbooksTotal}
                  label="cookbooks"
                  loading={isCookbooksLoading}
                />
                <StatPill
                  Icon={UsersIcon}
                  value={followStatus?.followerCount ?? 0}
                  label="followers"
                  loading={isFollowStatusLoading}
                />
              </div>

              {!isChefProfileLoading && (
                <p
                  className="ui-body mx-auto mt-3 max-w-2xl sm:mx-0"
                  style={{
                    color: chefProfile?.bio
                      ? "var(--cs-text-secondary)"
                      : "var(--cs-text-tertiary)",
                  }}
                >
                  {chefProfile?.bio ?? "This chef hasn't written a bio yet."}
                </p>
              )}

              {chefProfile?.genres && chefProfile.genres.length > 0 && (
                <ul className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                  {chefProfile.genres.map((g) => (
                    <li key={g} className="ui-chip" style={{ cursor: "default" }}>
                      {g}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>

          {/* Accolades read as a showcase now, not a row of chips crammed
             into the header sidebar — each one is a real card with its
             own icon, so a Michelin star and a local cook-off win both
             get room to say what they actually are. */}
          {chefProfile?.achievements && chefProfile.achievements.length > 0 && (
            <section className="space-y-3">
              <h2 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
                Achievements
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {chefProfile.achievements.map((a, i) => (
                  <li
                    key={i}
                    className="ui-card flex items-start gap-3 p-4"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: "var(--cs-warning-bg)",
                        color: "var(--cs-warning-fg)",
                      }}
                    >
                      <TrophyIcon size={18} weight="fill" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className="ui-subheading"
                          style={{ color: "var(--cs-text-primary)" }}
                        >
                          {a.title}
                        </p>
                        {a.year && (
                          <span
                            className="ui-micro ui-numeric shrink-0 font-semibold"
                            style={{ color: "var(--cs-text-tertiary)" }}
                          >
                            {a.year}
                          </span>
                        )}
                      </div>
                      {a.description && (
                        <p
                          className="ui-caption mt-1"
                          style={{ color: "var(--cs-text-secondary)" }}
                        >
                          {a.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <SegmentedTabs
            segments={TABS}
            value={tab}
            onChange={setTab}
            label={`${chef.fullName}'s work`}
          />

          {tab === "recipes" ? (
            <>
              {isRecipesLoading ? (
                <div className={RECIPE_GRID}>
                  <CardSkeletonGrid variant="recipe" count={6} />
                </div>
              ) : recipes.length === 0 ? (
                <EmptyState
                  icon={<ForkKnifeIcon size={24} />}
                  title="No recipes published yet"
                  description={`${chef.fullName} hasn't published a recipe so far. Their cookbooks may still have something.`}
                />
              ) : (
                <div className={RECIPE_GRID}>
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe._id} recipe={recipe} statsFor={statsFor} />
                  ))}
                </div>
              )}
              <LoadMoreSentinel
                ref={recipesSentinelRef}
                loading={isRecipesFetchingNextPage}
                done={!recipesHasNextPage && recipes.length > 0}
                label="recipes"
              />
            </>
          ) : (
            <>
              {isCookbooksLoading ? (
                <div className={RECIPE_GRID}>
                  <CardSkeletonGrid variant="cookbook" count={6} />
                </div>
              ) : cookbooks.length === 0 ? (
                <EmptyState
                  icon={<BookOpenIcon size={24} />}
                  title="No cookbooks yet"
                  description={`${chef.fullName} hasn't bundled a cookbook yet. Their individual recipes are free to read.`}
                />
              ) : (
                <div className={RECIPE_GRID}>
                  {cookbooks.map((cookbook) => (
                    <CookbookCard
                      key={cookbook._id}
                      cookbook={cookbook}
                      showBuy
                      /* The author is the page you're already on. */
                      showAuthor={false}
                    />
                  ))}
                </div>
              )}
              <LoadMoreSentinel
                ref={cookbooksSentinelRef}
                loading={isCookbooksFetchingNextPage}
                done={!cookbooksHasNextPage && cookbooks.length > 0}
                label="cookbooks"
              />
            </>
          )}

          {relatedChefs.length > 0 && (
            <section
              className="space-y-4 pt-6"
              style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
            >
              <h2 className="ui-heading" style={{ color: "var(--cs-text-primary)" }}>
                Other chefs
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {relatedChefs.map((related) => (
                  <ChefCard key={related._id} chef={related} size="compact" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
