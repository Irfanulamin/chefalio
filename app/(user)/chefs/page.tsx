"use client";

import { useInfiniteChefs } from "@/hooks/useChef";
import { EmptyState } from "@/components/common/EmptyState";
import { ChefCard } from "@/components/common/ChefCard";
import { PageHeader } from "@/components/User/shared/PageHeader";
import { SearchField } from "@/components/User/shared/SearchField";
import { CardSkeletonGrid } from "@/components/User/shared/CardSkeleton";
import { LoadMoreSentinel } from "@/components/User/shared/LoadMoreSentinel";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4";

export default function ChefsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";

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

  const { chefs, total, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteChefs({ search: debouncedSearch, limit: 16 });

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
      <title>Chefalio — Chefs</title>
      <div className="app-root">
        <div className="page-content">
          <PageHeader
            title="Chefs"
            lede="The people behind the recipes and cookbooks on Chefalio."
            meta={
              !isLoading && chefs.length > 0
                ? `Showing ${chefs.length} of ${total} chef${total !== 1 ? "s" : ""}`
                : undefined
            }
          />

          <search className="mb-6">
            <SearchField
              value={search}
              onChange={(v) => updateParams({ search: v || null })}
              placeholder="Search chefs…"
              label="Search chefs"
              className="max-w-sm"
            />
          </search>

          {isLoading ? (
            <div className={GRID}>
              <CardSkeletonGrid variant="chef" count={8} />
            </div>
          ) : chefs.length === 0 ? (
            <EmptyState
              icon={<UsersIcon size={24} />}
              title={search ? "No chefs match that search" : "No chefs yet"}
              description={
                search
                  ? "Chef search matches names and usernames — try a first name on its own."
                  : "Approved chefs appear here once their application goes through."
              }
              action={search ? undefined : { label: "Browse recipes", href: "/recipes" }}
            />
          ) : (
            <div className={GRID}>
              {chefs.map((chef) => (
                <ChefCard key={chef._id} chef={chef} />
              ))}
            </div>
          )}

          <LoadMoreSentinel
            ref={sentinelRef}
            loading={isFetchingNextPage}
            done={!hasNextPage && chefs.length > 0}
            label="chefs"
          />
        </div>
      </div>
    </>
  );
}
