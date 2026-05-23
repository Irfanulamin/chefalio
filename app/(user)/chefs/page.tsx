"use client";

import { useInfiniteChefs } from "@/hooks/useChef";
import { EmptyState } from "@/components/common/EmptyState";
import { MagnifyingGlassIcon, XIcon, Loader2Icon } from "lucide-react";
import { UsersIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { ForkKnifeIcon, BookOpenIcon } from "@phosphor-icons/react/dist/ssr";

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
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <title>Chefalio — Chefs</title>
      <div className="page-root">
        <div className="page-content">
          {/* Header */}
          <div className="pb-6 mb-6" style={{ borderBottom: "1px solid var(--cs-border-subtle)" }}>
            <h1
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ color: "var(--cs-text-primary)" }}
            >
              Chefs
            </h1>
            <p className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>
              Meet the talented chefs behind your favourite recipes and cookbooks.
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6">
            <div
              className="flex items-center gap-2 rounded-full px-3.5 py-2 flex-1 max-w-sm"
              style={{ border: "1px solid var(--cs-border-default)", backgroundColor: "var(--cs-surface-1)" }}
            >
              <MagnifyingGlassIcon size={14} style={{ color: "var(--cs-text-tertiary)" }} />
              <input
                value={search}
                onChange={(e) => updateParams({ search: e.target.value || null })}
                placeholder="Search chefs…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--cs-text-tertiary)]"
                style={{ color: "var(--cs-text-primary)" }}
              />
              {search && (
                <button onClick={() => updateParams({ search: null })}>
                  <XIcon size={13} style={{ color: "var(--cs-text-tertiary)" }} />
                </button>
              )}
            </div>
          </div>

          {/* Count */}
          {!isLoading && chefs.length > 0 && (
            <p className="text-sm mb-5" style={{ color: "var(--cs-text-tertiary)" }}>
              {`Showing ${chefs.length} of ${total} chef${total !== 1 ? "s" : ""}`}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl"
                  style={{
                    backgroundColor: "var(--cs-surface-2)",
                    border: "1px solid var(--cs-border-subtle)",
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full"
                    style={{ backgroundColor: "var(--cs-surface-3)" }}
                  />
                  <div className="space-y-1.5 w-full flex flex-col items-center">
                    <div className="h-3.5 w-3/4 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
                    <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--cs-surface-3)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : chefs.length === 0 ? (
            <EmptyState
              icon={<UsersIcon size={28} style={{ color: "var(--cs-accent)" }} />}
              title="No chefs found"
              description={search ? "Try a different search term." : "No chefs are available yet."}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {chefs.map((chef) => {
                const initials = chef.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <Link
                    key={chef._id}
                    href={`/chefs/${chef._id}`}
                    className="group flex flex-col items-center gap-3 p-5 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
                    style={{
                      backgroundColor: "var(--cs-surface-2)",
                      border: "1px solid var(--cs-border-subtle)",
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative w-20 h-20 shrink-0">
                      {chef.profile_url ? (
                        <Image
                          src={chef.profile_url}
                          alt={chef.fullName}
                          fill
                          sizes="80px"
                          loading="lazy"
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold"
                          style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
                        >
                          {initials}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="text-center min-w-0 w-full">
                      <p
                        className="text-sm font-semibold leading-snug line-clamp-1"
                        style={{ color: "var(--cs-text-primary)" }}
                      >
                        {chef.fullName}
                      </p>
                      <p
                        className="text-xs line-clamp-1 mt-0.5"
                        style={{ color: "var(--cs-text-tertiary)" }}
                      >
                        @{chef.username}
                      </p>

                      {(chef.recipeCount !== undefined || chef.cookbookCount !== undefined) && (
                        <div
                          className="flex items-center justify-center gap-3 mt-2 pt-2"
                          style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
                        >
                          {chef.recipeCount !== undefined && (
                            <span
                              className="flex items-center gap-1 text-[11px]"
                              style={{ color: "var(--cs-text-secondary)" }}
                            >
                              <ForkKnifeIcon size={11} />
                              {chef.recipeCount}
                            </span>
                          )}
                          {chef.cookbookCount !== undefined && (
                            <span
                              className="flex items-center gap-1 text-[11px]"
                              style={{ color: "var(--cs-text-secondary)" }}
                            >
                              <BookOpenIcon size={11} />
                              {chef.cookbookCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div ref={sentinelRef} className="h-4" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <Loader2Icon className="animate-spin" size={20} style={{ color: "var(--cs-text-tertiary)" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
