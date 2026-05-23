"use client";
import { use } from "react";
import { useCookbook } from "@/hooks/useCookbook";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpenIcon } from "@phosphor-icons/react/dist/ssr";

function CookbookDetailSkeleton() {
  return (
    <div className="page-root">
      <div className="page-content">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="lg:w-80 shrink-0 w-full">
            <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "3/4" }} />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-40 rounded-xl" />
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
      <div className="page-root flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center text-center px-4 max-w-sm">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: "var(--cs-accent-muted)" }}
          >
            <BookOpenIcon size={28} style={{ color: "var(--cs-accent)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--cs-text-primary)" }}>
            Cookbook not found
          </h1>
          <Link
            href="/cookbooks"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150"
            style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
          >
            Browse cookbooks
          </Link>
        </div>
      </div>
    );
  }

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
    <>
      <title>{cookbook.title} — Chefalio</title>
      <div className="page-root">
        <div className="page-content">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Cover image */}
            <div className="lg:w-72 shrink-0 w-full max-w-sm">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <Image
                  src={cookbook.cookbook_image}
                  alt={cookbook.title}
                  fill
                  className="object-cover"
                  priority
                />
                {(cookbook.discount ?? 0) > 0 && (
                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500 text-white z-10">
                    -{cookbook.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              {/* Title */}
              <h1
                className="text-3xl font-bold tracking-tight mb-3"
                style={{ color: "var(--cs-text-primary)" }}
              >
                {cookbook.title}
              </h1>

              {/* Author */}
              <Link
                href={`/chefs/${cookbook.authorId._id}`}
                className="inline-flex items-center gap-3 rounded-xl p-3 mb-5 transition-all duration-150 hover:shadow-sm"
                style={{
                  backgroundColor: "var(--cs-surface-2)",
                  border: "1px solid var(--cs-border-subtle)",
                }}
              >
                {cookbook.authorId.profile_url ? (
                  <Image
                    src={cookbook.authorId.profile_url}
                    alt={cookbook.authorId.fullName}
                    width={40}
                    height={40}
                    className="rounded-xl w-10 h-10 object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
                  >
                    {authorInitials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--cs-text-primary)" }}>
                    {cookbook.authorId.fullName}
                  </p>
                  <p className="text-xs" style={{ color: "var(--cs-text-secondary)" }}>
                    @{cookbook.authorId.username}
                  </p>
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest ml-auto"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  Chef
                </span>
              </Link>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--cs-text-secondary)" }}
              >
                {cookbook.description}
              </p>

              {/* Price + CTA */}
              <div
                className="rounded-2xl p-5 mb-5"
                style={{
                  backgroundColor: "var(--cs-surface-2)",
                  border: "1px solid var(--cs-border-subtle)",
                }}
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: "var(--cs-text-primary)" }}
                  >
                    ${(discountedPrice ?? cookbook.price).toFixed(2)}
                  </span>
                  {discountedPrice !== null && (
                    <span
                      className="text-lg line-through"
                      style={{ color: "var(--cs-text-tertiary)" }}
                    >
                      ${cookbook.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/purchase-cookbook/${cookbook._id}`}
                    className="flex-1 text-center py-3 rounded-xl font-semibold text-sm transition-colors duration-150"
                    style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
                  >
                    Buy Now
                  </Link>
                </div>

                <p
                  className="text-xs mt-3 text-center"
                  style={{ color: "var(--cs-text-tertiary)" }}
                >
                  {cookbook.stockCount} copies available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
