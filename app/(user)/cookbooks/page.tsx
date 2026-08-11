"use client";

import { useInfiniteCookbooks } from "@/hooks/useCookbook";
import { EmptyState } from "@/components/common/EmptyState";
import { CookbookCard } from "@/components/common/CookbookCard";
import { PageHeader } from "@/components/User/shared/PageHeader";
import { SearchField } from "@/components/User/shared/SearchField";
import { CardSkeletonGrid } from "@/components/User/shared/CardSkeleton";
import { LoadMoreSentinel } from "@/components/User/shared/LoadMoreSentinel";
import { BookOpenIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import { XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

const GRID = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function CookbooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const author = searchParams.get("author") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      params.delete("page");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedAuthor] = useDebounce(author, 500);

  const {
    cookbooks,
    total,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCookbooks({
    search: debouncedSearch,
    limit: 12,
    author: debouncedAuthor || undefined,
  });

  const hasActiveFilters = search.trim() !== "" || author.trim() !== "";
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <title>Chefalio — Cookbooks</title>
      <div className="app-root">
        <div className="page-content">
          <PageHeader
            title="Cookbooks"
            lede="Collections a chef has assembled and priced as a set."
            meta={
              !isLoading && cookbooks.length > 0
                ? `Showing ${cookbooks.length} of ${total} cookbook${total !== 1 ? "s" : ""}`
                : undefined
            }
          />

          <search className="mb-6 flex flex-wrap items-center gap-3">
            <SearchField
              value={search}
              onChange={(v) => updateParams({ search: v || null })}
              placeholder="Search cookbooks…"
              label="Search cookbooks"
              className="min-w-[220px] flex-1 sm:max-w-sm"
            />
            <SearchField
              value={author}
              onChange={(v) => updateParams({ author: v || null })}
              placeholder="Filter by chef…"
              label="Filter by chef"
              icon={<UserIcon size={15} />}
              className="w-full sm:w-56"
            />
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => updateParams({ search: null, author: null })}
                className="ui-chip focus-ring"
              >
                <XIcon size={13} aria-hidden />
                Clear all
              </button>
            )}
          </search>

          {isLoading ? (
            <div className={GRID}>
              <CardSkeletonGrid variant="cookbook" count={8} />
            </div>
          ) : cookbooks.length === 0 ? (
            <EmptyState
              icon={<BookOpenIcon size={24} />}
              title={
                hasActiveFilters ? "No cookbooks match that search" : "No cookbooks yet"
              }
              description={
                hasActiveFilters
                  ? "Try the title on its own, or clear the chef filter — searching both at once narrows results quickly."
                  : "When a chef bundles their recipes into a collection, it shows up here."
              }
              action={
                hasActiveFilters
                  ? { label: "Clear filters", href: "/cookbooks" }
                  : { label: "Browse recipes", href: "/recipes" }
              }
            />
          ) : (
            <div className={GRID}>
              {cookbooks.map((cookbook) => (
                <CookbookCard key={cookbook._id} cookbook={cookbook} showBuy />
              ))}
            </div>
          )}

          <LoadMoreSentinel
            ref={sentinelRef}
            loading={isFetchingNextPage}
            done={!hasNextPage && cookbooks.length > 0}
            label="cookbooks"
          />
        </div>
      </div>
    </>
  );
}
