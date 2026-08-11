"use client";

import { use } from "react";
import { useCookbook } from "@/hooks/useCookbook";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpenIcon } from "@phosphor-icons/react/dist/ssr";
import { SafeImage } from "@/components/common/SafeImage";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusPill } from "@/components/User/shared/StatusPill";
import { cookbookPrice, initialsOf } from "@/lib/recipe-display";

function CookbookDetailSkeleton() {
  return (
    <div className="app-root">
      <div className="page-content">
        <div className="flex flex-col items-start gap-10 lg:flex-row">
          <div className="w-full shrink-0 lg:w-72">
            <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "3/4" }} />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-64 rounded-xl" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CookbookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { cookbook, isLoading } = useCookbook(id);

  if (isLoading) return <CookbookDetailSkeleton />;

  if (!cookbook) {
    return (
      <div className="app-root">
        <div className="page-content">
          <EmptyState
            icon={<BookOpenIcon size={24} />}
            title="No cookbook at this address"
            description="It may have been unpublished by its chef, or the link may be wrong."
            action={{ label: "Browse cookbooks", href: "/cookbooks" }}
          />
        </div>
      </div>
    );
  }

  const price = cookbookPrice(cookbook.price, cookbook.discount ?? 0);
  const authorInitials = initialsOf(cookbook.authorId.fullName);
  const inStock = cookbook.stockCount > 0;

  return (
    <>
      <title>{`${cookbook.title} — Chefalio`}</title>
      <div className="app-root">
        <div className="page-content">
          <div className="flex flex-col items-start gap-10 lg:flex-row">
            <div className="w-full max-w-sm shrink-0 lg:w-72">
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: "3/4",
                  backgroundColor: "var(--cs-surface-3)",
                  border: "1px solid var(--cs-border-subtle)",
                }}
              >
                <SafeImage
                  src={cookbook.cookbook_image}
                  alt={`Cover of ${cookbook.title}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 288px"
                  fallback={
                    <span
                      className="flex h-full w-full items-center justify-center text-6xl font-bold opacity-20"
                      style={{ color: "var(--cs-accent-text)" }}
                    >
                      {cookbook.title.charAt(0)}
                    </span>
                  }
                />
                {price.discountPct > 0 && (
                  <StatusPill
                    tone="success"
                    overMedia
                    className="absolute left-3 top-3 z-10"
                  >
                    {price.discountPct}% off
                  </StatusPill>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1
                className="ui-title mb-3"
                style={{ color: "var(--cs-text-primary)", fontSize: "1.875rem" }}
              >
                {cookbook.title}
              </h1>

              <Link
                href={`/chefs/${cookbook.authorId._id}`}
                className="ui-card ui-card-interactive focus-ring mb-5 inline-flex items-center gap-3 p-3"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                  <SafeImage
                    src={cookbook.authorId.profile_url}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                    fallback={
                      <span
                        className="flex h-10 w-10 items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: "var(--cs-accent-muted)",
                          color: "var(--cs-accent-text)",
                        }}
                      >
                        {authorInitials}
                      </span>
                    }
                  />
                </div>
                <div>
                  <p
                    className="ui-subheading"
                    style={{ color: "var(--cs-text-primary)" }}
                  >
                    {cookbook.authorId.fullName}
                  </p>
                  <p
                    className="ui-micro"
                    style={{ color: "var(--cs-text-secondary)" }}
                  >
                    @{cookbook.authorId.username}
                  </p>
                </div>
                <span
                  className="ui-label ml-auto pl-4"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  Chef
                </span>
              </Link>

              <p
                className="ui-body mb-6 max-w-prose"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                {cookbook.description}
              </p>

              <div className="ui-card mb-5 max-w-md p-5">
                <div className="mb-4 flex items-baseline gap-3">
                  <span
                    className="ui-numeric text-3xl font-bold"
                    style={{ color: "var(--cs-text-primary)" }}
                  >
                    {price.current}
                  </span>
                  {price.original && (
                    <span
                      className="ui-numeric text-lg line-through"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      {price.original}
                    </span>
                  )}
                </div>

                {inStock ? (
                  <Link
                    href={`/purchase-cookbook/${cookbook._id}`}
                    className="focus-ring block w-full rounded-xl py-3 text-center text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {price.isFree ? "Get for free" : "Buy now"}
                  </Link>
                ) : (
                  <div
                    aria-disabled
                    className="block w-full cursor-not-allowed rounded-xl py-3 text-center text-sm font-semibold"
                    style={{
                      backgroundColor: "var(--cs-surface-3)",
                      color: "var(--cs-text-tertiary)",
                    }}
                  >
                    Sold out
                  </div>
                )}

                {/* Scarcity is only worth saying when it's actually low.
                    "412 copies available" under every book is noise. */}
                <p
                  className="ui-micro ui-numeric mt-3 text-center"
                  style={{
                    color: inStock && cookbook.stockCount <= 10
                      ? "var(--cs-warning-fg)"
                      : "var(--cs-text-tertiary)",
                  }}
                >
                  {!inStock
                    ? "No copies left right now"
                    : cookbook.stockCount <= 10
                      ? `Only ${cookbook.stockCount} left`
                      : "In stock"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
