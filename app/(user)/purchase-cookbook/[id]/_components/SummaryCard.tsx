import type { Cookbook } from "@/types/cookbook.type";
import Image from "next/image";

export const SummaryCard = ({ cookbook }: { cookbook: Cookbook }) => {
  const isLowStock = cookbook.stockCount <= 5;
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
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--cs-border-subtle)",
        backgroundColor: "var(--cs-surface-2)",
      }}
    >
      {/* Cover image */}
      <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
        {cookbook.cookbook_image && (
          <Image
            src={cookbook.cookbook_image}
            alt={cookbook.title}
            fill
            className="object-cover"
          />
        )}
        <span
          className="absolute bottom-2.5 right-2.5 text-sm font-bold px-2.5 py-1 rounded-lg z-10"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", color: "#fff" }}
        >
          ${(discountedPrice ?? cookbook.price).toFixed(2)}
        </span>
        {isLowStock && (
          <span
            className="absolute top-2.5 left-2.5 text-[11px] font-bold px-2 py-0.5 rounded-lg z-10"
            style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}
          >
            Only {cookbook.stockCount} left
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        {/* Badge */}
        <span
          className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--cs-accent-muted)",
            color: "var(--cs-accent)",
          }}
        >
          Cookbook
        </span>

        <p
          className="text-base font-semibold leading-snug line-clamp-2 mt-2 mb-2"
          style={{ color: "var(--cs-text-primary)" }}
        >
          {cookbook.title}
        </p>

        <p className="text-sm line-clamp-2 mb-3" style={{ color: "var(--cs-text-secondary)" }}>
          {cookbook.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 mb-4">
          {cookbook.authorId.profile_url ? (
            <Image
              src={cookbook.authorId.profile_url}
              alt={cookbook.authorId.fullName}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: "var(--cs-accent)", color: "#111110" }}
            >
              {authorInitials}
            </div>
          )}
          <span className="text-sm truncate" style={{ color: "var(--cs-text-secondary)" }}>
            {cookbook.authorId.fullName} · @{cookbook.authorId.username}
          </span>
        </div>

        {/* Price */}
        <div
          className="pt-3 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--cs-border-subtle)" }}
        >
          <span className="text-sm" style={{ color: "var(--cs-text-secondary)" }}>Price</span>
          <div className="flex items-center gap-2">
            {discountedPrice !== null && (
              <>
                <span className="text-xs line-through" style={{ color: "var(--cs-text-tertiary)" }}>
                  ${cookbook.price.toFixed(2)}
                </span>
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
                >
                  -{cookbook.discount}%
                </span>
              </>
            )}
            <span className="text-lg font-semibold" style={{ color: "var(--cs-text-primary)" }}>
              ${(discountedPrice ?? cookbook.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
