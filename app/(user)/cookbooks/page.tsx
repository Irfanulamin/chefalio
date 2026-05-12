"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteCookbooks } from "@/hooks/useCookbook";
import { cn } from "@/lib/utils";
import { Search, User, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";

export default function CookbooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const author = searchParams.get("author") ?? "";

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

  const { cookbooks, total, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteCookbooks({
      search: debouncedSearch,
      limit: 12,
      author: debouncedAuthor || undefined,
    });

  const clearAllFilters = () => updateParams({ search: null, author: null });
  const hasActiveFilters = search.trim() !== "" || author.trim() !== "";

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
      <title>Chefalio - Cookbooks</title>
      <div className="space-y-6 my-4 md:my-8 max-w-7xl mx-auto px-3">
        {/* Header */}
        <div className="pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Cookbooks</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Explore curated cookbooks crafted by talented chefs. Purchase a cookbook to unlock its full collection of recipes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <Input
              placeholder="Search cookbooks…"
              value={search}
              onChange={(e) => updateParams({ search: e.target.value || null })}
              className="pl-9 pr-9 rounded-lg border-zinc-200 dark:border-zinc-800"
            />
            {search && (
              <button
                onClick={() => updateParams({ search: null })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="relative flex-1 max-w-xs">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <Input
              placeholder="Filter by author…"
              value={author}
              onChange={(e) => updateParams({ author: e.target.value || null })}
              className="pl-9 pr-9 rounded-lg border-zinc-200 dark:border-zinc-800"
            />
            {author && (
              <button
                onClick={() => updateParams({ author: null })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-foreground"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Count */}
        {!isLoading && cookbooks.length > 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {total === 0
              ? "No cookbooks found"
              : `Showing ${cookbooks.length} of ${total} cookbook${total !== 1 ? "s" : ""}`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cookbooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center min-h-[40vh] gap-3">
            <p className="text-base font-medium">No cookbooks found</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              Try adjusting your search or author filter.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cookbooks.map((cookbook) => (
              <div
                key={cookbook._id}
                className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={cookbook.cookbook_image}
                    alt={cookbook.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(cookbook.discount ?? 0) > 0 && (
                    <span className="absolute top-2.5 left-2.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white">
                      -{cookbook.discount}%
                    </span>
                  )}
                  <span
                    className={cn(
                      "absolute top-2.5 right-2.5 text-[11px] font-medium px-2 py-0.5 rounded-md",
                      cookbook.stockCount <= 3
                        ? "bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                        : "bg-white/90 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-300",
                    )}
                  >
                    {cookbook.stockCount <= 3
                      ? `${cookbook.stockCount} left`
                      : `${cookbook.stockCount} in stock`}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Author */}
                  <Link
                    href={`/chefs/${cookbook.authorId._id}`}
                    className="flex items-center gap-2 mb-2.5"
                  >
                    {cookbook.authorId.profile_url ? (
                      <Image
                        src={cookbook.authorId.profile_url}
                        alt={cookbook.authorId.fullName}
                        width={20}
                        height={20}
                        className="rounded-full w-5 h-5 object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                        {cookbook.authorId.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-foreground transition-colors truncate">
                      {cookbook.authorId.fullName}
                    </span>
                  </Link>

                  <p className="text-[15px] font-semibold text-foreground leading-snug mb-1 line-clamp-2">
                    {cookbook.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                    {cookbook.description}
                  </p>

                  <div className="mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      {(cookbook.discount ?? 0) > 0 ? (
                        <>
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-bold text-foreground">
                              ${(cookbook.price * (1 - cookbook.discount / 100)).toFixed(2)}
                            </p>
                            <p className="text-xs text-zinc-400 line-through">
                              ${cookbook.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            {cookbook.discount}% off
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-bold text-foreground">
                            ${cookbook.price.toFixed(2)}
                          </p>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full inline-block",
                                cookbook.stockCount <= 3 ? "bg-orange-500" : "bg-emerald-500",
                              )}
                            />
                            {cookbook.stockCount <= 3 ? "Almost gone" : "In stock"}
                          </p>
                        </>
                      )}
                    </div>
                    <Link href={`/purchase-cookbook/${cookbook._id}`}>
                      <Button
                        size="sm"
                        className="h-8 px-4 text-xs font-medium rounded-lg"
                      >
                        Buy now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
