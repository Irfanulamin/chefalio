"use client";

import { useInfiniteCookbooks } from "@/hooks/useCookbook";
import { EmptyState } from "@/components/common/EmptyState";
import { MagnifyingGlassIcon, BookOpenIcon, XIcon, CircleNotchIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

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

  const { cookbooks, total, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteCookbooks({
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
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <title>Chefalio — Cookbooks</title>
      <div className="page-root">
        <div className="page-content">
          {/* Header */}
          <div className="pb-6 mb-6" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
            <h1
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Cookbooks
            </h1>
            <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
              Explore curated cookbooks crafted by talented chefs.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Search */}
            <div
              className="flex items-center gap-2 rounded-full px-3.5 py-2 flex-1 min-w-[200px] max-w-sm"
              style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
            >
              <MagnifyingGlassIcon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
              <input
                value={search}
                onChange={(e) => updateParams({ search: e.target.value || null })}
                placeholder="Search cookbooks…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--cs-text-tertiary)]"
                style={{ color: "var(--cs-text-primary)" }}
              />
              {search && (
                <button onClick={() => updateParams({ search: null })}>
                  <XIcon size={13} style={{ color: "var(--cs-text-tertiary)" }} />
                </button>
              )}
            </div>

            {/* Author filter */}
            <div
              className="flex items-center gap-2 rounded-full px-3.5 py-2 w-48"
              style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
            >
              <UserIcon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
              <input
                value={author}
                onChange={(e) => updateParams({ author: e.target.value || null })}
                placeholder="Filter by author…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--cs-text-tertiary)]"
                style={{ color: "var(--cs-text-primary)" }}
              />
              {author && (
                <button onClick={() => updateParams({ author: null })}>
                  <XIcon size={13} style={{ color: "var(--cs-text-tertiary)" }} />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => updateParams({ search: null, author: null })}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150"
                style={{
                  backgroundColor: "var(--cs-surface-3)",
                  color: "var(--cs-text-secondary)",
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Count */}
          {!isLoading && cookbooks.length > 0 && (
            <p className="text-sm mb-5" style={{ color: "var(--cs-text-tertiary)" }}>
              {`Showing ${cookbooks.length} of ${total} cookbook${total !== 1 ? "s" : ""}`}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: "var(--cs-surface-2)",
                    border: "1px solid var(--cs-border-subtle)",
                  }}
                >
                  <div
                    className="w-full"
                    style={{ aspectRatio: "3/4", backgroundColor: "var(--cs-surface-3)" }}
                  />
                  <div className="p-4 space-y-2.5">
                    <div className="h-3 w-24 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
                    <div className="h-4 w-4/5 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
                    <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : cookbooks.length === 0 ? (
            <EmptyState
              icon={<BookOpenIcon size={28} style={{ color: "var(--cs-accent)" }} />}
              title="No cookbooks found"
              description={
                hasActiveFilters
                  ? "Try adjusting your search or author filter."
                  : "No cookbooks are available yet."
              }
              action={hasActiveFilters ? { label: "Clear filters", href: "/cookbooks" } : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cookbooks.map((cookbook) => {
                const discountedPrice =
                  (cookbook.discount ?? 0) > 0
                    ? cookbook.price * (1 - cookbook.discount / 100)
                    : null;
                const authorInitials = cookbook.authorId.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={cookbook._id}
                    className="group rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                    style={{
                      backgroundColor: "var(--cs-surface-2)",
                      border: "1px solid var(--cs-border-subtle)",
                    }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                      {cookbook.cookbook_image && (
                        <Image
                          src={cookbook.cookbook_image}
                          alt={cookbook.title}
                          fill
                          className="object-cover"
                        />
                      )}

                      {/* Discount badge */}
                      {(cookbook.discount ?? 0) > 0 && (
                        <span className="absolute top-2.5 left-2.5 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500 text-white z-10">
                          -{cookbook.discount}%
                        </span>
                      )}

                      {/* Price badge */}
                      <span
                        className="absolute bottom-2.5 right-2.5 text-sm font-bold px-2.5 py-1 rounded-lg z-10"
                        style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#fff" }}
                      >
                        {discountedPrice !== null
                          ? `$${discountedPrice.toFixed(2)}`
                          : `$${cookbook.price.toFixed(2)}`}
                      </span>

                      {/* Preview overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <Link
                          href={`/cookbooks/${cookbook._id}`}
                          className="px-4 py-2 rounded-xl text-sm font-semibold"
                          style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
                        >
                          Preview
                        </Link>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Author */}
                      <Link
                        href={`/chefs/${cookbook.authorId._id}`}
                        className="flex items-center gap-2 mb-2 group/author"
                      >
                        {cookbook.authorId.profile_url ? (
                          <Image
                            src={cookbook.authorId.profile_url}
                            alt={cookbook.authorId.fullName}
                            width={20}
                            height={20}
                            className="rounded-full w-5 h-5 object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
                          >
                            {authorInitials}
                          </div>
                        )}
                        <span
                          className="text-xs truncate transition-colors duration-150 group-hover/author:underline"
                          style={{ color: "var(--cs-text-secondary)" }}
                        >
                          {cookbook.authorId.fullName}
                        </span>
                      </Link>

                      <p
                        className="text-[15px] font-semibold leading-snug line-clamp-2 mb-3"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {cookbook.title}
                      </p>

                      <div className="mt-auto pt-3" style={{ borderTop: "1px solid var(--cs-border-subtle)" }}>
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
              })}
            </div>
          )}

          <div ref={sentinelRef} className="h-4" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <CircleNotchIcon className="animate-spin" size={20} style={{ color: "var(--cs-text-tertiary)" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
